import type { IconName } from "./types";

/**
 * Soluciones — cada una tiene su propia página en /soluciones/[slug] (SEO).
 * Equivale a la futura colección `Solutions` de Payload.
 * Las 4 líneas de negocio salen de la web actual (misiontecnologica.com: outsourcing de impresión, venta
 * corporativa y arrendamiento de cómputo, digitalización con IA e infraestructura TI) y del documento
 * "Arquitectura UX/UI". Confirmar con el área comercial el alcance de cada servicio antes de producción.
 */

export type SolutionFeature = { title: string; description: string };
export type SolutionFaq = { question: string; answer: string };

export type Solution = {
  slug: string;
  title: string;
  /** Texto corto para tarjetas. */
  summary: string;
  icon: IconName;
  featured?: boolean;
  seo: { title: string; description: string };
  hero: { title: string; intro: string };
  /** Qué incluye el servicio. */
  features: SolutionFeature[];
  /** Resultado que busca el cliente (cualitativo, sin métricas no verificadas). */
  benefits: string[];
  faqs: SolutionFaq[];
  relatedSectors: string[];
  /** Servicio del cotizador que corresponde a la solución (si aplica). */
  quoteService?: "computo" | "impresion" | "digitalizacion" | "audiovideo";
};

export const processSteps: SolutionFeature[] = [
  { title: "Diagnóstico", description: "Conocemos tu operación, tus sedes y lo que hoy funciona o no funciona." },
  { title: "Propuesta", description: "Definimos el alcance, los equipos y el modelo de servicio adecuado." },
  { title: "Implementación", description: "Instalamos, configuramos y ponemos en marcha la solución." },
  { title: "Acompañamiento", description: "Damos soporte y seguimiento para que el servicio se mantenga en el tiempo." },
];

