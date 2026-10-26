import { describe, expect, it } from "vitest";
import { CARRERA_ORIGINAL } from "@/lib/carreras";
import { migrarEstado } from "@/lib/store-migracion";

describe("migrarEstado", () => {
  it("v1: pasa el progreso único a la carrera original", () => {
    const v1 = {
      progreso: { "340101": { estado: "APROBADA", nota: 9 } },
      filtro: "aprobadas",
      anioExpandido: [1, 3],
    };
    expect(migrarEstado(v1, 1)).toEqual({
      progresos: { [CARRERA_ORIGINAL]: { "340101": { estado: "APROBADA", nota: 9 } } },
      aniosExpandidos: { [CARRERA_ORIGINAL]: [1, 3] },
      filtro: "aprobadas",
    });
  });

  it("v0: sanea el progreso y descarta lo que no sirve", () => {
    const v0 = {
      progreso: {
        "340101": { estado: "NO_CURSADA", nota: 7 },
        "999999": { estado: "APROBADA", nota: 10 },
      },
      filtro: "cualquiera",
      anioExpandido: "1",
    };
    expect(migrarEstado(v0, 0)).toEqual({
      progresos: { [CARRERA_ORIGINAL]: { "340101": { estado: "NO_CURSADA", nota: null } } },
      aniosExpandidos: { [CARRERA_ORIGINAL]: [] },
      filtro: "todas",
    });
  });

  it("sin datos guardados queda vacío", () => {
    expect(migrarEstado(undefined, 0)).toEqual({
      progresos: {},
      aniosExpandidos: { [CARRERA_ORIGINAL]: [] },
      filtro: "todas",
    });
  });

  it("v2: deja el estado como está", () => {
    const v2 = {
      progresos: { otra: { X: { estado: "REGULAR", nota: null } } },
      aniosExpandidos: { otra: [2] },
      filtro: "pendientes",
    };
    expect(migrarEstado(v2, 2)).toEqual(v2);
  });
});
