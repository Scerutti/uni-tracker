"use client";

import { useCallback, useRef } from "react";
import { useCarreraStore } from "@/lib/store";
import { crearArchivoProgreso, leerArchivoProgreso } from "@/lib/progreso-io";
import type { FiltroActivo } from "@/lib/types";
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

export function Toolbar() {
  const filtro = useCarreraStore((s) => s.filtro);
  const setFiltro = useCarreraStore((s) => s.setFiltro);
  const progreso = useCarreraStore((s) => s.progreso);
  const importarProgreso = useCarreraStore((s) => s.importarProgreso);
  const resetProgreso = useCarreraStore((s) => s.resetProgreso);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(crearArchivoProgreso(progreso), null, 2);
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
          const resultado = leerArchivoProgreso(raw);

          if (!resultado.ok) {
            toast.error("Error al importar", { description: resultado.error });
            return;
          }

          importarProgreso(resultado.progreso);

          const count = Object.values(resultado.progreso).filter(
            (v) => v.estado !== "NO_CURSADA"
          ).length;
          toast.success("Progreso importado", {
            description: `Se cargaron ${count} materia${count !== 1 ? "s" : ""} con avance.`,
          });
        } catch {
          toast.error("Error al importar", {
            description:
              "No se pudo leer el archivo. Verificá que sea un JSON válido.",
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
                Esto eliminará todo tu progreso guardado. Esta acción no se
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
