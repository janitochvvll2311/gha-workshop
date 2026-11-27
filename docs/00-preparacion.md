# 00 · Preparación

**Tiempo:** 15 min
**Objetivo:** dejar el entorno listo para ejecutar y probar la aplicación antes
de empezar con Docker y GitHub Actions.

## Prerrequisitos

- Git.
- Bun 1.4.4.
- Docker Desktop o Docker Engine.
- Cuenta de GitHub.
- GitHub CLI (`gh`) autenticado.
- Extensión `gh act`.
- Editor de código.
- 6 GB de disco libre y conexión a internet.

En Windows se recomienda **WSL2** o **Git Bash** para los scripts `.sh`.

## Instalación

Instala las herramientas desde sus sitios oficiales:

- Bun: <https://bun.sh>
- Git: <https://git-scm.com>
- Docker Desktop: <https://www.docker.com/products/docker-desktop/>
- GitHub CLI: <https://cli.github.com>

Autentica GitHub:

```bash
gh auth login
```

Instala la extensión de `act`:

```bash
gh extension install nektos/gh-act
```

## Verificación

```bash
bun --version
git --version
docker info
gh auth status
gh act --version
```

> En Git Bash para Windows, `docker` puede resolver a un cliente Linux que
> apunta a `/var/run/docker.sock`. Si `docker info` falla, usa `docker.exe info`
> o ejecuta los comandos de Docker desde PowerShell. Los scripts del taller
> detectan este caso automáticamente.

Valores esperados en el entorno de referencia:

- Bun `1.4.4`
- Docker con daemon activo
- `gh` autenticado en la cuenta correcta
- `gh act` respondiendo con una versión

## Preflight automático

Desde la raíz del repositorio:

```bash
bash scripts/preflight.sh
```

El script comprueba herramientas, autenticación, extensión `gh-act` y descarga
las imágenes base. Puede tardar varios minutos la primera vez.

## Clonar el repositorio

```bash
git clone https://github.com/janitochvvll2311/gha-workshop.git
cd gha-workshop
```

Si trabajas desde un fork, usa tu URL:

```bash
git clone https://github.com/TU_USUARIO/gha-workshop.git
```

> `main` está protegida. Para probar cambios, crea una rama:
>
> ```bash
> git switch -c taller/mi-prueba
> ```

## Primer contacto con la app

```bash
bun install --frozen-lockfile
bun test
bun run typecheck
bun run dev
```

Abre <http://localhost:3000>.

Prueba en el chat:

- `Hola`
- `/ayuda`
- `/chiste`
- `/echo hola CI`

Detén el servidor con `Ctrl+C`.

### Si el puerto 3000 está ocupado

```bash
PORT=3100 bun run dev
```

En PowerShell:

```powershell
$env:PORT = "3100"
bun run dev
```

## Docker

Comprueba que Docker Desktop está usando contenedores Linux:

```bash
docker run --rm hello-world
```

Si falla, abre Docker Desktop y espera a que el motor termine de iniciar.

## Notas para Windows

- Usa Git Bash o WSL2 para `scripts/*.sh`.
- Configura Git para no convertir los scripts a CRLF:

  ```bash
  git config --global core.autocrlf input
  ```

- El repositorio incluye `.gitattributes` con `eol=lf` para scripts, YAML y
  Dockerfiles.
- Si ves errores como `bash: $'\r': command not found`, el archivo se descargó
  con CRLF. Vuelve a clonar o ejecuta `dos2unix` sobre el script.

## Checkpoint

- [ ] `bun test` pasa.
- [ ] `bun run typecheck` pasa.
- [ ] `bun run dev` sirve la interfaz.
- [ ] `docker info` funciona.
- [ ] `gh auth status` muestra la cuenta correcta.
- [ ] `gh act --version` responde.

Si algo falla, consulta [troubleshooting.md](troubleshooting.md).
