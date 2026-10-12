/**
 * Bolsa de empleo — futura colección `Jobs` de Payload (con estado activo/cerrado).
 * Las convocatorias de abajo son EJEMPLOS para la maqueta (`example: true`): solo se ven
 * en desarrollo/pruebas. Reemplazarlas por las convocatorias reales activas.
 */

export type Job = {
  slug: string;
  title: string;
  area: string;
  location: string;
  modality: "Presencial" | "Híbrido" | "Remoto";
  type: "Tiempo completo" | "Medio tiempo" | "Prácticas";
  publishedAt: string; // ISO
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  active: boolean;
  example: boolean;
};

export const jobs: Job[] = [
  {
    slug: "tecnico-de-soporte-en-impresion",
    title: "Técnico de soporte en impresión",
    area: "Operaciones",
    location: "Lima",
    modality: "Presencial",
    type: "Tiempo completo",
    publishedAt: "2026-10-01",
    summary:
      "Buscamos un técnico para la instalación, configuración y mantenimiento de equipos de impresión HP en las sedes de nuestros clientes.",
    responsibilities: [
      "Instalar y configurar equipos multifuncionales en las sedes de los clientes.",
      "Realizar mantenimiento preventivo y correctivo.",
      "Registrar las atenciones y mantener actualizado el inventario de equipos.",
    ],
    requirements: [
      "Formación técnica en computación, electrónica o afines.",
      "Experiencia en soporte de impresoras o equipos de oficina.",
      "Disponibilidad para desplazarse entre sedes.",
    ],
    niceToHave: ["Experiencia con equipos HP LaserJet Enterprise."],
    active: true,
    example: true,
  },
  {
    slug: "ejecutivo-comercial-corporativo",
    title: "Ejecutivo comercial corporativo",
    area: "Comercial",
    location: "Lima",
    modality: "Híbrido",
    type: "Tiempo completo",
    publishedAt: "2026-09-25",
    summary:
      "Buscamos un ejecutivo para desarrollar nuevas cuentas corporativas y acompañar a los clientes en soluciones de outsourcing e impresión.",
    responsibilities: [
      "Identificar oportunidades en empresas de distintos sectores.",
      "Preparar propuestas junto al equipo técnico.",
      "Dar seguimiento a la relación con los clientes.",
    ],
    requirements: [
      "Experiencia en venta consultiva B2B.",
      "Conocimiento de soluciones tecnológicas para empresas.",
      "Buena comunicación oral y escrita.",
    ],
    active: true,
    example: true,
  },
];

export function getJob(slug: string) {
  return jobs.find((j) => j.slug === slug);
}

export const jobHref = (slug: string) => `/trabaja-con-nosotros/${slug}`;
