<!--
Base: `develop`. A `main` sólo llegan los releases.
Título: estilo Conventional Commits, por ejemplo `fix(store): ...` o `feat(carreras): ...`.
-->

Cierra #

## Qué cambia y por qué

<!-- El problema que ve el usuario (o el riesgo) y cómo lo resuelve este PR. -->

## Cambios

<!-- Un punto por cambio, con el archivo principal en `código`. -->

-

## Planes de estudio y datos guardados

- [ ] **Sin cambios**: no toca planes de estudio ni el formato del progreso.
- [ ] **Cambia un plan de estudio** (materias, códigos o correlativas): lo revisé contra el plan oficial. Link: <!-- url -->
- [ ] **Cambia el formato del progreso** (localStorage o JSON exportado): subí la `version` y agregué la migración, así nadie pierde su avance.

## Release

- [ ] No cambia la versión.
- [ ] Sube la versión a **x.y.z**: `package.json` y `package-lock.json`.

## Verificación

- [ ] `npm run typecheck` pasa.
- [ ] `npm run lint` pasa.
- [ ] `npm test` pasa. Tests nuevos o cambiados: <!-- archivos, o "ninguno" -->
- [ ] Probé la UI en el navegador (celular y escritorio, si aplica).

**Para probar:**

1.

## Antes de mergear

- [ ] Sin secretos ni archivos locales (`.env.local`, configuración del editor).
- [ ] Pasos manuales pendientes (variables de entorno en Vercel, etc.): <!-- cuáles, o "ninguno" -->
