## Qué cambia

<!-- Describe el cambio y el problema que resuelve. -->

## Cómo lo probé

- [ ] `bun install --frozen-lockfile`
- [ ] `bun run typecheck`
- [ ] `bun test`
- [ ] `bash scripts/local-ci.sh` (si el cambio afecta al runner o a Docker)

## Checklist de seguridad

- [ ] No incluyo secretos, tokens ni archivos `.env`.
- [ ] No uso `pull_request_target` para ejecutar código no confiable.
- [ ] Si agrego o actualizo una acción, queda fijada por SHA completo.
- [ ] El cambio mantiene los permisos del workflow en solo lectura salvo justificación.
- [ ] Revisé que no se impriman datos sensibles en los logs.

## Notas para revisión

<!-- Riesgos, decisiones o pasos pendientes. -->
