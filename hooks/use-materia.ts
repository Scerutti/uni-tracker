"use client";

import { useCallback, type ChangeEvent } from "react";
import { toast } from "sonner";
import { useCarreraStore } from "@/lib/store";
import {
  getCorrelativasIncumplidas,
  getEstado,
  getMateriasHabilitadasParaCursar,
  getNota,
  puedeInteractuar,
} from "@/lib/carrera-utils";
import type { EstadoMateria, Materia, ProgresoMap } from "@/lib/types";

function codigosHabilitados(progreso: ProgresoMap) {
  return new Set(getMateriasHabilitadasParaCursar(progreso).map((m) => m.codigo));
}

/**
 * Estado y handlers de una materia, compartidos por la fila (desktop) y la tarjeta (mobile).
 */
export function useMateria(materia: Materia) {
  const progreso = useCarreraStore((s) => s.progreso);
  const setEstado = useCarreraStore((s) => s.setEstado);
  const setNota = useCarreraStore((s) => s.setNota);

  const estado = getEstado(materia.codigo, progreso);
  const nota = getNota(materia.codigo, progreso);
  const habilitada = puedeInteractuar(materia, progreso);
  const incumplidas = getCorrelativasIncumplidas(materia, progreso);

  const handleEstadoChange = useCallback(
    (value: string) => {
      const antes = codigosHabilitados(useCarreraStore.getState().progreso);
      setEstado(materia.codigo, value as EstadoMateria);
      const nuevas = getMateriasHabilitadasParaCursar(useCarreraStore.getState().progreso).filter(
        (m) => !antes.has(m.codigo)
      );

      if (nuevas.length > 0) {
        toast.success(
          nuevas.length === 1 ? "Se habilitó una materia para cursar" : `Se habilitaron ${nuevas.length} materias para cursar`,
          { description: nuevas.map((m) => m.nombre).join(", ") }
        );
      }
    },
    [materia.codigo, setEstado]
  );

  const handleNotaChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === "") {
        setNota(materia.codigo, null);
      } else {
        const num = parseFloat(val);
        if (!isNaN(num) && num >= 0 && num <= 10) {
          setNota(materia.codigo, num);
        }
      }
    },
    [materia.codigo, setNota]
  );

  return {
    progreso,
    estado,
    nota,
    habilitada,
    incumplidas,
    handleEstadoChange,
    handleNotaChange,
  };
}
