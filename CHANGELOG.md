# Changelog

Los cambios de cada versión de uni-tracker. La versión que se ve en el footer de la app sale de `package.json`.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones siguen [SemVer](https://semver.org/lang/es/).

## [1.0.0] - 2026-10-26

Primera versión estable: la app está en uso, soporta varias carreras y el progreso guardado tiene migraciones.

### Agregado

- Soporte para varias carreras: cada una tiene su página (`/carrera/<id>`) y su progreso guardado por separado. La home las agrupa por universidad. (#13)
- Validación de los planes de estudio y tests con Vitest. (#13)
- Pedir una carrera nueva desde la home o la 404: por mail (con los datos a completar) o con un issue en GitHub.
- Página 404 propia. (#14)
- Filtro "Habilitadas para rendir".
- Las materias con correlativas distintas para rendir el final muestran las dos listas (Cursar / Rendir).
- Versión de la app en el footer: al tocarla se abre un resumen corto de las novedades.

### Cambiado

- `/carrera` redirige a `/carrera/lic-sistemas`. El progreso guardado se migra solo a la nueva carrera.
- El archivo exportado incluye la carrera en el nombre, y al importar un archivo de otra carrera el error dice de cuál es.
- El modal de egreso dice "¡Te recibiste!" y el nombre de la carrera.
- Dependencias al día: Next 16.4, React 19.3, lucide-react 1.x y sonner 2.

## [0.1.0] - 2026-10-07

### Agregado

- Seguimiento del plan de Lic. en Sistemas de Información (UADER): estados No cursada, En curso, Regular y Aprobada, y notas.
- Correlativas para cursar y para rendir, incluso por año completo.
- Dashboard con avance, horas, promedio y materias habilitadas.
- Modal de egreso con confetti.
- Exportar e importar el progreso en JSON.
- Tema claro y oscuro.
