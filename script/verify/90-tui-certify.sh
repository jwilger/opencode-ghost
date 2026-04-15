#!/usr/bin/env bash
set -euo pipefail

root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

echo "==> tui conformance-kit certification"
bun script/tui-certify.ts --check
