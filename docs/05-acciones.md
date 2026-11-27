# 05 · Acciones de terceros

**Tiempo:** 25 min
**Objetivo:** usar `actions/checkout` y `oven-sh/setup-bun` para que el workflow
funcione en GitHub real, fijando las acciones por SHA completo.

## Por qué hacen falta acciones

En `act` el workspace local está montado. En GitHub, el runner empieza vacío:
no tiene tu código ni Bun instalado.

Necesitamos:

- `actions/checkout`: clonar el repositorio en el runner.
- `oven-sh/setup-bun`: instalar la versión de Bun que usa el proyecto.

## `uses` y `with`

```yaml
      - name: Checkout
        uses: actions/checkout@<SHA>
        with:
          persist-credentials: false
```

- `uses` indica la acción y la versión.
- `with` pasa entradas a la acción.

## Fijar por SHA, no por tag

Los tags como `v7` pueden moverse. Un atacante podría apuntar un tag a un commit
malicioso. Para un repositorio público, fija el **SHA completo** y deja un
comentario con la versión legible:

```yaml
uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
```

```yaml
uses: oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6 # v2.2.0
```

Dependabot puede actualizar estos SHA y sus comentarios.

## Workflow final

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

Si estás siguiendo el taller desde un tag:

```bash
git switch --detach fase-5
gh act workflow_dispatch -j test
```

## Ejecutar con act

```bash
gh act workflow_dispatch -j test
```

Ahora el workflow ya no depende de que Bun esté preinstalado en la imagen:
`setup-bun` lo instala. `checkout` deja el repositorio en el workspace del
runner.

## Seguridad de las acciones

- Fija todas las acciones por SHA.
- Revisa el código de una acción antes de usarla.
- Prefiere acciones oficiales o de proveedores confiables.
- No pases secretos a acciones de terceros sin necesidad.
- Mantén `permissions` en solo lectura.
- No uses `pull_request_target` para ejecutar código de un PR.
- Activa Dependabot para `github-actions`.

`persist-credentials: false` evita que el token quede guardado en la
configuración de Git del runner. No lo necesitamos para este proyecto.

## Dependabot

`.github/dependabot.yml` mantiene actualizadas las acciones y las dependencias
de Bun. Dependabot para acciones actualiza el SHA y el comentario de versión.

## Ejercicio: comparar tags y SHA

1. Cambia temporalmente el SHA de `setup-bun` por `@v2`.
2. Ejecuta `gh act workflow_dispatch -j test`.
3. Vuelve a fijarlo por SHA.
4. Discute por qué el tag es más cómodo pero menos seguro.

No dejes el tag en `main`.

## Checkpoint

- [ ] El workflow incluye `actions/checkout`.
- [ ] El workflow incluye `oven-sh/setup-bun`.
- [ ] Ambas acciones están fijadas por SHA completo.
- [ ] `persist-credentials: false` está presente.
- [ ] `gh act workflow_dispatch -j test` termina en verde.
- [ ] El workflow ya funcionaría en GitHub real.
