import type { ComponentType } from "react";
import { CheckCircle2, Clock, Lock, PlayCircle } from "lucide-react";
import type { EstadoMateria, TipoMateria } from "./types";

interface EstadoConfig {
  label: string;
  /** Fondo de la fila o tarjeta de la materia. */
  fila: string;
  /** Colores de chips y badges que muestran el estado. */
  chip: string;
  icono: ComponentType<{ className?: string }>;
}

export const ESTADOS: EstadoMateria[] = ["NO_CURSADA", "EN_CURSO", "REGULAR", "APROBADA"];

export const ESTADO_CONFIG: Record<EstadoMateria, EstadoConfig> = {
  NO_CURSADA: {
    label: "No cursada",
    fila: "",
    chip: "bg-destructive/10 text-destructive",
    icono: Lock,
  },
  EN_CURSO: {
    label: "En curso",
    fila: "bg-sky-50/60 dark:bg-sky-950/30",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400",
    icono: PlayCircle,
  },
  REGULAR: {
    label: "Regular",
    fila: "bg-amber-50/60 dark:bg-amber-950/30",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
    icono: Clock,
  },
  APROBADA: {
    label: "Aprobada",
    fila: "bg-emerald-50/60 dark:bg-emerald-950/30",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
    icono: CheckCircle2,
  },
};

export const TIPO_LABEL: Record<TipoMateria, string> = {
  Anual: "Anual",
  "Cuatrim C1": "C1",
  "Cuatrim C2": "C2",
};
