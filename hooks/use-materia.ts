"use client";

import { useCallback, type ChangeEvent } from "react";
import { toast } from "sonner";
import { useProgreso, useProgresoStore } from "@/lib/store";
import {
  esNotaValida,
  getCorrelativasIncumplidas,
  getEstado,
  getMateriasHabilitadasParaCursar,
  getNota,
  puedeInteractuar,
} from "@/lib/carrera-utils";
import { useCarrera } from "@/components/carrera-provider";
import type { Carrera, EstadoMateria, Materia } from "@/lib/types";

function codigosHabilitados(carrera: Carrera) {
  const progreso = useProgresoStore.getState().progresos[carrera.id] ?? {};
  return new Set(getMateriasHabilitadasParaCursar(carrera, progreso).map((m) => m.codigo));
}

/**
 * Estado y handlers de una materia, compartidos por la fila (desktop) y la tarjeta (mobile).
 */
export function useMateria(materia: Materia) {
  const carrera = useCarrera();
  const progreso = useProgreso(carrera.id);
  const setEstado = useProgresoStore((s) => s.setEstado);
  const setNota = useProgresoStore((s) => s.setNota);

  const estado = getEstado(materia.codigo, progreso);
  const nota = getNota(materia.codigo, progreso);
  const habilitada = puedeInteractuar(carrera, materia, progreso);
  const incumplidas = getCorrelativasIncumplidas(carrera, materia, progreso);

  const handleEstadoChange = useCallback(
    (value: string) => {
      const antes = codigosHabilitados(carrera);
      setEstado(carrera, materia.codigo, value as EstadoMateria);
      const despues = useProgresoStore.getState().progresos[carrera.id] ?? {};
      const nuevas = getMateriasHabilitadasParaCursar(carrera, despues).filter((m) => !antes.has(m.codigo));

      if (nuevas.length > 0) {
        toast.success(
          nuevas.length === 1
            ? "Se habilitó una materia para cursar"
            : `Se habilitaron ${nuevas.length} materias para cursar`,
          { description: nuevas.map((m) => m.nombre).join(", ") }
        );
      }
    },
    [carrera, materia.codigo, setEstado]
  );

  const handleNotaChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === "") {
        setNota(carrera.id, materia.codigo, null);
      } else {
        const num = parseFloat(val);
        if (esNotaValida(num)) {
          setNota(carrera.id, materia.codigo, num);
        }
      }
    },
    [carrera.id, materia.codigo, setNota]
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
