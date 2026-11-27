# 02 · Script de automatización

**Tiempo:** 25 min
**Objetivo:** convertir los pasos manuales de la fase anterior en un script
reproducible y ejecutable con un solo comando.

## Por qué un script

Los pasos manuales son útiles para aprender, pero no para repetir. Un script:

- Documenta el orden exacto.
- Falla rápido con `set -euo pipefail`.
- Se puede ejecutar en local y en CI.
- Reduce la diferencia entre "mi máquina" y "el runner".

## Dos scripts, dos responsabilidades

### `scripts/ci-steps.sh`

Es la receta que debe ejecutar cualquier runner:

```bash
#!/usr/bin/env bash
set -euo pipefail

bun install --frozen-lockfile
bun run typecheck
bun test
```

No clona el repositorio ni crea contenedores. Asume que ya está en la raíz del
proyecto. Así puede reutilizarse en Docker, en `act` y en GitHub.

### `scripts/local-ci.sh`

Es el orquestador local:

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/janitochvvll2311/gha-workshop.git}"
REF="${REF:-main}"
IMAGE="${IMAGE:-gha-runner-lab:1}"

docker build -f docker/runner.Dockerfile -t "$IMAGE" .

docker run --rm \
  -e REPO_URL="$REPO_URL" \
  -e REF="$REF" \
  "$IMAGE" \
  bash -c '
    set -euo pipefail
    git clone --depth 1 --branch "$REF" "$REPO_URL" repo
    cd repo
    bash ./scripts/ci-steps.sh
  '
```

Este script:

1. Construye la imagen del runner.
2. Crea un contenedor limpio.
3. Clona el repositorio en la referencia indicada.
4. Ejecuta la receta.
5. Elimina el contenedor.

## Ejecutar

Desde la raíz del repositorio:

```bash
bash scripts/local-ci.sh
```

Salida esperada, resumida:

```text
==> Construyendo imagen del runner: gha-runner-lab:1
==> Ejecutando CI en un runner limpio
==> Clonando https://github.com/janitochvvll2311/gha-workshop.git (main)
==> Instalando dependencias
==> Verificando tipos
==> Ejecutando tests
20 pass
0 fail
```

## Variables de entorno

| Variable | Valor por defecto | Uso |
|---|---|---|
| `REPO_URL` | URL del taller | Clonar un fork |
| `REF` | `main` | Rama o tag a probar |
| `IMAGE` | `gha-runner-lab:1` | Nombre de la imagen |

Ejemplo con un fork y una rama:

```bash
REPO_URL=https://github.com/TU_USUARIO/gha-workshop.git \
REF=mi-rama \
bash scripts/local-ci.sh
```

## Importante: el script clona desde GitHub

`local-ci.sh` no usa tus cambios locales sin commit. Si modificaste algo,
haz commit y push primero. Esto es intencional: el runner debe obtener el
código desde el repositorio, no desde tu escritorio.

## Ejercicio: provocar un fallo

1. Crea una rama:

   ```bash
   git switch -c demo/fallo
   ```

2. Rompe un test de forma temporal, por ejemplo cambiando una expectativa en
   `tests/chat.test.ts`.

3. Haz commit y push:

   ```bash
   git add tests/chat.test.ts
   git commit -m "test: provocar fallo para el taller"
   git push -u origin demo/fallo
   ```

4. Ejecuta:

   ```bash
   REF=demo/fallo bash scripts/local-ci.sh
   ```

5. Observa que el script termina con código distinto de cero y que el
   contenedor se elimina igualmente.

6. Vuelve a `main` y elimina la rama de prueba cuando termines.

## Por qué `set -euo pipefail`

- `-e`: aborta si un comando falla.
- `-u`: error si se usa una variable no definida.
- `-o pipefail`: un fallo en una tubería no queda oculto.

Sin esto, un script puede seguir ejecutando pasos después de un fallo y dar una
falsa sensación de éxito.

## Checkpoint

- [ ] `bash scripts/local-ci.sh` termina en verde.
- [ ] El contenedor se elimina al terminar.
- [ ] Entiendes la diferencia entre `ci-steps.sh` y `local-ci.sh`.
- [ ] Sabes cómo probar otra rama con `REF`.
