import type { Carrera, Materia } from "./types";

interface IndicePlan {
  materias: Materia[];
  porCodigo: Map<string, Materia>;
  anioPorCodigo: Map<string, number>;
}

const indices = new WeakMap<Carrera, IndicePlan>();

/**
 * Índices del plan de una carrera. Se arman la primera vez que se piden.
 */
function indice(carrera: Carrera): IndicePlan {
  let idx = indices.get(carrera);
  if (!idx) {
    const materias = carrera.plan.flatMap((a) => a.materias);
    idx = {
      materias,
      porCodigo: new Map(materias.map((m) => [m.codigo, m])),
      anioPorCodigo: new Map(carrera.plan.flatMap((a) => a.materias.map((m) => [m.codigo, a.anio] as const))),
    };
    indices.set(carrera, idx);
  }
  return idx;
}

export function getAllMaterias(carrera: Carrera): Materia[] {
  return indice(carrera).materias;
}

export function getMateriaByCode(carrera: Carrera, codigo: string): Materia | undefined {
  return indice(carrera).porCodigo.get(codigo);
}

export function getMateriasDeAnio(carrera: Carrera, anio: number): Materia[] {
  return carrera.plan.find((a) => a.anio === anio)?.materias ?? [];
}

export function getAnioDeMateria(carrera: Carrera, codigo: string): number | undefined {
  return indice(carrera).anioPorCodigo.get(codigo);
}

/**
 * Texto corto de un código para los chips de correlativas.
 */
export function abreviarCodigo(carrera: Carrera, codigo: string): string {
  return carrera.abreviarCodigo?.(codigo) ?? codigo;
}
