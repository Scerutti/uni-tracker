"use client";

import type { ChangeEvent } from "react";
import { CheckCircle2, Lock, TriangleAlert } from "lucide-react";
import { getEstado, NOTA_MINIMA_APROBACION, notaInvalida, requisitoCumplido } from "@/lib/carrera-utils";
import { ESTADO_CONFIG, ESTADOS } from "@/lib/estado-config";
import { getMateriaByCode } from "@/lib/plan-data";
import type { EstadoMateria, Materia, ProgresoMap } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CHIP_BASE =
  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium transition-colors";

export function nombresDeMaterias(codigos: string[]): string {
  return codigos.map((c) => getMateriaByCode(c)?.nombre ?? c).join(", ");
}

interface CorrelativasProps {
  materia: Materia;
  progreso: ProgresoMap;
  onScrollToMateria?: (codigo: string) => void;
}

/**
 * Chips con las correlativas para cursar y su estado actual.
 */
export function Correlativas({ materia, progreso, onScrollToMateria }: CorrelativasProps) {
  if (materia.correlativas.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {materia.correlativas.map((r) =>
        typeof r === "string" ? (
          <ChipMateria
            key={r}
            codigo={r}
            progreso={progreso}
            onScrollToMateria={onScrollToMateria}
          />
        ) : (
          <ChipAnio key={`anio-${r.anio}`} materia={materia} anio={r.anio} progreso={progreso} />
        )
      )}
    </div>
  );
}

function ChipMateria({
  codigo,
  progreso,
  onScrollToMateria,
}: {
  codigo: string;
  progreso: ProgresoMap;
  onScrollToMateria?: (codigo: string) => void;
}) {
  const { label, chip, icono: Icono } = ESTADO_CONFIG[getEstado(codigo, progreso)];
  const nombre = getMateriaByCode(codigo)?.nombre ?? "Desconocida";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onScrollToMateria?.(codigo)}
          className={cn(CHIP_BASE, "cursor-pointer", chip)}
          aria-label={`${nombre}: ${label}`}
        >
          <Icono className="size-3" />
          {codigo.slice(-3)}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="font-medium">{nombre}</p>
        <p className="text-xs opacity-80">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ChipAnio({ materia, anio, progreso }: { materia: Materia; anio: number; progreso: ProgresoMap }) {
  const cumplido = requisitoCumplido(materia, { anio }, progreso);
  const Icono = cumplido ? CheckCircle2 : Lock;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className={cn(CHIP_BASE, cumplido ? ESTADO_CONFIG.APROBADA.chip : ESTADO_CONFIG.NO_CURSADA.chip)}
        >
          <Icono className="size-3" />
          {anio}° año
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="font-medium">{anio}° año completo</p>
        <p className="text-xs opacity-80">
          {cumplido ? "Todas regulares o aprobadas" : "Faltan materias por regularizar"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Ícono de advertencia cuando el estado de la materia no acompaña a sus correlativas.
 */
export function AvisoIncumplidas({ codigos }: { codigos: string[] }) {
  if (codigos.length === 0) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className="inline-flex shrink-0 text-amber-600 dark:text-amber-400"
          aria-label="Correlativas no cumplidas"
        >
          <TriangleAlert className="size-4" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="font-medium">Correlativas no cumplidas</p>
        <p className="text-xs opacity-80">{nombresDeMaterias(codigos)}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function EstadoSelect({
  value,
  onValueChange,
  disabled,
  size,
  className,
}: {
  value: EstadoMateria;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn("text-xs", className)} size={size} aria-label="Estado">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ESTADOS.map((e) => (
          <SelectItem key={e} value={e}>
            {ESTADO_CONFIG[e].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function NotaInput({
  estado,
  nota,
  onChange,
  className,
}: {
  estado: EstadoMateria;
  nota: number | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  const invalida = notaInvalida(estado, nota);

  return (
    <Input
      type="number"
      placeholder="-"
      min={0}
      max={10}
      step={1}
      value={nota ?? ""}
      onChange={onChange}
      aria-label="Nota"
      aria-invalid={invalida || undefined}
      title={invalida ? `La nota mínima para aprobar es ${NOTA_MINIMA_APROBACION}` : undefined}
      className={cn("text-xs text-center tabular-nums", className)}
    />
  );
}
