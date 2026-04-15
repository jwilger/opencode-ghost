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

const render = async (path: string) => {
  const baseline = await readJson<{ source_commit: string }>("evidence/traceability/baseline.json")
  const securityCase = await readJson<{ case_id: string; profile_id: string; expect: { kind: string } }>(path)
  const name = slug(securityCase.case_id)
  const commuting = await readJson<{ status: string; actual: Record<string, unknown> }>(
    `evidence/traceability/commuting.security.${name}.json`,
  )
  const rows = [
    { kind: "hello", protocol_version: "0.1.0", implementation_id: "opencode-source", implementation_version: baseline.source_commit },
    { kind: "capabilities", supported_profiles: ["security-critical"], supported_transports: ["file_path"], supported_observations: ["permission_gate", "route_projection"] },
    { kind: "profile_request", profile_id: securityCase.profile_id },
    { kind: "profile_response", profile_id: securityCase.profile_id, accepted: true },
    { kind: "case_offer", case_id: securityCase.case_id, profile_id: securityCase.profile_id, schema_family: "contract.security.case", payload: { path } },
    { kind: "case_accept", case_id: securityCase.case_id, accepted: true },
    { kind: "checkpoint", case_id: securityCase.case_id, seq: 1, observation_kind: securityCase.expect.kind, payload: commuting.actual },
    { kind: "verdict", case_id: securityCase.case_id, status: commuting.status, evidence: `evidence/traceability/commuting.security.${name}.json` },
  ]
  if (rows.at(-1)?.status !== "pass") throw new Error("security certification did not pass")
  return [`evidence/traceability/opencode_source.security_critical.${name}.jsonl`, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`] as const
}

const main = async () => {
  const cases = await list("contracts/security/cases/*.json")
  let bad = false
  for (const path of cases) {
    const [target, want] = await render(path)
    if (mode === "write") {
      await Bun.write(join(root, target), want)
      continue
    }
    const got = await Bun.file(join(root, target)).text()
    if (got === want) continue
    console.error(`stale security certification transcript: ${target}`)
    bad = true
  }
  if (bad) process.exit(1)
}

await main()
