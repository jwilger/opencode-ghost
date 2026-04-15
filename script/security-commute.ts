#!/usr/bin/env bun

import { join } from "node:path"

const root = join(import.meta.dir, "..")
const mode = process.argv.includes("--write") ? "write" : "check"

const readJson = async <T>(path: string) => (await Bun.file(join(root, path)).json()) as T
const list = async (glob: string) => {
  const out: string[] = []
  for await (const path of new Bun.Glob(glob).scan({ cwd: root })) out.push(path)
  return out.sort()
}
const slug = (id: string) => id.split(".").slice(2).join("_")

type Routes = {
  items: {
    operation_id: string
  }[]
}

type SecurityCase = {
  case_id: string
  profile_id: string
  expect: {
    observation_space: Record<string, unknown>
    payload: {
      required_routes: string[]
      required_claims: string[]
    }
  }
}

type GraphRow = {
  kind: "node" | "edge"
  id: string
}

const render = async (path: string) => {
  const routes = await readJson<Routes>("contracts/runtime/inventory/routes.json")
  const securityCase = await readJson<SecurityCase>(path)
  const runtime = await readJson<{ status: string }>("evidence/traceability/commuting.runtime.permission_cycle.json")
  const claims = (await Bun.file(join(root, "graph/contract-graph.jsonl")).text())
    .split("\n")
    .filter(Boolean)
    .map((x) => JSON.parse(x) as GraphRow)
    .filter((x) => x.kind === "node")
    .map((x) => x.id)
  const missingRoutes = securityCase.expect.payload.required_routes.filter(
    (x) => !routes.items.some((route) => route.operation_id === x),
  )
  const missingClaims = securityCase.expect.payload.required_claims.filter(
    (x) => !claims.includes(x),
  )
  const payload = {
    case_id: securityCase.case_id,
    profile_id: securityCase.profile_id,
    observation_space: securityCase.expect.observation_space,
    actual: {
      required_routes: securityCase.expect.payload.required_routes,
      required_claims: securityCase.expect.payload.required_claims,
      route_count: securityCase.expect.payload.required_routes.length,
      runtime_permission_cycle_status: runtime.status,
    },
    missing_routes: missingRoutes,
    missing_claims: missingClaims,
    status:
      missingRoutes.length === 0 &&
      missingClaims.length === 0 &&
      runtime.status === "pass"
        ? "pass"
        : "fail",
  }
  return [slug(securityCase.case_id), `${JSON.stringify(payload, null, 2)}\n`] as const
}

const main = async () => {
  const cases = await list("contracts/security/cases/*.json")
  let bad = false
  for (const path of cases) {
    const [name, want] = await render(path)
    const target = `evidence/traceability/commuting.security.${name}.json`
    if (mode === "write") {
      await Bun.write(join(root, target), want)
      continue
    }
    const got = await Bun.file(join(root, target)).text()
    if (got === want) continue
    console.error(`stale security commuting evidence: ${target}`)
    bad = true
  }
  if (bad) process.exit(1)
}

await main()
