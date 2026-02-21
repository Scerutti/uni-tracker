import type { AnioData } from "./types";

export const planDeEstudios: AnioData[] = [
  {
    anio: 1,
    materias: [
      { codigo: "340101", nombre: "Sistemas y Organizaciones", tipo: "Anual", cargaHoraria: 128, correlativas: [] },
      { codigo: "340102", nombre: "Fundamentos de Programación", tipo: "Anual", cargaHoraria: 160, correlativas: [] },
      { codigo: "340103", nombre: "Cálculo Diferencial e Integral", tipo: "Anual", cargaHoraria: 128, correlativas: [] },
      { codigo: "340104", nombre: "Lógica y Álgebra", tipo: "Anual", cargaHoraria: 128, correlativas: [] },
      { codigo: "340105", nombre: "Lecto-Comprensión en Inglés", tipo: "Anual", cargaHoraria: 64, correlativas: [] },
      { codigo: "340106", nombre: "Derechos Humanos y Tecnología", tipo: "Cuatrim C1", cargaHoraria: 32, correlativas: [] },
      { codigo: "340107", nombre: "Fundamentos de Computación", tipo: "Cuatrim C2", cargaHoraria: 128, correlativas: [] },
    ],
  },
  {
    anio: 2,
    materias: [
      { codigo: "340208", nombre: "Ingeniería de Software I", tipo: "Anual", cargaHoraria: 160, correlativas: ["340101", "340102"] },
      { codigo: "340209", nombre: "Algoritmos y Estructura de Datos", tipo: "Anual", cargaHoraria: 128, correlativas: ["340102", "340104"] },
      { codigo: "340210", nombre: "Programación Orientada a Objetos", tipo: "Anual", cargaHoraria: 160, correlativas: ["340102", "340105", "340107"] },
      { codigo: "340211", nombre: "Matemática Discreta", tipo: "Anual", cargaHoraria: 96, correlativas: ["340104"] },
      { codigo: "340212", nombre: "Ecuaciones Diferenciales y Cálculo Multivariado", tipo: "Cuatrim C1", cargaHoraria: 96, correlativas: ["340103"] },
      { codigo: "340213", nombre: "Arquitectura de Computadoras", tipo: "Cuatrim C2", cargaHoraria: 96, correlativas: ["340102", "340107"] },
      { codigo: "340299", nombre: "Optativa I", tipo: "Cuatrim C2", cargaHoraria: 48, correlativas: ["340102", "340105", "340107"] },
    ],
  },
  {
    anio: 3,
    materias: [
      { codigo: "340314", nombre: "Ingeniería de Software II", tipo: "Anual", cargaHoraria: 128, correlativas: ["340208"] },
      { codigo: "340315", nombre: "Bases de Datos", tipo: "Anual", cargaHoraria: 128, correlativas: ["340209", "340210"] },
      { codigo: "340316", nombre: "Sistemas Operativos", tipo: "Anual", cargaHoraria: 128, correlativas: ["340209", "340213"] },
      { codigo: "340317", nombre: "Redes de Datos", tipo: "Anual", cargaHoraria: 128, correlativas: ["340213"] },
      { codigo: "340318", nombre: "Probabilidad y Estadística", tipo: "Cuatrim C1", cargaHoraria: 96, correlativas: ["340211", "340212"] },
      { codigo: "340319", nombre: "Paradigmas de Programación", tipo: "Cuatrim C1", cargaHoraria: 96, correlativas: ["340209", "340210"] },
      { codigo: "340320", nombre: "Teoría de la Computación", tipo: "Cuatrim C2", cargaHoraria: 96, correlativas: ["340211"] },
      { codigo: "340321", nombre: "Taller de Integración", tipo: "Cuatrim C2", cargaHoraria: 96, correlativas: [] },
    ],
  },
  {
    anio: 4,
    materias: [
      { codigo: "340422", nombre: "Ingeniería de Software III", tipo: "Anual", cargaHoraria: 128, correlativas: ["340314", "340315"] },
      { codigo: "340423", nombre: "Inteligencia Artificial", tipo: "Cuatrim C1", cargaHoraria: 96, correlativas: ["340318", "340319"] },
      { codigo: "340424", nombre: "Seguridad Informática", tipo: "Cuatrim C1", cargaHoraria: 96, correlativas: ["340316", "340317"] },
      { codigo: "340425", nombre: "Gestión de Proyectos de Software", tipo: "Cuatrim C2", cargaHoraria: 96, correlativas: ["340314"] },
      { codigo: "340426", nombre: "Legislación y Ética Profesional", tipo: "Cuatrim C2", cargaHoraria: 64, correlativas: ["340106"] },
      { codigo: "340499", nombre: "Optativa II", tipo: "Cuatrim C2", cargaHoraria: 48, correlativas: ["340299"] },
    ],
  },
  {
    anio: 5,
    materias: [
      { codigo: "340527", nombre: "Administración de Sistemas y Redes", tipo: "Cuatrim C1", cargaHoraria: 96, correlativas: ["340316", "340317"] },
      { codigo: "340528", nombre: "Auditoría y Calidad de Software", tipo: "Cuatrim C1", cargaHoraria: 96, correlativas: ["340422"] },
      { codigo: "340529", nombre: "Computación de Alto Rendimiento", tipo: "Cuatrim C1", cargaHoraria: 96, correlativas: ["340316", "340320"] },
      { codigo: "340530", nombre: "Práctica Profesional Supervisada", tipo: "Anual", cargaHoraria: 200, correlativas: ["340422", "340425"] },
      { codigo: "340531", nombre: "Sistemas Distribuidos", tipo: "Cuatrim C2", cargaHoraria: 96, correlativas: ["340316", "340317"] },
      { codigo: "340532", nombre: "Emprendimientos Tecnológicos", tipo: "Cuatrim C2", cargaHoraria: 64, correlativas: ["340425", "340426"] },
      { codigo: "340533", nombre: "Tesina de Grado", tipo: "Anual", cargaHoraria: 200, correlativas: [] },
    ],
  },
];

export function getAllMaterias() {
  return planDeEstudios.flatMap((a) => a.materias);
}

export function getMateriaByCode(codigo: string) {
  return getAllMaterias().find((m) => m.codigo === codigo);
}

export function getMateriasDeAnio(anio: number) {
  return planDeEstudios.find((a) => a.anio === anio)?.materias ?? [];
}
