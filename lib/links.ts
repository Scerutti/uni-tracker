/** Mail de contacto; también recibe los pedidos de carreras nuevas. */
export const CONTACTO_EMAIL = "softsys95@gmail.com";

/** Formulario de GitHub para pedir que se agregue una carrera. */
export const PEDIR_CARRERA_GITHUB_URL = "https://github.com/Scerutti/uni-tracker/issues/new?template=nueva-carrera.yml";

const PEDIR_CARRERA_ASUNTO = "Nueva carrera para Mi Carrera";

const PEDIR_CARRERA_CUERPO = `Hola, quiero que agreguen mi carrera.

Universidad:
Carrera:
Plan de estudios (año o resolución):
Link al plan oficial:
Reglas especiales (nota mínima, correlativas por año, optativas, etc.):
`;

/**
 * Mail con los datos que hacen falta para sumar una carrera. Es la opción para
 * quien no tiene cuenta de GitHub.
 */
export const PEDIR_CARRERA_MAILTO =
  `mailto:${CONTACTO_EMAIL}` +
  `?subject=${encodeURIComponent(PEDIR_CARRERA_ASUNTO)}` +
  `&body=${encodeURIComponent(PEDIR_CARRERA_CUERPO)}`;
