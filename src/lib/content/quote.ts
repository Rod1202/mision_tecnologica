import type { IconName } from "./types";

/**
 * Cotizador de proyecto — servicios, opciones y TARIFAS DE DEMOSTRACIÓN.
 * Equivale a la futura colección global `QuoteSettings` de Payload.
 *
 * TARIFAS: todos los montos en soles (PEN) son de prueba (`ratesAreDemo: true`) para que el
 * cotizador calcule y se pueda revisar la experiencia. La estimación se muestra SIEMPRE rotulada
 * como de demostración mientras `ratesAreDemo` sea `true`. Reemplazar por las tarifas referenciales
 * que entregue el área comercial y recién entonces poner `ratesAreDemo: false`.
 */

export const ratesAreDemo = true;

/* ------------------------------------------------------------------ */
/* Servicios                                                            */
/* ------------------------------------------------------------------ */

export const serviceIds = ["computo", "impresion", "digitalizacion"] as const;
export type ServiceId = (typeof serviceIds)[number];

export const quoteServices: { id: ServiceId; title: string; summary: string; icon: IconName }[] = [
  {
    id: "computo",
    title: "Cómputo",
    summary: "Laptops, desktops y workstations en alquiler o compra, con soporte.",
    icon: "laptop",
  },
  {
    id: "impresion",
    title: "Impresión",
    summary: "Multifuncionales HP con consumibles, mantenimiento y reportes de uso.",
    icon: "printer",
  },
  {
    id: "digitalizacion",
    title: "Digitalización",
    summary: "Archivo físico convertido en documentos digitales buscables y ordenados.",
    icon: "scan",
  },
];

export function getQuoteService(id: ServiceId) {
  return quoteServices.find((s) => s.id === id)!;
}

/* ------------------------------------------------------------------ */
/* Opciones                                                             */
/* ------------------------------------------------------------------ */

export type Option<V extends string | number = string> = { value: V; label: string; hint?: string };

export const locationOptions = [
  { value: "lima", label: "Lima" },
  { value: "mixto", label: "Lima y provincias" },
  { value: "provincias", label: "Provincias" },
] as const satisfies readonly Option[];
export type Location = (typeof locationOptions)[number]["value"];

export const termOptions = [
  { value: 12, label: "12 meses" },
  { value: 24, label: "24 meses" },
  { value: 36, label: "36 meses" },
] as const satisfies readonly Option<number>[];
export type Term = (typeof termOptions)[number]["value"];

export const startOptions = [
  { value: "inmediato", label: "Inmediato" },
  { value: "trimestre", label: "1 a 3 meses" },
  { value: "evaluando", label: "Evaluando" },
] as const satisfies readonly Option[];
export type Start = (typeof startOptions)[number]["value"];

// Cómputo
export const deviceOptions = [
  { value: "laptop", label: "Laptops", hint: "Para trabajo móvil o híbrido" },
  { value: "desktop", label: "Desktops", hint: "Puestos fijos de oficina" },
  { value: "workstation", label: "Workstations", hint: "Diseño, ingeniería y datos" },
] as const satisfies readonly Option[];
export type DeviceType = (typeof deviceOptions)[number]["value"];

export const profileOptions = [
  { value: "basico", label: "Básico", hint: "Ofimática y correo" },
  { value: "estandar", label: "Estándar", hint: "Multitarea y sistemas de gestión" },
  { value: "avanzado", label: "Alto rendimiento", hint: "Análisis, diseño y desarrollo" },
] as const satisfies readonly Option[];
export type Profile = (typeof profileOptions)[number]["value"];

export const computoModeOptions = [
  { value: "alquiler", label: "Alquiler mensual", hint: "Sin inversión inicial, con renovación de equipos" },
  { value: "compra", label: "Compra", hint: "Pago único; los equipos son de tu empresa" },
] as const satisfies readonly Option[];
export type ComputoMode = (typeof computoModeOptions)[number]["value"];

export const computoExtraOptions = [
  { value: "soporte", label: "Mesa de ayuda y soporte en sitio" },
  { value: "gestion", label: "Gestión remota y antivirus" },
  { value: "imagen", label: "Imagen y configuración inicial" },
  { value: "perifericos", label: "Monitor, teclado y mouse" },
] as const satisfies readonly Option[];
export type ComputoExtra = (typeof computoExtraOptions)[number]["value"];

// Impresión
export const printFormatOptions = [
  { value: "a4", label: "A4 y oficio" },
  { value: "a3", label: "Incluye A3" },
] as const satisfies readonly Option[];
export type PrintFormat = (typeof printFormatOptions)[number]["value"];

export const printModeOptions = [
  { value: "outsourcing", label: "Costo por página", hint: "Equipos, tóner y mantenimiento incluidos" },
  { value: "alquiler", label: "Alquiler de equipos", hint: "Cuota fija por equipo más consumibles" },
  { value: "compra", label: "Compra de equipos", hint: "Pago único más consumibles" },
] as const satisfies readonly Option[];
export type PrintMode = (typeof printModeOptions)[number]["value"];

export const printExtraOptions = [
  { value: "segura", label: "Impresión segura con PIN o tarjeta" },
  { value: "monitoreo", label: "Monitoreo y reportes de volumetría" },
] as const satisfies readonly Option[];
export type PrintExtra = (typeof printExtraOptions)[number]["value"];

