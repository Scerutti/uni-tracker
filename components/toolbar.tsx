"use client";

import { useCallback, useRef } from "react";
import { useCarreraStore } from "@/lib/store";
import { getAllMaterias } from "@/lib/plan-data";
import type { EstadoMateria, FiltroActivo, ProgresoMap } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Download, Upload, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const VALID_ESTADOS: EstadoMateria[] = ["NO_CURSADA", "REGULAR", "APROBADA"];
const codigosValidos = new Set(getAllMaterias().map((m) => m.codigo));

/**
 * Valida y sanitiza un JSON importado. Devuelve solo las entradas
 * con codigos que existen en el plan de estudios y estados validos.
 */
function validarImport(data: unknown): ProgresoMap | null {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return null;
  }

  const resultado: ProgresoMap = {};
  let entradas = 0;
  let descartadas = 0;

  for (const [codigo, valor] of Object.entries(data as Record<string, unknown>)) {
    if (!codigosValidos.has(codigo)) {
      descartadas++;
      continue;
    }

    if (typeof valor !== "object" || valor === null) {
      descartadas++;
      continue;
    }

    const entry = valor as Record<string, unknown>;
    const estado = entry.estado;

    if (typeof estado !== "string" || !VALID_ESTADOS.includes(estado as EstadoMateria)) {
      descartadas++;
      continue;
    }

    let nota: number | null = null;
    if (entry.nota !== null && entry.nota !== undefined) {
      const num = Number(entry.nota);
      if (!isNaN(num) && num >= 0 && num <= 10) {
        nota = num;
      }
    }

    resultado[codigo] = {
      estado: estado as EstadoMateria,
      nota,
    };
    entradas++;
  }

  if (entradas === 0 && descartadas > 0) return null;

  return resultado;
}

export function Toolbar() {
  const filtro = useCarreraStore((s) => s.filtro);
  const setFiltro = useCarreraStore((s) => s.setFiltro);
  const progreso = useCarreraStore((s) => s.progreso);
  const importarProgreso = useCarreraStore((s) => s.importarProgreso);
  const resetProgreso = useCarreraStore((s) => s.resetProgreso);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(progreso, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progreso-carrera-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const count = Object.keys(progreso).length;
    toast.success("Progreso exportado", {
      description: `Se exportaron ${count} materia${count !== 1 ? "s" : ""} con progreso.`,
    });
  }, [progreso]);

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const raw = JSON.parse(ev.target?.result as string);
          const validado = validarImport(raw);

          if (!validado) {
            toast.error("Error al importar", {
              description:
                "El archivo no tiene un formato valido. Asegurate de usar un JSON exportado por esta aplicacion.",
            });
            return;
          }

          importarProgreso(validado);

          const count = Object.values(validado).filter(
            (v) => v.estado !== "NO_CURSADA"
          ).length;
          toast.success("Progreso importado", {
            description: `Se cargaron ${count} materia${count !== 1 ? "s" : ""} con avance. La UI se actualizo automaticamente.`,
          });
        } catch {
          toast.error("Error al importar", {
            description:
              "No se pudo leer el archivo. Verifica que sea un JSON valido.",
          });
        }
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [importarProgreso]
  );

  const handleReset = useCallback(() => {
    resetProgreso();
    toast.info("Progreso reiniciado", {
      description: "Todas las materias fueron marcadas como no cursadas.",
    });
  }, [resetProgreso]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Filtrar:
        </label>
        <Select
          value={filtro}
          onValueChange={(v) => setFiltro(v as FiltroActivo)}
        >
          <SelectTrigger className="h-9 w-48" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las materias</SelectItem>
            <SelectItem value="aprobadas">Solo aprobadas</SelectItem>
            <SelectItem value="habilitadas">Solo habilitadas</SelectItem>
            <SelectItem value="pendientes">Solo pendientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="size-4" />
          <span className="hidden sm:inline">Exportar JSON</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4" />
          <span className="hidden sm:inline">Importar JSON</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
          aria-label="Importar archivo JSON de progreso"
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <RotateCcw className="size-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reiniciar progreso</AlertDialogTitle>
              <AlertDialogDescription>
                Esto eliminara todo tu progreso guardado. Esta accion no se
                puede deshacer. Te recomendamos exportar tu progreso antes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>
                Reiniciar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
