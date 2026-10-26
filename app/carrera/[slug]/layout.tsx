import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { CarreraProvider } from "@/components/carrera-provider";
import { getCarrera } from "@/lib/carreras";

export default async function CarreraLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carrera = getCarrera(slug);
  if (!carrera) notFound();

  return (
    <CarreraProvider carreraId={carrera.id}>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader
          logo={carrera.universidad.logo}
          universidad={carrera.universidad.sigla}
          carrera={carrera.nombreCorto}
        />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
    </CarreraProvider>
  );
}
