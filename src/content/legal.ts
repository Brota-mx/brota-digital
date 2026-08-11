/**
 * Aviso de privacidad (LFPDPPP) — paso 11 del orden de construcción.
 *
 * POR QUÉ HAY CAMPOS VACÍOS Y QUÉ PASA MIENTRAS LO ESTÉN
 *
 * `IDENTIDAD` son los datos que la ley exige para identificar al responsable y
 * que **no se pueden redactar, solo conocer**. Mientras alguno esté vacío,
 * `avisoCompleto` es `false` y entonces:
 *
 * - `/aviso-de-privacidad` responde **404** con la página del sitio, y
 * - `app/sitemap.ts` no la anuncia.
 *
 * Es a propósito, y es la parte importante de este archivo. La alternativa
 * —publicar con marcadores tipo 〔razón social〕— es peor que no tener aviso: un
 * documento legal con huecos a la vista dice de la agencia justo lo contrario
 * de lo que el sitio entero intenta decir. Y la otra alternativa, romper el
 * build, dejaría el repositorio en rojo por un dato que depende de una
 * conversación entre socios.
 *
 * Así que el estado incompleto es un estado válido y silencioso: el enlace
 * legal del footer y del formulario sigue llevando al 404, exactamente como
 * antes de que esta página existiera, y el día que se llenen los cinco campos
 * la página aparece sola. **Nadie tiene que acordarse de encender nada.**
 *
 * ⚠️ LO QUE ESTE TEXTO AFIRMA ES VERIFICABLE, Y POR ESO ES FRÁGIL
 *
 * «No usamos cookies», «no hay base de datos de prospectos» y la tabla de
 * proveedores no salen de una plantilla: salen de leer `app/api/contacto/route.ts`,
 * `lib/contacto.ts` y `.env.example`. Es lo que le da fuerza y también lo que lo
 * vuelve delicado — **si el formulario cambia, este archivo miente el mismo
 * día.** Cualquiera que toque el endpoint tiene que pasar por aquí.
 *
 * ⚠️ LO QUE SIGUE SIN REVISIÓN PROFESIONAL
 *
 * Una pregunta de fondo queda abierta: si Resend, Upstash, Cloudflare y Vercel
 * son *encargados* (remisión, sin consentimiento) o *terceros* (transferencia
 * internacional, con consentimiento). El texto está redactado para sostener las
 * dos lecturas. Si la respuesta fuera «terceros con consentimiento expreso»,
 * el formulario necesita una casilla nueva — es lo único pendiente que puede
 * reabrir código ya cerrado.
 */

/**
 * Los cinco datos que faltan, y el único que ya está decidido.
 *
 * Se llenan aquí y en ningún otro lado. En cuanto los cinco tengan valor, la
 * página se enciende sola.
 */
export const IDENTIDAD = {
  /**
   * Quien responde por los datos: nombre completo de la persona física o
   * denominación social de la persona moral.
   *
   * ⚠️ **El responsable no es necesariamente quien factura**, sino quien decide
   * qué se hace con los datos. Nombrar aquí a una entidad que solo emite los
   * comprobantes le atribuiría un tratamiento ajeno a su actividad y publicaría
   * su domicilio en este sitio. Conviene decidirlo a propósito y no por inercia
   * administrativa.
   */
  razonSocial: "",

  /** Domicilio para oír y recibir notificaciones. Puede ser convencional. */
  domicilio: "",

  /**
   * Buzón para ejercer derechos ARCO. La ley obliga a atender lo que llegue
   * aquí, así que tiene que ser una dirección que alguien lea de verdad.
   */
  correoPrivacidad: "",

  /**
   * Quién conserva materialmente el correo, y dónde.
   *
   * ⚠️ Cloudflare **no** guarda correo: su Email Routing reenvía a otro buzón.
   * Si el correo de `@brotadigital.mx` se enruta con Cloudflare, aquí va el
   * destino final —el que sí lo almacena— y Cloudflare entra como un renglón
   * aparte en la tabla de proveedores, como quien enruta.
   */
  proveedorBuzon: "",
  paisBuzon: "",

  /**
   * Fecha de publicación, en formato legible («12 de agosto de 2026»).
   *
   * Escrita a mano y no derivada del build: la fecha de un despliegue cambia
   * cada vez que se toca cualquier cosa del sitio, y este campo dice cuándo
   * cambió **el aviso**, que es lo que un titular necesita saber.
   */
  ultimaActualizacion: "",
} as const;

/** Meses de conservación del mensaje tras la conversación. Decidido: 24. */
export const CONSERVACION_MESES = 24;

/**
 * ¿Están los datos? Si no, la ruta no existe.
 *
 * Se comprueba con `.trim()` porque un espacio en blanco es la forma más fácil
 * de encender la página por accidente sin haber llenado nada.
 */
export const avisoCompleto = Object.values(IDENTIDAD).every(
  (valor) => valor.trim() !== "",
);

