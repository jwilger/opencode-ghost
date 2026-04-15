#!/usr/bin/env bash
set -euo pipefail

root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

echo "==> rust reference consumer"
cargo run --quiet --manifest-path consumer/rust-ref/Cargo.toml -- runtime >/tmp/opencode-ghost-rust-runtime.json
cargo run --quiet --manifest-path consumer/rust-ref/Cargo.toml -- tui >/tmp/opencode-ghost-rust-tui.json
