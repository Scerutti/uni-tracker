"use client";

import { useMemo } from "react";
import { useCarreraStore } from "@/lib/store";
import { getEstado, estaHabilitadaParaCursar } from "@/lib/carrera-utils";
import type { AnioData, FiltroActivo } from "@/lib/types";
import { MateriaRow } from "./materia-row";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { MateriaCard } from "./materia-card";
import { ChevronDown } from "lucide-react";

interface AnioSectionProps {
  anioData: AnioData;
  filtro: FiltroActivo;
  onScrollToMateria?: (codigo: string) => void;
}

export function AnioSection({ anioData, filtro, onScrollToMateria }: AnioSectionProps) {
  const progreso = useCarreraStore((s) => s.progreso);
  const anioExpandido = useCarreraStore((s) => s.anioExpandido);
  const isMobile = useIsMobile();
  const setAnioExpandido = useCarreraStore((s) => s.setAnioExpandido);

  const isOpen = anioExpandido === null || anioExpandido === anioData.anio;

  const materiasFiltradas = useMemo(() => {
    return anioData.materias.filter((m) => {
      const estado = getEstado(m.codigo, progreso);
      switch (filtro) {
        case "aprobadas":
          return estado === "APROBADA";
        case "habilitadas":
          return estaHabilitadaParaCursar(m, progreso);
        case "pendientes":
          return estado === "NO_CURSADA";
        default:
          return true;
      }
    });
  }, [anioData.materias, filtro, progreso]);

  const aprobadas = anioData.materias.filter(
    (m) => getEstado(m.codigo, progreso) === "APROBADA"
  ).length;
  const regulares = anioData.materias.filter(
    (m) => getEstado(m.codigo, progreso) === "REGULAR"
  ).length;

  if (materiasFiltradas.length === 0 && filtro !== "todas") return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => setAnioExpandido(open ? anioData.anio : null)}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-card px-4 py-3 border transition-colors hover:bg-muted/50 cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold tabular-nums">
            {anioData.anio}{"° Anio"}
          </span>
          <div className="flex items-center gap-1.5">
            {aprobadas > 0 && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 text-xs"
              >
                {aprobadas} apr.
              </Badge>
            )}
            {regulares > 0 && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-xs"
              >
                {regulares} reg.
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {aprobadas}/{anioData.materias.length}
            </Badge>
          </div>
        </div>
        <ChevronDown
          className={`size-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        {materiasFiltradas.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay materias que coincidan con el filtro seleccionado.
          </p>
        ) : (
            <div className="mt-2">
              {!isMobile ? (
                  <div className="rounded-lg border bg-card overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableHead className="w-24">Codigo</TableHead>
                          <TableHead>Materia</TableHead>
                          <TableHead className="w-16">Tipo</TableHead>
                          <TableHead className="w-12 text-right">Hs</TableHead>
                          <TableHead className="w-48">Correlativas</TableHead>
                          <TableHead className="w-36">Estado</TableHead>
                          <TableHead className="w-20">Nota</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materiasFiltradas.map((m) => (
                            <MateriaRow
                                key={m.codigo}
                                materia={m}
                                onScrollToMateria={onScrollToMateria}
                            />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
              ) : (
                  <div className="flex flex-col gap-3">
                    {materiasFiltradas.map((m) => (
                        <MateriaCard
                            key={m.codigo}
                            materia={m}
                            onScrollToMateria={onScrollToMateria}
                        />
                    ))}
                  </div>
              )}
            </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
