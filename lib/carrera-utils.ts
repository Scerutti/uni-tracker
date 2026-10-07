import type { EstadoMateria, Materia, ProgresoMap, Requisito } from "./types";
import { getAllMaterias, getMateriasDeAnio } from "./plan-data";

/** Nota mínima para aprobar un final. */
export const NOTA_MINIMA_APROBACION = 4;

const cumpleParaCursar = (estado: EstadoMateria) =>
  estado === "REGULAR" || estado === "APROBADA";

const cumpleParaRendir = (estado: EstadoMateria) => estado === "APROBADA";

/**
 * Obtiene el estado de una materia con valor por defecto.
 */
export function getEstado(codigo: string, progreso: ProgresoMap): EstadoMateria {
  return progreso[codigo]?.estado ?? "NO_CURSADA";
}

export function getNota(codigo: string, progreso: ProgresoMap): number | null {
  return progreso[codigo]?.nota ?? null;
}

/**
 * Convierte requisitos (códigos o años completos) en una lista de códigos,
 * excluyendo a la propia materia.
 */
function expandirRequisitos(materia: Materia, requisitos: Requisito[]): string[] {
  const codigos = requisitos.flatMap((r) =>
    typeof r === "string" ? [r] : getMateriasDeAnio(r.anio).map((m) => m.codigo)
  );
  return codigos.filter((c) => c !== materia.codigo);
}

export function getCodigosParaCursar(materia: Materia): string[] {
  return expandirRequisitos(materia, materia.correlativas);
}

export function getCodigosParaRendir(materia: Materia): string[] {
  return expandirRequisitos(materia, materia.correlativasRendir ?? materia.correlativas);
}

/**
 * Un requisito está cumplido para cursar si todas sus materias están REGULAR o APROBADA.
 */
export function requisitoCumplido(
  materia: Materia,
  requisito: Requisito,
  progreso: ProgresoMap
): boolean {
  return expandirRequisitos(materia, [requisito]).every((c) =>
    cumpleParaCursar(getEstado(c, progreso))
  );
}

function cumpleCorrelativasCursar(materia: Materia, progreso: ProgresoMap): boolean {
  return getCodigosParaCursar(materia).every((c) => cumpleParaCursar(getEstado(c, progreso)));
}

function cumpleCorrelativasRendir(materia: Materia, progreso: ProgresoMap): boolean {
  return getCodigosParaRendir(materia).every((c) => cumpleParaRendir(getEstado(c, progreso)));
}

/**
 * Una materia está habilitada para cursar si todavía no se cursó y
 * sus correlativas están REGULAR o APROBADA.
 */
export function estaHabilitadaParaCursar(materia: Materia, progreso: ProgresoMap): boolean {
  return (
    getEstado(materia.codigo, progreso) === "NO_CURSADA" &&
    cumpleCorrelativasCursar(materia, progreso)
  );
}

/**
 * Una materia está habilitada para rendir si está REGULAR y
 * sus correlativas de final están APROBADA.
 */
export function estaHabilitadaParaRendir(materia: Materia, progreso: ProgresoMap): boolean {
  return (
    getEstado(materia.codigo, progreso) === "REGULAR" &&
    cumpleCorrelativasRendir(materia, progreso)
  );
}

/**
 * Una materia se puede editar si ya tiene progreso o si cumple las correlativas para cursar.
 */
export function puedeInteractuar(materia: Materia, progreso: ProgresoMap): boolean {
  return (
    getEstado(materia.codigo, progreso) !== "NO_CURSADA" ||
    cumpleCorrelativasCursar(materia, progreso)
  );
}

/**
 * Correlativas que no acompañan al estado actual de la materia, por ejemplo
 * una materia APROBADA cuya correlativa se volvió a marcar como no cursada.
 */
export function getCorrelativasIncumplidas(materia: Materia, progreso: ProgresoMap): string[] {
  const estado = getEstado(materia.codigo, progreso);
  if (estado === "NO_CURSADA") return [];

  const incumplidas = new Set(
    getCodigosParaCursar(materia).filter((c) => !cumpleParaCursar(getEstado(c, progreso)))
  );
  if (estado === "APROBADA") {
    for (const c of getCodigosParaRendir(materia)) {
      if (!cumpleParaRendir(getEstado(c, progreso))) incumplidas.add(c);
    }
  }
  return [...incumplidas];
}

export function getMateriasHabilitadasParaCursar(progreso: ProgresoMap): Materia[] {
  return getAllMaterias().filter((m) => estaHabilitadaParaCursar(m, progreso));
}

export function getMateriasHabilitadasParaRendir(progreso: ProgresoMap): Materia[] {
  return getAllMaterias().filter((m) => estaHabilitadaParaRendir(m, progreso));
}

/**
 * Indica si todas las materias del plan están aprobadas.
 */
export function esEgresado(progreso: ProgresoMap): boolean {
  return getAllMaterias().every((m) => getEstado(m.codigo, progreso) === "APROBADA");
}

/**
 * Calcula estadísticas del avance.
 */
export function calcularEstadisticas(progreso: ProgresoMap) {
  const todas = getAllMaterias();
  const total = todas.length;

  let aprobadas = 0;
  let regulares = 0;
  let enCurso = 0;
  let horasTotales = 0;
  let horasAprobadas = 0;

  for (const m of todas) {
    const estado = getEstado(m.codigo, progreso);
    horasTotales += m.cargaHoraria;
    if (estado === "APROBADA") {
      aprobadas++;
      horasAprobadas += m.cargaHoraria;
    } else if (estado === "REGULAR") regulares++;
    else if (estado === "EN_CURSO") enCurso++;
  }

  const porcentaje = total > 0 ? Math.round((aprobadas / total) * 100) : 0;
  const porcentajeHoras = horasTotales > 0 ? Math.round((horasAprobadas / horasTotales) * 100) : 0;

  return {
    total,
    aprobadas,
    regulares,
    enCurso,
    pendientes: total - aprobadas - regulares - enCurso,
    porcentaje,
    horasTotales,
    horasAprobadas,
    porcentajeHoras,
    habilitadasCursar: getMateriasHabilitadasParaCursar(progreso).length,
    habilitadasRendir: getMateriasHabilitadasParaRendir(progreso).length,
  };
}

/**
 * Calcula el promedio de las notas de finales aprobados.
 */
export function calcularPromedio(progreso: ProgresoMap): number | null {
  const notas: number[] = [];
  for (const m of getAllMaterias()) {
    const entry = progreso[m.codigo];
    if (entry?.estado === "APROBADA" && entry.nota !== null) {
      notas.push(entry.nota);
    }
  }
  if (notas.length === 0) return null;
  const suma = notas.reduce((a, b) => a + b, 0);
  return Math.round((suma / notas.length) * 100) / 100;
}

/**
 * Indica si la nota cargada no es coherente con el estado (aprobada con nota menor a la mínima).
 */
export function notaInvalida(estado: EstadoMateria, nota: number | null): boolean {
  return estado === "APROBADA" && nota !== null && nota < NOTA_MINIMA_APROBACION;
}
