# GHA Workshop

[![CI](https://github.com/janitochvvll2311/gha-workshop/actions/workflows/ci.yml/badge.svg)](https://github.com/janitochvvll2311/gha-workshop/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Taller práctico de **GitHub Actions** usando una aplicación de chat simulado con **Bun**, Docker y un Pull Request real.

El objetivo no es construir una IA: el bot responde con reglas deterministas para que los tests sean reproducibles y el repositorio pueda ser público sin secretos ni claves de API.

## Qué vas a aprender

- Qué es un runner y por qué debe ser efímero.
- Cómo reproducir un job de CI con Docker.
- Cómo convertir pasos manuales en un script reproducible.
- Cómo ejecutar workflows localmente con `gh act`.
- Cómo separar un script en pasos visibles dentro de un workflow.
- Cómo usar acciones de terceros fijadas por SHA.
- Cómo proteger `main` y exigir CI en cada Pull Request.
- Qué configuración necesita un repositorio público para ser seguro.

## Inicio rápido

Requisitos: Bun 1.4.4, Git, Docker y, para el taller, `gh` + `gh act`.

```bash
git clone https://github.com/janitochvvll2311/gha-workshop.git
cd gha-workshop
bun install --frozen-lockfile
bun test
bun run dev
```

Abre `http://localhost:3000`.

### Docker

```bash
docker build -t gha-workshop:local .
docker run --rm -p 3000:3000 gha-workshop:local
```

O con Compose:

```bash
docker compose up --build
```

## Taller

Duración: **3 h 20 min de contenido + buffer**, máximo 4 horas.

| Bloque | Guía | Tiempo |
|---|---|---:|
| 0 | [Preparación](docs/00-preparacion.md) | 15 min |
| 1 | [Runner manual con Docker](docs/01-runner-manual.md) | 35 min |
| 2 | [Script de automatización](docs/02-script.md) | 25 min |
| 3 | [`gh act` y workflow con script](docs/03-act.md) | 30 min |
| 4 | [Pasos explícitos en el workflow](docs/04-workflow-pasos.md) | 25 min |
| 5 | [Acciones de terceros](docs/05-acciones.md) | 25 min |
| 6 | [PR real y branch protection](docs/06-pr-real.md) | 30 min |
| 7 | [Retos opcionales](docs/07-retos.md) | 15 min |

Material de apoyo:

- [Planificación del taller](docs/planificacion.md)
- [Solución de problemas](docs/troubleshooting.md)
- [Guía del facilitador](docs/facilitator.md)
- [Contribuir](CONTRIBUTING.md)
- [Seguridad](SECURITY.md)

## Estructura

```text
.github/        Workflow de CI, Dependabot y plantilla de PR
docker/         Runner de práctica e imagen para gh act
docs/           Material del taller y planificación
public/         Interfaz del chat
scripts/        Preflight, receta de CI y orquestador local
src/            Servidor Bun y lógica del bot
tests/          Tests unitarios y de integración
```

## Comandos útiles

```bash
bun run dev            # servidor con recarga
bun test               # tests
bun run typecheck      # TypeScript sin emitir
bash scripts/preflight.sh
bash scripts/local-ci.sh
gh act workflow_dispatch -j test
```

## Seguridad

Este repositorio es público y educativo:

- No contiene secretos ni claves de API.
- El workflow usa `permissions: contents: read`.
- Las acciones están fijadas por SHA completo.
- No se usa `pull_request_target`.
- No se usan runners self-hosted.
- `main` está protegida con Pull Request y checks obligatorios.

Si encuentras un problema de seguridad, sigue las instrucciones de [SECURITY.md](SECURITY.md).

## Licencia

MIT. Consulta [LICENSE](LICENSE).
