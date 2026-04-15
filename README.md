# opencode-ghost

`opencode-ghost` is a specification and conformance repository for the
`opencode` runtime and built-in TUI.

The goal is to make reimplementation possible without reading the upstream
source tree. In practice, this repo gives you:

- extracted contracts and inventories from a pinned `opencode` commit
- witness cases for runtime, TUI, integrations, and security behavior
- an evaluator boundary for external implementations
- machine-checked evidence that the original `opencode` codebase satisfies the
  promoted profiles
- downstream consumer checks in Rust and Go

If you are approaching this as an average senior engineer, the short version is:

1. run `./verify-all`
2. read the generated reports
3. inspect the witness cases you care about
4. implement against the conformance-kit and IUT contracts
5. compare your implementation against the same cases that `opencode` passes

## What This Repo Is For

Use this repo when you want to:

- understand what parts of `opencode` are considered stable enough to specify
- inspect promoted runtime, TUI, integration, or security witness cases
- certify that the source implementation still satisfies the ghost contracts
- build an external implementation against a stable evaluator boundary
- understand how formal artifacts, concrete cases, and generated reports fit
  together

Use the upstream `opencode` repo when you want to:

- change product behavior
- debug implementation bugs directly in the product code
- work on features that are not yet promoted here

## Quick Start

Enter the pinned toolchain shell and run the full verifier:

```bash
nix develop
./verify-all
```

Or run it in one command:

```bash
nix develop /home/jwilger/projects/opencode-ghost -c ./verify-all
```

The verifier checks:

- extracted inventories and file traceability
- generated governance views
- JSON, JSONL, and graph integrity
- baseline certification of the original `opencode` implementation
- Quint and Lean witness artifacts
- runtime and TUI commuting checks
- integration and security witness checks
- normalization laws
- deterministic regeneration
- semantic freeze status
- aggregate profile certification
- downstream Rust and Go consumer checks

## What To Read First

If you want the practical entrypoints, start here:

- [VERIFY.md](/home/jwilger/projects/opencode-ghost/VERIFY.md)
- [GOVERNANCE.md](/home/jwilger/projects/opencode-ghost/GOVERNANCE.md)
- [contracts/iut/README.md](/home/jwilger/projects/opencode-ghost/contracts/iut/README.md)
- [contracts/tui/README.md](/home/jwilger/projects/opencode-ghost/contracts/tui/README.md)
- [contracts/schema/README.md](/home/jwilger/projects/opencode-ghost/contracts/schema/README.md)

If you want the generated high-level status views, start here:

- [claims-ledger.md](/home/jwilger/projects/opencode-ghost/claims-ledger.md)
- [formalization-inventory.md](/home/jwilger/projects/opencode-ghost/formalization-inventory.md)
- [completeness-matrix.md](/home/jwilger/projects/opencode-ghost/completeness-matrix.md)
- [refinement-ledger.md](/home/jwilger/projects/opencode-ghost/refinement-ledger.md)
- [semantic-coverage-report.md](/home/jwilger/projects/opencode-ghost/semantic-coverage-report.md)
- [rust-ergonomics-report.md](/home/jwilger/projects/opencode-ghost/rust-ergonomics-report.md)
- [tcb-inventory.md](/home/jwilger/projects/opencode-ghost/tcb-inventory.md)

If you want the canonical machine-readable index, read:

- [graph/contract-graph.jsonl](/home/jwilger/projects/opencode-ghost/graph/contract-graph.jsonl)

## Repository Layout

The repo is organized by function rather than by language alone.

- `graph/`
  - the canonical contract graph and its schema
- `contracts/`
  - machine-readable contract families, IUT boundaries, cases, inventories, and
    world descriptions
- `model/`
  - abstract runtime and TUI model seeds, including kernel-level structure
- `spec/`
  - Quint artifacts
- `OpencodeGhost/` and `lean/`
  - Lean artifacts
- `tests/`
  - normalization and witness test inputs
- `evidence/traceability/`
  - commuting evidence, certification transcripts, profile summaries, consumer
    summaries, and semantic freeze data
- `consumer/`
  - downstream reference consumers and portability sentinels
- `script/`
  - extraction, rendering, commuting, certification, normalization, and freeze
    tooling
- `script/verify/`
  - the ordered verification pipeline executed by `./verify-all`
- `adr/`
  - concrete semantic decision records

## The Main Concepts

### 1. Contract graph

`graph/contract-graph.jsonl` is the canonical index for surfaces, artifacts,
claims, profiles, worlds, and report generation. The Markdown ledgers are
derived from it.

### 2. Witness cases

