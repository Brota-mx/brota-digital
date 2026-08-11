"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  contactoPagina,
  LIMITES,
  OPCIONES_PRESUPUESTO,
} from "@/content/contacto";
import { servicios } from "@/content/servicios";
import { site } from "@/content/site";

/**
 * El formulario de contacto — la mitad de cliente de las 6 capas de §5.
 *
 * LO QUE ESTE COMPONENTE *NO* ES
 *
 * No es una capa de seguridad. Cualquiera puede saltárselo con un `curl`. La
 * validación que cuenta está en `app/api/contacto/route.ts` y corre sobre el
 * cuerpo crudo. Aquí lo único irreemplazable es el widget de Turnstile, porque
 * el token solo se puede emitir en el navegador.
 *
 * SIN LIBRERÍA DE FORMULARIOS, Y QUIÉN VALIDA AHORA
 *
 * Llevaba React Hook Form + el resolver de Zod: dos dependencias que validaban
 * en el navegador con el mismo esquema del endpoint. Se quitaron, y el trabajo
 * quedó repartido entre los dos que ya lo hacían gratis:
 *
 * - El NAVEGADOR atrapa lo obvio antes de tocar la red, con los atributos que
 *   el HTML ya trae: `required`, `type="email"`, `maxLength`, `minLength`. Por
 *   eso el `<form>` ya no lleva `noValidate` — lo llevaba precisamente para
 *   apagar esto y que validara la librería.
 * - El SERVIDOR es la autoridad y siempre lo fue. Devuelve un mensaje por campo
 *   (`{ error: "validacion", campos: {…} }`) y esos mensajes se pintan junto a
 *   su control, que es exactamente lo que se pintaba antes.
 *
 * El precio: lo que el navegador no sabe comprobar —el formato del teléfono
 * mexicano, un nombre que era solo etiquetas HTML— ya no se marca mientras se
 * teclea, sino al enviar. Es un viaje de ida y vuelta en el caso raro, a cambio
 * de no mandar un validador entero al teléfono de cada visitante. Y los mensajes
 * del navegador salen en el idioma DEL NAVEGADOR, no del sitio: es el mismo
 * trato que ya se acepta con los controles nativos del `<select>`.
 *
 * Sin React Hook Form este archivo tampoco importa `lib/contacto.ts`, que es lo
 * que mantiene a Zod fuera del paquete del navegador. Los topes de longitud
 * viven en `content/contacto.ts` por esa razón.
 *
 * LOS SEIS ESTADOS VISIBLES (§5)
 *
 * Reposo · enviando · éxito · error de validación · error de servidor ·
 * rate-limited. El sexto —`no-disponible`, el 503 del fail-closed— se pinta
 * aparte del error de servidor genérico porque dice algo distinto: no es «falló,
 * reintenta», es «este canal no está y el otro sí». Enviar un visitante a
 * reintentar contra un 503 que va a seguir ahí es mandarlo a perder el tiempo.
 *
 * EL BOTÓN NO PUEDE SALTAR AL DESHABILITARSE (§5)
 *
 * «Enviar solicitud» y «Enviando…» no miden lo mismo, así que el botón lleva un
 * ancho mínimo que cabe a los dos y el texto se centra dentro. Sin eso, el
 * layout da un tirón justo en el momento en que el visitante está mirando.
 */

/**
 * Tipos mínimos del widget de Cloudflare, escritos a mano.
 *
 * La alternativa era `@types/cloudflare-turnstile` o un envoltorio de React:
 * dos dependencias para cuatro firmas que caben en doce líneas. Regla 10
 * (`ponytail`).
 */
