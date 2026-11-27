#!/usr/bin/env bash
set -euo pipefail

echo "==> Instalando dependencias"
bun install --frozen-lockfile

echo "==> Verificando tipos"
bun run typecheck

echo "==> Ejecutando tests"
bun test
