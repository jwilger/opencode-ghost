# Security Contracts

This directory contains security-critical witness cases.

## Current promoted cases

- `cases/permission.gating.json`
- `cases/path.operations.json`

These cases currently cover:

- permission gating
- path-sensitive route exposure

They are backed by:

- commuting evidence under `evidence/traceability/commuting.security.*`
- source certification transcripts under
  `evidence/traceability/opencode_source.security_critical.*`

This surface is intentionally focused on high-value, operationally testable
security behavior rather than broad policy prose.
