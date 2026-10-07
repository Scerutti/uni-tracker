"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap } from "lucide-react";
import confetti from "canvas-confetti";

/**
 * Modal de egreso. Está abierto mientras haya una frase; la elige el store
 * en el momento en que se aprueba la última materia.
 */
export function GraduationModal({
    frase,
    onClose,
}: {
    frase: string | null;
    onClose: () => void;
}) {
    const open = frase !== null;

    // 🎊 Dispara confetti cada vez que se abre
    useEffect(() => {
        if (open) {
            void confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={(abierto) => !abierto && onClose()}>
            <DialogContent className="text-center py-10">
                <DialogTitle className="text-2xl font-bold">
                    Felicitaciones, Licenciado 🎓
                </DialogTitle>

                <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-4">
                        <GraduationCap className="size-10 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    <DialogDescription className="max-w-md">
                        {frase}
                    </DialogDescription>
                </div>
            </DialogContent>
        </Dialog>
    );
}
