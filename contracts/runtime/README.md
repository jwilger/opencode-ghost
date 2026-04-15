# Runtime Contracts

This directory contains runtime-facing contract artifacts.

## Main contents

- `cases/`
  - promoted runtime witness cases
- `inventory/`
  - extracted route and command inventories from the pinned `opencode` commit

## How To Use It

If you want to understand one runtime slice:

1. open a case in `cases/`
2. open the corresponding commuting evidence under `evidence/traceability/`
3. open the matching source certification transcript
4. if the slice is formal, inspect the Quint and Lean witness artifacts too

The promoted runtime cases are the quickest path into the repo’s runtime
semantics because they bind concrete observations to profiles, worlds, and
certification evidence.
