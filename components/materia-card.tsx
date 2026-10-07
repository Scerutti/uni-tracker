"use client";

import { TriangleAlert } from "lucide-react";
import { useMateria } from "@/hooks/use-materia";
import { ESTADO_CONFIG, TIPO_LABEL } from "@/lib/estado-config";
import type { Materia } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Correlativas,
    EstadoSelect,
    NotaInput,
    nombresDeMaterias,
} from "@/components/materia-shared";

interface MateriaCardProps {
    materia: Materia;
    onScrollToMateria?: (codigo: string) => void;
}

export function MateriaCard({ materia, onScrollToMateria }: MateriaCardProps) {
    const { progreso, estado, nota, habilitada, incumplidas, handleEstadoChange, handleNotaChange } =
        useMateria(materia);
    const config = ESTADO_CONFIG[estado];

    return (
        <Card
            id={`materia-${materia.codigo}`}
            className={cn(
                "p-4 gap-3 transition-all duration-200",
                estado === "NO_CURSADA" && !habilitada ? "opacity-45" : config.fila
            )}
        >
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
                <div>
                    <p className="text-sm font-semibold leading-tight">
                        {materia.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {materia.codigo} • {TIPO_LABEL[materia.tipo]} • {materia.cargaHoraria} hs
                    </p>
                    {materia.aclaracion && (
                        <p className="text-xs text-muted-foreground italic">
                            {materia.aclaracion}
                        </p>
                    )}
                </div>

                {estado !== "NO_CURSADA" && (
                    <Badge variant="secondary" className={cn("border-transparent", config.chip)}>
                        {config.label}
                    </Badge>
                )}
            </div>

            {incumplidas.length > 0 && (
                <p className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                    <TriangleAlert className="size-3.5 shrink-0 mt-px" />
                    <span>Correlativas no cumplidas: {nombresDeMaterias(incumplidas)}</span>
                </p>
            )}

            <Correlativas
                materia={materia}
                progreso={progreso}
                onScrollToMateria={onScrollToMateria}
            />

            {/* Estado + Nota */}
            <div className="flex gap-2 items-center">
                <EstadoSelect
                    value={estado}
                    onValueChange={handleEstadoChange}
                    disabled={!habilitada}
                    className="flex-1"
                />

                {(estado === "REGULAR" || estado === "APROBADA") && (
                    <NotaInput
                        estado={estado}
                        nota={nota}
                        onChange={handleNotaChange}
                        className="h-9 w-20"
                    />
                )}
            </div>
        </Card>
    );
}
