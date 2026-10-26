import { describe, expect, it } from "vitest";
import { getCarrera } from "@/lib/carreras";
import {
  crearArchivoProgreso,
  leerArchivoProgreso,
  nombreArchivoProgreso,
  sanitizarProgreso,
} from "@/lib/progreso-io";
import { carreraDePrueba } from "./fixtures";

const carrera = carreraDePrueba();

describe("sanitizarProgreso", () => {
  it("descarta códigos que no son del plan y estados inválidos", () => {
    expect(
      sanitizarProgreso(carrera, {
        A1: { estado: "APROBADA", nota: 8 },
        ZZ: { estado: "APROBADA", nota: 8 },
        A2: { estado: "PROMOCIONADA", nota: 8 },
        B1: "REGULAR",
      })
    ).toEqual({ A1: { estado: "APROBADA", nota: 8 } });
  });

  it("saca la nota de materias que no la llevan y las notas fuera de escala", () => {
    expect(
      sanitizarProgreso(carrera, {
        A1: { estado: "NO_CURSADA", nota: 8 },
        A2: { estado: "EN_CURSO", nota: 5 },
        B1: { estado: "REGULAR", nota: 11 },
        B2: { estado: "APROBADA", nota: "7" },
      })
    ).toEqual({
      A1: { estado: "NO_CURSADA", nota: null },
      A2: { estado: "EN_CURSO", nota: null },
      B1: { estado: "REGULAR", nota: null },
      B2: { estado: "APROBADA", nota: 7 },
    });
  });

  it("devuelve null si no es un objeto o si no queda ninguna entrada válida", () => {
    expect(sanitizarProgreso(carrera, null)).toBeNull();
    expect(sanitizarProgreso(carrera, [])).toBeNull();
    expect(sanitizarProgreso(carrera, { ZZ: { estado: "APROBADA" } })).toBeNull();
    expect(sanitizarProgreso(carrera, {})).toEqual({});
  });
});

describe("leerArchivoProgreso", () => {
  const progreso = { A1: { estado: "APROBADA" as const, nota: 9 } };

  it("lee un archivo exportado por la app", () => {
    const archivo = JSON.parse(JSON.stringify(crearArchivoProgreso(carrera, progreso)));
    expect(leerArchivoProgreso(carrera, archivo)).toEqual({ ok: true, progreso });
  });

  it("acepta el formato anterior (el mapa suelto)", () => {
    expect(leerArchivoProgreso(carrera, progreso)).toEqual({ ok: true, progreso });
  });

  it("rechaza un archivo de otra carrera y la nombra si la conoce", () => {
    const sistemas = getCarrera("lic-sistemas")!;
    const archivo = crearArchivoProgreso(sistemas, {});
    const resultado = leerArchivoProgreso(carrera, archivo);
    expect(resultado.ok).toBe(false);
    expect(!resultado.ok && resultado.error).toContain(sistemas.nombreCorto);

    const desconocida = { ...archivo, carrera: "no-existe" };
    expect(leerArchivoProgreso(carrera, desconocida)).toEqual({
      ok: false,
      error: "El archivo corresponde a otra carrera.",
    });
  });

  it("rechaza archivos de una versión más nueva", () => {
    const archivo = { ...crearArchivoProgreso(carrera, progreso), version: 99 };
    expect(leerArchivoProgreso(carrera, archivo).ok).toBe(false);
  });

  it("rechaza datos que no son progreso", () => {
    expect(leerArchivoProgreso(carrera, "hola").ok).toBe(false);
  });
});

describe("nombreArchivoProgreso", () => {
  it("incluye la carrera y la fecha", () => {
    expect(nombreArchivoProgreso(carrera, new Date("2026-03-15T12:00:00Z"))).toBe("progreso-prueba-2026-03-15.json");
  });
});
