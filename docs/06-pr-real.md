# 06 · PR real y branch protection

**Tiempo:** 30 min
**Objetivo:** ejecutar el workflow en GitHub real mediante un Pull Request,
comprobar un fallo controlado y proteger `main` para que no se mergee sin CI.

## Antes de empezar

El workflow final debe estar en `main` y el check `Test (Bun)` debe haber
corrido al menos una vez. Si acabas de crear el repositorio, espera a que el
primer run termine en verde.

Comprueba:

```bash
gh run list --limit 5
```

## Crear una rama y un cambio pequeño

```bash
git switch main
git pull
git switch -c demo/pr-ci
```

Haz un cambio pequeño y útil. Por ejemplo, agrega una sección a este documento
o mejora un texto del README. Luego:

```bash
git add .
git commit -m "docs: probar CI en un Pull Request"
git push -u origin demo/pr-ci
```

## Abrir el Pull Request

```bash
gh pr create --base main --head demo/pr-ci --fill
```

O abre el PR desde la interfaz de GitHub.

En el PR observa:

- El check `Test (Bun)`.
- La pestaña **Checks**.
- Los logs por step.
- La duración.
- El resumen del job.

> `gh pr checks` muestra el nombre del job: `Test (Bun)`. En la interfaz de
> GitHub puede aparecer junto al workflow como `CI / Test (Bun)`.

Espera el resultado:

```bash
gh pr checks --watch
```

## Ejercicio: fallo controlado

1. En la misma rama, rompe un test de forma temporal:

   ```bash
   # Edita tests/chat.test.ts y cambia una expectativa
   git add tests/chat.test.ts
   git commit -m "test: provocar fallo en CI"
   git push
   ```

2. Vuelve a mirar los checks:

   ```bash
   gh pr checks --watch
   ```

3. Observa:
   - El check queda en rojo.
   - El step `Ejecutar tests` falla.
   - El merge queda bloqueado si la protección está activa.

4. Corrige el test:

   ```bash
   git revert --no-edit HEAD
   git push
   ```

5. Verifica que el check vuelve a verde.

## Proteger `main`

Configura una **ruleset** o branch protection. En la interfaz:

1. **Settings → Rules → Rulesets → New branch ruleset**.
2. Nombre: `main-protection`.
3. Enforcement status: **Active**.
4. Target branches: **Include default branch**.
5. Activa:
   - **Restrict deletions**.
   - **Block force pushes**.
   - **Require a pull request before merging**.
   - **Require status checks to pass**.
   - **Require branches to be up to date before merging**.
   - **Require linear history** (opcional, recomendado con squash).
6. En status checks, selecciona `Test (Bun)`.
7. Aprobaciones requeridas: `0` para un repositorio personal, `1` si habrá
   revisión de otra persona.
8. Guarda la ruleset.

Si el check no aparece en la lista, primero haz que un PR lo ejecute una vez.
El nombre debe coincidir exactamente con el que muestra GitHub.

### Verificar la protección

- Abre un PR con un test roto: el botón de merge debe quedar bloqueado.
- Corrige el test: el botón se habilita cuando el check pasa.
- Intenta hacer push directo a `main`: debe ser rechazado.

## Merge

Con el check en verde:

```bash
gh pr merge --squash --delete-branch
```

Después del merge, GitHub ejecuta CI en `main` por el evento `push`. Verifica:

```bash
gh run list --branch main --limit 3
```

## PRs desde forks

En un repositorio público, cualquiera puede abrir un PR desde un fork. GitHub
no expone secretos a esos workflows y el `GITHUB_TOKEN` es de solo lectura.

Configura en **Settings → Actions → General → Fork pull request workflows**:

- **Require approval for first-time contributors**, o
- **Require approval for all external contributors** si quieres más control.

Nunca cambies a `pull_request_target` para "arreglar" un workflow de fork que
necesita checkout: eso puede dar acceso a secretos a código no confiable.

## Checkpoint

- [ ] El PR ejecuta `Test (Bun)`.
- [ ] El check verde permite merge.
- [ ] Un test roto bloquea el merge.
- [ ] `main` rechaza pushes directos.
- [ ] El workflow corre también después del merge.
- [ ] Entiendes por qué no hay secretos en el workflow.
