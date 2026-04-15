# formalization-inventory.md

> Generated from `graph/contract-graph.jsonl`. Do not edit directly.

## Formal Claims

| Claim | Support | Refines | Checked by | State |
| --- | --- | --- | --- | --- |
| `claim.runtime.pending_waiting` | `artifact.lean.runtime_witness` | `surface.kernel` |  | `provisional` |
| `claim.runtime.approved_idle` | `artifact.lean.runtime_witness` | `surface.kernel` |  | `provisional` |
| `claim.runtime.rejected_idle` | `artifact.lean.runtime_witness` | `surface.kernel` |  | `provisional` |
| `claim.runtime.witness_final` | `artifact.spec.runtime_witness` | `surface.kernel` |  | `provisional` |
| `claim.runtime.reject_witness_final` | `artifact.spec.runtime_witness` | `surface.kernel` |  | `provisional` |
| `claim.runtime.commuting.permission_cycle` |  | `surface.kernel` | `artifact.evidence.runtime_permission_cycle_commuting` | `provisional` |
| `claim.runtime.source_certified.permission_cycle` |  |  | `artifact.evidence.opencode_runtime_formal_transcript` | `provisional` |
| `claim.runtime.commuting.permission_reject` |  | `surface.kernel` | `artifact.evidence.runtime_permission_reject_commuting` | `provisional` |
| `claim.runtime.source_certified.permission_reject` |  |  | `artifact.evidence.opencode_runtime_formal_reject_transcript` | `provisional` |
| `claim.normalization.runtime_laws` |  |  | `artifact.script.normalize` | `provisional` |
| `claim.normalization.tui_laws` |  |  | `artifact.script.normalize` | `provisional` |

## Formal Profile Requirements

| Profile | Requires | Covers |
| --- | --- | --- |
| `profile.runtime_formal` | `artifact.spec.runtime_witness`, `artifact.lean.runtime_witness`, `artifact.case.runtime_permission_cycle`, `artifact.evidence.runtime_permission_cycle_commuting`, `artifact.case.runtime_permission_reject`, `artifact.evidence.runtime_permission_reject_commuting` | `surface.kernel` |