/** Los campos que faltan, para poder decirlo en vez de dejarlo adivinar. */
export const camposPendientes = Object.entries(IDENTIDAD)
  .filter(([, valor]) => valor.trim() === "")
  .map(([campo]) => campo);

export const avisoPrivacidad = {
  eyebrow: "Legal",
  titulo: "Aviso de privacidad",

  /** Se arma con la fecha de `IDENTIDAD` para que no haya dos fechas que cuadrar. */
  actualizacionEtiqueta: "Última actualización:",

  secciones: [
    {
      id: "responsable",
      titulo: "Quién es responsable de tus datos",
      parrafos: [
        `${IDENTIDAD.razonSocial} («Brota Digital»), con domicilio en ${IDENTIDAD.domicilio}, es responsable del tratamiento de los datos personales que se recaban a través de este sitio.`,
        `Para cualquier asunto relacionado con este aviso o con tus datos personales, el canal es ${IDENTIDAD.correoPrivacidad}.`,
      ],
    },
    {
      id: "que-datos",
      titulo: "Qué datos se recaban",
      parrafos: ["Los que escribes en el formulario de contacto:"],
      lista: [
        "Nombre",
        "Correo electrónico",
        "Teléfono o WhatsApp",
        "Nombre del negocio (opcional)",
        "Rango de presupuesto aproximado",
        "El mensaje que redactas",
      ],
      parrafosFinales: [
        "Además, y solo por razones de seguridad, se recaba tu dirección IP: se usa para limitar el número de envíos por conexión y para la verificación anti-robots.",
        "Si escribes por WhatsApp quedan también el número desde el que escribes, el nombre de tu perfil y el contenido de la conversación, en los términos del propio servicio de WhatsApp.",
        "No se recaban datos personales sensibles. No se piden datos de salud, origen étnico, creencias, preferencias, situación patrimonial ni financiera, y no deben escribirse en el mensaje. Este sitio tampoco está dirigido a menores de edad ni recaba datos de menores a sabiendas.",
      ],
    },
    {
      id: "para-que",
      titulo: "Para qué se usan",
      parrafos: [
        "Finalidades necesarias, sin las cuales no se puede atender tu solicitud:",
      ],
      lista: [
        "Responder tu mensaje y darle seguimiento.",
        "Elaborar y enviarte una propuesta o cotización del alcance que pediste.",
        "Contactarte por correo, teléfono o WhatsApp sobre esa misma solicitud.",
        "En su caso, formalizar la contratación del servicio.",
        "Prevenir el abuso automatizado del formulario, que es la única finalidad de la dirección IP.",
      ],
      parrafosFinales: [
        "Finalidades adicionales: ninguna. Tus datos no se usan para publicidad, boletines, prospección, elaboración de perfiles ni mercadotecnia, y no se venden, rentan ni comparten con terceros para fines propios de esos terceros. Si algún día se quisieran usar para algo distinto de lo listado arriba, se te pediría tu consentimiento otra vez.",
      ],
    },
    {
      id: "verificacion",
      titulo: "Verificación automatizada",
      parrafos: [
        "Antes de aceptar un envío, el formulario ejecuta una verificación anti-robots (Cloudflare Turnstile) que decide de forma automatizada si la solicitud proviene de una persona o de un programa. Esa decisión solo determina si el mensaje se envía o no; no produce ningún efecto jurídico ni afecta tus derechos, y si te bloquea por error tienes el WhatsApp del sitio y el correo de contacto de arriba.",
      ],
    },
    {
      id: "conservacion",
      titulo: "Cuánto tiempo se conservan",
      lista: [
        `Tu mensaje se conserva en el buzón de correo de Brota Digital mientras dure la conversación comercial y por ${CONSERVACION_MESES} meses después, para poder acreditar qué se ofreció y qué se acordó. Después se elimina.`,
        "Tu dirección IP vive 10 minutos en el servicio de control de envíos y se borra sola. No se guarda junto a tu mensaje ni queda asociada a él.",
        "No hay base de datos de prospectos. El sitio es estático: lo que escribes no se guarda en ningún sistema de Brota Digital más allá del correo que se genera.",
      ],
    },
    {
      id: "cookies",
      titulo: "Cookies",
      parrafos: [
        "Este sitio no usa cookies. No hay analítica, ni pixeles de publicidad, ni rastreo entre sitios, ni almacenamiento local en tu navegador. Por eso tampoco verás un banner de consentimiento: no hay nada que consentir.",
      ],
    },
    {
      id: "proveedores",
      titulo: "Proveedores y transferencias fuera de México",
      parrafos: [
        "Para funcionar, el sitio se apoya en proveedores de infraestructura que actúan por cuenta e instrucción de Brota Digital y que no pueden usar tus datos para fines propios. Algunos procesan la información en Estados Unidos de América, por lo que tus datos salen del territorio nacional:",
      ],
      // Los proveedores salen del código, no de una plantilla: `.env.example`
      // tiene exactamente estas claves y `route.ts` hace exactamente estas tres
      // llamadas. Si se agrega un servicio al endpoint, se agrega uno aquí.
      //
      // Lista y no `<table>`, al revés que la de precios de `/servicios`. Esa
      // tiene dos columnas y cabe a 375 px; esta tendría cuatro y no cabe, así
      // que sería scroll horizontal —o una región tabulable— a cambio de nada:
      // no hay valores que comparar entre renglones, cada proveedor se lee
      // solo. La tabla ahí gana porque se comparan precios; aquí no.
      proveedores: [
        {
          nombre: "Resend",
          para: "Enviar a Brota Digital el correo con tu solicitud",
          recibe: "Todo lo que escribiste en el formulario",
          donde: "Estados Unidos",
        },
        {
          nombre: "Upstash",
          para: "Limitar los envíos por conexión",
          recibe: "Tu dirección IP, durante 10 minutos",
          donde: "Estados Unidos",
        },
        {
          nombre: "Cloudflare",
          para: "Verificación anti-robots y enrutamiento del correo",
          recibe: "Tu dirección IP y el resultado de la verificación",
          donde: "Estados Unidos",
        },
        {
          nombre: "Vercel",
          para: "Alojar y servir el sitio",
          recibe: "Tu dirección IP en los registros del servidor",
          donde: "Estados Unidos",
        },
        {
          nombre: IDENTIDAD.proveedorBuzon,
          para: "Recibir y conservar el correo",
          recibe: "Todo lo que escribiste",
          donde: IDENTIDAD.paisBuzon,
        },
      ],
      parrafosFinales: [
        "Al enviar el formulario aceptas que tus datos se procesen de esta forma. Fuera de estos proveedores, no se transfieren tus datos a nadie, salvo requerimiento fundado y motivado de una autoridad competente.",
        // La salida honesta: WhatsApp tampoco procesa en México, así que
        // ofrecerlo como refugio de quien no quiere que sus datos salgan del
        // país sería falso. Lo que sí se puede ofrecer es la elección informada.
        "Ninguno de los canales de este sitio procesa exclusivamente dentro de México: el correo y WhatsApp también se apoyan en servicios del extranjero. Si eso es un problema para ti, escríbenos y acordamos otra forma de tratar tu solicitud.",
      ],
    },
    {
      id: "derechos",
      titulo: "Tus derechos (ARCO)",
      parrafos: [
        "Tienes derecho a acceder a tus datos, rectificarlos si son inexactos, cancelarlos cuando ya no sean necesarios y oponerte a su tratamiento. También puedes revocar tu consentimiento en cualquier momento.",
        `Para ejercerlos, escribe a ${IDENTIDAD.correoPrivacidad} indicando:`,
      ],
      lista: [
        "Tu nombre y un correo o teléfono donde recibir la respuesta.",
        "Copia de una identificación oficial, para acreditar que eres tú (o el poder, si actúas en representación de alguien).",
        "Qué derecho quieres ejercer y sobre qué datos.",
        "Si pides una rectificación, cuál es el dato correcto y algún documento que lo respalde.",
      ],
      parrafosFinales: [
        // Se remite al plazo legal en vez de prometer un número propio. La ley
        // fija veinte días para comunicar la determinación y quince para
        // hacerla efectiva; lo que no está claro entre fuentes es si el cómputo
        // es en días hábiles o naturales, y un aviso que adjetiva mal el plazo
        // se equivoca en algo comprobable. Remitiendo, el texto es cierto con
        // cualquiera de los dos cómputos.
        "La respuesta se comunica dentro del plazo que fija la Ley Federal de Protección de Datos Personales en Posesión de los Particulares —veinte días para comunicarte la determinación y quince más para hacerla efectiva si procede—, y el trámite es gratuito: solo se cobrarían los gastos de envío o de reproducción en copias, si los hubiera.",
        "Revocar tu consentimiento o cancelar tus datos puede impedir que se te responda: si se borra tu solicitud, no queda a quién contestarle.",
      ],
    },
    {
      id: "cambios",
      titulo: "Cambios a este aviso",
      parrafos: [
        "Cualquier cambio se publica en esta misma página, con la fecha de última actualización de arriba. Si el cambio afecta de forma sustancial cómo se usan tus datos, se te informará por el correo que hayas proporcionado.",
      ],
    },
    {
      id: "autoridad",
      titulo: "Si algo no te parece",
      parrafos: [
        // Sin mencionar al INAI: se extinguió por la reforma constitucional del
        // 20-dic-2024 y sus funciones en la materia pasaron a esta Secretaría.
        // Citarlo sería un error con fecha en el sitio de una agencia.
        "Si consideras que tu derecho a la protección de datos personales fue vulnerado, puedes acudir a la Secretaría Anticorrupción y Buen Gobierno, autoridad competente en la materia conforme a la legislación vigente.",
      ],
    },
  ],
} as const;