export const solutions: Solution[] = [
  {
    slug: "outsourcing-de-impresion",
    title: "Outsourcing de impresión",
    summary: "Equipos, suministros, mantenimiento y soporte reunidos en un servicio que mantiene tu operación en marcha.",
    icon: "printer",
    featured: true,
    quoteService: "impresion",
    seo: {
      title: "Outsourcing de impresión HP para empresas en Perú",
      description:
        "Servicio de outsourcing de impresión con equipos HP: evaluación, implementación, consumibles, mantenimiento y monitoreo del parque. Misión Tecnológica, HP Power Services Partner y Centro de Servicio Autorizado HP.",
    },
    hero: {
      title: "Outsourcing de impresión HP: más que equipos, un servicio que funciona.",
      intro:
        "Somos HP Power Services Partner y el único canal monomarca de HP Inc. en el Perú para el segmento corporativo de outsourcing de impresión. Nos encargamos de los equipos, los consumibles, el mantenimiento y el seguimiento de tu parque de impresión.",
    },
    features: [
      {
        title: "Evaluación del parque de impresión",
        description: "Analizamos cómo imprime cada sede o área para definir los equipos y la distribución adecuados.",
      },
      {
        title: "Equipos HP LaserJet Enterprise",
        description: "Multifuncionales láser de la línea empresarial de HP, pensados para entornos corporativos.",
      },
      {
        title: "Instalación y configuración",
        description: "Puesta en marcha de los equipos y su integración a la red de la empresa.",
      },
      {
        title: "Suministro de consumibles",
        description: "Seguimiento de niveles y reposición de tóner para evitar interrupciones.",
      },
      {
        title: "Servicio técnico autorizado por HP",
        description: "Como Centro de Servicio Autorizado HP (CAS) atendemos con repuestos originales, mayor rapidez y gestión de garantías.",
      },
      {
        title: "Monitoreo y reportes de uso",
        description: "Seguimiento del parque de impresión e informes de volumetría para controlar el consumo.",
      },
    ],
    benefits: [
      "Visibilidad del volumen de impresión por sede y por área.",
      "Menos interrupciones por falta de consumibles o fallas.",
      "Equipos empresariales HP adecuados a cada necesidad.",
      "Un servicio integral con un solo responsable.",
    ],
    faqs: [
      {
        question: "¿Qué es el outsourcing de impresión?",
        answer:
          "Es un servicio en el que el proveedor se encarga de los equipos de impresión, los consumibles, el mantenimiento y el seguimiento del uso, para que la empresa no tenga que gestionarlos por su cuenta.",
      },
      {
        question: "¿Con qué marca de equipos trabajan?",
        answer:
          "Trabajamos con HP. Somos HP Power Services Partner y el único canal monomarca de HP Inc. en el Perú para el segmento corporativo de outsourcing de impresión.",
      },
      {
        question: "¿Qué modalidades ofrecen?",
        answer: "Costo por página, costo por clic o venta de equipos con servicio. Puedes indicarlo en el cotizador y un asesor te propondrá la mejor opción.",
      },
      {
        question: "¿Puedo ver los equipos disponibles?",
        answer: "Sí. En el catálogo encontrarás los modelos de referencia y podrás solicitar una cotización.",
      },
    ],
    relatedSectors: ["educacion", "sector-financiero", "logistica", "otros-sectores"],
  },
  {
    slug: "arrendamiento-y-venta-de-computo",
    title: "Arrendamiento y venta de cómputo",
    summary: "Equipos de cómputo ajustados a tu operación, con alternativas de renovación y soporte especializado.",
    icon: "laptop",
    quoteService: "computo",
    seo: {
      title: "Arrendamiento y venta de equipos de cómputo para empresas",
      description:
        "Alquiler y venta corporativa de laptops, PC, workstations y monitores HP, ASUS y Lenovo, con configuración, soporte y renovación de equipos. Misión Tecnológica.",
    },
    hero: {
      title: "Equipos de cómputo para tu equipo, sin la carga de administrarlos.",
      intro:
        "Arrendamos o vendemos los equipos que tus colaboradores necesitan, con el perfil adecuado para cada área, y nos encargamos de la configuración, el soporte y la renovación.",
    },
    features: [
      {
        title: "Arrendamiento de equipos",
        description: "Laptops, PC y workstations bajo un modelo de servicio mensual, sin inversión inicial.",
      },
      {
        title: "Venta corporativa",
        description: "Compra de equipos HP, ASUS y Lenovo con las condiciones de un proveedor empresarial.",
      },
      {
        title: "Imagen y configuración inicial",
        description: "Equipos listos para trabajar, con el software y la configuración que define tu empresa.",
      },
      {
        title: "Gestión del ciclo de vida",
        description: "Entrega, reemplazo, renovación y retiro de equipos de forma ordenada y documentada.",
      },
      {
        title: "Mesa de ayuda y soporte",
        description: "Atención de incidencias en sitio y remota, con seguimiento hasta su solución.",
      },
      {
        title: "Inventario y control de activos",
        description: "Información clara sobre qué equipos tienes, dónde están y en qué estado se encuentran.",
      },
    ],
    benefits: [
      "Equipos actualizados sin una gran inversión inicial.",
      "Un solo proveedor responsable de los equipos y del soporte.",
      "Mayor control sobre los recursos tecnológicos de cada sede.",
      "Un servicio que puede crecer junto con la organización.",
    ],
    faqs: [
      {
        question: "¿Qué conviene más: arrendar o comprar?",
        answer:
          "Depende de tu operación. El arrendamiento evita la inversión inicial e incluye la renovación de equipos; la compra conviene cuando la empresa prefiere tener los activos. Un asesor puede ayudarte a compararlo.",
      },
      {
        question: "¿Con qué marcas trabajan?",
        answer: "Trabajamos con HP, ASUS y Lenovo en laptops, PC, small form factor, all in one, workstations, monitores y periféricos.",
      },
      {
        question: "¿Cómo empezamos?",
        answer: "Indica en el cotizador cuántos equipos necesitas, con qué perfil y modalidad, y te enviamos la propuesta.",
      },
    ],
    relatedSectors: ["educacion", "sector-financiero", "logistica", "retail"],
  },
  {
    slug: "digitalizacion-documental",
    title: "Digitalización documental",
    summary: "Procesos y documentos convertidos en información fácil de encontrar, ordenar, proteger y compartir.",
    icon: "scan",
    quoteService: "digitalizacion",
    seo: {
      title: "Digitalización documental con IA para empresas",
      description:
        "Digitalización de archivos físicos con captura inteligente: escaneo, OCR, indexación y carga a gestores documentales, en tus instalaciones o en nuestro centro. Misión Tecnológica.",
    },
    hero: {
      title: "Tu archivo físico, convertido en información que se encuentra al instante.",
      intro:
        "Digitalizamos expedientes, documentos y planos con captura inteligente: texto buscable, indexación por campos y carga a tu gestor documental, en tus instalaciones o en nuestro centro.",
    },
    features: [
      {
        title: "Captura y escaneo",
        description: "Hojas sueltas, expedientes, tomos y planos de gran formato, con control de calidad de cada imagen.",
      },
      {
        title: "Captura de datos inteligente",
        description: "Reconocimiento de texto (OCR) con inteligencia artificial para que cada documento se pueda buscar.",
      },
      {
        title: "Indexación por campos",
        description: "Clasificamos los documentos según los datos que tu empresa necesita para encontrarlos.",
      },
      {
        title: "Carga a gestor documental",
        description: "Entregamos la información organizada y lista para tu sistema o gestor documental.",
      },
      {
        title: "En sitio o en nuestro centro",
        description: "Llevamos el equipo y el personal a tus instalaciones, o recogemos y devolvemos el archivo.",
      },
      {
        title: "Re-archivo del físico",
        description: "Devolvemos el archivo ordenado después de digitalizarlo.",
      },
    ],
    benefits: [
      "Información disponible en segundos, no en horas de búsqueda.",
      "Menos espacio dedicado a archivo físico.",
      "Documentos protegidos y con acceso controlado.",
      "Procesos más rápidos entre áreas y sedes.",
    ],
    faqs: [
      {
        question: "¿Cómo se mide el volumen a digitalizar?",
        answer:
          "Puedes indicarlo en páginas, files (archivadores), tomos (más de 200 hojas en promedio) o cajas (unas 2 000 hojas). Con eso preparamos la propuesta.",
      },
      {
        question: "¿Mis documentos salen de la empresa?",
        answer: "Solo si lo prefieres. Podemos digitalizar en tus instalaciones o trasladar el archivo a nuestro centro y devolverlo.",
      },
      {
        question: "¿Cómo protegen la información?",
        answer: "Trabajamos bajo un sistema de gestión de seguridad de la información según ISO/IEC 27001.",
      },
    ],
    relatedSectors: ["educacion", "sector-financiero", "otros-sectores"],
  },
  {
    slug: "infraestructura-tecnologica",
    title: "Infraestructura tecnológica",
    summary: "Redes, servidores, seguridad y continuidad diseñados para acompañar el crecimiento de tu empresa.",
    icon: "network",
    seo: {
      title: "Infraestructura TI para empresas: redes, servidores y continuidad",
      description:
        "Implementación y soporte de infraestructura TI: redes, servidores, seguridad y continuidad operativa, con despliegue ordenado en todas tus sedes. Misión Tecnológica.",
    },
    hero: {
      title: "Infraestructura tecnológica para que tu operación no se detenga.",
      intro:
        "Diseñamos, implementamos y damos soporte a la infraestructura que sostiene tu operación, con despliegues planificados sede por sede y acompañamiento después de la puesta en marcha.",
    },
    features: [
      {
        title: "Redes y conectividad",
        description: "Diseño e implementación de redes para conectar tus sedes, áreas y equipos.",
      },
      {
        title: "Servidores y almacenamiento",
        description: "Equipos e infraestructura para alojar tus sistemas e información.",
      },
      {
        title: "Seguridad",
        description: "Controles para proteger la información y el acceso a tus sistemas.",
      },
      {
        title: "Despliegue planificado",
        description: "Cronograma por sede, instalación, pruebas y entrega documentada, coordinados con tu operación.",
      },
      {
        title: "Soporte y continuidad",
        description: "Atención técnica en sitio y remota, mantenimiento preventivo y seguimiento de incidencias.",
      },
      {
        title: "Reportes de servicio",
        description: "Informes periódicos con el estado de la infraestructura y de las atenciones realizadas.",
      },
    ],
    benefits: [
      "Una infraestructura que acompaña el crecimiento de la empresa.",
      "Menor impacto en la operación durante los cambios.",
      "Trazabilidad de cada atención técnica.",
      "Un equipo que conoce tu operación.",
    ],
    faqs: [
      {
        question: "¿Pueden implementar en varias sedes al mismo tiempo?",
        answer: "Sí. Planificamos el despliegue por sedes y coordinamos los tiempos con cada una para avanzar de forma ordenada.",
      },
      {
        question: "¿Dan soporte después de la implementación?",
        answer: "Sí. El alcance del soporte se define en la propuesta de servicio. Solicita una asesoría para revisar tu caso.",
      },
      {
        question: "¿Trabajan en provincias?",
        answer: "Sí. Atendemos organizaciones con sedes en todo el Perú.",
      },
    ],
    relatedSectors: ["sector-financiero", "retail", "logistica", "otros-sectores"],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}

export const solutionHref = (slug: string) => `/soluciones/${slug}`;
