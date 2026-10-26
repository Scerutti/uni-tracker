import type { Carrera, Universidad } from "../types";
import { licSistemas } from "./lic-sistemas";

/** Todas las carreras disponibles, en el orden en que aparecen en la home. */
export const CARRERAS: Carrera[] = [licSistemas];

/** Carrera del progreso guardado antes de que hubiera más de una (formato v1). */
export const CARRERA_ORIGINAL = licSistemas.id;

const carrerasPorId = new Map(CARRERAS.map((c) => [c.id, c]));

export function getCarrera(id: string): Carrera | undefined {
  return carrerasPorId.get(id);
}

/**
 * Agrupa las carreras por universidad, respetando el orden de `CARRERAS`.
 */
export function getCarrerasPorUniversidad(): { universidad: Universidad; carreras: Carrera[] }[] {
  const grupos = new Map<string, { universidad: Universidad; carreras: Carrera[] }>();
  for (const carrera of CARRERAS) {
    const grupo = grupos.get(carrera.universidad.id);
    if (grupo) grupo.carreras.push(carrera);
    else grupos.set(carrera.universidad.id, { universidad: carrera.universidad, carreras: [carrera] });
  }
  return [...grupos.values()];
}
