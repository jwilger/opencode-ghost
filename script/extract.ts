#!/usr/bin/env bun

import { join, relative } from "node:path"

const ghost = join(import.meta.dir, "..")
const src = Bun.env.OPENCODE_ROOT || "/home/jwilger/projects/opencode"
const mode = process.argv.includes("--write") ? "write" : "check"

const git = (args: string[]) =>
  Bun.spawnSync({
    cmd: ["git", "-C", src, ...args],
    stdout: "pipe",
    stderr: "pipe",
  })

const trim = (buf: Uint8Array) => new TextDecoder().decode(buf).trim()
const sha = trim(git(["rev-parse", "HEAD"]).stdout)
const branch = trim(git(["rev-parse", "--abbrev-ref", "HEAD"]).stdout)

const list = async (glob: string) => {
  const out: string[] = []
  for await (const path of new Bun.Glob(glob).scan({ cwd: src, absolute: true })) out.push(path)
  return out.sort()
}

const rel = (path: string) => relative(src, path)
const text = async (path: string) => Bun.file(path).text()
const j = (x: unknown) => JSON.stringify(x, null, 2) + "\n"

const ids = async (glob: string, re: RegExp) =>
  (
    await Promise.all(
      (await list(glob)).map(async (path) => {
        const body = await text(path)
        return [...body.matchAll(re)].map((m) => ({
          id: m[1],
          source: rel(path),
        }))
      }),
    )
  )
    .flat()
    .sort((a, b) => a.id.localeCompare(b.id) || a.source.localeCompare(b.source))

const routes = async () => {
  const items = await ids("packages/opencode/src/server/instance/**/*.ts", /operationId:\s*"([^"]+)"/g)
  return {
    schema_version: "0.1.0",
    artifact_family: "inventory.runtime.routes",
    source_commit: sha,
    source_branch: branch,
    count: items.length,
    items,
  }
}

const cmds = async () => {
  const items = await ids("packages/opencode/src/cli/cmd/**/*.ts", /command:\s*"([^"]+)"/g)
  return {
    schema_version: "0.1.0",
    artifact_family: "inventory.runtime.commands",
    source_commit: sha,
    source_branch: branch,
    count: items.length,
    items,
  }
}

const providers = async () => {
  const pkg = await Bun.file(join(src, "packages/opencode/package.json")).json()
  const deps = Object.keys({
    ...pkg.dependencies,
    ...pkg.devDependencies,
  })
    .filter(
      (x) =>
        x.startsWith("@ai-sdk/") ||
        x.includes("auth") ||
        x.includes("provider") ||
        x.includes("gateway"),
    )
    .sort()
  const files = (await list("packages/opencode/src/provider/**/*.ts")).map(rel)
  return {
    schema_version: "0.1.0",
    artifact_family: "inventory.integrations.providers",
    source_commit: sha,
    source_branch: branch,
    dependencies: deps,
    files,
  }
}

const tui = async () => {
  const files = await list("packages/opencode/src/cli/cmd/tui/**/*.{ts,tsx}")
  const items = files.map((path) => {
    const file = rel(path)
    const name = file.split("/").at(-1) || file
    const kind = file.includes("/routes/")
      ? "route"
      : file.includes("/component/dialog-") || file.includes("/ui/dialog-")
        ? "dialog"
        : file.includes("/plugin/")
          ? "plugin"
          : file.includes("/context/")
            ? "context"
            : file.includes("/util/")
              ? "util"
              : "core"
    return {
      id: `tui.file.${name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase()}`,
      kind,
      source: file,
    }
  })
  return {
    schema_version: "0.1.0",
    artifact_family: "inventory.tui.surfaces",
    source_commit: sha,
    source_branch: branch,
    count: items.length,
    items,
  }
}

const tests = async () => {
  const items = (await list("packages/opencode/test/cli/tui/**/*.{ts,tsx}")).map((path) => ({
    id: `tui.test.${rel(path).split("/").at(-1)!.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase()}`,
    source: rel(path),
  }))
  return {
    schema_version: "0.1.0",
    artifact_family: "inventory.tui.tests",
    source_commit: sha,
    source_branch: branch,
    count: items.length,
    items,
  }
}

const trace = async () => {
  const out: string[] = []
  for (const item of (await routes()).items)
    out.push(
      JSON.stringify({
        id: `trace.route.${item.id.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase()}`,
        kind: "route",
        target: item.id,
        source: item.source,
      }),
    )
  for (const item of (await cmds()).items)
    out.push(
      JSON.stringify({
        id: `trace.command.${item.id.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase()}`,
        kind: "command",
        target: item.id,
        source: item.source,
      }),
    )
  for (const item of (await tests()).items)
    out.push(
      JSON.stringify({
        id: item.id,
        kind: "tui_test",
        target: item.id.replace(/^tui\.test\./, ""),
        source: item.source,
      }),
    )
  return out.sort().join("\n") + "\n"
}

const out = async () => {
  const files = [
    [join(ghost, "contracts/runtime/inventory/routes.json"), j(await routes())],
    [join(ghost, "contracts/runtime/inventory/commands.json"), j(await cmds())],
    [join(ghost, "contracts/integrations/inventory/providers.json"), j(await providers())],
    [join(ghost, "contracts/tui/inventory/surfaces.json"), j(await tui())],
    [join(ghost, "contracts/tui/inventory/tests.json"), j(await tests())],
    [join(ghost, "evidence/traceability/files.jsonl"), await trace()],
  ] as const
  return files
}

const main = async () => {
  let bad = false
  for (const [path, want] of await out()) {
    if (mode === "write") {
      await Bun.write(path, want)
      continue
    }
    const file = Bun.file(path)
    if (!(await file.exists())) {
      console.error(`missing: ${relative(ghost, path)}`)
      bad = true
      continue
    }
    const got = await file.text()
    if (got === want) continue
    console.error(`stale: ${relative(ghost, path)}`)
    bad = true
  }
  if (bad) process.exit(1)
}

await main()
