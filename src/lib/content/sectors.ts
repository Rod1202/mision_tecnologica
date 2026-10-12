import type { Client, IconName } from "./types";

/**
 * Sectores y clientes — futura colección `Sectors` + `Clients` de Payload.
 * Los clientes se muestran en desarrollo/pruebas; en producción solo los que tengan `verified: true`
 * (autorización de uso de nombre y logotipo confirmada).
 */

export type Sector = {
  slug: string;
  title: string;
  /** Etiqueta corta para la pestaña. */
  tabLabel: string;
  summary: string;
  icon: IconName;
  howWeHelp: string[];
  clients: Client[];
};

const PENDING_AUTH = "Confirmar autorización de uso de nombre y logotipo.";

export const sectors: Sector[] = [
  {
    slug: "educacion",
    title: "Educación",
    tabLabel: "Educación",
    summary: "Universidades, institutos y colegios con múltiples sedes, laboratorios y áreas administrativas.",
    icon: "graduation-cap",
    howWeHelp: [
      "Equipos de impresión y cómputo distribuidos por campus y sedes.",
      "Despliegues coordinados con el calendario académico.",
      "Soporte para áreas administrativas y académicas.",
    ],
    clients: [
      { name: "Universidad San Ignacio de Loyola", verified: false, note: PENDING_AUTH },
      { name: "Universidad Científica del Sur", verified: false, note: PENDING_AUTH },
      { name: "Instituto SISE", verified: false, note: PENDING_AUTH },
      { name: "Universidad Continental", verified: false, note: PENDING_AUTH },
      { name: "Innova Schools", verified: false, note: `${PENDING_AUTH} Confirmar denominación oficial.` },
    ],
  },
  {
    slug: "sector-financiero",
    title: "Sector financiero",
    tabLabel: "Financiero",
    summary: "Entidades financieras con red de agencias que requieren operación continua y control de recursos.",
    icon: "landmark",
    howWeHelp: [
      "Implementación de equipos en redes de agencias a nivel nacional.",
      "Control del parque de impresión por agencia.",
      "Atención técnica para mantener la atención al cliente sin interrupciones.",
    ],
    clients: [
      { name: "Caja Trujillo", verified: false, note: PENDING_AUTH },
      { name: "Caja Metropolitana", verified: false, note: PENDING_AUTH },
      { name: "Hermes", verified: false, note: `${PENDING_AUTH} Confirmar servicio y sector.` },
    ],
  },
  {
    slug: "logistica",
    title: "Logística",
    tabLabel: "Logística",
    summary: "Operaciones de almacén y distribución donde la documentación no puede detenerse.",
    icon: "truck",
    howWeHelp: [
      "Equipos de impresión para almacenes y centros de distribución.",
      "Continuidad en la emisión de documentos de la operación.",
      "Soporte coordinado con los turnos de trabajo.",
    ],
    clients: [
      { name: "Savar", verified: false, note: PENDING_AUTH },
      { name: "Sharf", verified: false, note: `${PENDING_AUTH} Confirmar escritura comercial oficial.` },
    ],
  },
  {
    slug: "retail",
    title: "Retail y comercio",
    tabLabel: "Retail",
    summary: "Tiendas y oficinas comerciales que necesitan equipos disponibles en cada punto.",
    icon: "shopping-bag",
    howWeHelp: [
      "Despliegue de equipos en tiendas y oficinas comerciales.",
      "Reposición y soporte para que cada punto siga operando.",
      "Gestión centralizada de equipos distribuidos.",
    ],
    clients: [
      { name: "Conecta Retail", verified: false, note: PENDING_AUTH },
      { name: "Nexxo", verified: false, note: `${PENDING_AUTH} Confirmar razón social, marca y sector.` },
    ],
  },
  {
    slug: "otros-sectores",
    title: "Otros sectores",
    tabLabel: "Otros",
    summary: "Salud, industria y servicios profesionales con necesidades tecnológicas propias.",
    icon: "building",
    howWeHelp: [
      "Soluciones adaptadas a la operación de cada organización.",
      "Implementación y soporte en sedes a nivel nacional.",
      "Reportes de servicio para el control de los recursos.",
    ],
    clients: [
      { name: "Auna", verified: false, note: PENDING_AUTH },
      { name: "Qroma", verified: false, note: PENDING_AUTH },
      { name: "Vulco", verified: false, note: `${PENDING_AUTH} Confirmar entidad exacta.` },
      { name: "PwC", verified: false, note: PENDING_AUTH },
    ],
  },
];

export function getSector(slug: string) {
  return sectors.find((s) => s.slug === slug);
}
