#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
hugo --gc --minify
test -f public/index.html
echo "verify-build: base OK"
