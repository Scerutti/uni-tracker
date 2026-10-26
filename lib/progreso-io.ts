import type { Carrera, EstadoMateria, ProgresoMap } from "./types";
import { getCarrera } from "./carreras";
import { esNotaValida, llevaNota } from "./carrera-utils";
import { getMateriaByCode } from "./plan";

const APP_ID = "uni-tracker";
const FORMATO_VERSION = 1;

const VALID_ESTADOS: EstadoMateria[] = ["NO_CURSADA", "EN_CURSO", "REGULAR", "APROBADA"];

export interface ArchivoProgreso {
  app: typeof APP_ID;
  version: number;
  carrera: string;
  exportadoEl: string;
  progreso: ProgresoMap;
}

/**
 * Valida y sanea un mapa de progreso. Devuelve solo las entradas con códigos
 * del plan de la carrera y estados válidos; las materias sin cursar o en curso no llevan nota.
 * Devuelve null si el dato no es un objeto o si ninguna entrada es válida.
 */
export function sanitizarProgreso(carrera: Carrera, data: unknown): ProgresoMap | null {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return null;
  }

  const resultado: ProgresoMap = {};
  let entradas = 0;
  let descartadas = 0;

  for (const [codigo, valor] of Object.entries(data as Record<string, unknown>)) {
    if (!getMateriaByCode(carrera, codigo) || typeof valor !== "object" || valor === null) {
      descartadas++;
      continue;
    }

    const entry = valor as Record<string, unknown>;
    const estado = entry.estado;

    if (typeof estado !== "string" || !VALID_ESTADOS.includes(estado as EstadoMateria)) {
      descartadas++;
      continue;
    }

    let nota: number | null = null;
    if (llevaNota(estado as EstadoMateria) && entry.nota !== null && entry.nota !== undefined) {
      const num = Number(entry.nota);
      if (esNotaValida(num)) {
        nota = num;
      }
    }

    resultado[codigo] = { estado: estado as EstadoMateria, nota };
    entradas++;
  }

  if (entradas === 0 && descartadas > 0) return null;

  return resultado;
}

export function crearArchivoProgreso(carrera: Carrera, progreso: ProgresoMap): ArchivoProgreso {
  return {
    app: APP_ID,
    version: FORMATO_VERSION,
    carrera: carrera.id,
    exportadoEl: new Date().toISOString(),
    progreso,
  };
}

/**
 * Nombre del archivo exportado, con la carrera y la fecha.
 */
export function nombreArchivoProgreso(carrera: Carrera, fecha = new Date()): string {
  return `progreso-${carrera.id}-${fecha.toISOString().slice(0, 10)}.json`;
}

export type ResultadoLectura =
  | { ok: true; progreso: ProgresoMap }
  | { ok: false; error: string };

/**
 * Lee un archivo exportado para importarlo en `carrera`. Acepta el formato actual
 * ({ app, version, carrera, progreso }) y el formato anterior (el mapa de progreso suelto).
 */
export function leerArchivoProgreso(carrera: Carrera, data: unknown): ResultadoLectura {
  const esFormatoActual =
    typeof data === "object" &&
    data !== null &&
    (data as Record<string, unknown>).app === APP_ID;

  if (esFormatoActual) {
    const archivo = data as Partial<ArchivoProgreso>;
    if (archivo.carrera !== carrera.id) {
      const otra = typeof archivo.carrera === "string" ? getCarrera(archivo.carrera) : undefined;
      return {
        ok: false,
        error: otra
          ? `El archivo corresponde a ${otra.nombreCorto} (${otra.universidad.sigla}). Importalo desde esa carrera.`
          : "El archivo corresponde a otra carrera.",
      };
    }
    if (typeof archivo.version !== "number" || archivo.version > FORMATO_VERSION) {
      return {
        ok: false,
        error: "El archivo fue exportado con una versión más nueva de la aplicación.",
      };
    }
    data = archivo.progreso;
  }

  const progreso = sanitizarProgreso(carrera, data);
  if (!progreso) {
    return {
      ok: false,
      error: "El archivo no tiene un formato válido. Asegurate de usar un JSON exportado por esta aplicación.",
    };
  }
  return { ok: true, progreso };
}
