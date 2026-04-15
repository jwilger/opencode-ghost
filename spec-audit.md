# Spec Audit

This document is the human-readable audit layer for the ghost specification.

Unlike generated ledgers and matrices, this file is intentionally editorial. It
records whether the specification remains semantically legible to a reviewer who
cares about:

- abstraction quality,
- operational relevance,
- compatibility boundaries,
- and the distinction between proved, modeled, tested, and merely observed
  claims.

## Audit axes

### Runtime semantics

Questions:

- Is the semantic kernel minimal and sufficient?
- Are route, session, sync, permission, and worktree behaviors factored through
  the kernel rather than duplicated at multiple levels?
- Are operational theorems actually constraining conformance, rather than merely
  restating it?

### TUI semantics

Questions:

- Is the TUI specified extensionally rather than renderer-specifically?
- Are interaction, layout, and frame semantics cleanly separated?
- Are certified frame obligations stricter than observational invariants only
  where strictness is genuinely required?

### Compatibility policy

Questions:

- Are `normative`, `compatibility_only`, and `excluded` behaviors separated with
  defensible ADR support?
- Are bug-compatible requirements narrow and explicit?

### Verification semantics

Questions:

- Do the commuting-diagram checks compare the correct observation spaces?
- Are normalization assumptions explicit and adversarially tested?
- Is the oracle derived tightly enough to avoid becoming a shadow
  implementation?

### Consumer viability

Questions:

- Can `opencode` itself satisfy the promoted profiles under the conformance kit?
- Can the Rust reference consumer implement promoted slices without semantic
  guesswork?
- Does the secondary consumer still find the contracts language-neutral?

## Update rule

This file should change only when one of the following changes materially:

- the semantic kernel,
- the trust base,
- artifact promotion criteria,
- observation-space design,
- or a counterexample forces a reinterpretation of the contract.
