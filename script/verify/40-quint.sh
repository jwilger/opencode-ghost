#!/usr/bin/env bash
set -euo pipefail

root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

echo "==> quint witness verification"
quint typecheck spec/runtime_witness.qnt
quint test spec/runtime_witness.qnt --main runtime_witness --match permission_cycle --verbosity 1
quint run spec/runtime_witness.qnt --main runtime_witness --invariant inv --max-steps 8 --max-samples 128 --seed 7 --verbosity 1
