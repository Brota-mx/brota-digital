import { z } from "zod";

import { LIMITES, OPCIONES_PRESUPUESTO } from "@/content/contacto";

/**
 * Esquema del formulario de contacto — capa 1 de las 6 de §5.
 *
 * Vive fuera de `content/` y fuera de la ruta porque lo consumen los DOS
 * lados: el cliente para pintar el error junto al campo mientras se escribe, y
 * el endpoint para volver a validar sin confiar en nada de lo anterior. Es el
 * mismo objeto, no dos copias que se desincronizan — que es exactamente cómo
 * un formulario "validado" acaba aceptando un cuerpo que el cliente jamás
 * habría mandado.
 *
 * ⚠️ La validación del cliente es comodidad, no seguridad. El endpoint corre
 * `safeParse` sobre el cuerpo crudo antes de tocar nada más, y esa es la que
 * cuenta.
 *
 * Los mensajes están aquí y no en `content/` a propósito: el endpoint los
 * devuelve sin renderizar una página, así que no son "texto visible de un
 * componente" sino parte del contrato del esquema. `content/contacto.ts` tiene
 * los rótulos y los seis estados; esto tiene los porqués de un rechazo.
 */

/**
 * Teléfono mexicano: 10 dígitos, con `+52` opcional (§5).
 *
 * Se valida sobre los dígitos y no sobre lo tecleado a propósito: la gente
 * escribe `998 734 7034`, `(998) 734-7034` y `+52 998 734 7034`, y rechazar
 * por un espacio es perder un prospecto por una regla de formato que no le
 * importa a nadie. Los separadores se tiran antes de la regex; lo que se
 * guarda y se envía por correo es el número normalizado.
 */
const DIEZ_DIGITOS_MX = /^(52)?\d{10}$/;

export const soloDigitos = (v: string) => v.replace(/\D/g, "");

/**
 * Mensaje de respaldo de cada campo de texto, para cuando el dato falta o no
 * es una cadena.
 *
 * Sin esto Zod contesta con su texto por defecto —«Invalid input: expected
 * string, received number»— y ese mensaje llega al navegador del visitante.
 * El sitio es monolingüe en español (blueprint §2) y un error en inglés es
 * texto visible sin traducir; lo cazó el caso 12 de la batería, no el
 * formulario, porque desde el formulario los campos siempre salen como texto.
 */
const faltaOnoEsTexto = (que: string) => ({ error: `Falta ${que}.` });

export const contactoSchema = z.object({
  nombre: z
    .string(faltaOnoEsTexto("el nombre"))
    .trim()
    .min(2, "Escribe el nombre completo.")
    .max(LIMITES.nombre, "El nombre es demasiado largo."),

  correo: z
    .string(faltaOnoEsTexto("el correo"))
    .trim()
    .max(LIMITES.correo, "El correo es demasiado largo.")
    .pipe(z.email("Revisa el correo: falta el @ o el dominio.")),

  telefono: z
    .string(faltaOnoEsTexto("el teléfono"))
    .trim()
    .max(LIMITES.telefono, "El teléfono es demasiado largo.")
    .refine(
      (v) => DIEZ_DIGITOS_MX.test(soloDigitos(v)),
      "Escribe 10 dígitos. El +52 es opcional.",
    ),

  // El único campo opcional del formulario. `default("")` en vez de
  // `.optional()` para que el tipo sea `string` y el endpoint no tenga que
  // preguntarse si existe antes de sanearlo.
  negocio: z
    .string(faltaOnoEsTexto("el nombre del negocio"))
    .trim()
    .max(LIMITES.negocio, "El nombre del negocio es demasiado largo.")
    .default(""),

  presupuesto: z.enum(
    OPCIONES_PRESUPUESTO,
    "Elige un rango. Si no hay uno claro, «No estoy seguro todavía» también sirve.",
  ),

  mensaje: z
    .string(faltaOnoEsTexto("el mensaje"))
    .trim()
    .min(10, "Cuenta un poco más: con una línea no se puede cotizar.")
    .max(LIMITES.mensaje, "El mensaje es demasiado largo."),

  /**
   * Honeypot (capa 3). Se declara en el esquema para que un cuerpo que lo trae
   * lleno siga siendo *válido* — si Zod lo rechazara, el bot recibiría un 400
   * y sabría que el campo existe. Válido y descartado en silencio con 200 es
   * el punto entero de la trampa.
   */
  website: z
    .string(faltaOnoEsTexto("el campo oculto"))
    .max(LIMITES.honeypot)
    .default(""),

  /**
   * Token de Turnstile (capa 5). Obligatorio en el esquema: el caso «sin
   * token» de la batería de §5 se resuelve aquí, en CPU, antes de gastar una
   * llamada a Cloudflare.
   */
  token: z
    .string(faltaOnoEsTexto("la verificación anti-robots"))
    .min(1, "Falta completar la verificación anti-robots.")
    .max(LIMITES.token),
});

// Sin tipos `input`/`output` exportados: los consumía el formulario cuando
// llevaba React Hook Form. El endpoint usa el tipo que `safeParse` ya devuelve
// inferido, y un alias que nadie importa es una firma más que mantener.
