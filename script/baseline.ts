#!/usr/bin/env bun

import { join } from "node:path"

const root = join(import.meta.dir, "..")
const src = Bun.env.OPENCODE_ROOT || "/home/jwilger/projects/opencode"

const readJson = (path: string) => Bun.file(path).json()
const read = (path: string) => Bun.file(path).text()
const list = async (glob: string) => {
  const out: string[] = []
  for await (const path of new Bun.Glob(glob).scan({ cwd: root })) out.push(path)
  return out.sort()
}

const need = async (path: string) => {
  if (await Bun.file(path).exists()) return
  throw new Error(`missing source file: ${path}`)
}

const main = async () => {
  const routes = await readJson(join(root, "contracts/runtime/inventory/routes.json"))
  const cmds = await readJson(join(root, "contracts/runtime/inventory/commands.json"))
  const tui = await readJson(join(root, "contracts/tui/inventory/surfaces.json"))
  const tests = await readJson(join(root, "contracts/tui/inventory/tests.json"))
  const runtime = await Promise.all((await list("tests/runtime/*.json")).map((path) => readJson(join(root, path))))
  const tui_witness = await Promise.all((await list("tests/tui/*.json")).map((path) => readJson(join(root, path))))

  for (const item of routes.items) {
    const path = join(src, item.source)
    await need(path)
    const body = await read(path)
    if (body.includes(`operationId: "${item.operation_id}"`)) continue
    throw new Error(`route mismatch: ${item.operation_id} in ${item.source}`)
  }

  for (const item of cmds.items) {
    const path = join(src, item.source)
    await need(path)
    const body = await read(path)
    if (body.includes(`command: "${item.command}"`)) continue
    throw new Error(`command mismatch: ${item.command} in ${item.source}`)
  }

  for (const item of tui.items) await need(join(src, item.source))
  for (const item of tests.items) await need(join(src, item.source))

  const claims = {
    source_commit: routes.source_commit,
    source_branch: routes.source_branch,
    route_count: routes.count,
    command_count: cmds.count,
    tui_surface_count: tui.count,
    tui_test_count: tests.count,
    runtime_witness: runtime[0]?.case_id ?? "",
    tui_witness: tui_witness[0]?.case_id ?? "",
    required_runtime_routes: [...new Set(runtime.flatMap((item: any) => item.required_routes))],
    required_tui_surfaces: [...new Set(tui_witness.flatMap((item: any) => item.required_tui_routes))],
    required_tui_tests: [...new Set(tui_witness.flatMap((item: any) => item.required_tests))],
    runtime_cases: runtime.map((item: any) => ({
      case_id: item.case_id,
      profile_id: item.profile_id,
      required_routes: item.required_routes,
    })),
    tui_cases: tui_witness.map((item: any) => ({
      case_id: item.case_id,
      profile_id: item.profile_id,
      required_surfaces: item.required_tui_routes,
      required_tests: item.required_tests,
    })),
  }

  for (const item of runtime)
    for (const id of item.required_routes) {
      if (routes.items.some((x: any) => x.operation_id === id)) continue
      throw new Error(`runtime witness route missing from inventory: ${id}`)
    }

  for (const item of tui_witness)
    for (const id of item.required_tui_routes) {
      if (tui.items.some((x: any) => x.id === id)) continue
      throw new Error(`tui witness surface missing from inventory: ${id}`)
    }

  for (const item of tui_witness)
    for (const id of item.required_tests) {
      if (tests.items.some((x: any) => x.id === id)) continue
      throw new Error(`tui witness test missing from inventory: ${id}`)
    }

  await Bun.write(join(root, "evidence/traceability/baseline.json"), JSON.stringify(claims, null, 2) + "\n")
}

await main()
