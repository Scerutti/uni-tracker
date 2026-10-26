"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getCarrera } from "@/lib/carreras";
import type { Carrera } from "@/lib/types";

const CarreraContext = createContext<Carrera | null>(null);

/**
 * Hace disponible la carrera de la página a los componentes de adentro.
 * Recibe el id (no el objeto) porque viene de un Server Component.
 */
export function CarreraProvider({ carreraId, children }: { carreraId: string; children: ReactNode }) {
  const carrera = getCarrera(carreraId);
  if (!carrera) throw new Error(`Carrera desconocida: ${carreraId}`);
  return <CarreraContext.Provider value={carrera}>{children}</CarreraContext.Provider>;
}

export function useCarrera(): Carrera {
  const carrera = useContext(CarreraContext);
  if (!carrera) throw new Error("useCarrera se usa dentro de un CarreraProvider");
  return carrera;
}
