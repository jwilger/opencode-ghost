# Integration Contracts

This directory contains integration-facing contract artifacts.

## Main contents

- `cases/`
  - promoted canonical integration witness cases
- `inventory/`
  - extracted provider inventory from the pinned `opencode` commit

## Current focus

The current promoted integration surface is intentionally narrow:

- provider inventory coverage
- auth-surface coverage

These cases are backed by:

- commuting evidence under `evidence/traceability/commuting.integrations.*`
- source certification transcripts under
  `evidence/traceability/opencode_source.integrations_canonical.*`
