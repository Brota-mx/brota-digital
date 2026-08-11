import type { ServicioId } from "./servicios";

/**
 * Copy de `/contacto` — paso 10 del orden de construcción (blueprint §3 y §5).
 *
 * Regla 2 del CLAUDE.md: nada de texto en el JSX. Aquí vive todo lo que se lee
 * en la página, incluidos los mensajes de error del formulario y los seis
 * estados visibles de §5. Los mensajes de validación viven además en el
 * esquema (`lib/contacto.ts`), porque el servidor los usa sin renderizar nada.
 *
 * EL PRESUPUESTO ES EL CAMPO QUE HACE TRABAJAR A LA ESCALERA
 *
 * Sin él la escalera de `/servicios` es decorativa: el visitante la lee, se
 * autoclasifica y luego escribe un mensaje que no dice en qué peldaño se puso.
 * Por eso es obligatorio y por eso sus opciones son los peldaños reales y no
 * rangos inventados para el formulario — la etiqueta de cada opción se arma de
 * `content/servicios.ts`, así que el día que un rango cambie de precio cambia
 * aquí solo.
 */

/**
 * Los valores válidos del select, y la única fuente del enum de Zod.
 *
 * `satisfies` es la guarda: si un peldaño se renombra en `content/servicios.ts`,
 * esta línea deja de compilar. Agregar un peldaño nuevo NO rompe la compilación
 * —simplemente no se ofrece en el formulario—, que es el lado seguro del error:
 * se ofrece de menos, nunca una opción que el endpoint vaya a rechazar.
 */
export const OPCIONES_PRESUPUESTO = [
  "siembra",
  "cosecha",
  "selva",
  "ecosistema",
  "no-seguro",
] as const satisfies readonly (ServicioId | "no-seguro")[];

export type OpcionPresupuesto = (typeof OPCIONES_PRESUPUESTO)[number];

export const contactoPagina = {
  eyebrow: "Contacto",
  titulo: "Cuéntanos qué necesita el negocio",
  entrada:
    "El formulario pide un rango de presupuesto desde el primer mensaje. Con eso y el contexto del negocio se responde con una propuesta real, en vez de una ronda previa de «¿cuánto cuesta?».",

  /** Encabezado de la columna del formulario. No es H1: el H1 es el de arriba. */
  formularioTitulo: "Solicitar una cotización",

  /** Rótulo de cada campo, y el texto de ayuda cuando hace falta. */
  campos: {
    nombre: { label: "Nombre", ayuda: "" },
    correo: { label: "Correo", ayuda: "" },
    telefono: {
      label: "Teléfono o WhatsApp",
      ayuda: "10 dígitos. Con o sin +52.",
    },
    negocio: { label: "Negocio", ayuda: "Opcional." },
    presupuesto: {
      label: "Presupuesto aproximado",
      ayuda: "Sirve para responder con una propuesta del alcance correcto.",
    },
    mensaje: {
      label: "Qué necesita el negocio",
      ayuda: "Qué se quiere lograr y para cuándo, si ya hay fecha.",
    },
  },

  /**
   * La etiqueta de «No estoy seguro». Las otras cuatro se arman del peldaño:
   * «Siembra · $3,500 – $6,000 MXN».
   */
  presupuestoIndeciso: "No estoy seguro todavía",
  presupuestoVacio: "Elegir un rango",

  /**
   * Rótulo del honeypot. No lo lee nadie —el campo está fuera del lienzo y
   * marcado `aria-hidden`—, pero un `<input>` sin `<label>` es marcado roto, y
   * la regla 2 no tiene excepción por «es que no se ve».
   */
  honeypot: "No llenar este campo",

  /** Los estados del botón. El segundo no puede mover el layout (§5). */
  enviar: "Enviar solicitud",
  enviando: "Enviando…",

  /**
   * Nota de privacidad al pie del formulario. Es requisito de la LFPDPPP
   * —el aviso tiene que estar a la vista en el punto de recolección—, no una
   * cortesía.
   */
  /**
   * El enlace va en su propia línea y no dentro de la frase. La regla 12 pide
   * 44×44 en todo objetivo táctil, y un enlace de 44 px de alto metido en un
   * párrafo abre el interlineado de las dos líneas que lo rodean —se vio en la
   * captura de escritorio—. Fuera de la prosa cumple la regla sin deformar
   * nada, y de paso la frase se lee entera.
   */
  privacidad: "Los datos se usan únicamente para responder esta solicitud.",

  /**
   * Sustituye al formulario cuando no hay JavaScript. No es una cortesía: la
   * verificación anti-robots solo puede emitir su token en el navegador, así
   * que sin JavaScript el formulario no puede enviarse — y enseñar un
   * formulario que no funciona es peor que no enseñarlo.
   */
  sinJavaScript:
    "El formulario necesita JavaScript para funcionar. Con JavaScript desactivado, el WhatsApp de aquí abajo es el canal directo.",

  /** Los seis estados visibles de §5, en el orden en que se prueban. */
  estados: {
    exito: {
      titulo: "Solicitud enviada",
      texto:
        "Se responde al correo indicado. Si es urgente, el WhatsApp está aquí abajo.",
    },
    errorValidacion: "Revisa los campos marcados abajo.",
    errorServidor:
      "No se pudo enviar la solicitud. Vuelve a intentarlo en un momento, o escribe por WhatsApp.",
    errorNoDisponible:
      "El envío por formulario no está disponible en este momento. El WhatsApp de abajo sí funciona.",
    errorLimite:
      "Se recibieron varias solicitudes desde esta conexión. Espera unos minutos antes de volver a enviar, o escribe por WhatsApp.",
    errorVerificacion:
      "Falta completar la verificación anti-robots que está arriba del botón.",
  },

  /** Columna lateral: el canal rápido y dónde se opera. */
  lateral: {
    whatsappTitulo: "Canal rápido",
    whatsappTexto:
      "Para una pregunta corta o para saber si un proyecto entra en un presupuesto, WhatsApp es más rápido que el formulario.",
    whatsappBoton: "Escribir por WhatsApp",

    zonasTitulo: "Dónde se opera",
    zonasTexto:
      "El trabajo se hace en remoto de punta a punta —briefing, avances y entrega—, así que no hace falta estar en la misma ciudad.",

    horarioTitulo: "Tiempo de respuesta",
    horarioTexto:
      "Las solicitudes se responden en días hábiles. No hay respuestas automáticas: contesta una persona.",
  },
} as const;
