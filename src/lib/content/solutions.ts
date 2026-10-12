import type { IconName } from "./types";

/**
 * Soluciones — cada una tiene su propia página en /soluciones/[slug] (SEO).
 * Equivale a la futura colección `Solutions` de Payload.
 * IMPORTANTE: confirmar con el área comercial el alcance real de cada servicio antes de producción.
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
};

export const processSteps: SolutionFeature[] = [
  { title: "Diagnóstico", description: "Conocemos tu operación, tus sedes y lo que hoy funciona o no funciona." },
  { title: "Propuesta", description: "Definimos el alcance, los equipos y el modelo de servicio adecuado." },
  { title: "Implementación", description: "Instalamos, configuramos y ponemos en marcha la solución." },
  { title: "Acompañamiento", description: "Damos soporte y seguimiento para que el servicio se mantenga en el tiempo." },
];

export const solutions: Solution[] = [
  {
    slug: "outsourcing-tecnologico",
    title: "Outsourcing tecnológico",
    summary:
      "Servicios especializados que se integran a la operación de tu empresa para que tu equipo se concentre en el negocio.",
    icon: "network",
    featured: true,
    seo: {
      title: "Outsourcing tecnológico para empresas en Perú",
      description:
        "Terceriza la gestión de tus equipos y servicios tecnológicos con Misión Tecnológica: alquiler de equipos informáticos, personal técnico y control de activos, con cobertura a nivel nacional.",
    },
    hero: {
      title: "Outsourcing tecnológico para que tu equipo se concentre en el negocio.",
      intro:
        "Nos encargamos de los equipos y servicios tecnológicos que tu operación necesita, con un modelo de servicio que se adapta a tus sedes, a tus áreas y a tu crecimiento.",
    },
    features: [
      {
        title: "Alquiler de equipos informáticos",
        description: "Equipos para tus colaboradores bajo un modelo de servicio, sin la carga de comprarlos y administrarlos.",
      },
      {
        title: "Gestión del ciclo de vida",
        description: "Entrega, reemplazo, renovación y retiro de equipos de forma ordenada y documentada.",
      },
      {
        title: "Personal técnico especializado",
        description: "Profesionales que atienden la operación tecnológica de tu empresa según el alcance acordado.",
      },
      {
        title: "Atención de incidencias",
        description: "Registro y seguimiento de cada requerimiento hasta su solución.",
      },
      {
        title: "Inventario y control de activos",
        description: "Información clara sobre qué equipos tienes, dónde están y en qué estado se encuentran.",
      },
      {
        title: "Reportes de servicio",
        description: "Informes periódicos para tomar decisiones con datos sobre el uso y el estado del servicio.",
      },
    ],
    benefits: [
      "Más tiempo del equipo interno para tareas propias del negocio.",
      "Un solo proveedor responsable de los equipos y del servicio.",
      "Mayor control sobre los recursos tecnológicos de cada sede.",
      "Un servicio que puede crecer junto con la organización.",
    ],
    faqs: [
      {
        question: "¿Qué es el outsourcing tecnológico?",
        answer:
          "Es delegar en un proveedor especializado la provisión y gestión de equipos y servicios tecnológicos, de modo que la empresa recibe el servicio funcionando sin tener que administrarlo directamente.",
      },
      {
        question: "¿Atienden empresas fuera de Lima?",
        answer: "Sí. Misión Tecnológica cuenta con cobertura a nivel nacional para atender organizaciones con sedes en distintas regiones del país.",
      },
      {
        question: "¿Cómo empezamos?",
        answer:
          "Solicita una asesoría. Revisamos tu operación, identificamos qué necesitas y te proponemos el alcance del servicio.",
      },
    ],
    relatedSectors: ["educacion", "sector-financiero", "logistica", "retail"],
  },
  {
    slug: "impresion-empresarial",
    title: "Impresión empresarial",
    summary: "Outsourcing de impresión y gestión de equipos, como partner de HP en impresión láser empresarial.",
    icon: "printer",
    seo: {
      title: "Outsourcing de impresión empresarial con HP",
      description:
        "Soluciones de impresión para empresas con equipos HP LaserJet Enterprise: evaluación, implementación, consumibles, mantenimiento y seguimiento del parque de impresión. Misión Tecnológica, partner de HP.",
    },
    hero: {
      title: "Impresión empresarial: más que equipos, un servicio que funciona.",
      intro:
        "Como partner de HP, diseñamos e implementamos soluciones de impresión para empresas: desde la evaluación de cada sede hasta el soporte y el seguimiento del parque de equipos.",
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
        title: "Mantenimiento preventivo y correctivo",
        description: "Atención técnica para mantener los equipos operativos durante el servicio.",
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
        answer: "Misión Tecnológica es partner de HP y trabaja con HP como marca principal en impresión láser empresarial.",
      },
      {
        question: "¿Puedo ver los equipos disponibles?",
        answer: "Sí. En la tienda encontrarás los modelos de referencia y podrás solicitar una cotización por WhatsApp.",
      },
    ],
    relatedSectors: ["educacion", "sector-financiero", "logistica", "otros-sectores"],
  },
  {
    slug: "implementacion-y-despliegue",
    title: "Implementación y despliegue",
    summary: "Instalación, configuración y puesta en marcha de soluciones en las sedes de tu organización.",
    icon: "rocket",
    seo: {
      title: "Implementación y despliegue de equipos tecnológicos",
      description:
        "Planificamos y ejecutamos el despliegue de equipos tecnológicos en todas tus sedes: instalación, configuración, reemplazo de equipos, pruebas y entrega documentada, con cobertura nacional.",
    },
    hero: {
      title: "Implementación y despliegue ordenado, sede por sede.",
      intro:
        "Llevamos nuevas soluciones a la operación real de tu empresa: planificamos cada etapa, instalamos y configuramos los equipos, y entregamos todo documentado.",
    },
    features: [
      {
        title: "Planificación del despliegue",
        description: "Cronograma por sede y por área, coordinado con la operación para reducir el impacto.",
      },
      {
        title: "Instalación y configuración",
        description: "Equipos listos para trabajar, configurados según los requerimientos de la empresa.",
      },
      {
        title: "Reemplazo de equipos",
        description: "Retiro de los equipos anteriores y puesta en marcha de los nuevos en el mismo proceso.",
      },
      {
        title: "Pruebas y puesta en marcha",
        description: "Verificación del funcionamiento antes de entregar cada equipo a los usuarios.",
      },
      {
        title: "Entrega documentada",
        description: "Actas de entrega e inventario actualizado de lo instalado en cada sede.",
      },
      {
        title: "Orientación a usuarios",
        description: "Indicaciones básicas para que los colaboradores usen los nuevos equipos desde el primer día.",
      },
    ],
    benefits: [
      "Despliegues coordinados en varias sedes a la vez.",
      "Menor impacto en la operación durante el cambio.",
      "Información completa de lo instalado y dónde.",
      "Cobertura a nivel nacional.",
    ],
    faqs: [
      {
        question: "¿Pueden implementar en varias sedes al mismo tiempo?",
        answer:
          "Sí. Planificamos el despliegue por sedes y coordinamos los tiempos con cada una para avanzar de forma ordenada.",
      },
      {
        question: "¿Qué entregan al terminar la implementación?",
        answer: "Entregamos la documentación de lo instalado, como actas de entrega e inventario de equipos por sede.",
      },
      {
        question: "¿Trabajan en provincias?",
        answer: "Sí, contamos con cobertura a nivel nacional.",
      },
    ],
    relatedSectors: ["sector-financiero", "retail", "educacion"],
  },
  {
    slug: "soporte-y-continuidad",
    title: "Soporte y continuidad",
    summary: "Acompañamiento técnico para que los equipos y servicios sigan funcionando cuando el negocio lo necesita.",
    icon: "life-buoy",
    seo: {
      title: "Soporte técnico y continuidad operativa para empresas",
      description:
        "Soporte técnico en sitio y remoto, mantenimiento preventivo, atención de incidencias con seguimiento y reportes de servicio para mantener la continuidad de tu operación.",
    },
    hero: {
      title: "Soporte y continuidad para que tu operación no se detenga.",
      intro:
        "Acompañamos a tu empresa después de la implementación, con atención técnica, mantenimiento y seguimiento para que los equipos y servicios sigan funcionando.",
    },
    features: [
      {
        title: "Soporte en sitio y remoto",
        description: "Atención técnica en las sedes de la empresa o a distancia, según el tipo de requerimiento.",
      },
      {
        title: "Mantenimiento preventivo",
        description: "Revisiones programadas para anticiparnos a las fallas.",
      },
      {
        title: "Atención de incidencias con seguimiento",
        description: "Cada caso se registra y se sigue hasta su cierre.",
      },
      {
        title: "Reportes periódicos de servicio",
        description: "Informes con el estado de los equipos y de las atenciones realizadas.",
      },
    ],
    benefits: [
      "Continuidad en la operación diaria de las áreas.",
      "Trazabilidad de cada atención técnica.",
      "Un equipo que conoce tu operación.",
    ],
    faqs: [
      {
        question: "¿El soporte es solo para equipos que ustedes instalaron?",
        answer:
          "El alcance del soporte se define en la propuesta de servicio. Solicita una asesoría para revisar tu caso.",
      },
      {
        question: "¿Cómo se reportan las incidencias?",
        answer: "Se registran y se les da seguimiento hasta su solución, con reportes periódicos del servicio.",
      },
      {
        question: "¿Atienden en regiones?",
        answer: "Sí, Misión Tecnológica tiene cobertura a nivel nacional.",
      },
    ],
    relatedSectors: ["sector-financiero", "logistica", "otros-sectores"],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}

export const solutionHref = (slug: string) => `/soluciones/${slug}`;
