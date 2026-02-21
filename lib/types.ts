export type TipoMateria = "Anual" | "Cuatrim C1" | "Cuatrim C2";

export type EstadoMateria = "NO_CURSADA" | "REGULAR" | "APROBADA";

export interface Materia {
  codigo: string;
  nombre: string;
  tipo: TipoMateria;
  cargaHoraria: number;
  correlativas: string[];
}

export interface AnioData {
  anio: number;
  materias: Materia[];
}

export interface ProgresoMateria {
  estado: EstadoMateria;
  nota: number | null;
}

export type ProgresoMap = Record<string, ProgresoMateria>;

export type FiltroActivo = "todas" | "aprobadas" | "habilitadas" | "pendientes";
