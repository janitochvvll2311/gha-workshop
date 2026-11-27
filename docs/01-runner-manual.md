# 01 · Runner manual con Docker

**Tiempo:** 35 min
**Objetivo:** entender qué hace un runner de GitHub Actions simulando uno con
Docker: entorno limpio, clonado del repositorio y ejecución de tests.

## Conceptos

Un **runner** es la máquina que ejecuta un job. En GitHub Actions, los runners
hospedados son efímeros: cada job empieza en un entorno nuevo y se destruye al
terminar.

En esta práctica vamos a reproducir ese ciclo:

1. Crear un contenedor limpio.
2. Clonar el repositorio.
3. Instalar dependencias.
4. Ejecutar los tests.
5. Destruir el contenedor.

## Construir la imagen del runner

Desde la raíz del repositorio:

```bash
docker build -f docker/runner.Dockerfile -t gha-runner-lab:1 .
```

La imagen parte de `ubuntu:24.04`, instala Git, curl, unzip y Bun 1.4.4, y
ejecuta como usuario `runner` (no-root). El Dockerfile es nuestra versión del
"runner preconfigurado".

Verifica la imagen:

```bash
docker run --rm gha-runner-lab:1 bash -c 'id && bun --version && git --version'
```

Deberías ver un UID distinto de 0 y Bun 1.4.4.

## Crear una instancia del runner

```bash
docker run --rm -it --name gha-runner gha-runner-lab:1
```

Notas:

- `--rm` elimina el contenedor al salir.
- `-it` permite interactuar con la terminal.
- No se monta el código local: el runner debe clonar el repositorio, igual que
  un runner real.

## Clonar y probar dentro del runner

Dentro del contenedor:

```bash
git clone https://github.com/janitochvvll2311/gha-workshop.git
cd gha-workshop
bun install --frozen-lockfile
bun test
```

Salida esperada:

```text
20 pass
0 fail
```

También puedes validar tipos:

```bash
bun run typecheck
```

## Comprobar la naturaleza efímera

Sal del contenedor:

```bash
exit
```

Comprueba que ya no existe:

```bash
docker ps -a --filter name=gha-runner
```

Vuelve a ejecutar el flujo desde cero y observa que el clonado y la instalación
se repiten. Eso es exactamente lo que hace un runner de CI: no conserva el
estado entre jobs.

## Opcional: ejecutar la app dentro del runner

Si quieres ver la aplicación servida desde el contenedor:

```bash
docker run --rm -p 3000:3000 gha-runner-lab:1 bash -c '
  git clone --depth 1 https://github.com/janitochvvll2311/gha-workshop.git repo &&
  cd repo &&
  bun install --frozen-lockfile &&
  bun run start
'
```

Abre <http://localhost:3000>. Detén con `Ctrl+C`.

## Qué acaba de pasar

- El runner no tenía el código: lo obtuvo con `git clone`.
- No tenía dependencias: las instaló con `bun install`.
- No confió en el estado local: ejecutó los tests en un entorno limpio.
- Al terminar, el contenedor desapareció.

Ese es el contrato básico de CI: **reproducibilidad**.

## Reto

- Cambia `BUN_VERSION` en `docker/runner.Dockerfile` por otra versión y observa
  si los tests siguen pasando.
- Ejecuta el contenedor con `--network none` y explica por qué falla el clonado.

## Checkpoint

- [ ] La imagen se construye.
- [ ] El contenedor ejecuta como usuario no-root.
- [ ] El clonado funciona dentro del contenedor.
- [ ] `bun test` pasa dentro del runner.
- [ ] El contenedor se elimina al salir.
