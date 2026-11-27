# Contribuir

Gracias por querer mejorar el taller. Este repositorio es material educativo y
también un ejemplo de CI seguro para un proyecto público.

## Flujo de trabajo

1. Haz un fork del repositorio.
2. Crea una rama descriptiva:

   ```bash
   git switch -c docs/mejora-guia
   ```

3. Instala dependencias y valida:

   ```bash
   bun install --frozen-lockfile
   bun run typecheck
   bun test
   ```

4. Si cambias Docker o los scripts:

   ```bash
   bash scripts/local-ci.sh
   ```

5. Abre un Pull Request contra `main` y espera el check `CI / Test (Bun)`.

## Reglas del proyecto

- No incluir secretos, tokens ni archivos `.env`.
- No usar `pull_request_target` para ejecutar código no confiable.
- Fijar cualquier acción nueva por SHA completo.
- Mantener `permissions` en el mínimo necesario.
- No usar runners self-hosted.
- Mantener los tests rápidos y deterministas.
- Actualizar la documentación cuando cambie un comando o una ruta.
- Usar mensajes de commit claros; se acepta Conventional Commits.

## Estilo

- TypeScript estricto.
- Dos espacios, comillas dobles y punto y coma.
- Textos de interfaz y documentación en español.
- Nombres de código en inglés cuando sea natural.
- Sin dependencias nuevas si el problema se resuelve con la biblioteca estándar
  de Bun.

## Seguridad

Si el cambio afecta al workflow, revisa también:

- [ ] `permissions` sigue siendo de solo lectura.
- [ ] Las acciones siguen fijadas por SHA.
- [ ] No se interpolan entradas no confiables dentro de `run:`.
- [ ] No se imprimen secretos.
- [ ] El cambio no permite ejecutar código de forks con privilegios.

Para reportar una vulnerabilidad, consulta [SECURITY.md](SECURITY.md).
