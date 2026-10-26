import { type FiltroActivo, type ProgresoMap, FILTROS } from "./types";
import { CARRERA_ORIGINAL, getCarrera } from "./carreras";
import { sanitizarProgreso } from "./progreso-io";

/** Lo que se guarda en localStorage. */
export interface EstadoPersistido {
  /** Progreso de cada carrera, por id de carrera. */
  progresos: Record<string, ProgresoMap>;
  /** Años desplegados de cada carrera, por id de carrera. */
  aniosExpandidos: Record<string, number[]>;
  filtro: FiltroActivo;
}

export const VERSION_ESTADO = 2;

function filtroValido(filtro: unknown): FiltroActivo {
  return FILTROS.includes(filtro as FiltroActivo) ? (filtro as FiltroActivo) : "todas";
}

function aniosValidos(anios: unknown): number[] {
  return Array.isArray(anios) ? anios.filter((a): a is number => typeof a === "number") : [];
}

/**
 * Lleva el estado guardado con una versión anterior al formato actual.
 *
 * - v0 y v1: un solo progreso, de la carrera original. v0 además no estaba saneado
 *   (notas en materias no cursadas, códigos que no existen en el plan).
 * - v2: progreso y años desplegados separados por carrera.
 */
export function migrarEstado(persisted: unknown, version: number): EstadoPersistido {
  const anterior = (typeof persisted === "object" && persisted !== null ? persisted : {}) as Record<string, unknown>;

  if (version < 2) {
    const carrera = getCarrera(CARRERA_ORIGINAL);
    const progreso = carrera ? (sanitizarProgreso(carrera, anterior.progreso) ?? {}) : {};
    return {
      progresos: Object.keys(progreso).length > 0 ? { [CARRERA_ORIGINAL]: progreso } : {},
      aniosExpandidos: { [CARRERA_ORIGINAL]: aniosValidos(anterior.anioExpandido) },
      filtro: filtroValido(anterior.filtro),
    };
  }

  return {
    progresos: (anterior.progresos as EstadoPersistido["progresos"]) ?? {},
    aniosExpandidos: (anterior.aniosExpandidos as EstadoPersistido["aniosExpandidos"]) ?? {},
    filtro: filtroValido(anterior.filtro),
  };
}
