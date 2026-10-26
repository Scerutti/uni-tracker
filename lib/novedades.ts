export interface Novedad {
  version: string;
  /** Fecha del release, en formato `AAAA-MM-DD`. */
  fecha: string;
  /** Qué cambió, en pocas palabras y para quien usa la app (sin detalles técnicos). */
  cambios: string[];
}

/**
 * Resumen de cada versión que se muestra al tocar la versión en el footer. La primera es la
 * actual y tiene que coincidir con `package.json` (lo revisa un test). El detalle está en `CHANGELOG.md`.
 */
export const NOVEDADES: Novedad[] = [
  {
    version: "1.0.1",
    fecha: "2026-10-26",
    cambios: ["Mejoras internas para que la app siga andando al día."],
  },
  {
    version: "1.0.0",
    fecha: "2026-10-26",
    cambios: [
      "La app está lista para sumar más carreras, cada una con su propio progreso.",
      "Ves qué correlativas necesitás para cursar y cuáles para rendir el final.",
      "Nuevo filtro para ver qué materias ya podés rendir.",
      "Si tu carrera no está, la podés pedir por mail.",
    ],
  },
  {
    version: "0.1.0",
    fecha: "2026-10-07",
    cambios: ["Primera versión: seguimiento de Lic. en Sistemas (UADER) con correlativas, promedio y avance."],
  },
];
