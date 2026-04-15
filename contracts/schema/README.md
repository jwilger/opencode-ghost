# Schema Families

These schema-family files define the bootstrap machine-readable shapes for the ghost evaluator.

- `conformance-kit.json` defines the outer protocol used to negotiate capabilities, profiles, fixtures, checkpoints, and verdicts.
- `runtime-case.json` defines the initial runtime conformance-case family.
- `tui-interaction.json`, `tui-layout.json`, and `tui-frame.json` define the three TUI observation layers.

These are deliberately narrow:

- they prefer tagged unions and explicit ordering
- they keep nullability and optionality distinct
- they describe families and invariants rather than every final field from opencode

Later extraction phases should refine the vocabularies and add enumerated IDs without changing the basic evaluator topology.
