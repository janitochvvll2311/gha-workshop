#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/janitochvvll2311/gha-workshop.git}"
REF="${REF:-main}"
IMAGE="${IMAGE:-gha-runner-lab:1}"

echo "==> Construyendo imagen del runner: $IMAGE"
docker build -f docker/runner.Dockerfile -t "$IMAGE" .

echo "==> Ejecutando CI en un runner limpio"
docker run --rm \
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
