# Consumer Examples

This directory contains small downstream consumers for promoted ghost artifacts.

They are intentionally minimal. Their purpose is to prove that the current
contracts are consumable by real implementations, not to serve as production
reimplementations of `opencode`.

## Consumers

- `rust-ref/`
  - Rust reference consumer for the promoted runtime and TUI witness slices
- `rust-blind/`
  - Rust source-isolated consumer that runs against copied ghost artifacts from
    a temporary root
- `go-sanity/`
  - Go portability sentinel that parses promoted witness artifacts without
    special pleading

## How They Are Used

`./verify-all` exercises them through:

- `script/verify/150-rust-ref.sh`
- `script/verify/160-go-sanity.sh`
- `script/verify/170-rust-blind.sh`
- `script/verify/175-consumer-certify.sh`

## Running Them Manually

Rust reference consumer:

```bash
cargo run --quiet --manifest-path consumer/rust-ref/Cargo.toml -- runtime
cargo run --quiet --manifest-path consumer/rust-ref/Cargo.toml -- tui
```

Rust source-isolated consumer:

```bash
tmp="$(mktemp -d)"
mkdir -p "$tmp/contracts/runtime/cases" "$tmp/contracts/tui/cases" "$tmp/evidence/traceability"
cp contracts/runtime/cases/*.json "$tmp/contracts/runtime/cases/"
cp contracts/tui/cases/*.json "$tmp/contracts/tui/cases/"
cp evidence/traceability/commuting.runtime.*.json "$tmp/evidence/traceability/"
cp evidence/traceability/commuting.tui.*.json "$tmp/evidence/traceability/"
cargo run --quiet --manifest-path consumer/rust-blind/Cargo.toml -- "$tmp"
rm -rf "$tmp"
```

Go sanity consumer:

```bash
(cd consumer/go-sanity && go run .)
```

## What Success Means

These consumers currently prove that:

- promoted witness cases are machine-readable outside the source implementation
- the current IUT and conformance-kit boundary is usable from Rust
- the promoted runtime and TUI witness slices can be consumed without JS-only
  assumptions
- the current contract family is at least minimally portable to another language
