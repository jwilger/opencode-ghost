#!/usr/bin/env bash
set -euo pipefail

root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

echo "==> go sanity consumer"
(cd consumer/go-sanity && go run .) >/tmp/opencode-ghost-go-sanity.txt
