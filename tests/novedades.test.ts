import { describe, expect, it } from "vitest";
import packageJson from "@/package.json";
import { NOVEDADES } from "@/lib/novedades";

describe("NOVEDADES", () => {
  it("la primera es la versión de package.json (si no, el footer no tiene resumen)", () => {
    expect(NOVEDADES[0].version).toBe(packageJson.version);
  });

  it("cada versión tiene fecha y al menos un cambio", () => {
    for (const novedad of NOVEDADES) {
      expect(novedad.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(novedad.cambios.length).toBeGreaterThan(0);
    }
  });
});
