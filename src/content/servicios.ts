/**
 * La escalera de servicios — los 4 peldaños (blueprint §3).
 *
 * Es el argumento estructural del sitio, no una tabla de precios: el visitante
 * se autoclasifica y ve el camino completo por delante (PRODUCT.md §Positioning).
 * De aquí salen la sección Escalera de la home, la página `/servicios` y las
 * opciones de presupuesto del formulario de contacto — un solo lugar que editar.
 *
 * Reglas al tocar este archivo:
 * - Nada que no se pueda cumplir. Cada rango corresponde a un paquete real y
 *   disponible, y `incluye` / `noIncluye` es lo que respalda ese precio
 *   (Art. 7 LFPC: el precio anunciado obliga).
 * - El orden del array es el orden visual de la escalera. No se reordena.
 */

export const servicios = [
  {
    id: "siembra",
    nombre: "Siembra",
    /** Una línea. Qué es, sin adjetivos de calidad. */
    promesa: "Una página que existe, carga rápido y recibe mensajes.",
    paraQuien:
      "El negocio que todavía no tiene sitio y necesita uno que se vea serio y responda desde el teléfono.",
    /** Texto de display. También alimenta el select de presupuesto. */
    rango: "$3,500 – $6,000 MXN",
    incluye: [
      "Una página con las secciones esenciales del negocio",
      "Diseño responsivo, pensado primero para teléfono",
      "Botón de WhatsApp directo",
      "Publicación en línea con dominio propio",
    ],
    noIncluye: [
      "Varias páginas o secciones internas",
      "Trabajo de posicionamiento en buscadores",
      "Contenido administrable sin ayuda",
    ],
  },
  {
    id: "cosecha",
    nombre: "Cosecha",
    promesa: "Un sitio completo que además busca clientes en Google.",
    paraQuien:
      "El negocio con servicios que explicar, que quiere que lo encuentren buscando y saber qué funciona.",
    rango: "$12,000 – $18,000 MXN",
    incluye: [
      "Sitio de varias páginas, una por servicio o línea de negocio",
      "Posicionamiento en buscadores: títulos, descripciones y estructura por página",
      "Analítica y Search Console configurados",
      "Formulario de contacto con protección anti-spam",
      "Correos con el dominio del negocio",
    ],
    noIncluye: [
      "Segundo idioma",
      "Contenido administrable por el cliente",
      "Sistema de citas o agenda",
    ],
  },
  {
    id: "selva",
    nombre: "Selva",
    promesa:
      "El sitio completo: dos idiomas, contenido que el cliente edita solo, agenda y seguridad auditada.",
    paraQuien:
      "El despacho, la clínica o el grupo que atiende a un público exigente y necesita operar el sitio sin depender de nadie.",
    rango: "$35,000 – $60,000 MXN",
    incluye: [
      "Sitio bilingüe, con las dos versiones tratadas como contenido de primera",
      "Gestor de contenido: publicar y editar sin tocar código",
      "Agenda de citas integrada",
      "Auditoría de seguridad: cabeceras, política de contenido y formulario en capas",
      "Auditoría de accesibilidad AA y de rendimiento en móvil",
      "Suite de pruebas automatizadas que corre antes de cada publicación",
    ],
    noIncluye: [
      "Automatizaciones que operen solas después de la entrega",
      "Agentes de atención con IA",
      "Integraciones con sistemas internos del cliente",
    ],
  },
  {
    id: "ecosistema",
    nombre: "Ecosistema",
    promesa: "Sistemas que trabajan cuando nadie está viendo.",
    paraQuien:
      "El negocio que ya tiene demanda y pierde tiempo —o clientes— en tareas que una máquina puede sostener.",
    rango: "Desde $80,000 MXN, más una mensualidad de operación",
    incluye: [
      "Agentes de atención con IA sobre los canales que el negocio ya usa",
      "Automatización de procesos internos y seguimiento de prospectos",
      "Integración con las herramientas y sistemas que el negocio ya opera",
      "Monitoreo y mantenimiento del sistema en operación",
    ],
    noIncluye: [
      "Alcance cerrado sin diagnóstico previo: cada sistema se cotiza sobre el proceso real",
    ],
  },
] as const;

