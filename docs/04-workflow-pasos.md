# 04 · Pasos explícitos en el workflow

**Tiempo:** 25 min
**Objetivo:** extraer los pasos del script a steps separados para mejorar la
visualización, el diagnóstico y el reporte.

## Anatomía de un workflow

```yaml
name: CI                    # nombre del workflow
on: workflow_dispatch       # evento que lo dispara
permissions:               # permisos del GITHUB_TOKEN
  contents: read
jobs:                      # trabajos
  test:                    # id del job
    name: Test (Bun)       # nombre visible
    runs-on: ubuntu-latest # runner
    steps:                 # lista ordenada de pasos
      - name: ...          # nombre visible del paso
        run: ...           # comando de shell
```

Un **step** puede ser:

- `run`: ejecuta comandos en el runner.
- `uses`: ejecuta una acción preconfigurada.

Los steps comparten el mismo workspace y el mismo sistema de archivos. Si un
step falla, los siguientes se omiten por defecto.

## De script a pasos

Partimos de:

```yaml
      - name: Ejecutar receta de tests
        run: bash ./scripts/ci-steps.sh
```

Y lo separamos en:

```yaml
      - name: Instalar dependencias
        run: bun install --frozen-lockfile

      - name: Verificar tipos
        run: bun run typecheck

      - name: Ejecutar tests
        run: bun test
```

Workflow completo de la fase:

```yaml
name: CI

on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  test:
    name: Test (Bun)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Instalar dependencias
        run: bun install --frozen-lockfile

      - name: Verificar tipos
        run: bun run typecheck

      - name: Ejecutar tests
        run: bun test
```

Si estás siguiendo el taller desde un tag:

```bash
git switch --detach fase-4
gh act workflow_dispatch -j test
```

## Ejecutar

```bash
gh act workflow_dispatch -j test
```

Ahora la salida muestra tres pasos separados con su propio estado y duración.

## Ejercicio: ver un fallo aislado

1. Abre `tests/chat.test.ts`.
2. Cambia temporalmente una expectativa para que falle.
3. Ejecuta:

   ```bash
   gh act workflow_dispatch -j test
   ```

4. Observa:
   - El step `Ejecutar tests` falla.
   - El job queda en rojo.
   - Los pasos posteriores, si los hubiera, se omiten.
5. Corrige el test y vuelve a ejecutar.

En GitHub real, además verás el check rojo en el PR y el merge bloqueado si
`main` exige ese check.

## Por qué separar los pasos

- **Diagnóstico:** sabes exactamente qué falló.
- **Reporte:** GitHub muestra cada step con nombre, duración y logs.
- **Reutilización:** puedes ejecutar solo un paso durante la depuración.
- **Condiciones:** puedes usar `if`, `continue-on-error` o `timeout-minutes`
  por step.
- **Lectura:** el workflow se entiende sin abrir un script.

La contrapartida es la duplicación: `ci-steps.sh` y el workflow repiten
comandos. En un proyecto maduro se puede resolver con una **composite action**
o un workflow reutilizable. Para el taller, la duplicación es intencional:
queremos ver los pasos.

## `run` con varias líneas

```yaml
      - name: Diagnóstico
        run: |
          bun --version
          git --version
          echo "Runner: $RUNNER_OS"
```

`|` conserva los saltos de línea. Cada línea se ejecuta en el mismo shell.

## Opcional: resumen del job

En GitHub real puedes escribir un resumen visible en la pestaña del job:

```yaml
      - name: Resumen
        if: always()
        run: |
          echo "### Resultado de CI" >> "$GITHUB_STEP_SUMMARY"
          echo "- Bun: $(bun --version)" >> "$GITHUB_STEP_SUMMARY"
```

`if: always()` hace que el paso se ejecute aunque un paso anterior falle.
No es necesario para el taller, pero es útil para reportes.

## Checkpoint

- [ ] El workflow tiene tres steps separados.
- [ ] `gh act workflow_dispatch -j test` muestra cada paso.
- [ ] Un test roto falla en el step correcto.
- [ ] Entiendes la diferencia entre `run` y `uses`.
