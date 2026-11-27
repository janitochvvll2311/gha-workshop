#!/usr/bin/env bash
set -euo pipefail

echo "==> Verificando herramientas"

for command in bun git docker gh; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Falta la herramienta: $command" >&2
    exit 1
  fi
  echo "  ✓ $command"
done

docker info >/dev/null
echo "  ✓ Docker daemon"
gh auth status
echo "  ✓ gh autenticado"

if ! gh extension list | grep -q "gh act"; then
  echo "==> Instalando la extensión gh-act"
  gh extension install nektos/gh-act
fi

gh act --version

echo "==> Descargando imágenes base"
docker pull ubuntu:24.04
docker pull oven/bun:1.4.4-slim
docker pull catthehacker/ubuntu:act-latest

echo "==> Preflight completado"
