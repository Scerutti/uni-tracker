"use client";

import { useCallback } from "react";
import { useCarreraStore } from "@/lib/store";
import { planDeEstudios } from "@/lib/plan-data";
import { Dashboard } from "@/components/dashboard";
import { Toolbar } from "@/components/toolbar";
import { AnioSection } from "@/components/anio-section";

export default function CarreraPage() {
  const filtro = useCarreraStore((s) => s.filtro);

  const handleScrollToMateria = useCallback((codigo: string) => {
    const el = document.getElementById(`materia-${codigo}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-primary", "ring-offset-2");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-primary", "ring-offset-2");
      }, 2000);
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <Dashboard />
        <Toolbar />

        <div className="flex flex-col gap-4">
          {planDeEstudios.map((anioData) => (
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
