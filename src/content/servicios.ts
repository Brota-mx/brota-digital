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
