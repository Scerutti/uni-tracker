"use client";

import { useCallback } from "react";
import { useCarreraStore } from "@/lib/store";
import {
  getEstado,
  getNota,
  getCorrelativasFaltantes,
  puedeInteractuar,
} from "@/lib/carrera-utils";
import { getMateriaByCode } from "@/lib/plan-data";
import type { EstadoMateria, Materia } from "@/lib/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Clock, Lock } from "lucide-react";

interface MateriaRowProps {
  materia: Materia;
  onScrollToMateria?: (codigo: string) => void;
}

export function MateriaRow({ materia, onScrollToMateria }: MateriaRowProps) {
  const progreso = useCarreraStore((s) => s.progreso);
  const setEstado = useCarreraStore((s) => s.setEstado);
  const setNota = useCarreraStore((s) => s.setNota);

  const estado = getEstado(materia.codigo, progreso);
  const nota = getNota(materia.codigo, progreso);
  const habilitada = puedeInteractuar(materia, progreso);
  const faltantes = getCorrelativasFaltantes(materia, progreso);

  const handleEstadoChange = useCallback(
    (value: string) => {
      setEstado(materia.codigo, value as EstadoMateria);
    },
    [materia.codigo, setEstado]
  );

  const handleNotaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const tipoLabel =
    materia.tipo === "Anual"
      ? "Anual"
      : materia.tipo === "Cuatrim C1"
      ? "C1"
      : "C2";

  const rowBg =
    estado === "APROBADA"
      ? "bg-emerald-50/60 dark:bg-emerald-950/30"
      : estado === "REGULAR"
      ? "bg-amber-50/60 dark:bg-amber-950/30"
      : !habilitada
      ? "opacity-45"
      : "";

  return (
    <TableRow
      id={`materia-${materia.codigo}`}
      className={`transition-all duration-200 ${rowBg}`}
    >
      {/* Codigo */}
      <TableCell className="font-mono text-xs text-muted-foreground">
        {materia.codigo}
      </TableCell>

      {/* Nombre */}
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium leading-tight">
            {materia.nombre}
          </span>
          {/* Regla especial inline hint */}
          {materia.codigo === "340321" && (
            <span className="text-xs text-muted-foreground italic">
              Requiere todas las materias de 2do.
            </span>
          )}
          {materia.codigo === "340533" && (
            <span className="text-xs text-muted-foreground italic">
              Requiere IA, Seguridad y Gestion de Proy.
            </span>
          )}
        </div>
      </TableCell>

      {/* Tipo */}
      <TableCell>
        <Badge variant="outline" className="text-xs px-1.5 py-0 font-normal">
          {tipoLabel}
        </Badge>
      </TableCell>

      {/* Horas */}
      <TableCell className="text-xs text-muted-foreground text-right tabular-nums">
        {materia.cargaHoraria}
      </TableCell>

      {/* Correlativas */}
      <TableCell>
        {materia.correlativas.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {materia.correlativas.map((cod) => {
              const corr = getMateriaByCode(cod);
              const corrEstado = getEstado(cod, progreso);
              const isFaltante = faltantes.includes(cod);

              return (
                <Tooltip key={cod}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onScrollToMateria?.(cod)}
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium transition-colors cursor-pointer
                        ${
                          corrEstado === "APROBADA"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                            : corrEstado === "REGULAR"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                            : isFaltante
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {corrEstado === "APROBADA" ? (
                        <CheckCircle2 className="size-3" />
                      ) : corrEstado === "REGULAR" ? (
                        <Clock className="size-3" />
                      ) : (
                        <Lock className="size-3" />
                      )}
                      {cod.slice(-3)}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-medium">{corr?.nombre ?? "Desconocida"}</p>
                    <p className="text-xs opacity-80">
                      {corrEstado === "APROBADA"
                        ? "Aprobada"
                        : corrEstado === "REGULAR"
                        ? "Regular"
                        : "No cursada"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </TableCell>

      {/* Estado */}
      <TableCell>
        <Select
          value={estado}
          onValueChange={handleEstadoChange}
          disabled={!habilitada}
        >
          <SelectTrigger className="h-8 w-32 text-xs" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NO_CURSADA">No cursada</SelectItem>
            <SelectItem value="REGULAR">Regular</SelectItem>
            <SelectItem value="APROBADA">Aprobada</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      {/* Nota */}
      <TableCell>
        {estado !== "NO_CURSADA" ? (
          <Input
            type="number"
            placeholder="-"
            min={0}
            max={10}
            step={1}
            value={nota ?? ""}
            onChange={handleNotaChange}
            className="h-8 w-16 text-xs text-center tabular-nums"
          />
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}
