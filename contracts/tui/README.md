# TUI Contracts

This directory contains the normative contract family for the built-in `opencode` TUI.

The TUI contract is decomposed into three artifact families:

- `interaction`: input events, route/dialog transitions, and action semantics
- `layout`: semantic regions, focus, visibility, and scroll state
- `frame`: terminal-cell observations for the certified matrix

The current repository uses this family to certify promoted built-in screens, including:

- session
- permission
- session-list dialog
- command dialog
- theme dialog
- plugin-route missing fallback
- home
- help dialog
- sidebar
- timeline dialog

Supporting artifacts in this directory include:

- `certified.json` for the current certified screen set
- `cases/` for promoted TUI witness cases
- `inventory/` for extracted surfaces and test coverage
- `normalization.md` for the TUI normalization boundary
- `terminal-assumptions.md` for the certified terminal matrix

The TUI semantics are observational first. Exact frame parity is one distinguished projection over the certified matrix, alongside interaction, layout, and named observational invariants.
