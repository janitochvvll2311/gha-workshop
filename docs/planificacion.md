# Planificación del taller

Este documento consolida la conversación de planificación del taller. No
incluye razonamiento interno ni datos del entorno local; solo requisitos,
decisiones y el plan acordado.

- **Repositorio:** <https://github.com/janitochvvll2311/gha-workshop>
- **Fecha de planificación:** 2026-11-27
- **Duración:** 3 h 20 min de contenido + buffer, máximo 4 horas
- **Licencia:** MIT

## Objetivo

Capacitar a desarrolladores en GitHub Actions mediante una progresión práctica:

1. Simular un runner con Docker.
2. Clonar y probar un proyecto Bun en un entorno limpio.
3. Automatizar los pasos con un script.
4. Ejecutar un workflow localmente con `gh act`.
5. Separar el script en pasos visibles.
6. Usar acciones de terceros fijadas por SHA.
7. Abrir un PR real que ejecute CI y bloquea el merge si falla.

## Requisitos acordados

- Aplicación web sencilla de chat simulado usando Bun.
- Repositorio público con proyecto Bun, Dockerfile y documentación.
- Configuración segura para un repositorio público.
- Uso de Docker para simular manualmente el runner, el clonado y los tests.
- Script que automatice el flujo manual.
- `gh act` para simular GitHub Actions en local.
- Workflow que use el script y luego pasos explícitos.
- Acciones preconfiguradas como `actions/checkout`.
- Verificación final mediante un Pull Request real.
- Taller impartible en 3–4 horas como máximo.

## Decisiones

| Tema | Decisión |
|---|---|
| Nombre | `gha-workshop` |
| Visibilidad | Pública |
| App | Chat simulado, sin IA ni API externa |
| Backend | `Bun.serve` |
| Tests | `bun test` |
| Runner de práctica | `ubuntu:24.04` + Bun, usuario no-root |
| Simulación local | `gh act` + imagen `catthehacker/ubuntu:act-latest` |
| CI real | `ubuntu-latest` de GitHub |
| Acciones | `actions/checkout` y `oven-sh/setup-bun`, fijadas por SHA |
| Seguridad | Permisos de solo lectura, sin secretos, sin self-hosted |
| Rama protegida | `main` con PR y check obligatorio |
| Licencia | MIT |

## Agenda

| Bloque | Tema | Min | Checkpoint |
|---|---|---:|---|
| 0 | Preflight y contexto | 15 | Herramientas verificadas y tests locales |
| 1 | Runner manual con Docker | 35 | Contenedor limpio clona y ejecuta tests |
| 2 | Script de automatización | 25 | `local-ci.sh` reproduce el flujo |
| 3 | `gh act` + workflow con script | 30 | Job local en verde |
| 4 | Pasos explícitos en el workflow | 25 | Steps separados y fallo identificable |
| 5 | Acciones de terceros | 25 | `checkout` + `setup-bun` fijadas por SHA |
| 6 | PR real y branch protection | 30 | Check verde, fallo controlado y merge bloqueado |
| 7 | Cierre y retos | 15 | PR de participante con CI verde |

Total: **200 minutos = 3 h 20 min**. Con pausa y buffer queda por debajo de
4 horas.

## Estructura

```text
gha-workshop/
├── .github/
│   ├── workflows/ci.yml
│   ├── dependabot.yml
│   └── pull_request_template.md
├── docker/
│   ├── runner.Dockerfile
│   └── act-runner.Dockerfile
├── docs/
├── public/
├── scripts/
├── src/
├── tests/
├── Dockerfile
├── compose.yaml
├── package.json
├── bun.lock
├── tsconfig.json
└── README.md
```

## Seguridad

- Repositorio sin secretos.
- `permissions: contents: read` en el workflow.
- Sin `pull_request_target`.
- Acciones fijadas por SHA completo.
- `persist-credentials: false`.
- Sin runners self-hosted.
- Secret scanning y push protection.
- Dependabot para acciones y Bun.
- Branch protection en `main`.
- Imagen de producción no-root.
- Contenedores de práctica efímeros y sin privilegios.

## Implementación

1. Crear app, UI y tests.
2. Validar tests, typecheck y servidor.
3. Crear Dockerfiles y probar imágenes.
4. Crear scripts de preflight, receta y orquestación.
5. Escribir documentación.
6. Crear commits y tags `fase-0` a `fase-6`.
7. Crear el repositorio público y hacer push.
8. Configurar Actions, seguridad y branch protection.
9. Validar `gh act`.
10. Abrir PR verde, PR rojo y comprobar el bloqueo de merge.

## Criterios de aceptación

- `bun test` pasa en un clon limpio.
- La app responde en `/api/health` dentro de Docker.
- `scripts/local-ci.sh` funciona desde cero.
- `gh act workflow_dispatch -j test` termina en verde.
- El workflow final funciona en un PR real.
- Un test roto bloquea el merge.
- `main` no acepta pushes directos.
- No hay secretos.
- Las acciones están fijadas por SHA.
- La documentación permite repetir el taller sin ayuda.

## Conversación consolidada

La planificación pasó por estas decisiones:

1. Se propuso una app de chat simulada con Bun para evitar claves de API y
   mantener los tests deterministas.
2. Se acordó un repositorio público con documentación por fases, Dockerfiles y
   scripts.
3. Se definió una progresión de runner manual → script → `gh act` → pasos
   explícitos → acciones → PR real.
4. Se incorporó seguridad desde el diseño: permisos mínimos, sin secretos,
   acciones fijadas por SHA y sin runners self-hosted.
5. Se ajustó la duración a un máximo de 4 horas, con prework asíncrono y retos
   opcionales fuera de la sesión.
6. Se cambió el nombre del repositorio a `gha-workshop`.
7. Se decidió migrar esta planificación al repositorio en este documento,
   sanitizando rutas y datos del entorno local.
