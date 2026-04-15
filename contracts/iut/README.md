# Implementation Under Test Contracts

These files define the evaluator boundary for external implementations.

- `runtime.json` describes how a runtime implementation starts, receives cases, emits observations, and reports verdict-relevant failures.
- `tui.json` describes how a TUI implementation starts in deterministic mode, receives interaction events, and emits frame and layout checkpoints.

These contracts are already used by:

- source-first certification of the `opencode` implementation
- the Rust reference consumer
- the Rust source-isolated consumer
- the Go sanity consumer

Design constraints:

- language agnostic
- Rust-friendly
- explicit discriminants, ordering, and nullability
- shared evaluator topology across runtime and TUI certification

These contracts are the concrete specialization of the conformance-kit protocol. They may still become more specific, but they are already normative enough to carry promoted witness slices and profile certification.
