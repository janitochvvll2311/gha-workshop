# Guía del facilitador

## Resumen

- **Duración:** 3 h 20 min de contenido; 4 h máximo con pausa y buffer.
- **Formato:** presencial o remoto, parejas o tríos.
- **Nivel:** Git, terminal y Docker básicos.
- **Resultado:** cada participante entiende el ciclo runner → script → workflow
  → acciones → PR con CI.

## Antes de la sesión

### 48 horas antes

Envía a los participantes:

- Enlaces de instalación de Bun, Git, Docker y GitHub CLI.
- Instrucción para autenticar `gh auth login`.
- Instrucción para instalar `gh extension install nektos/gh-act`.
- Enlace al repositorio.
- Petición de ejecutar `bash scripts/preflight.sh` y `bun test`.

Sin este prework, la fase 0 se come el tiempo de las fases prácticas.

### 24 horas antes

Comprueba que el repositorio está listo:

```bash
gh repo view janitochvvll2311/gha-workshop
gh run list --limit 5
```

Verifica:

- [ ] Workflow de CI en verde.
- [ ] Actions con permisos de solo lectura.
- [ ] Secret scanning y push protection.
- [ ] Dependabot activo.
- [ ] Ruleset de `main` activa.
- [ ] Sin secretos.
- [ ] Documentación sin enlaces roto.
- [ ] Tags `fase-0` a `fase-6`.

### 1 hora antes

Preconstruye las imágenes para no depender de la red:

```bash
docker pull ubuntu:24.04
docker pull oven/bun:1.4.4-slim
docker pull catthehacker/ubuntu:act-latest

docker build -f docker/runner.Dockerfile -t gha-runner-lab:1 .
docker build -f docker/act-runner.Dockerfile -t gha-act-runner:1 .
docker build -t gha-workshop:local .
```

Prueba el recorrido completo una vez:

```bash
bun test
bash scripts/local-ci.sh
gh act workflow_dispatch -j test
```

## Agenda

| Bloque | Min | Facilitación |
|---|---:|---|
| 0 · Preflight | 15 | Verificación rápida; parejas se ayudan |
| 1 · Runner manual | 35 | Demo + práctica; explicar entorno efímero |
| 2 · Script | 25 | Leer los dos scripts y ejecutar |
| 3 · Act | 30 | Construir imagen, ejecutar y leer logs |
| 4 · Pasos | 25 | Editar YAML, provocar fallo |
| 5 · Acciones | 25 | Checkout, setup-bun, SHA y seguridad |
| 6 · PR real | 30 | Abrir PR, ver checks, branch protection |
| 7 · Cierre | 15 | Retos, retrospective y recursos |

Pausa recomendada: 10 min después del bloque 3.

### Variante de 3 horas

Si el grupo necesita terminar antes:

- Bloque 0: 10 min.
- Bloques 4 y 5 juntos: 35 min.
- Bloque 6: 25 min.
- Cierre: 10 min.
- Retos: tarea asíncrona.

## Checkpoints y tags

Cada bloque tiene un checkpoint. Si un equipo se atrasa:

```bash
git switch --detach fase-N
```

Tags disponibles:

- `fase-0`: app, Docker y documentación.
- `fase-1`: runner manual (mismo estado que fase 0).
- `fase-2`: scripts de CI.
- `fase-3`: workflow que llama al script.
- `fase-4`: pasos explícitos.
- `fase-5`: checkout y setup-bun.
- `fase-6`: estado final.

No permitas que un equipo se quede 20 minutos en un error de entorno. Usa el tag
y sigue; al final se resuelve en grupo.

## Dinámica

- Parejas: una persona conduce, otra lee y verifica.
- Cambiar roles en cada bloque.
- Pedir que levanten la mano al completar un checkpoint.
- No escribir YAML desde cero: usar los snippets de la guía.
- Reservar 5 min por bloque para preguntas.
- Evitar demostraciones largas; mejor que el grupo ejecute.

## Puntos que explicar

### Runner

- Es efímero.
- No confíes en el estado local.
- El código se obtiene desde el repositorio.
- Las dependencias se instalan desde el lockfile.

### Script vs workflow

- El script es portable y fácil de ejecutar en local.
- El workflow es la interfaz de GitHub.
- Los pasos explícitos mejoran el reporte.
- La duplicación se puede reducir con composite actions.

### `act`

- Útil para iterar.
- No garantiza paridad.
- No sustituye un PR real.
- No uses secretos reales.

### Seguridad

- Un repo público puede recibir PRs de cualquier persona.
- El workflow de un fork no recibe secretos.
- `pull_request_target` con checkout es peligroso.
- Fijar acciones por SHA reduce riesgo de supply chain.
- Los runners self-hosted no deben usarse en repos públicos.
- El `GITHUB_TOKEN` debe tener permisos mínimos.
- La branch protection convierte el CI en una puerta real.

## Problemas comunes y plan B

| Problema | Acción |
|---|---|
| Docker no inicia | Usar la máquina del facilitador o un entorno cloud |
| `act` falla por imagen | Preconstruir imágenes y repartir comandos |
| Red lenta | Usar tags y no reconstruir imágenes |
| Un equipo rompe el repo | `git switch --detach fase-N` |
| El PR no ejecuta CI | Revisar Actions, evento y fork approval |
| El check no coincide | Ver el nombre exacto en la pestaña Checks |
| Falta tiempo | Saltar retos y cerrar con demo del PR |

Plan B sin Docker: ejecutar `bun test`, mostrar el workflow y abrir un PR real.
Se pierde la simulación del runner, pero se conserva el objetivo de CI.

## Evaluación

Cada participante o pareja debe:

- [ ] Ejecutar tests en un runner limpio.
- [ ] Ejecutar `local-ci.sh`.
- [ ] Ejecutar `gh act`.
- [ ] Explicar la diferencia entre script y workflow.
- [ ] Abrir un PR con CI verde.
- [ ] Provocar un fallo y ver el bloqueo.
- [ ] Identificar al menos tres medidas de seguridad del repo.

## Cierre

Preguntas para la retrospective:

- ¿Qué parte del workflow no era visible en el script?
- ¿Qué ventaja aporta `actions/checkout`?
- ¿Qué riesgo tiene usar una acción por tag?
- ¿Qué cambiarías en un proyecto real?
- ¿Qué harías si el CI necesita un secreto?

Recursos:

- Documentación de GitHub Actions.
- Marketplace de acciones.
- `act` y `gh act`.
- Bun test runner.
- OpenID Connect para despliegues sin claves de larga duración.

## Después del taller

- Compartir el repositorio y los tags.
- Abrir un issue para dudas.
- Proponer un reto asíncrono.
- Revisar los PRs de los participantes con la checklist de seguridad.
- No mergear PRs de práctica sin revisar el workflow.
