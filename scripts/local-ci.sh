#!/usr/bin/env bash
set -euo pipefail

DOCKER="${DOCKER:-docker}"

# En Git Bash para Windows, "docker" puede resolver a un cliente Linux que
# apunta a /var/run/docker.sock. Si el daemon no responde, usamos docker.exe.
if ! "$DOCKER" info >/dev/null 2>&1 && command -v docker.exe >/dev/null 2>&1; then
  DOCKER="docker.exe"
fi

REPO_URL="${REPO_URL:-https://github.com/janitochvvll2311/gha-workshop.git}"
REF="${REF:-main}"
IMAGE="${IMAGE:-gha-runner-lab:1}"

echo "==> Construyendo imagen del runner: $IMAGE"
"$DOCKER" build -f docker/runner.Dockerfile -t "$IMAGE" .

echo "==> Ejecutando CI en un runner limpio"
"$DOCKER" run --rm \
  -e REPO_URL="$REPO_URL" \
  -e REF="$REF" \
  "$IMAGE" \
  bash -c '
    set -euo pipefail
    echo "==> Clonando $REPO_URL ($REF)"
    git clone --depth 1 --branch "$REF" "$REPO_URL" repo
    cd repo
    bash ./scripts/ci-steps.sh
  '
