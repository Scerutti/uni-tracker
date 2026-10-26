"use client";

import { useProgreso, useProgresoStore } from "@/lib/store";
import { calcularEstadisticas, calcularPromedio } from "@/lib/carrera-utils";
import { useCarrera } from "@/components/carrera-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationModal } from "@/components/graduation-modal";
import { ESTADO_CONFIG } from "@/lib/estado-config";
import type { EstadoMateria } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookOpen, GraduationCap, Target, FileCheck, TrendingUp } from "lucide-react";

const formatoHoras = new Intl.NumberFormat("es-AR");

export function Dashboard() {
  const carrera = useCarrera();
  const progreso = useProgreso(carrera.id);
  const celebracion = useProgresoStore((s) => s.celebracion);
  const cerrarCelebracion = useProgresoStore((s) => s.cerrarCelebracion);
  const stats = calcularEstadisticas(carrera, progreso);
  const promedio = calcularPromedio(carrera, progreso);

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar principal + Promedio */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-none bg-primary/5 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="size-5 text-primary" />
              Avance de Carrera
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold tabular-nums text-primary">
                {stats.porcentaje}%
              </span>
              <span className="text-sm text-muted-foreground">
                {stats.aprobadas} de {stats.total} materias aprobadas
              </span>
            </div>
            <Progress value={stats.porcentaje} className="h-3" />
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatoHoras.format(stats.horasAprobadas)} de{" "}
              {formatoHoras.format(stats.horasTotales)} hs aprobadas ({stats.porcentajeHoras}%)
            </span>
          </CardContent>
        </Card>

        <Card className="border-none bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-5 text-primary" />
              Promedio General
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {promedio !== null ? (
              <>
                <span className="text-4xl font-bold tabular-nums text-primary">
                  {promedio.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  de finales aprobados
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground pt-2">
                Cargá las notas de tus finales para calcular el promedio
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <EstadoStatCard estado="APROBADA" label="Aprobadas" value={stats.aprobadas} />
        <EstadoStatCard estado="REGULAR" label="Regulares" value={stats.regulares} />
        <EstadoStatCard estado="EN_CURSO" label="En curso" value={stats.enCurso} />
        <StatCard
          icon={<BookOpen className="size-4" />}
          label="Pendientes"
          value={stats.pendientes}
          iconClassName="bg-muted text-muted-foreground"
        />
        <StatCard
          icon={<Target className="size-4" />}
          label="Habilitadas cursar"
          value={stats.habilitadasCursar}
          iconClassName="bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400"
        />
        <StatCard
          icon={<FileCheck className="size-4" />}
          label="Habilitadas rendir"
          value={stats.habilitadasRendir}
          iconClassName="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
        />
      </div>
      <GraduationModal carrera={carrera.nombre} frase={celebracion} onClose={cerrarCelebracion} />
    </div>
  );
}

/**
 * Tarjeta de un estado de materia, con el ícono y los colores de `ESTADO_CONFIG`.
 */
function EstadoStatCard({ estado, label, value }: { estado: EstadoMateria; label: string; value: number }) {
  const { icono: Icono, chip } = ESTADO_CONFIG[estado];
  return <StatCard icon={<Icono className="size-4" />} label={label} value={value} iconClassName={chip} />;
}

function StatCard({
  icon,
  label,
  value,
  iconClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconClassName: string;
}) {
  return (
    <Card className="gap-3 py-4 border-none shadow-none">
      <CardContent className="flex items-center gap-3 px-4">
        <div className={cn("flex items-center justify-center rounded-lg p-2", iconClassName)}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tabular-nums">{value}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