The repo does not try to specify every possible behavior at once. It promotes
explicit witness cases for high-value behavior slices.

Examples:

- runtime permission cycle
- runtime permission rejection
- runtime workspace lifecycle
- TUI permission view
- certified built-in dialogs and surfaces
- canonical provider and auth-surface integrations
- security-sensitive permission and path cases

### 3. Conformance kit

The conformance kit is the evaluator protocol for an implementation under test.
It covers:

- capability advertisement
- profile negotiation
- case offer and acceptance
- checkpoint emission
- verdict reporting

See [contracts/schema/conformance-kit.json](/home/jwilger/projects/opencode-ghost/contracts/schema/conformance-kit.json).

### 4. Source-first certification

Before a promoted artifact is treated as normative, the original `opencode`
implementation must pass it under the same evaluator boundary.

That evidence lives under `evidence/traceability/opencode_source.*`.

### 5. Downstream consumers

This repo also checks that the promoted slices are consumable outside the source
implementation.

Current consumers:

- Rust reference consumer
- Rust source-isolated consumer
- Go sanity consumer

## How To Use This Repo

### Workflow A: understand the current specified surface

1. Run `./verify-all`.
2. Open [completeness-matrix.md](/home/jwilger/projects/opencode-ghost/completeness-matrix.md).
3. Open the profile summary you care about, for example:
   [evidence/traceability/opencode_source.profile.full_reference.json](/home/jwilger/projects/opencode-ghost/evidence/traceability/opencode_source.profile.full_reference.json)
4. Follow the case IDs into `contracts/*/cases`.
5. Follow the corresponding commuting and certification evidence under
   `evidence/traceability/`.

### Workflow B: inspect one behavior slice end to end

For a runtime slice:

1. Read the case under `contracts/runtime/cases/`.
2. Read the commuting evidence under `evidence/traceability/commuting.runtime.*`.
3. Read the source certification transcript under
   `evidence/traceability/opencode_source.runtime_formal.*` or
   `opencode_source.core_runtime.*`.
4. If relevant, inspect the Quint and Lean witness artifacts.

For a TUI slice:

1. Read the case under `contracts/tui/cases/`.
2. Read the commuting evidence under `evidence/traceability/commuting.tui.*`.
3. Read the source certification transcript under
   `evidence/traceability/opencode_source.tui_certified.*`.

### Workflow C: implement an external consumer

1. Read [contracts/iut/README.md](/home/jwilger/projects/opencode-ghost/contracts/iut/README.md).
2. Read [contracts/schema/conformance-kit.json](/home/jwilger/projects/opencode-ghost/contracts/schema/conformance-kit.json).
3. Start with one witness case from `contracts/runtime/cases/` or
   `contracts/tui/cases/`.
4. Make your implementation emit checkpoints and verdicts using the conformance
   kit message shapes.
5. Compare your behavior to the generated evidence for the same case.

The consumers under `consumer/` are useful examples of the current integration
boundary, not production implementations.

### Workflow D: add a new promoted case

1. Add or refine the case under the relevant `contracts/*/cases/` directory.
2. Update graph metadata in `graph/contract-graph.jsonl`.
3. Add or update any required world binding under `contracts/worlds/`.
4. Add or update the corresponding commuting or certification script if the new
   case expands a promoted surface.
5. Run `./verify-all`.
6. Ensure the generated reports and evidence are stable and deterministic.

## Current Profiles

The top-level profiles are:

- `core-runtime`
- `runtime-formal`
- `tui-certified`
- `integrations-canonical`
- `security-critical`
- `full-reference`

The generated profile summaries under `evidence/traceability/` show which cases
currently back each profile and whether the source implementation passed them.

## Current Status

At the time of writing, this repository already includes:

- baseline certification of `opencode` as the first consumer
- promoted runtime, TUI, integration, and security witness slices
- generated governance reports from the graph
- Quint and Lean witness artifacts
- deterministic regeneration checks
- downstream consumer summaries for Rust and Go

This means the repo is already usable as both:

- a specification and audit surface
- a practical starting point for an external implementation

## Design Rules

Some design choices are easy to miss if you only read cases:

- the contract graph is authoritative; generated Markdown is not
- normalization is part of the semantics, not post-processing fluff
- exact TUI frame parity is important, but it is not the whole TUI semantics
- opencode baseline certification is required before promotion
- the repository is structurally frozen except for defect-driven amendments

See [GOVERNANCE.md](/home/jwilger/projects/opencode-ghost/GOVERNANCE.md) and
[trust-base.md](/home/jwilger/projects/opencode-ghost/trust-base.md) for the
governing rules behind those choices.
