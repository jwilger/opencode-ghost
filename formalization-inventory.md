# formalization-inventory.md

> Generated from `graph/contract-graph.jsonl`. Do not edit directly.

## Formal Claims

| Claim | Support | Refines | Checked by | State |
| --- | --- | --- | --- | --- |
| `claim.runtime.pending_waiting` | `artifact.lean.runtime_witness` | `surface.kernel` |  | `normative` |
| `claim.runtime.approved_idle` | `artifact.lean.runtime_witness` | `surface.kernel` |  | `normative` |
| `claim.runtime.rejected_idle` | `artifact.lean.runtime_witness` | `surface.kernel` |  | `normative` |
| `claim.runtime.witness_final` | `artifact.spec.runtime_witness` | `surface.kernel` |  | `normative` |
| `claim.runtime.reject_witness_final` | `artifact.spec.runtime_witness` | `surface.kernel` |  | `normative` |
| `claim.runtime.commuting.permission_cycle` |  | `surface.kernel` | `artifact.evidence.runtime_permission_cycle_commuting` | `normative` |
| `claim.runtime.source_certified.permission_cycle` |  |  | `artifact.evidence.opencode_runtime_formal_transcript` | `normative` |
| `claim.runtime.commuting.permission_reject` |  | `surface.kernel` | `artifact.evidence.runtime_permission_reject_commuting` | `normative` |
| `claim.runtime.source_certified.permission_reject` |  |  | `artifact.evidence.opencode_runtime_formal_reject_transcript` | `normative` |
| `claim.runtime.commuting.workspace_lifecycle` |  | `surface.runtime` | `artifact.evidence.runtime_workspace_lifecycle_commuting` | `normative` |
| `claim.runtime.source_certified.workspace_lifecycle` |  |  | `artifact.evidence.opencode_core_runtime_workspace_lifecycle_transcript` | `normative` |
| `claim.normalization.runtime_laws` |  |  | `artifact.script.normalize` | `normative` |
| `claim.normalization.tui_laws` |  |  | `artifact.script.normalize` | `normative` |

## Formal Profile Requirements

| Profile | Requires | Covers |
| --- | --- | --- |
| `profile.runtime_formal` | `artifact.spec.runtime_witness`, `artifact.lean.runtime_witness`, `artifact.case.runtime_permission_cycle`, `artifact.evidence.runtime_permission_cycle_commuting`, `artifact.case.runtime_permission_reject`, `artifact.evidence.runtime_permission_reject_commuting` | `surface.kernel` |
