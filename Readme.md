# uni-tracker

Aplicación web para **llevar el seguimiento del plan de estudios** de una carrera universitaria: marcar materias como cursadas/aprobadas, visualizar el avance por año y consultar **correlativas** para planificar qué cursar/rendir después.

## ¿Para qué sirve?

- Registrar tu progreso materia por materia (estado y/o nota, según corresponda).
- Visualizar el plan organizado por años.
- Entender dependencias/correlatividades para planificar cursadas.
- Tener un “tablero” rápido del avance general.

## Stack / Tecnologías

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- UI basada en **Radix UI / shadcn**
- Estado con **Zustand** (persistencia local)

## Requisitos

- **Node.js 20+** (recomendado: 20.9 o superior)
- Un gestor de paquetes: `npm` o `pnpm`

## Instalación

Con **npm**:
```bash
npm install
npm run dev
```

Luego abrí: http://localhost:3000

## Scripts útiles

- `dev`: levanta el entorno de desarrollo
- `build`: compila para producción
- `start`: ejecuta el build en modo producción
- `lint`: corre el linter (ESLint)
- `typecheck`: verifica los tipos de TypeScript
- `test`: corre los tests (Vitest), incluida la validación de los planes de estudio

## Datos

El progreso se guarda en el `localStorage` del navegador. Para pasarlo a otro
navegador o dispositivo, usá **Exportar JSON** e **Importar JSON**.

Cada carrera guarda su progreso por separado, así que se puede llevar más de una
en el mismo navegador.

## Agregar una carrera

Cada carrera es un archivo en `lib/carreras/`, por ejemplo
`lib/carreras/lic-sistemas.ts`.

1. Si la universidad no existe, agregala en `lib/universidades.ts` y poné su
   logo en `public/images/`.
2. Creá `lib/carreras/<id>.ts` con un `Carrera`:
   - `id`: el slug de la URL (`/carrera/<id>`). Es permanente: el progreso
     guardado y los archivos exportados lo usan, así que no se cambia una vez
     publicado.
   - `nombre`, `nombreCorto` (para el header), `universidad` y `notaMinima`
     (nota mínima para aprobar un final).
   - `abreviarCodigo` (opcional): cómo se muestra un código en los chips de
     correlativas. Si se omite, se muestra el código completo.
   - `plan`: los años con sus materias. Una correlativa puede ser el código de
     una materia o un año completo (`{ anio: 2 }`). Una materia puede tener
     correlativas distintas para rendir el final (`correlativasRendir`).
3. Sumala a `CARRERAS` en `lib/carreras/index.ts`.
4. Corré `npm test`: valida todas las carreras (códigos repetidos,
   correlativas que no existen, de años posteriores o circulares).

Si no querés armarla vos, pedila con el template de issue **Nueva carrera**.

## Contribuir

Las contribuciones son bienvenidas.

- Si encontrás un bug, tenés una sugerencia o querés proponer una mejora: **abrí una Issue**.
- Si querés implementar algo: **abrí un Pull Request (PR)**.

Sugerencia para PR's:
1. Fork del repo
2. Crear una rama (`feat/...` o `fix/...`)
3. Cambios con una descripción clara
4. PR explicando el problema/feature y cómo probarlo

## Soporte

Si necesitás ayuda o querés discutir una idea, **abrí una Issue** y lo vemos ahí.

---
Hecho con Next.js + TypeScript.