declare global {
  interface Window {
    turnstile?: {
      render: (
        contenedor: HTMLElement,
        opciones: {
          sitekey: string;
          size?: "normal" | "compact";
          language?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widget?: string) => void;
    };
  }
}

/**
 * Se lee en el módulo y no dentro del componente: `process.env.NEXT_PUBLIC_*`
 * lo sustituye el compilador por su valor literal, y solo lo hace cuando la
 * referencia es estática.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Estado =
  | "reposo"
  | "enviando"
  | "exito"
  | "validacion"
  | "servidor"
  | "no-disponible"
  | "limite"
  | "verificacion";

/** Los estados que se anuncian en la banda de aviso. */
const AVISOS: Partial<Record<Estado, string>> = {
  validacion: contactoPagina.estados.errorValidacion,
  servidor: contactoPagina.estados.errorServidor,
  "no-disponible": contactoPagina.estados.errorNoDisponible,
  limite: contactoPagina.estados.errorLimite,
  verificacion: contactoPagina.estados.errorVerificacion,
};

const campoBase =
  "mt-2 block min-h-11 w-full border-b border-black/25 bg-transparent px-0 py-2 font-body text-base text-black transition-colors duration-200 ease-out placeholder:text-gray hover:border-black focus:border-black";

export function FormularioContacto() {
  const [estado, setEstado] = useState<Estado>("reposo");
  /** Mensaje por campo, tal como lo devuelve el endpoint. */
  const [errores, setErrores] = useState<Record<string, string>>({});

  const contenedorWidget = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  /**
   * El token va en una ref y no en el estado: no se pinta en ningún lado, así
   * que guardarlo en `useState` solo compraría un re-render por cada token.
   */
  const token = useRef("");

  /**
   * Pinta el widget con render explícito.
   *
   * El implícito (`class="cf-turnstile"`) escanea el DOM cuando el script
   * carga, y aquí el div lo pinta React después: es una carrera que a veces se
   * pierde y deja el hueco vacío. `onReady` de `next/script` corre cuando el
   * script ya está, y la guarda de `widget.current` evita el doble pintado del
   * modo estricto en desarrollo.
   */
  const pintarWidget = useCallback(() => {
    if (!SITE_KEY || !contenedorWidget.current) return;
    if (widget.current !== undefined || !window.turnstile) return;

    widget.current = window.turnstile.render(contenedorWidget.current, {
      sitekey: SITE_KEY,
      // El widget normal mide 300 px y no encoge. A 320 px de pantalla la
      // columna solo tiene 272, así que el widget estiraba la rejilla entera y
      // el documento desbordaba 19 px — lo cazó la medición a 320, no la vista.
      // `compact` (150×140) es la respuesta que Cloudflare da a ese caso.
      //
      // Se decide midiendo el hueco real y no un ancho de pantalla: el widget
      // no sabe a qué viewport corresponde, sabe cuánto espacio le dieron. Se
      // mide una vez, al pintar, porque el widget no se vuelve a montar al
      // girar el teléfono; entre 150 y 300 el `compact` sobra y no estorba.
      size: contenedorWidget.current.clientWidth < 300 ? "compact" : "normal",
      language: "es",
      callback: (t) => {
        token.current = t;
        // Si el intento anterior murió por falta de token, el mensaje deja de
        // ser cierto en cuanto el widget entrega uno. Se vacía en vez de
        // borrarse: la vista solo pregunta si hay texto, y el mismo objeto se
        // reemplaza entero en el siguiente envío.
        setErrores((previos) =>
          previos.token ? { ...previos, token: "" } : previos,
        );
      },
      // Un token vale una vez y caduca a los 5 minutos. Al vencer o fallar se
      // borra: el formulario vuelve a estar incompleto, que es la verdad.
      "expired-callback": () => {
        token.current = "";
      },
      "error-callback": () => {
        token.current = "";
      },
    });
  }, []);

  const onSubmit = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;

    setEstado("enviando");
    setErrores({});

    // `FormData` lee el formulario del DOM: cada control aporta su `name` y su
    // valor, sin que haya que registrarlos uno por uno ni mantener una copia
    // del estado en React. El honeypot entra aquí como un campo más, que es lo
    // que el esquema del endpoint espera.
    const campos = Object.fromEntries(new FormData(formulario));

    try {
      const r = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...campos, token: token.current }),
      });

      if (r.ok) {
        setEstado("exito");
        return;
      }

      const cuerpo: { error?: string; campos?: Record<string, string> } =
        await r.json().catch(() => ({}));

      if (r.status === 429) setEstado("limite");
      else if (r.status === 503) setEstado("no-disponible");
      else if (cuerpo.error === "verificacion") setEstado("verificacion");
      else if (cuerpo.error === "validacion" && cuerpo.campos) {
        setErrores(cuerpo.campos);
        setEstado("validacion");
      } else setEstado("servidor");
    } catch {
      setEstado("servidor");
    }

    // El token se consume en el intento, salga como salga. Sin este reinicio
    // el segundo envío manda un token quemado y Turnstile lo rechaza —un fallo
    // que parece del formulario y es del widget.
    window.turnstile?.reset(widget.current);
    token.current = "";
  };

  // ── Éxito: sustituye al formulario ────────────────────────────────────────
  //
  // No se deja el formulario lleno debajo del aviso: invita a mandarlo otra
  // vez, y el segundo envío se lo come el rate limit.
  if (estado === "exito") {
    const { titulo, texto } = contactoPagina.estados.exito;
    return (
      <div
        // `alert` lo anuncia sin esperar a que el lector de pantalla llegue
        // aquí navegando, y `tabIndex` permite que el foco caiga en el aviso.
        role="alert"
        tabIndex={-1}
        className="border-t-2 border-coral-ink pt-6"
      >
        <h3 className="font-display text-[clamp(24px,3.4vw,34px)] leading-[1.15] font-semibold">
          {titulo}
        </h3>
        <p className="mt-4 max-w-[46ch] text-gray">{texto}</p>
      </div>
    );
  }

  const aviso = AVISOS[estado];
  const enviando = estado === "enviando";

  return (
    <>
      {/* Solo se carga si hay clave pública. Sin ella no hay widget que pintar
          y el endpoint responde 503 de todas formas (fail-closed): cargar el
          script sería pedir 60 KB para nada. */}
      {SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          onReady={pintarWidget}
        />
      )}

      <form
        // `method="post"` sin `action` no es decoración: un formulario sin los
        // dos hace GET a la ruta actual, y eso mete nombre, correo y teléfono
        // en la barra de direcciones, en el historial y en los registros del
        // servidor. Solo pasa si el JavaScript no llegó a enganchar el
        // `onSubmit` —sin JS el formulario ni se muestra, ver el `noscript` de
        // la página—, pero es un atributo contra una fuga de datos personales.
        method="post"
        onSubmit={onSubmit}
        // `relative` es para el honeypot, que se saca del lienzo con posición
        // absoluta y necesita un contenedor posicionado.
        className="relative"
      >
        {/* ── Banda de aviso ─────────────────────────────────────────────── */}
        {/* Reservada siempre en el árbol para que el `aria-live` exista antes
            de tener texto: una región que aparece ya con contenido no se
            anuncia en varios lectores de pantalla. */}
        <div aria-live="polite" className="empty:hidden">
          {aviso && (
            <p className="mb-8 border-l-2 border-coral-ink bg-cream-2 px-5 py-4 text-sm text-black">
              {aviso}
            </p>
          )}
        </div>

        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          <Campo
            id="nombre"
            label={contactoPagina.campos.nombre.label}
            error={errores.nombre}
          >
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              minLength={2}
              maxLength={LIMITES.nombre}
              autoComplete="name"
              aria-invalid={!!errores.nombre}
              aria-describedby={errores.nombre ? "nombre-error" : undefined}
              className={campoBase}
            />
          </Campo>

          <Campo
            id="correo"
            label={contactoPagina.campos.correo.label}
            error={errores.correo}
          >
            <input
              id="correo"
              name="correo"
              type="email"
              required
              maxLength={LIMITES.correo}
              autoComplete="email"
              aria-invalid={!!errores.correo}
              aria-describedby={errores.correo ? "correo-error" : undefined}
              className={campoBase}
            />
          </Campo>

          <Campo
            id="telefono"
            label={contactoPagina.campos.telefono.label}
            ayuda={contactoPagina.campos.telefono.ayuda}
            error={errores.telefono}
          >
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              maxLength={LIMITES.telefono}
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={!!errores.telefono}
              aria-describedby={
                errores.telefono ? "telefono-error" : "telefono-ayuda"
              }
              className={campoBase}
            />
          </Campo>

          <Campo
            id="negocio"
            label={contactoPagina.campos.negocio.label}
            ayuda={contactoPagina.campos.negocio.ayuda}
            error={errores.negocio}
          >
            {/* El único campo opcional: sin `required`. */}
            <input
              id="negocio"
              name="negocio"
              type="text"
              maxLength={LIMITES.negocio}
              autoComplete="organization"
              aria-invalid={!!errores.negocio}
              aria-describedby={
                errores.negocio ? "negocio-error" : "negocio-ayuda"
              }
              className={campoBase}
            />
          </Campo>

          {/* El campo que hace trabajar a la escalera (§5). Ocupa las dos
              columnas: es el que decide cómo se responde, no un dato más. */}
          <Campo
            id="presupuesto"
            label={contactoPagina.campos.presupuesto.label}
            ayuda={contactoPagina.campos.presupuesto.ayuda}
            error={errores.presupuesto}
            className="sm:col-span-2"
          >
            <select
              id="presupuesto"
              name="presupuesto"
              required
              defaultValue=""
              aria-invalid={!!errores.presupuesto}
              aria-describedby={
                errores.presupuesto ? "presupuesto-error" : "presupuesto-ayuda"
              }
              className={`${campoBase} cursor-pointer`}
            >
              <option value="" disabled>
                {contactoPagina.presupuestoVacio}
              </option>
              {OPCIONES_PRESUPUESTO.map((opcion) => {
                // La etiqueta se arma del peldaño real: el día que un rango
                // cambie de precio, cambia en `content/servicios.ts` y ya.
                const peldano = servicios.find((s) => s.id === opcion);
                return (
                  <option key={opcion} value={opcion}>
                    {peldano
                      ? `${peldano.nombre} · ${peldano.rango}`
                      : contactoPagina.presupuestoIndeciso}
                  </option>
                );
              })}
            </select>
          </Campo>

          <Campo
            id="mensaje"
            label={contactoPagina.campos.mensaje.label}
            ayuda={contactoPagina.campos.mensaje.ayuda}
            error={errores.mensaje}
            className="sm:col-span-2"
          >
            <textarea
              id="mensaje"
              name="mensaje"
              rows={6}
              required
              minLength={10}
              maxLength={LIMITES.mensaje}
              aria-invalid={!!errores.mensaje}
              aria-describedby={
                errores.mensaje ? "mensaje-error" : "mensaje-ayuda"
              }
              className={`${campoBase} resize-y`}
            />
          </Campo>
        </div>

        {/* ── Honeypot (capa 3) ──────────────────────────────────────────── */}
        {/* Fuera del lienzo en vez de `display:none`: hay bots que saltan lo
            que no se renderiza. `aria-hidden` y `tabIndex={-1}` lo sacan del
            camino de quien navega con lector de pantalla o con teclado, que
            son justamente los que caerían en la trampa por accidente.

            Nunca `required`: un control obligatorio que no se puede enfocar
            atasca la validación nativa del navegador sin decir por qué. */}
        <div aria-hidden="true" className="absolute top-0 -left-[9999px]">
          <label htmlFor="website">{contactoPagina.honeypot}</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            maxLength={LIMITES.honeypot}
          />
        </div>

        {/* ── Turnstile (capa 5) ─────────────────────────────────────────── */}
        {/* El token no es un campo del formulario: lo emite el widget y se
            agrega al cuerpo en el envío. Su error sí se pinta aquí, porque es
            aquí donde está el control que lo resuelve. */}
        <div className="mt-10">
          <div ref={contenedorWidget} />
          {errores.token && (
            <p className="mt-3 text-sm text-coral-ink">{errores.token}</p>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button
            type="submit"
            disabled={enviando}
            // El ancho mínimo cabe a las dos etiquetas: sin él, «Enviando…»
            // encoge el botón y el layout salta (§5).
            className="min-w-[13rem]"
          >
            {enviando ? contactoPagina.enviando : contactoPagina.enviar}
          </Button>

          {/* La frase y el enlace, separados. `min-h-11 min-w-11` es la regla
              12 —sin ellos el enlace daba 126×18, otra vez el alto, y otra vez
              lo dijo la medición y no la vista— y aquí no le cuesta nada al
              texto, porque ya no está dentro de él. */}
          <div className="max-w-[34ch] text-sm text-gray">
            <p>{contactoPagina.privacidad}</p>
            <Link
              href={site.legal.href}
              className="inline-flex min-h-11 min-w-11 items-center text-coral-ink underline underline-offset-4"
            >
              {site.legal.label}
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

/**
 * Envoltorio de campo: rótulo arriba, ayuda debajo del rótulo, error debajo
 * del control.
 *
 * El error va en `--coral-ink` —el único acento que puede ser letra, y solo
 * sobre crema— pero el color NO es la señal: el mensaje dice qué pasa, el
 * `aria-invalid` lo marca en el árbol de accesibilidad y el
 * `aria-describedby` lo enlaza al control. Quien no distinga el color lee
 * exactamente lo mismo.
 */
function Campo({
  id,
  label,
  ayuda,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  ayuda?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block">
        <Eyebrow as="span" className="block text-black">
          {label}
        </Eyebrow>
      </label>
      {ayuda && (
        <p id={`${id}-ayuda`} className="mt-1 text-sm text-gray">
          {ayuda}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-coral-ink">
          {error}
        </p>
      )}
    </div>
  );
}
