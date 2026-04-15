# opencode-ghost

`opencode-ghost` is the specification-first repository for source-isolated reimplementation of the `opencode` runtime and built-in TUI.

This repository is intentionally bootstrap-light at first:

- deterministic dev shell via Nix
- Lean and Quint toolchain availability
- a single `verify-all` entrypoint
- room for extraction and validation hooks in `script/verify/*.sh`

## Quick start

```bash
nix develop
./verify-all
```

## Bootstrap scope

Current bootstrap verifies tool availability and file-level scaffolding only. Runtime extraction, formal checks, contract validation, and profile conformance checks should be added as hook scripts under `script/verify/`.
