# completeness-matrix.md

> Generated from `graph/contract-graph.jsonl`. Do not edit directly.

## Profile Matrix

| Profile | Includes | Covers | Requires | Certified | State |
| --- | --- | --- | --- | --- | --- |
| `profile.core_runtime` |  | `surface.runtime` | 3 | 3 | `normative` |
| `profile.runtime_formal` |  | `surface.kernel` | 6 | 3 | `normative` |
| `profile.tui_certified` |  | `surface.tui` | 18 | 3 | `normative` |
| `profile.integrations_canonical` |  | `surface.integrations` | 4 | 1 | `normative` |
| `profile.security_critical` |  | `surface.security` | 4 | 1 | `normative` |
| `profile.full_reference` | `profile.core_runtime`, `profile.runtime_formal`, `profile.tui_certified`, `profile.integrations_canonical`, `profile.security_critical` |  | 35 | 1 | `normative` |

## Artifact Totals

| Type | Count |
| --- | --- |
| artifact | 169 |
| claim | 47 |
| surface | 5 |
| profile | 6 |
| report | 7 |
| world | 13 |
