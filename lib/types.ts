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

export interface Universidad {
  id: string;
  nombre: string;
  sigla: string;
  /** Ruta del logo dentro de `public/`. */
  logo: string;
}

export interface Carrera {
  /**
   * Identificador permanente: es la URL (`/carrera/<id>`) y la clave del progreso
   * guardado y de los archivos exportados. No se cambia una vez publicada.
   */
  id: string;
  nombre: string;
  /** Nombre para el header, por ejemplo "Lic. en Sistemas". */
  nombreCorto: string;
  universidad: Universidad;
  /** Nota mínima para aprobar un final. */
  notaMinima: number;
  /** Texto de los chips de correlativas. Si se omite, se muestra el código completo. */
  abreviarCodigo?: (codigo: string) => string;
  plan: AnioData[];
}

export interface ProgresoMateria {
  estado: EstadoMateria;
  nota: number | null;
}

export type ProgresoMap = Record<string, ProgresoMateria>;

export type FiltroActivo = "todas" | "aprobadas" | "habilitadas" | "pendientes";
