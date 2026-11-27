# Seguridad

## Versiones soportadas

Este es un repositorio educativo. Se mantiene la rama `main` y las versiones
fijadas en `bun.lock`, `Dockerfile` y `.github/workflows/ci.yml`.

## Cómo reportar una vulnerabilidad

No abras un issue público con detalles explotables.

Usa **Security → Report a vulnerability** en GitHub para abrir un security
advisory privado:

<https://github.com/janitochvvll2311/gha-workshop/security/advisories/new>

Incluye:

- Descripción del problema.
- Pasos para reproducirlo.
- Impacto esperado.
- Versión o commit afectado.
- Mitigación sugerida, si la conoces.

## Alcance

Este proyecto:

- No procesa pagos ni datos personales.
- No usa una API de IA ni claves de API.
- No necesita secretos para funcionar.
- Está pensado para ejecutarse en un entorno efímero de práctica.

Quedan fuera de alcance los problemas del entorno local de cada participante,
Docker Desktop, `gh act` o servicios de terceros.

## Diseño de seguridad del repositorio

- Workflow con `permissions: contents: read`.
- Sin `pull_request_target`.
- Acciones fijadas por SHA completo.
- `persist-credentials: false` en `actions/checkout`.
- Sin runners self-hosted.
- Sin secretos en el repositorio.
- Branch protection en `main`.
- Secret scanning y push protection activados.
- Dependabot para acciones y dependencias de Bun.
- Imagen de producción ejecutada como usuario no-root.

## Recomendaciones para forks

Si haces un fork:

- Revisa los workflows antes de ejecutarlos.
- No agregues secretos reales a un repositorio de práctica.
- No uses runners self-hosted en repositorios públicos.
- Mantén las acciones fijadas por SHA.
- Ejecuta `bun install --frozen-lockfile` y `bun test` antes de abrir un PR.
