"use client";

import { useMateria } from "@/hooks/use-materia";
import { ESTADO_CONFIG, TIPO_LABEL } from "@/lib/estado-config";
import type { Materia } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AvisoIncumplidas,
  Correlativas,
  EstadoSelect,
  NotaInput,
} from "@/components/materia-shared";

interface MateriaRowProps {
  materia: Materia;
  onScrollToMateria?: (codigo: string) => void;
}

export function MateriaRow({ materia, onScrollToMateria }: MateriaRowProps) {
  const { progreso, estado, nota, habilitada, incumplidas, handleEstadoChange, handleNotaChange } =
    useMateria(materia);

  const rowBg = estado === "NO_CURSADA" && !habilitada ? "opacity-45" : ESTADO_CONFIG[estado].fila;

  return (
    <TableRow
      id={`materia-${materia.codigo}`}
      className={cn("transition-all duration-200", rowBg)}
    >
      {/* Codigo */}
      <TableCell className="font-mono text-xs text-muted-foreground">
        {materia.codigo}
      </TableCell>

      {/* Nombre */}
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 text-sm font-medium leading-tight">
            {materia.nombre}
            <AvisoIncumplidas codigos={incumplidas} />
          </span>
          {materia.aclaracion && (
            <span className="text-xs text-muted-foreground italic">
              {materia.aclaracion}
            </span>
          )}
        </div>
      </TableCell>

      {/* Tipo */}
      <TableCell>
        <Badge variant="outline" className="text-xs px-1.5 py-0 font-normal">
          {TIPO_LABEL[materia.tipo]}
        </Badge>
      </TableCell>

      {/* Horas */}
      <TableCell className="text-xs text-muted-foreground text-right tabular-nums">
        {materia.cargaHoraria}
      </TableCell>

      {/* Correlativas */}
      <TableCell>
        {materia.correlativas.length > 0 ? (
          <Correlativas
            materia={materia}
            progreso={progreso}
            onScrollToMateria={onScrollToMateria}
          />
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </TableCell>

      {/* Estado */}
      <TableCell>
        <EstadoSelect
          value={estado}
          onValueChange={handleEstadoChange}
          disabled={!habilitada}
          size="sm"
          className="h-8 w-32"
        />
      </TableCell>

      {/* Nota */}
      <TableCell>
        {estado === "REGULAR" || estado === "APROBADA" ? (
          <NotaInput
            estado={estado}
            nota={nota}
            onChange={handleNotaChange}
            className="h-8 w-16"
          />
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}