export const printVolumePresets = [2_000, 10_000, 30_000, 80_000];

// Digitalización
export const docTypeOptions = [
  { value: "sueltas", label: "Hojas sueltas", hint: "A4 u oficio, en buen estado" },
  { value: "expedientes", label: "Expedientes y folders", hint: "Con grapas, anillados o tamaños mixtos" },
  { value: "planos", label: "Planos y gran formato", hint: "A2, A1 y A0" },
] as const satisfies readonly Option[];
export type DocType = (typeof docTypeOptions)[number]["value"];

export const scanLocationOptions = [
  { value: "sitio", label: "En tus instalaciones", hint: "Llevamos el equipo y el personal" },
  { value: "centro", label: "En nuestro centro", hint: "Incluye recojo, traslado y devolución" },
] as const satisfies readonly Option[];
export type ScanLocation = (typeof scanLocationOptions)[number]["value"];

export const scanServiceOptions = [
  { value: "ocr", label: "OCR: texto buscable" },
  { value: "indexacion", label: "Indexación por campos" },
  { value: "gestor", label: "Carga a gestor documental" },
  { value: "rearchivo", label: "Re-archivo del físico" },
] as const satisfies readonly Option[];
export type ScanService = (typeof scanServiceOptions)[number]["value"];

export const urgencyOptions = [
  { value: "estandar", label: "Plazo estándar" },
  { value: "urgente", label: "Urgente", hint: "Doble turno o estación adicional" },
] as const satisfies readonly Option[];
export type Urgency = (typeof urgencyOptions)[number]["value"];

export const scanUnitOptions = [
  { value: "paginas", label: "Páginas" },
  { value: "cajas", label: "Cajas de archivo" },
] as const satisfies readonly Option[];
export type ScanUnit = (typeof scanUnitOptions)[number]["value"];

/* ------------------------------------------------------------------ */
/* Límites de los controles                                             */
/* ------------------------------------------------------------------ */

export const limits = {
  sites: { min: 1, max: 60 },
  devices: { min: 0, max: 2_000 },
  printPages: { min: 500, max: 200_000 },
  printDevices: { min: 1, max: 200 },
  scanPages: { min: 100, max: 3_000_000 },
  scanBoxes: { min: 1, max: 1_200 },
} as const;

/**
 * Documentos por caja de archivo estándar (para convertir cajas ⇄ páginas).
 * Los planos se cuentan por plano: una caja o tubo guarda muchos menos.
 */
export const SHEETS_PER_BOX: Record<DocType, number> = { sueltas: 2_500, expedientes: 2_000, planos: 100 };

/* ------------------------------------------------------------------ */
/* Tarifas de demostración (PEN)                                        */
/* ------------------------------------------------------------------ */

export const rates = {
  /** Despliegue e instalación por sede (pago único), solo con cómputo o impresión. */
  deploymentPerSite: { lima: 220, mixto: 340, provincias: 460 } satisfies Record<Location, number>,
  /** Factor sobre las cuotas mensuales según el plazo del contrato. */
  termFactor: { 12: 1.12, 24: 1, 36: 0.92 } satisfies Record<Term, number>,

  computo: {
    rentPerMonth: { laptop: 175, desktop: 135, workstation: 410 } satisfies Record<DeviceType, number>,
    purchase: { laptop: 3_300, desktop: 2_700, workstation: 7_900 } satisfies Record<DeviceType, number>,
    profileFactor: { basico: 0.85, estandar: 1, avanzado: 1.35 } satisfies Record<Profile, number>,
    soportePerDeviceMonth: 32,
    gestionPerDeviceMonth: 16,
    imagenPerDevice: 60,
    perifericos: { rentPerMonth: 28, purchase: 690 },
  },

  impresion: {
    /** Páginas al mes que atiende cómodamente un equipo (para sugerir la cantidad). */
    pagesPerDevice: 6_000,
    /** Por debajo de este volumen por sede no se sugiere un equipo propio para cada sede. */
    minPagesPerSite: 700,
    outsourcing: { bwPage: 0.058, colorPage: 0.3, feePerDeviceMonth: 85 },
    alquiler: { perDeviceMonth: 390, bwPage: 0.032, colorPage: 0.21 },
    compra: { perDevice: 5_200, bwPage: 0.04, colorPage: 0.24 },
    a3Factor: 1.25,
    /** El color en equipos de alquiler o compra sube el costo del equipo. */
    colorDeviceFactor: 1.35,
    segura: { perDevice: 420, perDeviceMonth: 22 },
    monitoreoPerDeviceMonth: 14,
  },

  digitalizacion: {
    perPage: { sueltas: 0.11, expedientes: 0.17, planos: 2.4 } satisfies Record<DocType, number>,
    /** Páginas por día hábil de una estación de captura. */
    pagesPerDay: { sueltas: 14_000, expedientes: 8_000, planos: 350 } satisfies Record<DocType, number>,
    services: { ocr: 0.025, indexacion: 0.04, gestor: 0.008, rearchivo: 0.03 } satisfies Record<ScanService, number>,
    gestorSetup: 950,
    sitioSetup: 1_400,
    centroPerBox: 32,
    urgentFactor: 1.25,
    provinciasFactor: 1.08,
  },
} as const;