export type Servicio = (typeof servicios)[number];
export type ServicioId = Servicio["id"];

/**
 * Copy propio de la página `/servicios` (blueprint §3, fila `/servicios`).
 *
 * Vive aquí y no en un quinto archivo de `content/` porque es texto de la
 * oferta, que es de lo que trata este archivo: los peldaños, el proceso
 * comercial y el FAQ que los explica. `site.ts` es identidad y contacto, y
 * `home.ts` es copy de una página que no es ésta.
 *
 * El H1 no es la consulta literal («cuánto cuesta una página web en México»)
 * a propósito: eso es un titular de blog, y esta es la página de servicios de
 * un despacho. La consulta vive donde sí trabaja —el `<caption>` de la tabla,
 * la primera pregunta del FAQ y la metadata—, que es además donde el buscador
 * la lee para armar el fragmento destacado (blueprint §6).
 */
export const serviciosPagina = {
  eyebrow: "Servicios",
  titulo: "Cuatro peldaños y lo que cuesta cada uno",
  entrada:
    "El precio está en esta página, no al final de una llamada. Cada peldaño dice qué incluye, qué no incluye y para qué momento del negocio es, para que la conversación empiece con el presupuesto sobre la mesa.",
  cta: { label: "Cotizar un proyecto", href: "/contacto" },
  whatsapp: "Escribir por WhatsApp",

  tabla: {
    /** Lo lee el buscador para armar el fragmento destacado. */
    caption:
      "Cuánto cuesta una página web en México: rangos por peldaño de servicio.",
    encabezados: ["Peldaño", "Rango de inversión"],
    /** Aclaración obligada: el precio anunciado obliga (Art. 7 LFPC). */
    nota: "Rangos en pesos mexicanos, sin IVA. El alcance de cada peldaño es el que se detalla abajo; la propuesta lo confirma por escrito antes de cualquier anticipo.",
  },

  detalle: {
    /** Rótulos de las dos listas de cada peldaño. */
    incluye: "Qué incluye",
    noIncluye: "Qué no incluye",
    paraQuien: "Para quién es",
    /** Prefijo del eyebrow de cada bloque: «Peldaño 01». */
    peldano: "Peldaño",
  },

  faqTitulo: "Preguntas frecuentes",

  cierre: {
    eyebrow: "Siguiente paso",
    titulo: "El peldaño se decide en la conversación, no antes",
    entrada:
      "El formulario pide un rango de presupuesto desde el primer mensaje. Con eso y el contexto del negocio se responde con una propuesta real, en vez de una ronda previa de «¿cuánto cuesta?».",
  },
} as const;

/**
 * FAQ de `/servicios` — el sustituto deliberado del blog (blueprint §6).
 *
 * Un blog abandonado a los tres meses es peor señal que no tener blog, así que
 * en su lugar van estas preguntas, editadas por código y marcadas como
 * `FAQPage`. Son las que la gente busca de verdad: cuánto cuesta, por qué
 * varía tanto, cuánto tarda, cómo se paga.
 *
 * Reglas al tocar este array:
 * - Se responde solo lo que se puede sostener. Nada de plazos, garantías de
 *   resultado ni cifras de trayectoria: un plazo anunciado obliga igual que un
 *   precio (Art. 7 LFPC), y lo que no está en `PRODUCT.md` no se publica.
 * - Cada respuesta se escribe completa y en una sola pieza: el buscador la
 *   toma tal cual del marcado, sin el contexto de la pregunta anterior.
 */
