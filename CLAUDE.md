# Ramas

- `develop` es la rama de trabajo; `main` es producción (Vercel publica `main`).
- El flujo es feature → `develop` → `main`. Las ramas salen de `develop` con prefijo `feat/`, `fix/` o `chore/`.
- Después de mergear un release a `main`, `develop` se adelanta a `main` para que no quede atrás por el merge commit: `git push origin origin/main:refs/heads/develop` (es fast-forward, no force push).

# Pull requests

- **PR template:** `.github/pull_request_template.md`. Cada descripción de PR sigue sus secciones, en el mismo orden. Las secciones que no aplican se dejan con su casilla "sin cambios" marcada; no se borran.
- **Default base branch:** `develop`. A `main` sólo llegan los releases.
- Con `gh pr create`, pasar la descripción completa con `--body-file`, armada sobre el template.
- Títulos y commits en español, estilo Conventional Commits.
