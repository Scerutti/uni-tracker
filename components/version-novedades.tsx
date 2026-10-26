"use client";

import { Sparkles } from "lucide-react";
import { NOVEDADES } from "@/lib/novedades";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CHANGELOG_URL = "https://github.com/Scerutti/uni-tracker/blob/main/CHANGELOG.md";

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Versión de la app en el footer. Al tocarla abre un resumen corto de qué cambió en esa versión.
 */
export function VersionNovedades({ version }: { version: string }) {
  const novedad = NOVEDADES.find((n) => n.version === version);

  return (
    <Dialog>
      <DialogTrigger
        className="cursor-pointer font-mono text-xs transition-colors hover:text-foreground"
        title="Qué hay de nuevo"
      >
        v{version}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col">
            <DialogTitle>Novedades de la v{version}</DialogTitle>
            {novedad && (
              <DialogDescription>{formatoFecha.format(new Date(`${novedad.fecha}T00:00:00Z`))}</DialogDescription>
            )}
          </div>
        </div>

        {novedad ? (
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm">
            {novedad.cambios.map((cambio) => (
              <li key={cambio}>{cambio}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Todavía no hay un resumen para esta versión.</p>
        )}

        <a
          href={CHANGELOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Ver todos los cambios
        </a>
      </DialogContent>
    </Dialog>
  );
}
