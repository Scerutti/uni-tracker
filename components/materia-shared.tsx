"use client";

import type { ChangeEvent, ReactNode } from "react";
import { CheckCircle2, Lock, TriangleAlert } from "lucide-react";
import { getEstado, NOTA_MAXIMA, notaInvalida, requisitoCumplido, tieneCorrelativas } from "@/lib/carrera-utils";
import { ESTADO_CONFIG } from "@/lib/estado-config";
import { abreviarCodigo, getMateriaByCode } from "@/lib/plan";
import { type Carrera, type EstadoMateria, type Materia, type ProgresoMap, type Requisito, ESTADOS } from "@/lib/types";
import { useCarrera } from "@/components/carrera-provider";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CHIP_BASE = "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium transition-colors";

export function nombresDeMaterias(carrera: Carrera, codigos: string[]): string {
  return codigos.map((c) => getMateriaByCode(carrera, c)?.nombre ?? c).join(", ");
}

interface CorrelativasProps {
  materia: Materia;
  progreso: ProgresoMap;
  onScrollToMateria?: (codigo: string) => void;
}

type Para = "cursar" | "rendir";

/**
 * Chips con las correlativas y su estado actual. Si la materia tiene correlativas
 * distintas para rendir el final, muestra las dos listas con su etiqueta.
 */
export function Correlativas({ materia, progreso, onScrollToMateria }: CorrelativasProps) {
  const rendir = materia.correlativasRendir;
  if (!tieneCorrelativas(materia)) return null;

  if (!rendir) {
    return (
      <ListaRequisitos
        materia={materia}
        requisitos={materia.correlativas}
        para="cursar"
        progreso={progreso}
        onScrollToMateria={onScrollToMateria}
      />
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {materia.correlativas.length > 0 && (
        <FilaRequisitos etiqueta="Cursar">
          <ListaRequisitos
            materia={materia}
            requisitos={materia.correlativas}
            para="cursar"
            progreso={progreso}
            onScrollToMateria={onScrollToMateria}
          />
        </FilaRequisitos>
      )}
      {rendir.length > 0 && (
        <FilaRequisitos etiqueta="Rendir">
          <ListaRequisitos
            materia={materia}
            requisitos={rendir}
            para="rendir"
            progreso={progreso}
            onScrollToMateria={onScrollToMateria}
          />
        </FilaRequisitos>
      )}
    </div>
  );
}

function FilaRequisitos({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-11 shrink-0 text-xs text-muted-foreground">{etiqueta}</span>
      {children}
    </div>
  );
}

function ListaRequisitos({
  materia,
  requisitos,
  para,
  progreso,
  onScrollToMateria,
}: CorrelativasProps & { requisitos: Requisito[]; para: Para }) {
  return (
    <div className="flex flex-wrap gap-1">
      {requisitos.map((r) =>
        typeof r === "string" ? (
          <ChipMateria key={r} codigo={r} progreso={progreso} onScrollToMateria={onScrollToMateria} />
        ) : (
          <ChipAnio key={`anio-${r.anio}`} materia={materia} anio={r.anio} para={para} progreso={progreso} />
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
  const carrera = useCarrera();
  const { label, chip, icono: Icono } = ESTADO_CONFIG[getEstado(codigo, progreso)];
  const nombre = getMateriaByCode(carrera, codigo)?.nombre ?? "Desconocida";

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
          {abreviarCodigo(carrera, codigo)}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="font-medium">{nombre}</p>
        <p className="text-xs opacity-80">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ChipAnio({
  materia,
  anio,
  para,
  progreso,
}: {
  materia: Materia;
  anio: number;
  para: Para;
  progreso: ProgresoMap;
}) {
  const carrera = useCarrera();
  const cumplido = requisitoCumplido(carrera, materia, { anio }, progreso, para);
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
          {para === "cursar"
            ? cumplido
              ? "Todas regulares o aprobadas"
              : "Faltan materias por regularizar"
            : cumplido
              ? "Todas aprobadas"
              : "Faltan materias por aprobar"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Ícono de advertencia cuando el estado de la materia no acompaña a sus correlativas.
 */
export function AvisoIncumplidas({ codigos }: { codigos: string[] }) {
  const carrera = useCarrera();
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
        <p className="text-xs opacity-80">{nombresDeMaterias(carrera, codigos)}</p>
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
  const carrera = useCarrera();
  const invalida = notaInvalida(carrera, estado, nota);

  return (
    <Input
      type="number"
      placeholder="-"
      min={0}
      max={NOTA_MAXIMA}
      step={1}
      value={nota ?? ""}
      onChange={onChange}
      aria-label="Nota"
      aria-invalid={invalida || undefined}
      title={invalida ? `La nota mínima para aprobar es ${carrera.notaMinima}` : undefined}
      className={cn("text-xs text-center tabular-nums", className)}
    />
  );
}
