# 03 · `gh act` y workflow con script

**Tiempo:** 30 min
**Objetivo:** ejecutar un workflow de GitHub Actions en local usando Docker y
`gh act`, reutilizando el script de la fase anterior.

## Qué es `act`

`act` lee los workflows de `.github/workflows/` y los ejecuta en contenedores
Docker locales. `gh act` es la extensión de GitHub CLI que envuelve a `act`.

Sirve para:

- Iterar rápido sin hacer push.
- Depurar YAML y comandos.
- Entender el ciclo de un job.

No sirve para:

- Garantizar paridad exacta con GitHub.
- Probar secretos reales.
- Validar permisos de `GITHUB_TOKEN`.
- Sustituir la ejecución real en un PR.

## Construir la imagen para act

Desde la raíz del repositorio:

```bash
docker build -f docker/act-runner.Dockerfile -t gha-act-runner:1 .
```

La imagen parte de `catthehacker/ubuntu:act-latest` y agrega Bun 1.4.4. Se usa
solo en local.

## Configuración de act

El repositorio incluye `.actrc`:

```text
-P ubuntu-latest=gha-act-runner:1
--pull=false
```

- `-P` mapea `ubuntu-latest` a nuestra imagen local.
- `--pull=false` evita descargar otra imagen.

Verifica que la imagen existe:

```bash
docker image inspect gha-act-runner:1 >/dev/null && echo "imagen lista"
```

## Workflow de esta fase

Si estás siguiendo el taller desde un tag:

```bash
git switch --detach fase-3
```

Si estás en `main`, crea o reemplaza `.github/workflows/ci.yml` con:

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
      - name: Ejecutar receta de tests
        run: bash ./scripts/ci-steps.sh
```

Este workflow es **solo para act**: todavía no tiene `actions/checkout`.
`act` monta el workspace local dentro del contenedor, por eso el script está
disponible. En GitHub real este job fallaría porque no hay código en el runner.
Eso lo resolvemos en la fase 5.

## Ejecutar

```bash
gh act workflow_dispatch -j test
```

También puedes usar:

```bash
gh act workflow_dispatch -j test --verbose
```

Salida esperada, resumida:

```text
[CI/test] 🚀  Start image=gha-act-runner:1
[CI/test] ⭐ Run Main Ejecutar receta de tests
==> Instalando dependencias
==> Verificando tipos
==> Ejecutando tests
20 pass
0 fail
[CI/test] ✅  Success - Main Ejecutar receta de tests
```

## Qué observar

- El job se ejecuta dentro de un contenedor.
- El workspace local aparece montado.
- El script se ejecuta con `bash`, sin depender del bit de ejecución.
- Los tests corren con el Bun preinstalado en la imagen.
- Al terminar, act limpia el contenedor.

## Diferencias con GitHub real

| Tema | `act` local | GitHub Actions |
|---|---|---|
| Runner | Imagen Docker local | Runner hospedado de GitHub |
| Código | Workspace montado | Requiere checkout |
| Secretos | Solo los que pases | Secrets del repositorio/entorno |
| Token | Emulado | `GITHUB_TOKEN` real con permisos |
| Caché | Limitada | Servicio de caché de GitHub |
| OIDC | No | Disponible |
| Paridad | Aproximada | Entorno real |

## Problemas comunes

### `image not found`

Construye la imagen:

```bash
docker build -f docker/act-runner.Dockerfile -t gha-act-runner:1 .
```

### `Cannot connect to the Docker daemon`

Abre Docker Desktop y espera a que el motor esté listo:

```bash
docker info
```

### El workflow no aparece

Ejecuta desde la raíz del repositorio y comprueba la ruta:

```bash
ls .github/workflows/ci.yml
gh act workflow_dispatch -j test
```

### Error de arquitectura en Apple Silicon

Añade a `.actrc`:

```text
--container-architecture linux/amd64
```

## Checkpoint

- [ ] La imagen `gha-act-runner:1` existe.
- [ ] `.actrc` está en la raíz.
- [ ] `gh act workflow_dispatch -j test` termina en verde.
- [ ] Entiendes por qué aún no hace falta `actions/checkout`.
- [ ] Sabes que `act` no reemplaza la validación en GitHub.
