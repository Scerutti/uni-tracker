export type TipoMateria = "Anual" | "Cuatrim C1" | "Cuatrim C2";

export type EstadoMateria = "NO_CURSADA" | "EN_CURSO" | "REGULAR" | "APROBADA";

/**
 * Requisito de correlatividad: el código de una materia puntual
 * o un año completo del plan (todas sus materias).
 */
export type Requisito = string | { anio: number };

export interface Materia {
  codigo: string;
  nombre: string;
  tipo: TipoMateria;
  cargaHoraria: number;
  /** Para cursar: deben estar REGULAR o APROBADA. */
  correlativas: Requisito[];
  /** Para rendir el final: deben estar APROBADA. Si se omite, se usan `correlativas`. */
  correlativasRendir?: Requisito[];
  /** Aclaración que se muestra junto al nombre (reglas especiales). */
  aclaracion?: string;
}

export interface AnioData {
  anio: number;
  materias: Materia[];
}

export interface Carrera {
  id: string;
  nombre: string;
  plan: AnioData[];
}

export interface ProgresoMateria {
  estado: EstadoMateria;
  nota: number | null;
}

export type ProgresoMap = Record<string, ProgresoMateria>;

export type FiltroActivo = "todas" | "aprobadas" | "habilitadas" | "pendientes";
