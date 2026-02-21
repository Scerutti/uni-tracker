import type { EstadoMateria, Materia, ProgresoMap } from "./types";
import { getAllMaterias, getMateriasDeAnio } from "./plan-data";

/**
 * Verifica si una materia está habilitada para cursar.
 * Regla general: todas las correlativas deben estar REGULAR o APROBADA.
 * Reglas especiales para 340321 y 340533.
 */
export function estaHabilitadaParaCursar(
  materia: Materia,
  progreso: ProgresoMap
): boolean {
  const estadoActual = progreso[materia.codigo]?.estado ?? "NO_CURSADA";
  // Si ya está REGULAR o APROBADA, no necesita "habilitarse"
  if (estadoActual !== "NO_CURSADA") return false;

  // Regla especial: 340321 - Taller de Integración
  if (materia.codigo === "340321") {
    const materias2do = getMateriasDeAnio(2);
    return materias2do.every((m) => {
      const estado = progreso[m.codigo]?.estado ?? "NO_CURSADA";
      return estado === "REGULAR" || estado === "APROBADA";
    });
  }

  // Regla especial: 340533 - Tesina de Grado
  if (materia.codigo === "340533") {
    const requeridas = ["340423", "340424", "340425"];
    return requeridas.every((codigo) => {
      const estado = progreso[codigo]?.estado ?? "NO_CURSADA";
      return estado === "REGULAR" || estado === "APROBADA";
    });
  }

  // Regla general
  return materia.correlativas.every((codigo) => {
    const estado = progreso[codigo]?.estado ?? "NO_CURSADA";
    return estado === "REGULAR" || estado === "APROBADA";
  });
}

/**
 * Verifica si una materia está habilitada para rendir final.
 * Regla general: todas las correlativas deben estar APROBADA.
 * Reglas especiales para 340321 y 340533.
 */
export function estaHabilitadaParaRendir(
  materia: Materia,
  progreso: ProgresoMap
): boolean {
  const estadoActual = progreso[materia.codigo]?.estado ?? "NO_CURSADA";
  // Solo se puede rendir si está REGULAR
  if (estadoActual !== "REGULAR") return false;

  // Regla especial: 340321 - Taller de Integración
  if (materia.codigo === "340321") {
    const materias3ro = getMateriasDeAnio(3);
    return materias3ro
      .filter((m) => m.codigo !== "340321")
      .every((m) => {
        const estado = progreso[m.codigo]?.estado ?? "NO_CURSADA";
        return estado === "APROBADA";
      });
  }

  // Regla especial: 340533 - Tesina de Grado
  if (materia.codigo === "340533") {
    const materias5to = getMateriasDeAnio(5);
    return materias5to
      .filter((m) => m.codigo !== "340533")
      .every((m) => {
        const estado = progreso[m.codigo]?.estado ?? "NO_CURSADA";
        return estado === "APROBADA";
      });
  }

  // Regla general
  return materia.correlativas.every((codigo) => {
    const estado = progreso[codigo]?.estado ?? "NO_CURSADA";
    return estado === "APROBADA";
  });
}

/**
 * Obtiene todas las materias habilitadas para cursar.
 */
export function getMateriasHabilitadasParaCursar(progreso: ProgresoMap): Materia[] {
  return getAllMaterias().filter((m) => estaHabilitadaParaCursar(m, progreso));
}

/**
 * Obtiene todas las materias habilitadas para rendir.
 */
export function getMateriasHabilitadasParaRendir(progreso: ProgresoMap): Materia[] {
  return getAllMaterias().filter((m) => estaHabilitadaParaRendir(m, progreso));
}

/**
 * Obtiene las correlativas faltantes para una materia.
 */
