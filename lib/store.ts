"use client";

import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {EstadoMateria, FiltroActivo, ProgresoMap} from "./types";

interface CarreraState {
    progreso: ProgresoMap;
    filtro: FiltroActivo;
    anioExpandido: number[];

    setEstado: (codigo: string, estado: EstadoMateria) => void;
    setNota: (codigo: string, nota: number | null) => void;
    setFiltro: (filtro: FiltroActivo) => void;
    setAnioExpandido: (anio: number) => void;
    importarProgreso: (data: ProgresoMap) => void;
    resetProgreso: () => void;
}

export const useCarreraStore = create<CarreraState>()(
    persist(
        (set) => ({
            progreso: {},
            filtro: "todas",
            anioExpandido: [],

            setEstado: (codigo, estado) =>
                set((state) => ({
                    progreso: {
                        ...state.progreso,
                        [codigo]: {
                            ...state.progreso[codigo],
                            estado,
                            nota: estado === "NO_CURSADA" ? null : state.progreso[codigo]?.nota ?? null,
                        },
                    },
                })),

            setNota: (codigo, nota) =>
                set((state) => ({
                    progreso: {
                        ...state.progreso,
                        [codigo]: {
                            ...state.progreso[codigo],
                            estado: state.progreso[codigo]?.estado ?? "NO_CURSADA",
                            nota,
                        },
                    },
                })),

            setFiltro: (filtro) => set({filtro}),
            setAnioExpandido: (anio) =>
                set((state) => ({
                    anioExpandido: state.anioExpandido.includes(anio)
                        ? state.anioExpandido.filter((a) => a !== anio)
                        : [...state.anioExpandido, anio],
                })),

            importarProgreso: (data) => set({progreso: data}),
            resetProgreso: () => set({progreso: {}}),
        }),
        {
            name: "carrera-progreso",
        }
    )
);
