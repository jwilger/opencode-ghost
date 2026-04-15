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
- `lean` / `lake` (Lean 4)
- `quint`

## 2. Run bootstrap verification

```bash
./verify-all
```

`verify-all` currently performs:

1. toolchain presence/version checks
2. bootstrap file presence checks
3. optional execution of `script/verify/*.sh` hooks in sorted order

## 3. Add future checks

As extraction and conformance scripts are added, place them under `script/verify/` as `*.sh` files. They will be auto-discovered and executed deterministically by `verify-all`.
