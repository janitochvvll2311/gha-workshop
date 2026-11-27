# Solución de problemas

## Docker

### `Cannot connect to the Docker daemon`

Abre Docker Desktop y espera a que el motor esté listo:

```bash
docker info
```

En Windows, comprueba que Docker Desktop usa contenedores Linux.

### `docker: command not found`

Instala Docker Desktop o Docker Engine y vuelve a abrir la terminal.

### El build tarda mucho o falla por red

- Verifica la conexión.
- Ejecuta `docker pull ubuntu:24.04`.
- Ejecuta `docker pull oven/bun:1.4.4-slim`.
- Si usas proxy, configúralo en Docker Desktop.

### `port is already allocated`

El puerto 3000 está ocupado. Usa otro:

```bash
docker run --rm -p 3100:3000 gha-workshop:local
```

O en local:

```bash
PORT=3100 bun run dev
```

### El contenedor de la app no queda `healthy`

Revisa logs:

```bash
docker logs <contenedor>
docker inspect --format '{{json .State.Health}}' <contenedor>
```

El healthcheck consulta `http://127.0.0.1:3000/api/health` dentro del
contenedor. Si cambiaste el puerto interno, actualiza el healthcheck.

## Scripts

### `bash: $'\r': command not found`

El script tiene CRLF. Vuelve a clonar o conviértelo:

```bash
dos2unix scripts/*.sh
```

Asegúrate de que `.gitattributes` está presente y de que Git no convierte los
scripts a CRLF.

### `Permission denied`

Ejecuta con `bash`:

```bash
bash scripts/ci-steps.sh
```

Si quieres ejecutarlo directamente, marca el bit de ejecución:

```bash
chmod +x scripts/*.sh
git update-index --chmod=+x scripts/*.sh
```

### `bun install --frozen-lockfile` falla

El lockfile no coincide con `package.json`. En local:

```bash
bun install
git diff bun.lock
```

Haz commit del lockfile actualizado. No uses `--no-frozen-lockfile` en CI.

### `local-ci.sh` no ve mis cambios

El script clona desde GitHub, no desde tu directorio local. Haz commit y push
antes de ejecutarlo.

## `gh act`

### `image not found`

```bash
docker build -f docker/act-runner.Dockerfile -t gha-act-runner:1 .
```

Comprueba `.actrc`:

```text
-P ubuntu-latest=gha-act-runner:1
--pull=false
```

### `Could not find any stages to run`

- Ejecuta desde la raíz del repositorio.
- Comprueba que `.github/workflows/ci.yml` existe.
- Usa el evento correcto:

  ```bash
  gh act workflow_dispatch -j test
  ```

### Error de arquitectura en Apple Silicon

Añade a `.actrc`:

```text
--container-architecture linux/amd64
```

### `actions/checkout` falla en act

- Comprueba que el repositorio tiene al menos un commit.
- Ejecuta desde la raíz.
- Prueba con `gh act workflow_dispatch -j test --verbose`.
- Actualiza la extensión:

  ```bash
  gh extension upgrade gh-act
  ```

### `act` no reproduce exactamente GitHub

Es esperado. `act` no tiene el mismo runner, caché, secretos, permisos ni OIDC.
Úsalo para iterar, no como certificación.

## GitHub Actions

### El workflow no se ejecuta en el PR

Comprueba:

- El archivo está en `.github/workflows/`.
- El evento incluye `pull_request`.
- La rama base es `main`.
- Actions está habilitado en **Settings → Actions → General**.
- El PR no está en modo draft si tu configuración lo excluye.

### El check no aparece para branch protection

El check debe haber corrido al menos una vez. Abre un PR, espera el run y vuelve
a la configuración. El nombre exacto suele ser `CI / Test (Bun)`.

### `Resource not accessible by integration`

El `GITHUB_TOKEN` no tiene permisos suficientes. Revisa `permissions:` en el
workflow. Para este taller solo se necesita `contents: read`.

### El PR de un fork no ejecuta workflows

Un maintainer debe aprobar el run según la configuración de fork pull request
workflows. Esto es una protección, no un error.

### El merge está bloqueado

- El check está en rojo.
- La rama no está actualizada.
- Falta una aprobación.
- Hay conversaciones sin resolver.
- La ruleset exige un check con otro nombre.

### `pull_request_target` y secretos

No uses `pull_request_target` para hacer checkout del código del PR y ejecutarlo
con secretos. Es una de las configuraciones más peligrosas en repositorios
públicos.

## TypeScript y Bun

### `Cannot find name 'Bun'`

Instala los tipos:

```bash
bun add -d @types/bun
```

Y revisa `tsconfig.json`.

### `bun test` pasa en local pero falla en CI

- Ejecuta en un contenedor limpio: `bash scripts/local-ci.sh`.
- Revisa diferencias de versión de Bun.
- Revisa variables de entorno.
- Revisa el lockfile.
- Evita depender de la hora, del orden de archivos o de estado global.

## Git

### `detected dubious ownership`

En un contenedor o en WSL:

```bash
git config --global --add safe.directory /ruta/al/repo
```

### No puedo hacer push a `main`

Es la branch protection funcionando. Crea una rama y abre un PR.

## Seguridad

### Secret scanning detecta un falso positivo

Revisa el hallazgo. Si es un falso positivo, documenta la excepción en
`SECURITY.md` o en la configuración de secret scanning. Nunca subas un secreto
real para "probar".

### Se subió un secreto por accidente

1. Revócalo inmediatamente.
2. Elimínalo del historial.
3. Revisa logs y forks.
4. Documenta el incidente.
