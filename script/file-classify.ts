#!/usr/bin/env bun

import { join } from "node:path"

const root = join(import.meta.dir, "..")
const mode = process.argv.includes("--write") ? "write" : "check"
const target = "evidence/traceability/file-classification.json"

type Row = {
  kind: "node" | "edge"
  id: string
  class?: string
  path?: string
}

const readRows = async () =>
  (await Bun.file(join(root, "graph/contract-graph.jsonl")).text())
    .split("\n")
    .filter(Boolean)
    .map((x) => JSON.parse(x) as Row)

const tracked = () => {
  const out = Bun.spawnSync({
    cmd: ["git", "ls-files"],
    cwd: root,
    stdout: "pipe",
    stderr: "ignore",
  })
  if (out.exitCode !== 0) throw new Error("git ls-files failed")
  return new TextDecoder()
    .decode(out.stdout)
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .sort()
}

const infer = (path: string) => {
  if (path.startsWith("evidence/traceability/")) return "generated"
  if (
    [
      "claims-ledger.md",
      "formalization-inventory.md",
      "completeness-matrix.md",
      "refinement-ledger.md",
      "rust-ergonomics-report.md",
      "semantic-coverage-report.md",
      "tcb-inventory.md",
    ].includes(path)
  ) return "generated"
  if (
    path === "README.md" ||
    path === "VERIFY.md" ||
    path === "GOVERNANCE.md" ||
    path === "trust-base.md" ||
    path === "spec-audit.md" ||
    path.startsWith("adr/") ||
    path.endsWith("/README.md")
  ) return "informative"
  return "normative"
}

const render = async () => {
  const rows = await readRows()
  const byPath = new Map<string, Row[]>()
  for (const row of rows) {
    if (row.kind !== "node" || typeof row.path !== "string") continue
    const list = byPath.get(row.path) || []
    list.push(row)
    byPath.set(row.path, list)
  }
  const files = tracked().map((path) => {
    const refs = byPath.get(path) || []
    return {
      path,
      class: refs[0]?.class || infer(path),
      graph_backed: refs.length > 0,
      graph_ids: refs.map((x) => x.id).sort(),
    }
  })
  const summary = {
    total: files.length,
    normative: files.filter((x) => x.class === "normative").length,
    informative: files.filter((x) => x.class === "informative").length,
    generated: files.filter((x) => x.class === "generated").length,
    graph_backed: files.filter((x) => x.graph_backed).length,
    heuristic_only: files.filter((x) => !x.graph_backed).length,
  }
  return `${JSON.stringify({ schema_version: "0.1.0", artifact_family: "evidence.file_classification", summary, files }, null, 2)}\n`
}

const main = async () => {
  const want = await render()
  if (mode === "write") {
    await Bun.write(join(root, target), want)
    return
  }
  const got = await Bun.file(join(root, target)).text()
  if (got === want) return
  throw new Error(`stale file classification inventory: ${target}`)
}

await main()
