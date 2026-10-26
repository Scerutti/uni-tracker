import type { Carrera, Requisito } from "./types";
import { NOTA_MAXIMA } from "./carrera-utils";

const ID_VALIDO = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Revisa que los datos de una carrera sean coherentes. Devuelve la lista de errores
 * (vacía si está todo bien). Corre en los tests sobre todas las carreras del registro.
 */
export function validarCarrera(carrera: Carrera): string[] {
  const errores: string[] = [];
  const error = (msg: string) => errores.push(`${carrera.id}: ${msg}`);

  if (!ID_VALIDO.test(carrera.id)) error(`el id "${carrera.id}" no es un slug válido`);
  if (carrera.notaMinima <= 0 || carrera.notaMinima > NOTA_MAXIMA) {
    error(`notaMinima fuera de la escala (1 a ${NOTA_MAXIMA})`);
  }
  if (carrera.plan.length === 0) error("el plan no tiene años");

  const anios = new Set<number>();
  const anioPorCodigo = new Map<string, number>();
  for (const { anio, materias } of carrera.plan) {
    if (anios.has(anio)) error(`el año ${anio} está repetido`);
    anios.add(anio);
    if (materias.length === 0) error(`el año ${anio} no tiene materias`);
    for (const m of materias) {
      if (anioPorCodigo.has(m.codigo)) error(`el código ${m.codigo} está repetido`);
      anioPorCodigo.set(m.codigo, anio);
      if (m.cargaHoraria <= 0) error(`${m.codigo} tiene carga horaria ${m.cargaHoraria}`);
    }
  }

  const revisar = (codigo: string, anioMateria: number, requisitos: Requisito[], tipo: string) => {
    for (const r of requisitos) {
      if (typeof r === "string") {
        const anioReq = anioPorCodigo.get(r);
        if (r === codigo) error(`${codigo} es correlativa de sí misma (${tipo})`);
        else if (anioReq === undefined) error(`${codigo} pide ${r}, que no existe (${tipo})`);
        else if (anioReq > anioMateria) error(`${codigo} pide ${r}, de un año posterior (${tipo})`);
      } else if (!anios.has(r.anio)) {
        error(`${codigo} pide el año ${r.anio}, que no existe (${tipo})`);
      } else if (r.anio > anioMateria) {
        error(`${codigo} pide el año ${r.anio}, posterior al suyo (${tipo})`);
      }
    }
  };

  for (const { anio, materias } of carrera.plan) {
    for (const m of materias) {
      revisar(m.codigo, anio, m.correlativas, "cursar");
      if (m.correlativasRendir) revisar(m.codigo, anio, m.correlativasRendir, "rendir");
    }
  }

  const ciclo = buscarCiclo(carrera);
  if (ciclo) error(`hay correlativas circulares: ${ciclo.join(" → ")}`);

  return errores;
}

/**
 * Busca un ciclo entre correlativas para cursar (sólo códigos de materia; los años
 * completos excluyen a la propia materia y no pueden formar ciclos con años posteriores).
 */
function buscarCiclo(carrera: Carrera): string[] | null {
  const correlativas = new Map(
    carrera.plan.flatMap((a) =>
      a.materias.map((m) => [m.codigo, m.correlativas.filter((r): r is string => typeof r === "string")] as const)
    )
  );
  const visitando = new Set<string>();
  const terminadas = new Set<string>();

  const visitar = (codigo: string, camino: string[]): string[] | null => {
    if (visitando.has(codigo)) return [...camino.slice(camino.indexOf(codigo)), codigo];
    if (terminadas.has(codigo)) return null;
    visitando.add(codigo);
    for (const req of correlativas.get(codigo) ?? []) {
      const ciclo = visitar(req, [...camino, codigo]);
      if (ciclo) return ciclo;
    }
    visitando.delete(codigo);
    terminadas.add(codigo);
    return null;
  };

  for (const codigo of correlativas.keys()) {
    const ciclo = visitar(codigo, []);
    if (ciclo) return ciclo;
  }
  return null;
}
