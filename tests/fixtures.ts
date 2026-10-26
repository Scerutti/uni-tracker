import type { Carrera, Materia, Requisito } from "@/lib/types";

/**
 * Materia mínima para los tests.
 */
export function materia(codigo: string, correlativas: Requisito[] = [], extra: Partial<Materia> = {}): Materia {
  return {
    codigo,
    nombre: `Materia ${codigo}`,
    tipo: "Anual",
    cargaHoraria: 100,
    correlativas,
    ...extra,
  };
}

/**
 * Carrera chica de dos años:
 * - A1, A2: sin correlativas.
 * - B1: pide A1.
 * - B2: pide el 1° año completo para cursar y B1 aprobada para rendir.
 */
export function carreraDePrueba(cambios: Partial<Carrera> = {}): Carrera {
  return {
    id: "prueba",
    nombre: "Carrera de Prueba",
    nombreCorto: "Prueba",
    universidad: { id: "u", nombre: "Universidad de Prueba", sigla: "UP", logo: "/logo.png" },
    notaMinima: 4,
    plan: [
      { anio: 1, materias: [materia("A1"), materia("A2")] },
      {
        anio: 2,
        materias: [materia("B1", ["A1"]), materia("B2", [{ anio: 1 }], { correlativasRendir: ["B1"] })],
      },
    ],
    ...cambios,
  };
}
