import { contactoSchema, soloDigitos } from "@/lib/contacto";

/**
 * Endpoint del formulario de contacto — las 6 capas de seguridad de §5.
 *
 * ORDEN DE LAS CAPAS, Y POR QUÉ ES ESE
 *
 *   0. Fail-closed (capa 6 de §5, primera en ejecutarse).
 *   1. Zod sobre el cuerpo crudo.
 *   2. Sanitización anti-injection.
 *   3. Honeypot → 200 en silencio.
 *   4. Rate limit por IP (Upstash).
 *   5. Turnstile verificado en servidor.
 *   → Resend.
 *
 * §5 numera el fail-closed al final porque es una *propiedad*, no un paso: si
 * falta un secreto no hay nada que ejecutar, así que se comprueba antes que
 * todo. El resto sigue el orden del blueprint, y ese orden además es el barato:
 * las dos capas que cuestan red (4 y 5) van después de las tres que cuestan
 * CPU, así que una inundación de basura no gasta una sola llamada de salida.
 *
 * SIN SDKs: TRES `fetch` Y NINGUNA DEPENDENCIA
 *
 * Resend, Upstash y Turnstile entran por su API REST documentada, no por su
 * paquete de npm. El blueprint §2 nombra los tres *servicios*, no tres
 * dependencias, y cada una es una petición de diez líneas. Regla 10 del
 * CLAUDE.md (`ponytail`): cero dependencias que el blueprint no pida. El
 * beneficio secundario importa igual — `pnpm audit --prod` tiene que dar 0
 * siempre, y cada paquete que no está es superficie que no hay que auditar.
 *
 * NUNCA SE DEVUELVE EL PORQUÉ EXACTO
 *
 * Los códigos de estado son los que el cliente necesita para elegir uno de los
 * seis estados visibles (400, 429, 503, 502, 200) y nada más. Un cuerpo de
 * error que diga «token de Turnstile inválido» le dice al bot qué capa lo
 * paró. Los detalles de validación de Zod sí se devuelven, porque son sobre lo
 * que el visitante escribió y sirven para corregirlo.
 */

/** Ventana de rate limit: 5 envíos por IP cada 10 minutos (§5, «ventana corta»). */
const LIMITE_ENVIOS = 5;
const LIMITE_VENTANA_S = 600;

/** Tope del cuerpo crudo. La suma de los máximos de §5 no llega a 6 KB. */
const CUERPO_MAX_BYTES = 16 * 1024;

/** Ninguna llamada de salida puede colgar la petición del visitante. */
const TIMEOUT_MS = 6000;

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_EMAILS = "https://api.resend.com/emails";

const json = (cuerpo: unknown, status: number) =>
  Response.json(cuerpo, { status });

// ── Capa 0 · Fail-closed ────────────────────────────────────────────────────
//
// Las seis variables que hacen falta para procesar un envío CON las
// protecciones puestas. Falta una → 503 y no se procesa nada. Nunca "se manda
// el correo y ya, el rate limit lo arreglamos luego": esa es exactamente la
// configuración que deja un formulario abierto en producción durante semanas.
//
// `NEXT_PUBLIC_TURNSTILE_SITE_KEY` no está en la lista porque es del cliente:
// sin ella el widget no se pinta, no hay token, y el envío muere en Zod.
const REQUERIDAS = [
  "RESEND_API_KEY",
  "CONTACT_EMAIL",
  "CONTACT_FROM",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "TURNSTILE_SECRET_KEY",
] as const;

type Entorno = Record<(typeof REQUERIDAS)[number], string>;

function leerEntorno(): Entorno | null {
  const valores = {} as Entorno;
  for (const clave of REQUERIDAS) {
    const valor = process.env[clave];
    if (!valor) return null;
    valores[clave] = valor;
  }
  return valores;
}

// ── Capa 2 · Sanitización anti-injection ────────────────────────────────────

/**
 * Limpia una línea que puede acabar en una CABECERA de correo (el asunto, el
 * nombre del `reply_to`).
 *
 * El salto de línea es el vector: `Nombre\r\nBcc: victima@…` convierte un
 * campo en una cabecera nueva. Se manda por API REST y no por SMTP, así que
 * Resend arma las cabeceras y el riesgo directo no aplica, pero el dato viaja
 * a un buzón y de ahí a saber dónde: se limpia igual, aquí, una vez.
 */
