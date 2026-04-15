#!/usr/bin/env bun

import { join } from "node:path"

const root = join(import.meta.dir, "..")
const mode = process.argv.includes("--write") ? "write" : "check"
const target = "evidence/traceability/opencode_source.tui_certified.permission_view.jsonl"

const readJson = async <T>(path: string) => (await Bun.file(join(root, path)).json()) as T

type Baseline = {
  source_commit: string
  required_tui_surfaces: string[]
  required_tui_tests: string[]
}

type TuiCase = {
  case_id: string
  profile_id: string
}

type Commute = {
  actual: Record<string, unknown>
  status: string
}

const render = async () => {
  const baseline = await readJson<Baseline>("evidence/traceability/baseline.json")
  const tuiCase = await readJson<TuiCase>("contracts/tui/cases/witness.permission_view.json")
  const commuting = await readJson<Commute>("evidence/traceability/commuting.tui.permission_view.json")
  const rows = [
    {
      kind: "hello",
      protocol_version: "0.1.0",
      implementation_id: "opencode-source",
      implementation_version: baseline.source_commit,
    },
    {
      kind: "capabilities",
      supported_profiles: ["tui-certified"],
      supported_transports: ["file_path"],
      supported_observations: ["interaction", "layout", "frame", "state_projection"],
    },
    {
      kind: "profile_request",
      profile_id: tuiCase.profile_id,
    },
    {
      kind: "profile_response",
      profile_id: tuiCase.profile_id,
      accepted: true,
    },
    {
      kind: "case_offer",
      case_id: tuiCase.case_id,
      profile_id: tuiCase.profile_id,
      schema_family: "contract.tui.case",
      payload: {
        path: "contracts/tui/cases/witness.permission_view.json",
        required_tui_surfaces: baseline.required_tui_surfaces,
        required_tui_tests: baseline.required_tui_tests,
      },
    },
    {
      kind: "case_accept",
      case_id: tuiCase.case_id,
      accepted: true,
    },
    {
      kind: "checkpoint",
      case_id: tuiCase.case_id,
      seq: 1,
      observation_kind: "state_projection",
      payload: commuting.actual,
    },
    {
      kind: "verdict",
      case_id: tuiCase.case_id,
      status: commuting.status,
      evidence: "evidence/traceability/commuting.tui.permission_view.json",
    },
  ]
  const seq = rows
    .filter((row) => row.kind === "checkpoint")
    .map((row) => row.seq)
  if (seq.some((n, i) => n !== i + 1)) throw new Error("checkpoint ordering is not strictly increasing")
  if (rows[0].kind !== "hello") throw new Error("TUI certification transcript must start with hello")
  if (rows.at(-1)?.kind !== "verdict") throw new Error("TUI certification transcript must end with verdict")
  if (rows.at(-1)?.status !== "pass") throw new Error("TUI baseline certification did not pass")
  return `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`
}

const main = async () => {
  const want = await render()
  if (mode === "write") {
    await Bun.write(join(root, target), want)
    return
  }
  const got = await Bun.file(join(root, target)).text()
  if (got === want) return
  throw new Error(`stale TUI certification transcript: ${target}`)
}

await main()
