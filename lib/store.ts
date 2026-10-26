"use client";

import {useEffect, useSyncExternalStore} from "react";
import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {Carrera, EstadoMateria, FiltroActivo, ProgresoMap} from "./types";
import {esEgresado, llevaNota} from "./carrera-utils";
import {elegirFrase} from "./frases";
import {type EstadoPersistido, migrarEstado, VERSION_ESTADO} from "./store-migracion";

interface ProgresoState extends EstadoPersistido {
    /** Frase del modal de egreso; null cuando no hay celebración. No se persiste. */
    celebracion: string | null;

    setEstado: (carrera: Carrera, codigo: string, estado: EstadoMateria) => void;
    setNota: (carreraId: string, codigo: string, nota: number | null) => void;
    setFiltro: (filtro: FiltroActivo) => void;
    toggleAnio: (carreraId: string, anio: number) => void;
    expandirAnio: (carreraId: string, anio: number) => void;
    importarProgreso: (carrera: Carrera, data: ProgresoMap) => void;
    resetProgreso: (carreraId: string) => void;
    cerrarCelebracion: () => void;
}

const SIN_PROGRESO: ProgresoMap = {};
const SIN_ANIOS: number[] = [];

/**
 * Aplica un nuevo progreso a una carrera y abre el modal de egreso si con este
 * cambio se aprobó la última materia del plan.
 */
function aplicarProgreso(state: ProgresoState, carrera: Carrera, progreso: ProgresoMap) {
    const anterior = state.progresos[carrera.id] ?? SIN_PROGRESO;
    const seRecibio = !esEgresado(carrera, anterior) && esEgresado(carrera, progreso);
    return {
        progresos: {...state.progresos, [carrera.id]: progreso},
        celebracion: seRecibio ? elegirFrase() : state.celebracion,
    };
}

export const useProgresoStore = create<ProgresoState>()(
    persist(
        (set) => ({
            progresos: {},
            aniosExpandidos: {},
            filtro: "todas",
            celebracion: null,

            setEstado: (carrera, codigo, estado) =>
                set((state) => {
                    const progreso = state.progresos[carrera.id] ?? SIN_PROGRESO;
                    return aplicarProgreso(state, carrera, {
                        ...progreso,
                        [codigo]: {
                            estado,
                            nota: llevaNota(estado) ? progreso[codigo]?.nota ?? null : null,
                        },
                    });
                }),

            setNota: (carreraId, codigo, nota) =>
                set((state) => {
                    const progreso = state.progresos[carreraId] ?? SIN_PROGRESO;
                    return {
                        progresos: {
                            ...state.progresos,
                            [carreraId]: {
                                ...progreso,
                                [codigo]: {
                                    estado: progreso[codigo]?.estado ?? "NO_CURSADA",
                                    nota,
                                },
                            },
                        },
                    };
                }),

            setFiltro: (filtro) => set({filtro}),
            toggleAnio: (carreraId, anio) =>
                set((state) => {
                    const anios = state.aniosExpandidos[carreraId] ?? SIN_ANIOS;
                    return {
                        aniosExpandidos: {
                            ...state.aniosExpandidos,
                            [carreraId]: anios.includes(anio) ? anios.filter((a) => a !== anio) : [...anios, anio],
                        },
                    };
                }),
            expandirAnio: (carreraId, anio) =>
                set((state) => {
                    const anios = state.aniosExpandidos[carreraId] ?? SIN_ANIOS;
                    return anios.includes(anio)
                        ? state
                        : {aniosExpandidos: {...state.aniosExpandidos, [carreraId]: [...anios, anio]}};
                }),

            importarProgreso: (carrera, data) => set((state) => aplicarProgreso(state, carrera, data)),
            resetProgreso: (carreraId) =>
                set((state) => {
                    const progresos = {...state.progresos};
                    delete progresos[carreraId];
                    return {progresos, celebracion: null};
                }),
            cerrarCelebracion: () => set({celebracion: null}),
        }),
        {
            name: "carrera-progreso",
            version: VERSION_ESTADO,
            // Se hidrata en el cliente después del primer render (ver useHidratarStore)
            // para que el HTML del servidor y el del cliente coincidan.
            skipHydration: true,
            partialize: (state): EstadoPersistido => ({
                progresos: state.progresos,
                aniosExpandidos: state.aniosExpandidos,
                filtro: state.filtro,
            }),
            migrate: migrarEstado,
        }
    )
);

/**
 * Progreso de una carrera. Devuelve siempre el mismo objeto vacío si no hay progreso,
 * para no volver a renderizar de más.
 */
export function useProgreso(carreraId: string): ProgresoMap {
    return useProgresoStore((s) => s.progresos[carreraId] ?? SIN_PROGRESO);
}

export function useAniosExpandidos(carreraId: string): number[] {
    return useProgresoStore((s) => s.aniosExpandidos[carreraId] ?? SIN_ANIOS);
}

/**
 * Carga el progreso guardado en localStorage y devuelve true cuando terminó.
 * Hasta entonces el store tiene el estado inicial, igual que en el servidor.
 */
export function useHidratarStore(): boolean {
    useEffect(() => {
        if (!useProgresoStore.persist.hasHydrated()) {
            void useProgresoStore.persist.rehydrate();
        }
    }, []);

    return useSyncExternalStore(
        (onChange) => useProgresoStore.persist.onFinishHydration(onChange),
        () => useProgresoStore.persist.hasHydrated(),
        () => false
    );
}
