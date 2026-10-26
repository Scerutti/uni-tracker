import { describe, expect, it } from "vitest";
import {
  calcularEstadisticas,
  calcularPromedio,
  esEgresado,
  estaHabilitadaParaCursar,
  estaHabilitadaParaRendir,
  getCorrelativasIncumplidas,
  notaInvalida,
  puedeInteractuar,
  requisitoCumplido,
  tieneCorrelativas,
} from "@/lib/carrera-utils";
import { getMateriaByCode } from "@/lib/plan";
import type { Carrera, EstadoMateria, ProgresoMap } from "@/lib/types";
import { carreraDePrueba } from "./fixtures";

const carrera = carreraDePrueba();

function m(c: Carrera, codigo: string) {
  const materia = getMateriaByCode(c, codigo);
  if (!materia) throw new Error(`No existe ${codigo}`);
  return materia;
}

function progreso(estados: Record<string, EstadoMateria>, notas: Record<string, number> = {}): ProgresoMap {
  return Object.fromEntries(
    Object.entries(estados).map(([codigo, estado]) => [codigo, { estado, nota: notas[codigo] ?? null }])
  );
}

describe("correlativas para cursar", () => {
  it("habilita una materia cuando su correlativa está regular", () => {
    expect(estaHabilitadaParaCursar(carrera, m(carrera, "B1"), {})).toBe(false);
    expect(estaHabilitadaParaCursar(carrera, m(carrera, "B1"), progreso({ A1: "EN_CURSO" }))).toBe(false);
    expect(estaHabilitadaParaCursar(carrera, m(carrera, "B1"), progreso({ A1: "REGULAR" }))).toBe(true);
    expect(estaHabilitadaParaCursar(carrera, m(carrera, "B1"), progreso({ A1: "APROBADA" }))).toBe(true);
  });

  it("un año completo pide todas sus materias", () => {
    expect(estaHabilitadaParaCursar(carrera, m(carrera, "B2"), progreso({ A1: "REGULAR" }))).toBe(false);
    expect(
      estaHabilitadaParaCursar(carrera, m(carrera, "B2"), progreso({ A1: "REGULAR", A2: "APROBADA" }))
    ).toBe(true);
  });

  it("una materia ya cursada no cuenta como habilitada, pero se puede editar", () => {
    const p = progreso({ A1: "REGULAR", B1: "EN_CURSO" });
    expect(estaHabilitadaParaCursar(carrera, m(carrera, "B1"), p)).toBe(false);
    expect(puedeInteractuar(carrera, m(carrera, "B1"), p)).toBe(true);
  });
});

describe("correlativas para rendir", () => {
  it("usa correlativasRendir cuando existen", () => {
    const base = { A1: "APROBADA", A2: "APROBADA", B2: "REGULAR" } as const;
    expect(estaHabilitadaParaRendir(carrera, m(carrera, "B2"), progreso({ ...base, B1: "REGULAR" }))).toBe(false);
    expect(estaHabilitadaParaRendir(carrera, m(carrera, "B2"), progreso({ ...base, B1: "APROBADA" }))).toBe(true);
  });

  it("si no hay correlativasRendir, pide las de cursar aprobadas", () => {
    expect(estaHabilitadaParaRendir(carrera, m(carrera, "B1"), progreso({ A1: "REGULAR", B1: "REGULAR" }))).toBe(
      false
    );
    expect(estaHabilitadaParaRendir(carrera, m(carrera, "B1"), progreso({ A1: "APROBADA", B1: "REGULAR" }))).toBe(
      true
    );
  });
});

describe("requisitoCumplido", () => {
  it("un año completo pide regulares para cursar y aprobadas para rendir", () => {
    const p = progreso({ A1: "APROBADA", A2: "REGULAR" });
    expect(requisitoCumplido(carrera, m(carrera, "B2"), { anio: 1 }, p)).toBe(true);
    expect(requisitoCumplido(carrera, m(carrera, "B2"), { anio: 1 }, p, "rendir")).toBe(false);
    expect(requisitoCumplido(carrera, m(carrera, "B2"), { anio: 1 }, { ...p, A2: { estado: "APROBADA", nota: null } }, "rendir")).toBe(true);
  });

  it("tieneCorrelativas mira las de cursar y las de rendir", () => {
    expect(tieneCorrelativas(m(carrera, "A1"))).toBe(false);
    expect(tieneCorrelativas(m(carrera, "B1"))).toBe(true);
    expect(tieneCorrelativas({ ...m(carrera, "A1"), correlativasRendir: ["A2"] })).toBe(true);
  });
});

describe("getCorrelativasIncumplidas", () => {
  it("no marca nada en una materia no cursada", () => {
    expect(getCorrelativasIncumplidas(carrera, m(carrera, "B1"), {})).toEqual([]);
  });

  it("marca la correlativa que se volvió a poner como no cursada", () => {
    expect(getCorrelativasIncumplidas(carrera, m(carrera, "B1"), progreso({ B1: "REGULAR" }))).toEqual(["A1"]);
  });

  it("en una materia aprobada también revisa las correlativas para rendir", () => {
    const p = progreso({ A1: "APROBADA", A2: "APROBADA", B1: "REGULAR", B2: "APROBADA" });
    expect(getCorrelativasIncumplidas(carrera, m(carrera, "B2"), p)).toEqual(["B1"]);
  });
});

describe("estadísticas", () => {
  it("cuenta estados, horas y habilitadas", () => {
    const stats = calcularEstadisticas(carrera, progreso({ A1: "APROBADA", A2: "REGULAR", B1: "EN_CURSO" }));
    expect(stats).toMatchObject({
      total: 4,
      aprobadas: 1,
      regulares: 1,
      enCurso: 1,
      pendientes: 1,
      porcentaje: 25,
      horasTotales: 400,
      horasAprobadas: 100,
      habilitadasCursar: 1,
      habilitadasRendir: 1,
    });
  });

  it("promedia sólo las aprobadas con nota, redondeado a dos decimales", () => {
    const p = progreso(
      { A1: "APROBADA", A2: "APROBADA", B1: "REGULAR", B2: "APROBADA" },
      { A1: 7, A2: 8, B1: 2, B2: 8 }
    );
    expect(calcularPromedio(carrera, p)).toBe(7.67);
    expect(calcularPromedio(carrera, { ...p, B2: { estado: "APROBADA", nota: null } })).toBe(7.5);
    expect(calcularPromedio(carrera, {})).toBeNull();
  });

  it("egresa cuando todas están aprobadas", () => {
    const todas = progreso({ A1: "APROBADA", A2: "APROBADA", B1: "APROBADA", B2: "APROBADA" });
    expect(esEgresado(carrera, todas)).toBe(true);
    expect(esEgresado(carrera, { ...todas, B2: { estado: "REGULAR", nota: null } })).toBe(false);
  });
});

describe("notaInvalida", () => {
  it("usa la nota mínima de la carrera", () => {
    expect(notaInvalida(carrera, "APROBADA", 4)).toBe(false);
    expect(notaInvalida(carrera, "APROBADA", 3)).toBe(true);
    expect(notaInvalida(carreraDePrueba({ notaMinima: 6 }), "APROBADA", 5)).toBe(true);
    expect(notaInvalida(carrera, "REGULAR", 2)).toBe(false);
  });
});
