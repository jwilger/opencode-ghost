# Implementation Under Test Contracts

These files define the bootstrap evaluator boundary for external implementations.

- `runtime.json` describes how a runtime implementation starts, receives cases, emits observations, and reports verdict-relevant failures.
- `tui.json` describes how a TUI implementation starts in deterministic mode, receives interaction events, and emits frame and layout checkpoints.

These contracts are intentionally bootstrap-quality:

- language agnostic
- Rust-friendly
- strict about discriminants, ordering, and nullability
- incomplete where the upstream extraction has not yet frozen exact payloads

They are not final protocol commitments. Later phases should tighten field vocabularies, observation shapes, and profile-specific obligations without changing the overall evaluator topology.
