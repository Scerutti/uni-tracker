"use client";

import { useCarreraStore } from "@/lib/store";
import { calcularEstadisticas, calcularPromedio } from "@/lib/carrera-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationModal } from "@/components/graduation-modal";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Target,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import {useEffect, useRef, useState} from "react";

export function Dashboard() {
  const progreso = useCarreraStore((s) => s.progreso);
  const stats = calcularEstadisticas(progreso);
  const promedio = calcularPromedio(progreso);
  const [showModal, setShowModal] = useState(false);
  const prevPendientes = useRef(stats.pendientes);

  useEffect(() => {
    if (prevPendientes.current > 0 && stats.pendientes === 0) {
      setShowModal(true);
    }

    prevPendientes.current = stats.pendientes;
  }, [stats.pendientes]);

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
                  sobre notas cargadas
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground pt-2">
                Carga notas para calcular el promedio
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          icon={<CheckCircle2 className="size-4" />}
          label="Aprobadas"
          value={stats.aprobadas}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-50 dark:bg-emerald-950/40"
        />
        <StatCard
          icon={<Clock className="size-4" />}
          label="Regulares"
          value={stats.regulares}
          color="text-amber-600 dark:text-amber-400"
          bg="bg-amber-50 dark:bg-amber-950/40"
        />
        <StatCard
          icon={<BookOpen className="size-4" />}
          label="Pendientes"
          value={stats.pendientes}
          color="text-muted-foreground"
          bg="bg-muted"
        />
        <StatCard
          icon={<Target className="size-4" />}
          label="Habilitadas cursar"
          value={stats.habilitadasCursar}
          color="text-sky-600 dark:text-sky-400"
          bg="bg-sky-50 dark:bg-sky-950/40"
        />
        <StatCard
          icon={<FileCheck className="size-4" />}
          label="Habilitadas rendir"
          value={stats.habilitadasRendir}
          color="text-indigo-600 dark:text-indigo-400"
          bg="bg-indigo-50 dark:bg-indigo-950/40"
        />
      </div>
      <GraduationModal
          open={showModal}
          onClose={() => setShowModal(false)}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <Card className="gap-3 py-4 border-none shadow-none">
      <CardContent className="flex items-center gap-3 px-4">
        <div className={`flex items-center justify-center rounded-lg p-2 ${bg} ${color}`}>
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
