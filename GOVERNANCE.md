# Governance

This repository is structurally frozen except for defect-driven amendments.

## Plan-Freeze Discipline

No new artifact family, governance surface, or release-bearing proof obligation
 may be introduced unless it is forced by one of:

- a promoted counterexample
- a non-commuting diagram
- failure of opencode baseline certification
- failure of the Rust witness or source-isolated consumer

When such a change is required, the amendment must be recorded in:

- `graph/contract-graph.jsonl`
- the relevant ADR under `adr/`
- any affected generated governance views

## Semantic Editor

The semantic editor is the anti-duplication authority for:

- the contract graph
- the semantic kernel
- the golden oracle
- the refinement ledger
- the conformance kit
- proof-bearing artifacts

The semantic editor may reject a proposed normative artifact if its semantics are
already subsumed by an existing artifact or can be generated from one.

## Normative Minimality Rule

Every normative artifact and normative claim must include an explicit
irreducibility justification in graph metadata.

That justification should answer:

- why the artifact cannot be generated from another normative artifact
- why the artifact is not redundant with an existing normative surface
- what semantic obligation would become ungrounded if the artifact were removed

## Foundational vs Peripheral Machinery

Foundational machinery:

- contract graph
- semantic kernel
- runtime and TUI IUT contracts
- conformance-kit protocol
- golden oracle
- Quint witness artifacts
- Lean witness artifacts
- normalization rules and checks
- the seven-layer witness slice

Peripheral machinery:

- secondary consumer checks beyond the required portability sentinel
- convenience reports that do not change certification outcomes
- nonessential diagnostics
- optional coverage refinements

Peripheral machinery may be deferred or reduced if it impedes foundational
closure. Foundational machinery may not be destabilized to improve peripheral
coverage.

## Decisive Epistemic Gate

The seven-layer witness slice is the decisive epistemic gate for the repository.
If it fails to close cleanly, the correct response is to simplify the semantic
basis rather than add more governance machinery.

The witness slice must continue to close across:

`evidence -> abstract model -> kernel -> oracle -> Quint -> Lean -> conformance -> implementation`

## Amendment Rule

All structural amendments after the plan freeze are defect-driven. Cosmetic or
editorial improvements are allowed, but they must not widen the normative basis
or mutate certification obligations without the defect-driven justification
described above.