export const faq = [
  {
    p: "¿Cuánto cuesta una página web en México?",
    r: "Depende del alcance, y por eso el rango es tan amplio. En Brota Digital una página de aterrizaje va de $3,500 a $6,000 pesos; un sitio de varias páginas con trabajo de posicionamiento en buscadores, de $12,000 a $18,000; un sitio bilingüe con gestor de contenido, agenda y auditorías de seguridad y accesibilidad, de $35,000 a $60,000; y un sistema de automatización con IA arranca en $80,000 más una mensualidad de operación. Los cuatro rangos, con lo que incluye y lo que no incluye cada uno, están detallados en esta misma página.",
  },
  {
    p: "¿Por qué un sitio cuesta $3,500 y otro $60,000?",
    r: "Porque no es el mismo trabajo. Lo que estira el precio es el número de páginas, el segundo idioma, que el cliente pueda editar el contenido sin ayuda, la agenda de citas, y las auditorías de seguridad, accesibilidad y rendimiento con pruebas automatizadas que corren antes de cada publicación. Una página de aterrizaje hace bien una sola cosa: existir, cargar rápido y recibir mensajes. Un sitio de $60,000 sostiene la operación de un despacho o una clínica.",
  },
  {
    p: "¿Cuánto tarda en estar lista una página web?",
    r: "Depende del peldaño y de qué tan rápido llegue el contenido del negocio. El plazo se pone por escrito en la propuesta, junto con el alcance, antes del anticipo. Brota Digital no publica un plazo general a propósito: un plazo anunciado obliga igual que un precio, y el mismo número no puede valer para una página de aterrizaje y para un sistema que se integra con las herramientas internas de un negocio.",
  },
  {
    p: "¿Cómo se paga?",
    r: "En dos partes: 50% de anticipo al aprobar la propuesta y 50% restante contra entrega. El alcance —lo que incluye y lo que no— queda por escrito antes del anticipo, para que nadie descubra a medio camino que algo no estaba contemplado.",
  },
  {
    p: "¿Se puede empezar con lo más básico y crecer después?",
    r: "Es la razón de que los servicios estén ordenados como escalera. Se empieza por el peldaño que corresponde al momento del negocio y se sube cuando toca, con el mismo proveedor y sobre el trabajo que ya está hecho. Nadie tiene que cambiar de agencia por haber crecido.",
  },
  {
    p: "¿El cliente puede editar el contenido sin saber programar?",
    r: "Desde el peldaño Selva, sí: incluye un gestor de contenido para publicar y editar sin tocar código, y la capacitación para operarlo. En Siembra y Cosecha el contenido lo actualiza Brota Digital.",
  },
  {
    p: "¿Brota Digital trabaja fuera de la Ciudad de México y de la Riviera Maya?",
    r: "Se opera desde Ciudad de México y desde Cancún y Playa del Carmen, y el trabajo se hace en remoto de punta a punta: briefing, avances y entrega. No hace falta estar en la misma ciudad para trabajar juntos.",
  },
  {
    p: "¿Qué es un sistema de automatización con IA para un negocio?",
    r: "Es un sistema que resuelve algo sin que nadie lo esté operando: un agente que atiende por los canales que el negocio ya usa —WhatsApp entre ellos—, el seguimiento automático de prospectos, o la integración con las herramientas internas para que dejen de moverse datos a mano. Es el peldaño Ecosistema, y se cotiza sobre el proceso real del negocio después de un diagnóstico, no como un paquete cerrado.",
  },
] as const;

/**
 * El proceso comercial, tal como ya se publicaba en el sitio anterior.
 *
 * El anticipo del 50% es la condición vigente. Los plazos de entrega NO se
 * publican aquí a propósito: los del sitio anterior (7 / 14 / 21 días)
 * corresponden a paquetes con otro alcance y prometer un plazo que no se
 * sostiene es exactamente lo que el Art. 7 LFPC no perdona. Se agregan cuando
 * haya un plazo confirmado por peldaño.
 */
export const proceso = [
  {
    n: "01",
    titulo: "Briefing",
    texto:
      "Una conversación para entender el negocio, a quién le vende y qué tiene que pasar para que el sitio se considere exitoso.",
  },
  {
    n: "02",
    titulo: "Propuesta y anticipo",
    texto:
      "Alcance por escrito, con lo que incluye y lo que no. Se arranca con el 50% de anticipo.",
  },
  {
    n: "03",
    titulo: "Diseño y construcción",
    texto:
      "Avances visibles y rondas de revisión acordadas en la propuesta. Nada se publica sin pasar las pruebas.",
  },
  {
    n: "04",
    titulo: "Entrega",
    texto:
      "Sitio en producción, capacitación para operarlo y el 50% restante contra entrega.",
  },
] as const;
