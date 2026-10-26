import Image from "next/image";
import Link from "next/link";
import { GraduationCap, ArrowRight, MessageSquarePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppFooter } from "@/components/app-footer";
import { getCarrerasPorUniversidad } from "@/lib/carreras";

const PEDIR_CARRERA_URL =
  "https://github.com/Scerutti/uni-tracker/issues/new?template=nueva-carrera.yml";

export default function HomePage() {
  const universidades = getCarrerasPorUniversidad();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-end px-4 py-3 sm:px-6 lg:px-8">
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
        <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Seguimiento de Plan de Carrera
            </h1>
            <p className="text-sm text-muted-foreground">
              Seleccioná tu carrera para comenzar a registrar tu avance.
            </p>
          </div>

          {universidades.map(({ universidad, carreras }) => (
            <section key={universidad.id} className="flex w-full flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative size-12 overflow-hidden rounded-xl border shadow-sm">
                  <Image
                    src={universidad.logo}
                    alt={`Logo ${universidad.sigla}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <h2 className="text-pretty text-base font-medium text-muted-foreground">
                  {universidad.nombre}
                </h2>
              </div>

              <div className="flex w-full flex-col gap-3">
                {carreras.map((c) => (
                  <Link key={c.id} href={`/carrera/${c.id}`}>
                    <Card className="group cursor-pointer border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
                      <CardContent className="flex items-center gap-4 px-5 py-4">
                        <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2.5">
                          <GraduationCap className="size-5 text-primary" />
                        </div>
                        <span className="flex-1 text-left text-sm font-semibold leading-tight text-foreground">
                          {c.nombre}
                        </span>
                        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <a href={PEDIR_CARRERA_URL} target="_blank" rel="noopener noreferrer" className="w-full">
            <Card className="border-dashed transition-colors hover:border-primary">
              <CardContent className="flex items-center gap-4 px-5 py-4">
                <div className="flex items-center justify-center rounded-lg bg-muted p-2.5">
                  <MessageSquarePlus className="size-5 text-muted-foreground" />
                </div>
                <div className="flex flex-1 flex-col items-start gap-0.5 text-left">
                  <span className="text-sm font-medium">¿No está tu carrera?</span>
                  <span className="text-xs text-muted-foreground">
                    Pedila en GitHub con el link al plan de estudios.
                  </span>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
