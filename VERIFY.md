# VERIFY

This repository uses a single verification entrypoint: `./verify-all`.

## 1. Enter the toolchain shell

```bash
nix develop
```

The default shell provides:

- `git`
- `node` (Node 20)
- `bun`
- `rustc` / `cargo`
- `go`
- `lean` / `lake` (Lean 4)
- `quint`

## 2. Run verification

```bash
./verify-all
```

`verify-all` currently performs:

1. toolchain presence/version checks
2. required repository file checks
3. deterministic execution of `script/verify/*.sh` hooks in sorted order

The current hook set covers:

- extraction
- governance rendering
- schema and graph validation
- baseline source certification
- Quint witness validation
- Lean witness validation
- runtime commuting checks
- runtime certification transcript generation
- TUI commuting checks
- TUI certification transcript generation
- normalization-law checks
- integration and security certification
- determinism checks
- semantic freeze reporting
- aggregate profile certification
- Rust reference consumer checks
- Go sanity consumer checks
- Rust source-isolated consumer checks
- consumer certification summaries

## 3. Extend the pipeline

New verification hooks should be added under `script/verify/` as `*.sh` files. They are auto-discovered and executed deterministically by `verify-all`, so new phases should preserve:

- stable output paths
- byte-deterministic regeneration where applicable
- graph-backed artifacts for any promoted normative surface
