import { describe, expect, it } from "vitest";
import { CARRERA_ORIGINAL, CARRERAS, getCarrera, getCarrerasPorUniversidad } from "@/lib/carreras";
import { validarCarrera } from "@/lib/validar-carrera";
import { carreraDePrueba, materia } from "./fixtures";

describe("registro de carreras", () => {
  it.each(CARRERAS.map((c) => [c.id, c] as const))("%s tiene datos coherentes", (_, carrera) => {
    expect(validarCarrera(carrera)).toEqual([]);
  });

  it("los ids no se repiten", () => {
    const ids = CARRERAS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("la carrera original sigue existiendo (la usa la migración del progreso guardado)", () => {
    expect(getCarrera(CARRERA_ORIGINAL)).toBeDefined();
  });

  it("agrupa por universidad sin perder carreras", () => {
    const total = getCarrerasPorUniversidad().reduce((n, g) => n + g.carreras.length, 0);
    expect(total).toBe(CARRERAS.length);
  });
});

describe("validarCarrera", () => {
  it("acepta una carrera bien armada", () => {
    expect(validarCarrera(carreraDePrueba())).toEqual([]);
  });

  it("detecta códigos repetidos y correlativas que no existen", () => {
    const carrera = carreraDePrueba({
      plan: [{ anio: 1, materias: [materia("A1"), materia("A1"), materia("A2", ["ZZ"])] }],
    });
    expect(validarCarrera(carrera)).toEqual([
      "prueba: el código A1 está repetido",
      "prueba: A2 pide ZZ, que no existe (cursar)",
    ]);
  });

  it("detecta correlativas de años posteriores o inexistentes", () => {
    const carrera = carreraDePrueba({
      plan: [
        { anio: 1, materias: [materia("A1", ["B1"]), materia("A2", [], { correlativasRendir: [{ anio: 5 }] })] },
        { anio: 2, materias: [materia("B1")] },
      ],
    });
    expect(validarCarrera(carrera)).toEqual([
      "prueba: A1 pide B1, de un año posterior (cursar)",
      "prueba: A2 pide el año 5, que no existe (rendir)",
    ]);
  });

  it("detecta correlativas circulares", () => {
    const carrera = carreraDePrueba({
      plan: [{ anio: 1, materias: [materia("A1", ["A2"]), materia("A2", ["A1"])] }],
    });
    expect(validarCarrera(carrera)).toEqual(["prueba: hay correlativas circulares: A1 → A2 → A1"]);
  });

  it("detecta un id que no sirve para la URL y una nota mínima fuera de escala", () => {
    expect(validarCarrera(carreraDePrueba({ id: "Lic Sistemas", notaMinima: 0 }))).toEqual([
      'Lic Sistemas: el id "Lic Sistemas" no es un slug válido',
      "Lic Sistemas: notaMinima fuera de la escala (1 a 10)",
    ]);
  });
});
