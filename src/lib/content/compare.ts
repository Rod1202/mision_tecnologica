import type { IconName } from "./types";

/**
 * Comparador de equipos de la tienda — filas comparables por tipo de equipo.
 * Cada producto guarda sus datos en `specValues` con estas claves. Para sumar un tipo nuevo
 * (por ejemplo monitores), basta con agregarlo a `productKinds` y definir sus filas aquí.
 */

export const productKindIds = ["impresora", "laptop"] as const;
export type ProductKind = (typeof productKindIds)[number];

export const productKinds: { id: ProductKind; label: string; plural: string; icon: IconName }[] = [
  { id: "impresora", label: "Impresora", plural: "Impresoras", icon: "printer" },
  { id: "laptop", label: "Laptop", plural: "Laptops", icon: "laptop" },
];

export function getProductKind(id: ProductKind) {
  return productKinds.find((k) => k.id === id)!;
}

export type SpecRow = {
  key: string;
  label: string;
  group: string;
  /** Si el valor es numérico comparable: qué extremo es mejor (se resalta en el comparador). */
  better?: "higher" | "lower";
  /** Qué número del texto se compara: el primero (por defecto) o el último ("650 hojas…; hasta 2.300"). */
  pick?: "first" | "last";
  /** Unidad para mostrar diferencias ("ppm", "s"…). */
  unit?: string;
  /** Lectura propia cuando el texto mezcla unidades (TB/GB, Wh, kg). */
  measure?: (value: string) => number | null;
};

const printerRows: SpecRow[] = [
  { key: "functions", label: "Funciones", group: "General" },
  { key: "color", label: "Color", group: "General" },
  { key: "maxPaper", label: "Tamaño máximo de papel", group: "General" },
  { key: "printSpeed", label: "Velocidad de impresión", group: "Impresión", better: "higher", unit: "ppm" },
  { key: "firstPage", label: "Primera página", group: "Impresión", better: "lower", unit: "s" },
  { key: "duplex", label: "Impresión a doble cara", group: "Impresión" },
  { key: "recommendedVolume", label: "Volumen mensual recomendado", group: "Capacidad", better: "higher", pick: "last", unit: "págs." },
  { key: "dutyCycle", label: "Ciclo de trabajo mensual", group: "Capacidad", better: "higher", unit: "págs." },
  { key: "paperInput", label: "Capacidad de entrada (máx.)", group: "Capacidad", better: "higher", pick: "last", unit: "hojas" },
  { key: "adf", label: "Alimentador de documentos", group: "Escaneo", better: "higher", unit: "hojas" },
  { key: "scanSpeed", label: "Velocidad de escaneo", group: "Escaneo", better: "higher", unit: "ppm" },
  { key: "display", label: "Pantalla", group: "Uso y conectividad", better: "higher", unit: "pulg." },
  { key: "connectivity", label: "Conectividad", group: "Uso y conectividad" },
  { key: "security", label: "Seguridad", group: "Uso y conectividad" },
];

const laptopRows: SpecRow[] = [
  { key: "processor", label: "Procesador", group: "Rendimiento" },
  { key: "ram", label: "Memoria RAM", group: "Rendimiento", better: "higher", unit: "GB", measure: (v) => unitNumber(v, { GB: 1, TB: 1024 }) },
  { key: "storage", label: "Almacenamiento", group: "Rendimiento", better: "higher", unit: "GB", measure: (v) => unitNumber(v, { GB: 1, TB: 1024 }) },
  { key: "graphics", label: "Gráficos", group: "Rendimiento" },
  { key: "display", label: "Pantalla", group: "Pantalla y movilidad" },
  { key: "battery", label: "Batería", group: "Pantalla y movilidad", better: "higher", unit: "Wh", measure: (v) => unitNumber(v, { Wh: 1 }) },
  { key: "weight", label: "Peso", group: "Pantalla y movilidad", better: "lower", unit: "kg", measure: (v) => unitNumber(v, { kg: 1, g: 0.001 }) },
  { key: "ports", label: "Puertos", group: "Conectividad y seguridad" },
  { key: "wireless", label: "Conectividad inalámbrica", group: "Conectividad y seguridad" },
  { key: "security", label: "Seguridad", group: "Conectividad y seguridad" },
  { key: "os", label: "Sistema operativo", group: "Conectividad y seguridad" },
];

export const specRows: Record<ProductKind, SpecRow[]> = {
  impresora: printerRows,
  laptop: laptopRows,
};

/** Máximo de equipos lado a lado. */
export const COMPARE_MAX = 3;

const NUMBER = /\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?/g;

/** "250.000" o "1.200,5": el punto separa miles. "1,4" o "1.4": decimales (formato es-PE de las fichas). */
function parseNumber(raw: string) {
  const thousands = /^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(raw);
  const n = Number(thousands ? raw.replace(/\./g, "").replace(",", ".") : raw.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** Números de un texto de ficha ("Hasta 52 ppm", "250.000 páginas", "1,4 kg"). */
export function specNumbers(value: string | undefined): number[] {
  if (!value) return [];
  return (value.match(NUMBER) ?? []).map(parseNumber).filter((n): n is number => n !== null);
}

/** Primer número de un texto de ficha. */
export function specNumber(value: string | undefined): number | null {
  return specNumbers(value)[0] ?? null;
}

/** Primer número seguido de alguna de las unidades, convertido a la unidad base ("1 TB" → 1024 GB). */
export function unitNumber(value: string, scale: Record<string, number>): number | null {
  const units = Object.keys(scale)
    .sort((a, b) => b.length - a.length)
    .join("|");
  const m = value.match(new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(${units})\\b`, "i"));
  if (!m) return null;
  const n = parseNumber(m[1]);
  const unit = Object.keys(scale).find((u) => u.toLowerCase() === m[2].toLowerCase())!;
  return n === null ? null : n * scale[unit];
}

/** Valor comparable de una fila para un texto de ficha. */
export function rowNumber(row: SpecRow, value: string | null | undefined): number | null {
  if (!value) return null;
  if (row.measure) return row.measure(value);
  const nums = specNumbers(value);
  return (row.pick === "last" ? nums.at(-1) : nums[0]) ?? null;
}
