import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppFooter } from "@/components/app-footer";
import { ESTADO_CONFIG } from "@/lib/estado-config";
import { PEDIR_CARRERA_MAILTO } from "@/lib/links";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Página no encontrada - Mi Carrera",
};

/**
 * 404 de toda la app (también para `/carrera/<id>` de una carrera que no existe).
 * Muestra la página como una materia bloqueada del plan.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-end px-4 py-3 sm:px-6 lg:px-8">
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
        <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Esta página no está en el plan
            </h1>
            <p className="text-pretty text-sm text-muted-foreground">
              Revisamos todos los años y no aparece. Puede que el link esté mal o que la carrera no esté cargada.
            </p>
          </div>

          <Card className="w-full gap-3 p-4 text-left opacity-80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold leading-tight">Página no encontrada</p>
                <p className="text-xs text-muted-foreground">404 • Anual • 0 hs</p>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
                  ESTADO_CONFIG.NO_CURSADA.chip
                )}
              >
                <Lock className="size-3" />
                Bloqueada
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Correlativas: una dirección que exista.</p>
          </Card>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
                Volver al inicio
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href={PEDIR_CARRERA_MAILTO}>
                <MessageSquarePlus className="size-4" />
                Pedir una carrera
              </a>
            </Button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
