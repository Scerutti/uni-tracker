"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap } from "lucide-react";
import confetti from "canvas-confetti";

const FRASES = [
    "No fue suerte. Fue constancia.",
    "Terminaste lo que empezaste.",
    "Disciplina > motivación.",
    "El esfuerzo sostenido construye resultados.",
    "La meta no era el título. Era en quién te convertiste.",
];

function getRandomFrase(prev?: string) {
    let nueva;

    do {
        nueva = FRASES[Math.floor(Math.random() * FRASES.length)];
    } while (FRASES.length > 1 && nueva === prev);

    return nueva;
}

export function GraduationModal({
                                    open,
                                    onClose,
                                }: {
    open: boolean;
    onClose: () => void;
}) {
    const [frase, setFrase] = useState("");
    const [hasFired, setHasFired] = useState(false);

    // 🎉 Genera nueva frase cada vez que se abre
    useEffect(() => {
        if (open) {
            setFrase((prev) => getRandomFrase(prev));
            setHasFired(false); // permite confetti nuevamente si vuelve a abrir
        }
    }, [open]);

    // 🎊 Dispara confetti cuando se abre
    useEffect(() => {
        if (open && !hasFired) {
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
            });

            setHasFired(true);
        }
    }, [open, hasFired]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="text-center py-10">
                <DialogTitle className="text-2xl font-bold">
                    Felicitaciones, Licenciado 🎓
                </DialogTitle>

                <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-4">
                        <GraduationCap className="size-10 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    <p className="text-muted-foreground max-w-md">
                        {frase}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}