const unaLinea = (v: string) => sinPeligros(v).replace(/[\r\n\t]+/g, " ").trim();

/**
 * Limpia texto de varias líneas (el mensaje). Conserva los saltos —es prosa—
 * pero no los caracteres de control ni el marcado.
 */
const variasLineas = (v: string) =>
  sinPeligros(v)
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/**
 * Lo común a los dos: fuera etiquetas HTML, fuera caracteres de control, y
 * fuera los esquemas de URL que solo sirven para ejecutar algo.
 *
 * El correo se envía en `text/plain` —sin campo `html`—, así que una etiqueta
 * no se interpreta en ningún lado. Se quitan de todas formas porque el texto
 * se lee en clientes de correo que a veces autolinkan, y porque «URLs
 * sospechosas» es literalmente lo que pide §5. Las URLs normales NO se tocan:
 * un prospecto que manda su sitio actual es el caso de uso, no el ataque.
 */
function sinPeligros(v: string) {
  return (
    v
      // Etiquetas completas y cierres sueltos.
      .replace(/<[^>]*>/g, " ")
      // Los tres esquemas ejecutables. El `\s*` cubre `java\tscript:`.
      .replace(/\b(?:javascript|data|vbscript)\s*:/gi, "")
      // Controles C0 y C1 salvo \t, \n y \r — los tres saltos los resuelve
      // quien llama, según la línea sea una o varias.
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
  );
}

// ── Capa 4 · Rate limit por IP ──────────────────────────────────────────────

/**
 * Ventana fija con `INCR` + `EXPIRE … NX` en una sola tubería de Upstash.
 *
 * `NX` es lo que la hace ventana y no cuenta eterna: pone el vencimiento solo
 * la primera vez, así que el contador muere 10 minutos después del PRIMER
 * envío y no se renueva con cada intento. Sin `NX`, quien insiste mantiene su
 * propio bloqueo vivo para siempre.
 *
 * Devuelve `null` si Upstash no contesta o contesta cualquier cosa rara: quien
 * llama lo trata como 503. Un rate limit que se cae y deja pasar no es un rate
 * limit (§5, fail-closed).
 */
async function dentroDelLimite(
  env: Entorno,
  ip: string,
): Promise<boolean | null> {
  const clave = `contacto:${ip}`;
  try {
    const r = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", clave],
        ["EXPIRE", clave, LIMITE_VENTANA_S, "NX"],
      ]),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!r.ok) return null;

    const datos: unknown = await r.json();
    if (!Array.isArray(datos)) return null;
    const cuenta = (datos[0] as { result?: unknown } | undefined)?.result;
    if (typeof cuenta !== "number") return null;

    return cuenta <= LIMITE_ENVIOS;
  } catch {
    return null;
  }
}

/**
 * La IP del visitante.
 *
 * En Vercel `x-forwarded-for` siempre viene y el primer valor es el cliente.
 * Si no viene —desarrollo local, o un proxy raro— se usa una clave única
 * compartida en vez de saltarse la capa: todo lo no identificable cae en el
 * mismo cubo, que es más estricto y no menos. Nunca se devuelve `null`: eso
 * sería un rate limit opcional.
 */
const ipDe = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "sin-ip";

// ── Capa 5 · Turnstile ──────────────────────────────────────────────────────

/** `null` = no se pudo verificar (→ 503). `false` = token rechazado (→ 400). */
async function tokenValido(
  env: Entorno,
  token: string,
  ip: string,
): Promise<boolean | null> {
  try {
    const cuerpo = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
    });
    // Solo se manda si es una IP de verdad; `sin-ip` no lo es.
    if (ip !== "sin-ip") cuerpo.set("remoteip", ip);

    const r = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: cuerpo,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!r.ok) return null;

    const datos: unknown = await r.json();
    const ok = (datos as { success?: unknown }).success;
    return typeof ok === "boolean" ? ok : null;
  } catch {
    return null;
  }
}

