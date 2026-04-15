# Trust Base

This document enumerates the trusted computing base for `opencode-ghost`.

The project goal is not to eliminate trust. It is to minimize, stratify, and
make explicit every trust dependency that mediates between:

1. upstream `opencode` evidence,
2. abstract and kernel semantics,
3. formal artifacts,
4. conformance judgments,
5. source-isolated downstream implementations.

## Strata

### Logical assumptions

- Lean kernel soundness.
- Soundness of the underlying mathematical reasoning encoded in the proved
  statements.
- Correct interpretation of theorem statements relative to the intended abstract
  semantics.

### Abstraction assumptions

- The abstract model and kernel preserve all semantically material distinctions
  required by the ghost contract.
- Concrete `opencode` behavior admitted as `compatibility_only` or `excluded`
  is correctly classified.
- Refinement mappings from concrete evidence into abstract semantics are
  complete for promoted surfaces.

### Normalization assumptions

- Normalizers erase only observationally irrelevant distinctions.
- Redaction does not collapse semantically distinct integration or session
  behaviors.
- Frame and trace normalization preserve all release-blocking observables.

### Harness assumptions

- The conformance kit and IUT bindings accurately capture the intended
  observation spaces.
- Extraction scripts produce deterministic and faithful inventories from the
  pinned `opencode` commit.
- Generated governance views are faithful projections of the contract graph.

### Environmental assumptions

- Nix-pinned tools are the ones actually used during verification.
- Terminal assumptions for the certified TUI matrix are stable:
  Linux, UTF-8, truecolor, and the declared width policy.
- Live-provider evidence is interpreted only through the fixture and evidence
  rules codified in the repo.

## TCB classes

The operational TCB includes:

- extraction scripts
- graph generators
- normalizers
- oracle implementation
- fixture minimizers
- conformance-kit harness
- Lean toolchain
- Quint and model-checking toolchain
- Nix-pinned environment definitions

The generated `tcb-inventory.md` should refine this document into concrete
artifacts, their semantic role, and their deterministic-output obligations.

## Release-blocking rule

No formal claim is release-blocking unless its dependence on the trust base is
explicitly recorded in:

- the claims ledger,
- the formalization inventory,
- the refinement ledger,
- and the generated TCB inventory.
