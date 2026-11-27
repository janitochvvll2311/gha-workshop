# Verificación del taller

Registro de la validación end-to-end realizada al crear el repositorio.

**Fecha:** 2026-11-27

## Entorno de referencia

- Bun `1.4.4`
- Docker `29.6.2`
- Git `2.47.0`
- GitHub CLI `2.93.0`
- `gh act` con `act` `0.2.88`
- Windows 11 + Docker Desktop con contenedores Linux

## Resultados

| Prueba | Resultado |
|---|---|
| `bun install --frozen-lockfile` | OK |
| `bun test` | 20 tests, 31 assertions, 0 fallos |
| `bun run typecheck` | OK |
| `docker build -t gha-workshop:local .` | OK |
| App en Docker (`/api/health`) | `{"status":"ok"}` |
| Usuario dentro de la imagen | `bun` (no-root) |
| `bash scripts/local-ci.sh` | OK en un contenedor limpio |
| `gh act workflow_dispatch -j test` | OK |
| CI en `main` | OK |
| Ruleset `main-protection` | Activa |
| Secret scanning + push protection | Activos |
| Dependabot | Activo |

## Workflow validado

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    name: Test (Bun)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Checkout
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - name: Setup Bun
        uses: oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6 # v2.2.0
        with:
          bun-version: 1.4.4

      - name: Instalar dependencias
        run: bun install --frozen-lockfile

      - name: Verificar tipos
        run: bun run typecheck

      - name: Ejecutar tests
        run: bun test
```

## Notas

- El check requerido por la ruleset es `Test (Bun)`, el nombre del job.
- En la interfaz de Pull Requests, GitHub puede mostrarlo junto al workflow,
  por ejemplo `CI / Test (Bun)`.
- Las acciones están fijadas por SHA completo.
- No se usan secretos ni runners self-hosted.
