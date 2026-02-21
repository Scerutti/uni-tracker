"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, ArrowRight, Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppFooter } from "@/components/app-footer";

const carreras = [
  {
    slug: "lic-sistemas",
    nombre: "Licenciatura en Sistemas de Informacion y Tecnologias de la Informacion",
    estado: "disponible" as const,
    href: "/carrera",
  },
  {
    slug: "wip",
    nombre: "Mas carreras proximamente...",
    estado: "wip" as const,
    href: "#",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal top bar */}
      <header className="flex items-center justify-end px-4 py-3 sm:px-6 lg:px-8">
        <ThemeToggle />
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
        <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
          {/* Logo */}
          <div className="relative size-24 overflow-hidden rounded-2xl border shadow-sm">
            <Image
              src="/images/uader-logo.png"
              alt="Logo UADER"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Seguimiento de Plan de Carrera
            </h1>
            <p className="text-pretty text-base text-muted-foreground">
              Universidad Autonoma de Entre Rios
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground">
            Selecciona tu carrera para comenzar a registrar tu avance.
          </p>

          {/* Career cards */}
          <div className="flex w-full flex-col gap-3">
            {carreras.map((c) =>
              c.estado === "disponible" ? (
                <Link key={c.slug} href={c.href}>
                  <Card className="group cursor-pointer border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
                    <CardContent className="flex items-center gap-4 px-5 py-4">
                      <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2.5">
                        <GraduationCap className="size-5 text-primary" />
                      </div>
                      <div className="flex flex-1 flex-col items-start gap-0.5">
                        <span className="text-sm font-semibold leading-tight text-foreground">
                          {c.nombre}
                        </span>
                        <Badge
                          variant="secondary"
                          className="mt-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 text-xs"
                        >
                          Disponible
                        </Badge>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card
                  key={c.slug}
                  className="cursor-not-allowed border-dashed opacity-50"
                >
                  <CardContent className="flex items-center gap-4 px-5 py-4">
                    <div className="flex items-center justify-center rounded-lg bg-muted p-2.5">
                      <Construction className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-1 flex-col items-start gap-0.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        {c.nombre}
                      </span>
                      <Badge variant="outline" className="mt-1 text-xs">
                        En desarrollo
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
