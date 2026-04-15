# ADRs

This directory stores short architecture decision records for semantic choices
that should not remain implicit in worker context or code review archaeology.

Each ADR should include:

- stable ID
- title
- status
- date
- decision taxonomy
- affected contract-graph IDs
- motivating evidence
- chosen decision
- rejected alternatives
- downstream impact

## Taxonomy

- `abstraction`
- `compatibility`
- `exclusion`
- `formalization-boundary`
- `normalization`
- `observation-space`
- `oracle-derivation`

## Required use

An ADR is required whenever the project:

- promotes a surprising behavior to `normative`,
- preserves a behavior as `compatibility_only`,
- excludes observed behavior from the ghost contract,
- changes an observation space,
- admits non-derived oracle logic into the TCB,
- or changes a release-blocking formal boundary.
