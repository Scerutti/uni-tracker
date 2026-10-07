"use client";

import {useEffect, useSyncExternalStore} from "react";
import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {EstadoMateria, FiltroActivo, ProgresoMap} from "./types";
import {esEgresado} from "./carrera-utils";
import {elegirFrase} from "./frases";
import {sanitizarProgreso} from "./progreso-io";

interface CarreraState {
    progreso: ProgresoMap;
    filtro: FiltroActivo;
    anioExpandido: number[];
    /** Frase del modal de egreso; null cuando no hay celebración. No se persiste. */
    celebracion: string | null;

    setEstado: (codigo: string, estado: EstadoMateria) => void;
    setNota: (codigo: string, nota: number | null) => void;
    setFiltro: (filtro: FiltroActivo) => void;
    setAnioExpandido: (anio: number) => void;
    expandirAnio: (anio: number) => void;
    importarProgreso: (data: ProgresoMap) => void;
    resetProgreso: () => void;
    cerrarCelebracion: () => void;
}

type EstadoPersistido = Pick<CarreraState, "progreso" | "filtro" | "anioExpandido">;

/**
 * Aplica un nuevo progreso y abre el modal de egreso si con este cambio
 * se aprobó la última materia del plan.
 */
function aplicarProgreso(state: CarreraState, progreso: ProgresoMap) {
    const seRecibio = !esEgresado(state.progreso) && esEgresado(progreso);
    return {
        progreso,
        celebracion: seRecibio ? elegirFrase() : state.celebracion,
    };
}

export const useCarreraStore = create<CarreraState>()(
    persist(
        (set) => ({
            progreso: {},
            filtro: "todas",
            anioExpandido: [],
            celebracion: null,

            setEstado: (codigo, estado) =>
                set((state) =>
                    aplicarProgreso(state, {
                        ...state.progreso,
                        [codigo]: {
                            estado,
                            nota: estado === "REGULAR" || estado === "APROBADA" ? state.progreso[codigo]?.nota ?? null : null,
                        },
                    })
                ),

            setNota: (codigo, nota) =>
                set((state) => ({
                    progreso: {
                        ...state.progreso,
                        [codigo]: {
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
            expandirAnio: (anio) =>
                set((state) =>
                    state.anioExpandido.includes(anio)
                        ? state
                        : {anioExpandido: [...state.anioExpandido, anio]}
                ),

            importarProgreso: (data) => set((state) => aplicarProgreso(state, data)),
            resetProgreso: () => set({progreso: {}, celebracion: null}),
            cerrarCelebracion: () => set({celebracion: null}),
        }),
        {
            name: "carrera-progreso",
            version: 1,
            // Se hidrata en el cliente después del primer render (ver useHidratarStore)
            // para que el HTML del servidor y el del cliente coincidan.
            skipHydration: true,
            partialize: (state): EstadoPersistido => ({
                progreso: state.progreso,
                filtro: state.filtro,
                anioExpandido: state.anioExpandido,
            }),
            // v0 -> v1: mismo formato, pero sin sanear (notas en materias no cursadas,
            // códigos que no existen en el plan).
            migrate: (persisted): EstadoPersistido => {
                const anterior = (persisted ?? {}) as Partial<EstadoPersistido>;
                return {
                    progreso: sanitizarProgreso(anterior.progreso) ?? {},
                    filtro: anterior.filtro ?? "todas",
                    anioExpandido: Array.isArray(anterior.anioExpandido) ? anterior.anioExpandido : [],
                };
            },
        }
    )
);

/**
 * Carga el progreso guardado en localStorage y devuelve true cuando terminó.
 * Hasta entonces el store tiene el estado inicial, igual que en el servidor.
 */
export function useHidratarStore(): boolean {
    useEffect(() => {
        if (!useCarreraStore.persist.hasHydrated()) {
            void useCarreraStore.persist.rehydrate();
        }
    }, []);

    return useSyncExternalStore(
        (onChange) => useCarreraStore.persist.onFinishHydration(onChange),
        () => useCarreraStore.persist.hasHydrated(),
        () => false
    );
}
