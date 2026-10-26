import type { Metadata } from "next";
import { CarreraView } from "@/components/carrera-view";
import { CARRERAS, getCarrera } from "@/lib/carreras";

/** Las carreras salen del registro: cualquier otro slug es 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CARRERAS.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const carrera = getCarrera(slug);
  if (!carrera) return {};
  return {
    title: `${carrera.nombreCorto} (${carrera.universidad.sigla}) - Mi Carrera`,
    description: `Seguimiento del plan de estudios de ${carrera.nombre}, ${carrera.universidad.nombre}.`,
  };
}

export default function CarreraPage() {
  return <CarreraView />;
}