export function getCorrelativasFaltantes(
  materia: Materia,
  progreso: ProgresoMap
): string[] {
  if (materia.codigo === "340321") {
    const materias2do = getMateriasDeAnio(2);
    return materias2do
      .filter((m) => {
        const estado = progreso[m.codigo]?.estado ?? "NO_CURSADA";
        return estado === "NO_CURSADA";
      })
      .map((m) => m.codigo);
  }

  if (materia.codigo === "340533") {
    const requeridas = ["340423", "340424", "340425"];
    return requeridas.filter((codigo) => {
      const estado = progreso[codigo]?.estado ?? "NO_CURSADA";
      return estado === "NO_CURSADA";
    });
  }

  return materia.correlativas.filter((codigo) => {
    const estado = progreso[codigo]?.estado ?? "NO_CURSADA";
    return estado === "NO_CURSADA";
  });
}

/**
 * Calcula estadísticas del avance.
 */
export function calcularEstadisticas(progreso: ProgresoMap) {
  const todas = getAllMaterias();
  const total = todas.length;

  let aprobadas = 0;
  let regulares = 0;

  for (const m of todas) {
    const estado = progreso[m.codigo]?.estado ?? "NO_CURSADA";
    if (estado === "APROBADA") aprobadas++;
    else if (estado === "REGULAR") regulares++;
  }

  const habilitadasCursar = getMateriasHabilitadasParaCursar(progreso);
  const habilitadasRendir = getMateriasHabilitadasParaRendir(progreso);
  const porcentaje = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

  return {
    total,
    aprobadas,
    regulares,
    pendientes: total - aprobadas - regulares,
    porcentaje,
    habilitadasCursar: habilitadasCursar.length,
    habilitadasRendir: habilitadasRendir.length,
  };
}

/**
 * Calcula el promedio de notas (solo materias con nota cargada).
 */
export function calcularPromedio(progreso: ProgresoMap): number | null {
  const notas: number[] = [];
  for (const entry of Object.values(progreso)) {
    if (entry.nota !== null && entry.nota !== undefined) {
      notas.push(entry.nota);
    }
  }
  if (notas.length === 0) return null;
  const suma = notas.reduce((a, b) => a + b, 0);
  return Math.round((suma / notas.length) * 100) / 100;
}

/**
 * Determina si una materia puede ser interactuada (cambiar estado/nota).
 * Es interactiva si:
 * - Ya tiene estado REGULAR o APROBADA (ya se marco algo)
 * - O cumple con todas las correlativas para cursar
 */
export function puedeInteractuar(
  materia: Materia,
  progreso: ProgresoMap
): boolean {
  const estadoActual = progreso[materia.codigo]?.estado ?? "NO_CURSADA";
  // Si ya tiene progreso, siempre se puede editar
  if (estadoActual !== "NO_CURSADA") return true;

  // Si no tiene correlativas especiales, check reglas
  // Regla especial: 340321 - Taller de Integracion
  if (materia.codigo === "340321") {
    const materias2do = getMateriasDeAnio(2);
    return materias2do.every((m) => {
      const estado = progreso[m.codigo]?.estado ?? "NO_CURSADA";
      return estado === "REGULAR" || estado === "APROBADA";
    });
  }

  // Regla especial: 340533 - Tesina de Grado
  if (materia.codigo === "340533") {
    const requeridas = ["340423", "340424", "340425"];
    return requeridas.every((codigo) => {
      const estado = progreso[codigo]?.estado ?? "NO_CURSADA";
      return estado === "REGULAR" || estado === "APROBADA";
    });
  }

  // Sin correlativas -> siempre habilitada
  if (materia.correlativas.length === 0) return true;

  // Regla general: todas las correlativas deben ser REGULAR o APROBADA
  return materia.correlativas.every((codigo) => {
    const estado = progreso[codigo]?.estado ?? "NO_CURSADA";
    return estado === "REGULAR" || estado === "APROBADA";
  });
}

/**
 * Obtiene el estado de una materia con valor por defecto.
 */
export function getEstado(codigo: string, progreso: ProgresoMap): EstadoMateria {
  return progreso[codigo]?.estado ?? "NO_CURSADA";
}

export function getNota(codigo: string, progreso: ProgresoMap): number | null {
  return progreso[codigo]?.nota ?? null;
}
