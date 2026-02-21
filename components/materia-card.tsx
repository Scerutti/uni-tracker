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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Lock } from "lucide-react";

interface MateriaCardProps {
    materia: Materia;
    onScrollToMateria?: (codigo: string) => void;
}

export function MateriaCard({ materia, onScrollToMateria }: MateriaCardProps) {
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

    return (
        <Card className="p-4 space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
                <div>
                    <p className="text-sm font-semibold leading-tight">
                        {materia.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {materia.codigo} • {tipoLabel} • {materia.cargaHoraria} hs
                    </p>
                </div>

                {estado === "APROBADA" && (
                    <Badge className="bg-emerald-100 text-emerald-700">
                        Aprobada
                    </Badge>
                )}
                {estado === "REGULAR" && (
                    <Badge className="bg-amber-100 text-amber-700">
                        Regular
                    </Badge>
                )}
            </div>

            {/* Correlativas */}
            {materia.correlativas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {materia.correlativas.map((cod) => {
                        const corrEstado = getEstado(cod, progreso);
                        const isFaltante = faltantes.includes(cod);

                        return (
                            <button
                                key={cod}
                                onClick={() => onScrollToMateria?.(cod)}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded
                  ${
                                    corrEstado === "APROBADA"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : corrEstado === "REGULAR"
                                            ? "bg-amber-100 text-amber-700"
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
                        );
                    })}
                </div>
            )}

            {/* Estado + Nota */}
            <div className="flex gap-2 items-center">
                <Select
                    value={estado}
                    onValueChange={handleEstadoChange}
                    disabled={!habilitada}
                >
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="NO_CURSADA">No cursada</SelectItem>
                        <SelectItem value="REGULAR">Regular</SelectItem>
                        <SelectItem value="APROBADA">Aprobada</SelectItem>
                    </SelectContent>
                </Select>

                {estado !== "NO_CURSADA" && (
                    <Input
                        type="number"
                        min={0}
                        max={10}
                        step={1}
                        value={nota ?? ""}
                        onChange={handleNotaChange}
                        className="h-9 w-20 text-xs text-center"
                    />
                )}
            </div>
        </Card>
    );
}