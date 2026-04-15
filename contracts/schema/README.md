# Schema Families

These schema-family files define the machine-readable families for the ghost evaluator.

- `conformance-kit.json` defines the outer protocol used to negotiate capabilities, profiles, fixtures, checkpoints, and verdicts.
- `profile-certification.json` defines generated source and consumer profile summaries.
- `consumer-certification.json` defines generated downstream consumer certification summaries.
- `runtime-case.json` defines the initial runtime conformance-case family.
- `tui-interaction.json`, `tui-layout.json`, and `tui-frame.json` define the three TUI observation layers.

These schemas are deliberately narrow:

- they prefer tagged unions and explicit ordering
- they keep nullability and optionality distinct
- they describe stable evaluator families and invariants rather than mirroring every upstream payload verbatim

The schemas are already exercised by extraction, commuting checks, source certification, and downstream consumer certification. Additional fields should be added only when a promoted surface or counterexample requires them.
