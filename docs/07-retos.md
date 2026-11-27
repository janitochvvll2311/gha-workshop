# 07 · Retos opcionales

Estos retos no forman parte del recorrido obligatorio de 3–4 horas. Úsalos si
el grupo termina antes o como tarea asíncrona.

## 1. Matriz de versiones de Bun

Prueba el proyecto con más de una versión:

```yaml
    strategy:
      fail-fast: false
      matrix:
        bun-version: ["1.4.4", "1.3.x"]
```

Y usa `${{ matrix.bun-version }}` en `setup-bun`.

Preguntas:

- ¿Qué versión falla?
- ¿El lockfile es compatible?
- ¿Conviene probar `latest` en un PR?

## 2. Caché de dependencias

Investiga `actions/cache` y cachea el directorio de instalación de Bun:

```yaml
      - name: Cache de Bun
        uses: actions/cache@<SHA> # fija la versión por SHA
        with:
          path: ~/.bun/install/cache
          key: ${{ runner.os }}-bun-${{ hashFiles('bun.lock') }}
```

Mide el tiempo antes y después. Recuerda fijar la acción por SHA.

## 3. Artefactos

Genera un reporte de tests y súbelo con `actions/upload-artifact`.

Pistas:

- Guarda la salida de `bun test` en un archivo.
- Usa `if: always()` para subirlo aunque falle.
- Revisa la pestaña **Artifacts** del run.

## 4. Cobertura

Ejecuta:

```bash
bun test --coverage
```

Agrega el comando al workflow y publica el resultado como artefacto o resumen.
No bloquees el taller por un umbral de cobertura.

## 5. `actionlint`

Valida los workflows con `actionlint`:

```bash
docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint:latest
```

Agrégalo como paso opcional o como workflow separado. Fija la imagen por
digest si lo llevas a producción.

## 6. CodeQL

Activa **Code scanning → CodeQL** en la configuración del repositorio para
JavaScript/TypeScript. Revisa los hallazgos y el tiempo adicional.

## 7. Composite action

Extrae los pasos repetidos de `ci-steps.sh` a una composite action en
`.github/actions/test/action.yml` y úsala desde el workflow.

Preguntas:

- ¿Ganas legibilidad?
- ¿Pierdes visibilidad de los pasos?
- ¿Cómo se prueba la action?

## 8. Imagen en GHCR

Publica la imagen de la app en GitHub Container Registry.

Requisitos:

- `permissions: packages: write`.
- Login con `GITHUB_TOKEN`.
- Un tag basado en el SHA del commit.

Discute por qué este workflow no debería ejecutarse en PRs de forks con
permisos de escritura.

## 9. OIDC y despliegue

Investiga cómo desplegar sin claves de larga duración usando OpenID Connect.

Puntos clave:

- `permissions: id-token: write`.
- Un proveedor cloud que confíe en GitHub.
- Restricciones por repositorio, rama y entorno.
- Nunca exponer el token a código de PR no confiable.

## 10. Dependabot y seguridad de Bun

Dependabot soporta actualizaciones de versión para Bun, pero no actualizaciones
de seguridad para ese ecosistema. Investiga:

- `bun audit`.
- Renovate.
- Alertas de seguridad del repositorio.
- Revisión manual del lockfile.

## Criterio de éxito

Un reto está bien resuelto si:

- El workflow sigue con permisos mínimos.
- Las acciones están fijadas por SHA.
- No se agregaron secretos innecesarios.
- La documentación explica el cambio.
- El check sigue siendo rápido y determinista.
