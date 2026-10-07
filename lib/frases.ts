const FRASES = [
  "No fue suerte. Fue constancia.",
  "Terminaste lo que empezaste.",
  "Disciplina > motivación.",
  "El esfuerzo sostenido construye resultados.",
  "La meta no era el título. Era en quién te convertiste.",
];

let ultimaFrase: string | undefined;

/**
 * Elige una frase de egreso al azar, distinta de la última que se mostró.
 */
export function elegirFrase(): string {
  let nueva: string;
  do {
    nueva = FRASES[Math.floor(Math.random() * FRASES.length)];
  } while (FRASES.length > 1 && nueva === ultimaFrase);

  ultimaFrase = nueva;
  return nueva;
}
