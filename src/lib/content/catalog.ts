import type { ProductKind } from "./compare";
import type { IconName } from "./types";

/**
 * Líneas del catálogo corporativo (sin precios). Futura colección `CatalogLines` de Payload.
 * Cada línea agrupa las categorías que Misión Tecnológica cotiza, aunque todavía no tengan fichas publicadas:
 * así el visitante ve el portafolio completo y puede pedir una cotización de cualquiera de ellas.
 */

export const catalogLineIds = ["impresion", "computo", "audio-video"] as const;
export type CatalogLineId = (typeof catalogLineIds)[number];

export type CatalogLine = {
  id: CatalogLineId;
  title: string;
  summary: string;
  icon: IconName;
  /** Marcas con las que trabajamos en esta línea. */
  brands: string[];
  /** Categorías que se cotizan en esta línea (con o sin fichas publicadas). */
  categories: string[];
  /** Servicio del cotizador que corresponde a la línea (para "Cotizar"). */
  quoteService: "impresion" | "computo" | "audiovideo";
};

export const catalogLines: CatalogLine[] = [
  {
    id: "impresion",
    title: "Impresión y digitalización",
    summary: "Impresoras y multifuncionales de última línea, ticketeras, plotters, lectores y escáneres.",
    icon: "printer",
    brands: ["HP"],
    categories: ["Impresoras y multifuncionales", "Ticketeras", "Plotters", "Lectores", "Escáneres"],
    quoteService: "impresion",
  },
  {
    id: "computo",
    title: "Cómputo",
    summary: "Laptops, PC, equipos compactos, workstations, all in one, monitores y periféricos.",
    icon: "laptop",
    brands: ["HP", "ASUS", "Lenovo"],
    categories: ["Laptops", "PC de escritorio", "Small Form Factor (SFF)", "All in One", "Workstations", "Monitores", "Mouse y periféricos"],
    quoteService: "computo",
  },
  {
    id: "audio-video",
    title: "Audio y video",
    summary: "Cámaras de videoconferencia, micrófonos, audífonos, headsets y proyectores.",
    icon: "video",
    brands: [],
    categories: ["Cámaras de videoconferencia", "Micrófonos", "Audífonos", "Headsets", "Proyectores"],
    quoteService: "audiovideo",
  },
];

/** Línea del catálogo según el tipo de equipo de la ficha. */
export const lineOfKind: Record<ProductKind, CatalogLineId> = {
  impresora: "impresion",
  laptop: "computo",
};

export function getCatalogLine(id: CatalogLineId) {
  return catalogLines.find((l) => l.id === id)!;
}