// ── El handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // Capa 0. Antes que nada, y sin decir qué falta.
  const env = leerEntorno();
  if (!env) return json({ error: "no-disponible" }, 503);

  // Tope de cuerpo. Se mide lo LEÍDO y no la cabecera `content-length`: la
  // cabecera la escribe el cliente y puede mentir, así que un cuerpo grande
  // tiene que caer aquí de todas formas. Comprobar además la cabecera no cambia
  // ni una respuesta — solo agrega la ilusión de dos defensas donde hay una.
  const crudo = await req.text();
  if (crudo.length > CUERPO_MAX_BYTES) return json({ error: "grande" }, 413);

  let cuerpo: unknown;
  try {
    cuerpo = JSON.parse(crudo);
  } catch {
    return json({ error: "invalido" }, 400);
  }

  // Capa 1.
  const parseo = contactoSchema.safeParse(cuerpo);
  if (!parseo.success) {
    // Solo campo → primer mensaje. Es lo que el cliente pinta junto al input;
    // no revela nada que el visitante no acabe de escribir.
    const campos: Record<string, string> = {};
    for (const asunto of parseo.error.issues) {
      const campo = String(asunto.path[0] ?? "");
      if (campo && !campos[campo]) campos[campo] = asunto.message;
    }
    return json({ error: "validacion", campos }, 400);
  }
  const datos = parseo.data;

  // Capa 2.
  //
  // Sin recortes por longitud: Zod ya rechazó arriba lo que pasaba de
  // `LIMITES`, y las tres funciones de saneo solo pueden ACORTAR —una etiqueta
  // se cambia por un espacio, un esquema ejecutable y los caracteres de control
  // por nada, y al final va un `trim`—. Un `.slice(0, LIMITES.x)` aquí no
  // podría recortar un solo byte nunca.
  const limpio = {
    nombre: unaLinea(datos.nombre),
    correo: unaLinea(datos.correo),
    telefono: soloDigitos(datos.telefono),
    negocio: unaLinea(datos.negocio),
    presupuesto: datos.presupuesto,
    mensaje: variasLineas(datos.mensaje),
  };

  // El saneado puede dejar vacío lo que Zod dio por bueno: un nombre que era
  // solo `<b></b>` pasa el `min(2)` y sale en blanco. Se rechaza como lo que
  // es, un cuerpo inválido, y no se manda un correo con campos vacíos.
  if (!limpio.nombre || !limpio.correo || !limpio.mensaje) {
    return json({ error: "invalido" }, 400);
  }

  // Capa 3. Doscientos, sin pistas, sin correo y sin gastar red.
  if (datos.website.trim()) return json({ ok: true }, 200);

  const ip = ipDe(req);

  // Capa 4.
  const permitido = await dentroDelLimite(env, ip);
  if (permitido === null) return json({ error: "no-disponible" }, 503);
  if (!permitido) return json({ error: "limite" }, 429);

  // Capa 5.
  const verificado = await tokenValido(env, datos.token, ip);
  if (verificado === null) return json({ error: "no-disponible" }, 503);
  if (!verificado) return json({ error: "verificacion" }, 400);

  // Envío. El asunto lleva el presupuesto porque es el dato que decide si la
  // solicitud se atiende hoy o el jueves — la razón entera de que el campo
  // exista (§5).
  const asunto = unaLinea(
    `Cotización · ${limpio.presupuesto} · ${limpio.nombre}`,
  );
  const texto = [
    `Nombre:       ${limpio.nombre}`,
    `Correo:       ${limpio.correo}`,
    `Teléfono:     ${limpio.telefono}`,
    `Negocio:      ${limpio.negocio || "—"}`,
    `Presupuesto:  ${limpio.presupuesto}`,
    "",
    "Mensaje:",
    limpio.mensaje,
  ].join("\n");

  try {
    const r = await fetch(RESEND_EMAILS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_EMAIL],
        // Responder al correo abre la respuesta al prospecto. El `from` sigue
        // siendo el dominio verificado: poner el correo del visitante ahí
        // rompería SPF y el mensaje acabaría en spam.
        reply_to: limpio.correo,
        subject: asunto,
        // Solo texto: sin campo `html` no hay marcado que interpretar.
        text: texto,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!r.ok) return json({ error: "envio" }, 502);
  } catch {
    return json({ error: "envio" }, 502);
  }

  return json({ ok: true }, 200);
}
