import type { IconName } from "./types";

/**
 * "Encuentra tu solución" — perfil "Sé lo que necesito" (cotizador de proyecto).
 * Servicios, opciones y límites. Equivale a la futura colección global `QuoteSettings` de Payload.
 *
 * SIN PRECIOS: el cotizador dimensiona el proyecto (equipos, volúmenes, sedes, plazos) y lo envía a un
 * asesor; no muestra montos. La propuesta económica la prepara el área comercial.
 */

/* ------------------------------------------------------------------ */
/* Servicios (las 4 verticales)                                         */
/* ------------------------------------------------------------------ */

export const serviceIds = ["computo", "impresion", "digitalizacion", "audiovideo"] as const;
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
    summary: "Equipos, consumibles y mantenimiento por página, por clic o con venta de equipos.",
    icon: "printer",
  },
  {
    id: "digitalizacion",
    title: "Digitalización",
    summary: "Archivo físico convertido en documentos digitales buscables y ordenados.",
    icon: "scan",
  },
  {
    id: "audiovideo",
    title: "Audio y video",
    summary: "Salas de reuniones equipadas y headsets para tus colaboradores.",
    icon: "video",
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

/** Plazo del contrato (cómputo, impresión, audio y video). La digitalización usa su propio "plazo del servicio". */
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
export const printFleetOptions = [
  { value: "actual", label: "Equipos actuales" },
  { value: "estimado", label: "Estimado requerido" },
] as const satisfies readonly Option[];
export type PrintFleet = (typeof printFleetOptions)[number]["value"];

/** Formatos de papel: cantidad de páginas al mes por formato. */
export const paperFormats = [
  { value: "a4", label: "A4" },
  { value: "oficio", label: "Oficio" },
  { value: "a3", label: "A3" },
] as const satisfies readonly Option[];
export type PaperFormat = (typeof paperFormats)[number]["value"];

export const printModeOptions = [
  { value: "pagina", label: "Costo por página", hint: "Tarifa por página impresa; equipos, consumibles y mantenimiento incluidos" },
  { value: "clic", label: "Costo por clic", hint: "Tarifa por cada impresión que registra el contador del equipo" },
  { value: "venta", label: "Venta de equipo + servicio", hint: "Compras los equipos y contratas consumibles y soporte" },
] as const satisfies readonly Option[];
export type PrintMode = (typeof printModeOptions)[number]["value"];

export const printExtraOptions = [
  { value: "segura", label: "Impresión segura con PIN o tarjeta" },
  { value: "monitoreo", label: "Monitoreo y reportes de volumetría" },
] as const satisfies readonly Option[];
export type PrintExtra = (typeof printExtraOptions)[number]["value"];

export const printVolumePresets = [2_000, 10_000, 30_000, 80_000];

// Digitalización
/** Cómo se mide el volumen. `sheets` = hojas aproximadas por unidad (solo como referencia). */
export const scanUnitOptions = [
  { value: "paginas", label: "Páginas", hint: "Hojas sueltas o conteo exacto" },
  { value: "files", label: "Files", hint: "Archivadores" },
  { value: "tomos", label: "Tomos", hint: "Más de 200 hojas en promedio" },
  { value: "cajas", label: "Cajas", hint: "Unas 2 000 hojas por caja" },
] as const satisfies readonly Option[];
export type ScanUnit = (typeof scanUnitOptions)[number]["value"];

export const scanUnitWords: Record<ScanUnit, { one: string; many: string; sheets?: number }> = {
  paginas: { one: "página", many: "páginas" },
  files: { one: "file", many: "files" },
  tomos: { one: "tomo", many: "tomos", sheets: 200 },
  cajas: { one: "caja", many: "cajas", sheets: 2_000 },
};

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

/** Plazo del servicio de digitalización (reemplaza al plazo de contrato). */
export const scanTermOptions = [
  { value: "1m", label: "Hasta 1 mes" },
  { value: "3m", label: "1 a 3 meses" },
  { value: "6m", label: "3 a 6 meses" },
  { value: "12m", label: "Más de 6 meses" },
] as const satisfies readonly Option[];
export type ScanTerm = (typeof scanTermOptions)[number]["value"];

// Audio y video
export const avNeedOptions = [
  { value: "salas", label: "Salas de reuniones", hint: "Videoconferencia para equipos" },
  { value: "headsets", label: "Headsets", hint: "Audio individual para colaboradores" },
] as const satisfies readonly Option[];
export type AvNeed = (typeof avNeedOptions)[number]["value"];

export const roomDeviceOptions = [
  { value: "camaras", label: "Cámaras" },
  { value: "microfonos", label: "Micrófonos" },
  { value: "audifonos", label: "Audífonos" },
  { value: "hub-mesa", label: "Hub de mesa" },
  { value: "hub-pantalla", label: "Hub de pantalla" },
  { value: "altavoz", label: "Altavoz" },
  { value: "display", label: "Display o pantalla" },
] as const satisfies readonly Option[];
export type RoomDevice = (typeof roomDeviceOptions)[number]["value"];

export const platformOptions = [
  { value: "teams", label: "Microsoft Teams" },
  { value: "zoom", label: "Zoom" },
  { value: "meet", label: "Google Meet" },
  { value: "webex", label: "Webex" },
  { value: "otra", label: "Otra o por definir" },
] as const satisfies readonly Option[];
export type Platform = (typeof platformOptions)[number]["value"];

export const headsetUserOptions = [
  { value: "basico", label: "Básico", hint: "Call center" },
  { value: "estandar", label: "Estándar", hint: "Producción y oficina" },
  { value: "ejecutivo", label: "Ejecutivo", hint: "Calidad de audio y cancelación de ruido" },
] as const satisfies readonly Option[];
export type HeadsetUser = (typeof headsetUserOptions)[number]["value"];

export const headsetFeatureOptions = [
  { value: "cable", label: "Con cable" },
  { value: "inalambrico", label: "Sin cable" },
  { value: "anc", label: "Audífonos con cancelación de ruido" },
  { value: "mic-anc", label: "Micrófono con cancelación de ruido" },
] as const satisfies readonly Option[];
export type HeadsetFeature = (typeof headsetFeatureOptions)[number]["value"];

/* ------------------------------------------------------------------ */
/* Límites de los controles                                             */
/* ------------------------------------------------------------------ */

export const limits = {
  sites: { min: 1, max: 60 },
  devices: { min: 0, max: 2_000 },
  printPages: { min: 0, max: 500_000 },
  printDevices: { min: 1, max: 500 },
  formatPages: { min: 0, max: 500_000 },
  scanAmount: { min: 1, max: 3_000_000 },
  roomGroups: { max: 6 },
  rooms: { min: 1, max: 200 },
  roomUsers: { min: 2, max: 100 },
  headsets: { min: 1, max: 5_000 },
} as const;
