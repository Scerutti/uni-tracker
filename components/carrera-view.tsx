"use client";

import { useCallback } from "react";
import { useProgresoStore, useHidratarStore } from "@/lib/store";
import { getAnioDeMateria } from "@/lib/plan";
import { useCarrera } from "@/components/carrera-provider";
import { Dashboard } from "@/components/dashboard";
import { Toolbar } from "@/components/toolbar";
import { AnioSection } from "@/components/anio-section";

export function CarreraView() {
  const carrera = useCarrera();
  const hidratado = useHidratarStore();
  const filtro = useProgresoStore((s) => s.filtro);
  const expandirAnio = useProgresoStore((s) => s.expandirAnio);

  const handleScrollToMateria = useCallback(
    (codigo: string) => {
      const anio = getAnioDeMateria(carrera, codigo);
      if (anio !== undefined) expandirAnio(carrera.id, anio);

      // Espera a que el año expandido se renderice antes de buscar la materia.
      requestAnimationFrame(() => {
        const el = document.getElementById(`materia-${codigo}`);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary", "ring-offset-2");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-primary", "ring-offset-2");
        }, 2000);
      });
    },
    [carrera, expandirAnio]
  );

  if (!hidratado) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="py-12 text-center text-sm text-muted-foreground">
          Cargando tu progreso...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <Dashboard />
        <Toolbar />

        <div className="flex flex-col gap-4">
          {carrera.plan.map((anioData) => (
            <AnioSection
              key={anioData.anio}
              anioData={anioData}
              filtro={filtro}
              onScrollToMateria={handleScrollToMateria}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
