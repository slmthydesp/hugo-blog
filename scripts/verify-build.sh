#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
hugo --gc --minify
test -f public/index.html
echo "verify-build: base OK"
test -f public/posts/uniswap-v2-overview/index.html
test -f public/posts/uniswap-v2-pair/index.html
test -f public/posts/openzeppelin-ownable/index.html
test -d public/series/uniswap-v2
test -d public/tags/solidity
echo "verify-build: content OK"
