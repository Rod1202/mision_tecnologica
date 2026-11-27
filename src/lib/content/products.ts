/**
 * Catálogo de DEMOSTRACIÓN — futura colección `Products` de Payload.
 * No hay pagos ni stock: el catálogo arma una solicitud de cotización.
 *
 * SIN PRECIOS: el catálogo es un portafolio corporativo; los montos se entregan en la cotización.
 *
 * Verificar nomenclatura y ficha técnica oficial de HP antes de publicar especificaciones.
 *
 * FICHA COMPARABLE: `specValues` usa las claves de `specRows` (src/lib/content/compare.ts) según `kind`.
 * Los datos salen de las hojas de datos públicas de HP (fuentes en `specSources`) y se publicaron con
 * `verified: true`. Un producto nuevo sin revisar lleva `verified: false`: sus datos se muestran solo donde
 * `showUnverifiedContent()` lo permite y, si no, "Por confirmar".
 *
 * GENERACIÓN: "lanzamiento" = modelo actual; "anterior" = generación previa (también se vende y se cotiza).
 * El comparador usa `successor` para el salto de generación y `upgradeLadders` para recomendar mejoras.
 */

import type { ProductKind } from "./compare";

export type Product = {
  slug: string;
  name: string;
  model: string;
  /** Marca del fabricante (HP, ASUS, Lenovo…). */
  brand: string;
  family: string;
  /** Tipo de equipo: define qué filas se comparan (impresora, laptop…). */
  kind: ProductKind;
  /** "lanzamiento": modelo vigente del catálogo. "anterior": generación anterior, solo como referencia en el comparador. */
  generation: "lanzamiento" | "anterior";
  /** Año de lanzamiento del modelo (según el fabricante). */
  launchYear?: number;
  /** Línea comercial cuando importa para el cliente (por ejemplo "Managed: solo bajo contrato de impresión"). */
  lineNote?: string;
  /** Generación anterior: slug del modelo del catálogo que lo reemplaza. */
  successor?: string;
  /** Aclaración del reemplazo (por ejemplo, cuando el sucesor no es del mismo tipo de color). */
  successorNote?: string;
  category: string;
  summary: string;
  highlights: string[];
  /** Pares etiqueta/valor de la ficha técnica. Vacío hasta contar con la ficha oficial. */
  specs: { label: string; value: string }[];
  /** Ficha comparable (claves de `specRows[kind]`). */
  specValues?: Partial<Record<string, string>>;
  /** De dónde salen los datos de `specValues` (hojas de datos públicas del fabricante). */
  specSources?: { label: string; url: string }[];
  demo: true;
  verified: boolean;
  /** Producto genérico de demostración (sin modelo real): solo visible en desarrollo/pruebas. */
  placeholder?: boolean;
  note?: string;
};

const SPEC_NOTE = "Ficha tomada de la hoja de datos pública de HP (fuentes en `specSources`).";

const launchModels: Product[] = [
  {
    slug: "hp-laserjet-enterprise-mfp-x53052dn",
    name: "HP LaserJet Enterprise MFP X53052dn",
    model: "X53052dn",
    brand: "HP",
    family: "HP LaserJet Enterprise",
    kind: "impresora",
    generation: "lanzamiento",
    category: "Multifuncional láser",
    summary:
      "Multifuncional láser de la línea HP LaserJet Enterprise para áreas y oficinas con impresión diaria de documentos.",
    highlights: [
      "Impresión, copia y escaneo en un solo equipo.",
      "Línea empresarial HP LaserJet Enterprise.",
      "Disponible con implementación y soporte de Misión Tecnológica.",
    ],
    specs: [],
    // Hoja de datos pública de HP: revisada por un verificador independiente (nov. 2026), pendiente de validación interna.
    specValues: {
      functions: "Imprimir, copiar y escanear; fax opcional",
      color: "Monocromo",
      maxPaper: "A4 y oficio (hasta 216 × 356 mm)",
      printSpeed: "Hasta 50 ppm (A4) · 52 ppm (carta)",
      firstPage: "Desde 4,1 s (A4)",
      duplex: "Sí, automático",
      recommendedVolume: "10.000 a 25.000 páginas al mes",
      dutyCycle: "Hasta 275.000 páginas al mes",
      paperInput: "650 hojas (bandeja multiuso de 100 + bandeja de 550); hasta 2.300",
      adf: "100 hojas, escaneo dúplex de una sola pasada",
      scanSpeed: "Hasta 47 ppm / 94 ipm dúplex (A4)",
      display: "Táctil a color de 8\" (20,3 cm), inclinable",
      connectivity: "Gigabit Ethernet, USB 3.0 (dispositivo y host), USB 2.0 host; Wi-Fi opcional (HP Jetdirect 3200w)",
      security: "HP Wolf Enterprise Security: HP Sure Start, detección de intrusiones en tiempo real, TPM 2.0 y autorrecuperación",
    },
    specSources: [
      { label: "Hoja de datos HP LaserJet Enterprise MFP X53052dn/z (copia publicada por un distribuidor)", url: "https://gosigna.com/wp-content/uploads/2026/03/X53052dn.pdf" },
      { label: "Guía del usuario HP MFP X53052", url: "https://www.hpusertraining.com/Printer_Content/MFPX53052/en/user_guide.pdf" },
    ],
    demo: true,
    verified: true,
    note: SPEC_NOTE,
  },
  {
    slug: "hp-laserjet-enterprise-mfp-x52952dn",
    name: "HP LaserJet Enterprise MFP X52952dn",
    model: "X52952dn",
    brand: "HP",
    family: "HP LaserJet Enterprise",
    kind: "impresora",
    generation: "lanzamiento",
    category: "Multifuncional láser",
    summary: "Multifuncional láser HP LaserJet Enterprise para equipos de trabajo que necesitan imprimir, copiar y digitalizar.",
    highlights: [
      "Impresión, copia y escaneo en un solo equipo.",
      "Línea empresarial HP LaserJet Enterprise.",
      "Disponible con implementación y soporte de Misión Tecnológica.",
    ],
    specs: [],
    // Hoja de datos pública de HP: revisada por un verificador independiente (nov. 2026), pendiente de validación interna.
    specValues: {
      functions: "Imprimir, copiar y escanear; fax opcional",
      color: "Monocromo",
      maxPaper: "A4 y oficio (hasta 216 × 356 mm)",
      printSpeed: "Hasta 50 ppm (A4) · 52 ppm (carta)",
      firstPage: "Desde 4,1 s (A4)",
      duplex: "Sí, automático",
      recommendedVolume: "7.500 a 18.750 páginas al mes",
      dutyCycle: "Hasta 225.000 páginas al mes",
      paperInput: "650 hojas (bandeja multiuso de 100 + bandeja de 550); hasta 2.300",
      adf: "50 hojas, escaneo dúplex de una sola pasada",
      scanSpeed: "Hasta 38 ppm / 76 ipm dúplex (A4)",
      display: "Táctil a color de 4,3\" (10,9 cm), inclinable",
      connectivity: "Gigabit Ethernet, USB 2.0 (dispositivo y host); Wi-Fi opcional (HP Jetdirect 3200w)",
      security: "HP Wolf Enterprise Security: HP Sure Start, lista de permitidos, Memory Shield, Connection Inspector y TPM 2.0",
    },
    specSources: [
      { label: "Hoja de datos HP LaserJet Enterprise MFP X52952 (copia publicada por un distribuidor)", url: "https://www.laservalley.com/pdfs/hpprinters/X52952.pdf" },
      { label: "Guía del usuario HP MFP X52952dn", url: "https://kaas.hpcloud.hp.com/pdf-public/pdf_12064934_en-US-1.pdf" },
      { label: "Soporte HP Perú: X52952dn", url: "https://support.hp.com/pe-es/product/setup-user-guides/hp-laserjet-enterprise-mfp-x52952dn-printer-series/model/2102789227" },
    ],
    demo: true,
    verified: true,
    note: SPEC_NOTE,
  },
  {
    slug: "hp-laserjet-enterprise-mfp-x62757dn",
    name: "HP LaserJet Enterprise MFP X62757dn",
    model: "X62757dn",
    brand: "HP",
    family: "HP LaserJet Enterprise",
    kind: "impresora",
    generation: "lanzamiento",
    category: "Multifuncional láser",
    summary: "Multifuncional láser HP LaserJet Enterprise para sedes y áreas con mayor volumen de documentos.",
    highlights: [
      "Impresión, copia y escaneo en un solo equipo.",
      "Línea empresarial HP LaserJet Enterprise.",
      "Disponible con implementación y soporte de Misión Tecnológica.",
    ],
    specs: [],
    // Hoja de datos pública de HP: revisada por un verificador independiente (nov. 2026), pendiente de validación interna.
    specValues: {
      functions: "Imprimir, copiar y escanear; fax opcional",
      color: "Monocromo",
      maxPaper: "A4 y oficio (hasta 216 × 356 mm)",
      printSpeed: "Hasta 55 ppm (A4) · 57 ppm (carta)",
      firstPage: "Desde 3,9 s (A4)",
      duplex: "Sí, automático",
      recommendedVolume: "15.000 a 37.500 páginas al mes",
      dutyCycle: "Hasta 425.000 páginas al mes",
      paperInput: "650 hojas (bandeja multiuso de 100 + bandeja de 550); hasta 2.850",
      adf: "150 hojas, escaneo dúplex de una sola pasada",
      scanSpeed: "Hasta 86 ppm / 172 ipm dúplex (A4)",
      display: "Táctil a color de 8\" (20,3 cm), inclinable",
      connectivity: "Gigabit Ethernet, USB 3.0 (dispositivo y host), USB 2.0 frontal; Wi-Fi opcional (HP Jetdirect 3200w)",
      security: "HP Wolf Enterprise Security: HP Sure Start, Memory Shield, Connection Inspector con autorrecuperación y TPM 2.0",
    },
    specSources: [
      { label: "Hoja de datos HP LaserJet Enterprise MFP X62757dn/zs (copia publicada por un distribuidor)", url: "https://gosigna.com/wp-content/uploads/2026/03/X62757dn-zs.pdf" },
      { label: "Guía del usuario HP MFP X62757", url: "https://kaas.hpcloud.hp.com/pdf-public/pdf_11890828_en-US-1.pdf" },
    ],
    demo: true,
    verified: true,
    note: SPEC_NOTE,
  },
  {
    slug: "hp-color-laserjet-enterprise-mfp-5800f",
    name: "HP Color LaserJet Enterprise MFP 5800f",
    model: "5800f",
    brand: "HP",
    family: "HP Color LaserJet Enterprise",
    kind: "impresora",
    generation: "lanzamiento",
    launchYear: 2023,
    category: "Multifuncional láser color",
    summary: "Multifuncional láser a color A4 de la línea HP Color LaserJet Enterprise, con fax de serie, para áreas que imprimen y digitalizan a diario.",
    highlights: [
      "Impresión a color, copia, escaneo y fax en un solo equipo.",
      "Línea empresarial HP Color LaserJet Enterprise.",
      "Disponible con implementación y soporte de Misión Tecnológica.",
    ],
    specs: [],
    specValues: {
      functions: "Imprimir, copiar, escanear y fax",
      color: "Color",
      maxPaper: "A4 y oficio (hasta 216 × 356 mm)",
      printSpeed: "Hasta 43 ppm negro y color (A4) · 45 ppm (carta)",
      firstPage: "Desde 7,2 s negro / 7,9 s color (A4)",
      duplex: "Sí, automático",
      recommendedVolume: "2.000 a 10.000 páginas al mes",
      dutyCycle: "Hasta 80.000 páginas al mes",
      paperInput: "650 hojas (bandeja multiuso de 100 + bandeja de 550); hasta 2.300",
      adf: "100 hojas, escaneo dúplex de una sola pasada",
      scanSpeed: "Hasta 47 ppm / 94 ipm dúplex en negro y color (A4)",
      display: "Táctil a color de 8\" (20,3 cm), inclinable",
      connectivity: "Gigabit Ethernet, USB 3.0 (dispositivo y host) y USB 2.0 host; Wi-Fi, BLE y NFC opcionales (HP Jetdirect 3100w)",
      security: "HP Wolf Security: HP Sure Start con autorreparación, lista blanca de código, Memory Shield, cifrado del almacenamiento y borrado seguro",
    },
    specSources: [
      { label: "HP: especificaciones de la Color LaserJet Enterprise MFP 5800f", url: "https://hp.com/lk-en/products/printers/product-details/product-specifications/2100491674" },
      { label: "Hoja de especificaciones HP 5800f, 2023 (copia publicada por un distribuidor)", url: "https://content.etilize.com/Additional-pdf1/1076801100.pdf" },
      { label: "Soporte HP Perú: serie MFP 5800", url: "https://support.hp.com/pe-es/drivers/hp-color-laserjet-enterprise-mfp-5800-printer-series/2101004128" },
    ],
    demo: true,
    verified: true,
    note: SPEC_NOTE,
  },
];

const MANAGED_NOTE = "Línea Managed: HP la vende solo bajo contrato de impresión gestionada.";

const previousModels: Product[] = [
  {
    slug: "hp-laserjet-managed-mfp-e52645dn",
    name: "HP LaserJet Managed MFP E52645dn",
    model: "E52645dn",
    brand: "HP",
    family: "HP LaserJet Managed",
    kind: "impresora",
    generation: "anterior",
    launchYear: 2019,
    lineNote: MANAGED_NOTE,
    successor: "hp-laserjet-enterprise-mfp-x53052dn",
    category: "Multifuncional láser",
    summary: "Multifuncional monocromo A4 de la generación 2019, de la línea Managed de HP.",
    highlights: [],
    specs: [],
    specValues: {
      functions: "Imprimir, copiar y escanear; fax opcional",
      color: "Monocromo",
      maxPaper: "A4 y oficio (hasta 216 × 356 mm)",
      printSpeed: "Hasta 43 ppm (A4)",
      firstPage: "Desde 5,2 s (A4)",
      duplex: "Sí, automático",
      recommendedVolume: "4.000 a 15.000 páginas al mes",
      dutyCycle: "Hasta 150.000 páginas al mes",
      paperInput: "650 hojas (bandeja multiuso de 100 + bandeja de 550); hasta 2.300",
      adf: "100 hojas, escaneo dúplex de una sola pasada",
      scanSpeed: "Hasta 43 ppm / 43 ipm dúplex (A4)",
      display: "Táctil a color de 8\" (20,3 cm), inclinable",
      connectivity: "Gigabit Ethernet, USB 2.0 (dispositivo y 2 host, uno frontal); Wi-Fi, Wi-Fi Direct y NFC opcionales (HP Jetdirect)",
      security: "HP Sure Start con autorreparación, lista blanca de firmware, detección de intrusiones en tiempo de ejecución y Connection Inspector",
    },
    specSources: [
      { label: "Hoja de datos HP LaserJet Managed MFP E52645, 4AA7-4853, marzo de 2019 (copia publicada por un distribuidor)", url: "https://landscape.uk.com/wp-content/uploads/2023/02/E52645-series_Landscape-23.pdf" },
      { label: "Soporte HP: serie E52645", url: "https://support.hp.com/mx-es/drivers/hp-laserjet-managed-mfp-e52645-series/20204802" },
    ],
    demo: true,
    verified: true,
    note: SPEC_NOTE,
  },
  {
    slug: "hp-laserjet-managed-mfp-e62655dn",
    name: "HP LaserJet Managed MFP E62655dn",
    model: "E62655dn",
    brand: "HP",
    family: "HP LaserJet Managed",
    kind: "impresora",
    generation: "anterior",
    launchYear: 2019,
    lineNote: MANAGED_NOTE,
    successor: "hp-laserjet-enterprise-mfp-x62757dn",
    category: "Multifuncional láser",
    summary: "Multifuncional monocromo A4 de alto volumen de la generación 2019, de la línea Managed de HP.",
    highlights: [],
    specs: [],
    specValues: {
      functions: "Imprimir, copiar y escanear; fax opcional",
      color: "Monocromo",
      maxPaper: "A4 y oficio (hasta 216 × 356 mm)",
      printSpeed: "Hasta 52 ppm (A4) · 55 ppm (carta)",
      firstPage: "Desde 5,3 s (A4)",
      duplex: "Sí, automático",
      recommendedVolume: "5.000 a 40.000 páginas al mes",
      dutyCycle: "Hasta 450.000 páginas al mes",
      paperInput: "650 hojas (bandeja multiuso de 100 + bandeja de 550); hasta 3.750",
      adf: "150 hojas, escaneo dúplex de una sola pasada",
      scanSpeed: "Hasta 69 ppm / 111 ipm dúplex (A4)",
      display: "Táctil a color de 8\" (20,3 cm), inclinable",
      connectivity: "Gigabit Ethernet, USB 2.0 (dispositivo y 2 host); Wi-Fi, Wi-Fi Direct, NFC y BLE opcionales (HP Jetdirect)",
      security: "HP Sure Start con autorreparación, lista blanca de firmware, detección de intrusiones en tiempo de ejecución, cifrado y borrado seguro",
    },
    specSources: [
      { label: "Hoja de datos HP LaserJet Managed MFP E62655dn, 4AA7-4195EEP, abril de 2019 (copia publicada por un distribuidor)", url: "https://cdn.shopify.com/s/files/1/0012/3548/4776/files/E62655dn_datasheet.pdf" },
      { label: "Hoja de datos HP LaserJet Managed MFP E62655 (copia publicada por un distribuidor)", url: "https://www.agilico.co.uk/wp-content/uploads/2024/10/HP-LaserJet-Managed-MFP-E62655.pdf" },
    ],
    demo: true,
    verified: true,
    note: SPEC_NOTE,
  },
  {
    slug: "hp-laserjet-managed-mfp-e42540f",
    name: "HP LaserJet Managed MFP E42540f",
    model: "E42540f",
    brand: "HP",
    family: "HP LaserJet Managed",
    kind: "impresora",
    generation: "anterior",
    lineNote: MANAGED_NOTE,
    successor: "hp-laserjet-enterprise-mfp-x52952dn",
    successorNote: "HP no indica un sucesor oficial: el X52952dn es el multifuncional compacto equivalente del catálogo.",
    category: "Multifuncional láser",
    summary: "Multifuncional monocromo A4 compacto de la línea Managed de HP.",
    highlights: [],
    specs: [],
    specValues: {
      functions: "Imprimir, copiar, escanear y fax",
      color: "Monocromo",
      maxPaper: "A4 y oficio (hasta 216 × 356 mm)",
      printSpeed: "Hasta 38 ppm (A4) · 40 ppm (carta)",
      firstPage: "Desde 6,5 s (A4)",
      duplex: "Sí, automático",
      recommendedVolume: "1.500 a 7.500 páginas al mes",
      dutyCycle: "Hasta 120.000 páginas al mes",
      paperInput: "350 hojas (bandeja multiuso de 100 + bandeja de 250); hasta 900",
      adf: "50 hojas, escaneo dúplex de una sola pasada",
      scanSpeed: "Hasta 29 ppm / 46 ipm dúplex (A4)",
      display: "Táctil a color de 4,3\" (10,9 cm)",
      connectivity: "Gigabit Ethernet, USB 2.0 (dispositivo y 2 host); Wi-Fi, Wi-Fi Direct, BLE y NFC opcionales (Jetdirect 3100w)",
      security: "HP Sure Start con autorreparación, lista blanca de firmware, detección de intrusiones en tiempo real, Connection Inspector y TPM",
    },
    specSources: [
      { label: "HP: especificaciones del E42540f", url: "https://hp.com/bd-en/products/printers/product-details/product-specifications/29252403" },
      { label: "Hoja de datos HP LaserJet Managed MFP E42540f (copia publicada por un distribuidor)", url: "https://landscape.uk.com/wp-content/uploads/2023/02/E42540f-data-sheet_Landscape-23.pdf" },
    ],
    demo: true,
    verified: true,
    note: SPEC_NOTE,
  },
  {
    slug: "hp-color-laserjet-pro-mfp-m479fdw",
    name: "HP Color LaserJet Pro MFP M479fdw",
    model: "M479fdw",
    brand: "HP",
    family: "HP Color LaserJet Pro",
    kind: "impresora",
    generation: "anterior",
    launchYear: 2019,
    successor: "hp-color-laserjet-enterprise-mfp-5800f",
    successorNote: "En la línea Pro, HP lo reemplazó por la Color LaserJet Pro MFP 4301fdw; en el catálogo, el salto a color es la MFP 5800f.",
    category: "Multifuncional láser color",
    summary: "Multifuncional láser a color A4 para pequeñas y medianas empresas, de la generación 2019.",
    highlights: [],
    specs: [],
    specValues: {
      functions: "Imprimir, copiar, escanear y fax",
      color: "Color",
      maxPaper: "A4 y oficio (hasta 216 × 356 mm)",
      printSpeed: "Hasta 27 ppm negro y color (A4) · 28 ppm (carta)",
      firstPage: "Desde 9,5 s negro / 11,0 s color (A4)",
      duplex: "Sí, automático",
      recommendedVolume: "750 a 4.000 páginas al mes",
      dutyCycle: "Hasta 50.000 páginas al mes",
      paperInput: "300 hojas (bandeja multiuso de 50 + bandeja de 250); hasta 850",
      adf: "50 hojas, escaneo dúplex de una sola pasada",
      scanSpeed: "Hasta 29 ppm / 46 ipm dúplex en negro; 20 ppm / 35 ipm en color (A4)",
      display: "Táctil a color de 4,3\" (10,9 cm)",
      connectivity: "Gigabit Ethernet, USB 2.0 (dispositivo y host), Wi-Fi de doble banda, Wi-Fi Direct y Bluetooth Low Energy",
      security: "Arranque seguro, integridad del firmware y del código en ejecución, impresión con PIN, almacenamiento cifrado y 802.1x",
    },
    specSources: [
      { label: "Hoja de datos HP Color LaserJet Pro MFP M479fdw (HP)", url: "https://pcb.inc.hp.com/dc/api/spec-sheet/ww-en/19202521/pdf/W1A80A.pdf" },
    ],
    demo: true,
    verified: true,
    note: SPEC_NOTE,
  },
  {
    slug: "hp-color-laserjet-managed-mfp-e47528f",
    name: "HP Color LaserJet Managed MFP E47528f",
    model: "E47528f",
    brand: "HP",
    family: "HP Color LaserJet Managed",
    kind: "impresora",
    generation: "anterior",
    launchYear: 2020,
    lineNote: MANAGED_NOTE,
    successor: "hp-color-laserjet-enterprise-mfp-5800f",
    successorNote: "HP no indica un sucesor oficial: la MFP 5800f es el multifuncional a color de nueva generación del catálogo.",
    category: "Multifuncional láser color",
    summary: "Multifuncional láser a color A4 de la línea Managed de HP, de la generación 2020.",
    highlights: [],
    specs: [],
    specValues: {
      functions: "Imprimir, copiar, escanear y fax",
      color: "Color",
      maxPaper: "A4 y oficio (hasta 216 × 356 mm)",
      printSpeed: "Hasta 27 ppm negro y color (A4) · 29 ppm (carta)",
      firstPage: "Desde 9,5 s negro / 11,0 s color (A4)",
      duplex: "Sí, automático",
      recommendedVolume: "1.500 a 7.500 páginas al mes",
      dutyCycle: "Hasta 65.000 páginas al mes",
      paperInput: "300 hojas (bandeja multiuso de 50 + bandeja de 250); hasta 850",
      adf: "50 hojas, escaneo dúplex de una sola pasada",
      scanSpeed: "Hasta 29 ppm / 46 ipm dúplex en negro; 20 ppm / 35 ipm en color (A4)",
      display: "Táctil a color de 4,3\" (10,9 cm)",
      connectivity: "Gigabit Ethernet, USB 2.0 (dispositivo y 2 host, uno frontal); Wi-Fi, Wi-Fi Direct, BLE y NFC opcionales",
      security: "HP Sure Start con autorreparación, lista blanca de firmware, detección de intrusiones, Connection Inspector, TPM y cifrado del almacenamiento",
    },
    specSources: [
      { label: "Hoja de datos HP Color LaserJet Managed MFP E47528, noviembre de 2020 (copia publicada por un distribuidor)", url: "https://www.agilico.co.uk/wp-content/uploads/2024/10/HP-Color-LaserJet-Managed-MFP-E47528.pdf" },
      { label: "Soporte HP: serie E47528", url: "https://support.hp.com/ar-es/drivers/hp-color-laserjet-managed-mfp-e47528-series/29256425" },
    ],
    demo: true,
    verified: true,
    note: SPEC_NOTE,
  },
];

/**
 * Productos GENÉRICOS de demostración para las categorías de impresión sin modelos definidos todavía.
 * Reemplazar por los modelos reales (con marca, ficha y fotografía) y quitar `placeholder`.
 */
const genericDemo = (
  slug: string,
  kind: ProductKind,
  name: string,
  category: string,
  summary: string,
  highlights: string[],
): Product => ({
  slug,
  name,
  model: "Demo",
  brand: "Genérico",
  family: "Producto de demostración",
  kind,
  generation: "lanzamiento",
  category,
  summary,
  highlights,
  specs: [],
  demo: true,
  verified: false,
  placeholder: true,
  note: "Producto genérico de demostración: reemplazar por el modelo real.",
});

const demoModels: Product[] = [
  genericDemo(
    "ticketera-termica-demo",
    "ticketera",
    "Ticketera térmica",
    "Ticketeras",
    "Impresora térmica de tickets y comprobantes para puntos de venta y atención al público.",
    ["Impresión térmica rápida, sin tinta.", "Para cajas, mostradores y módulos de atención.", "Instalación y soporte de Misión Tecnológica."],
  ),
  genericDemo(
    "plotter-gran-formato-demo",
    "plotter",
    "Plotter de gran formato",
    "Plotters",
    "Impresión de planos y gráficos en gran formato para áreas técnicas, de ingeniería y de diseño.",
    ["Planos y láminas en A1 y A0.", "Para áreas técnicas y de proyectos.", "Instalación y soporte de Misión Tecnológica."],
  ),
  genericDemo(
    "lector-codigo-barras-demo",
    "lector",
    "Lector de códigos de barras",
    "Lectores",
    "Lectura de códigos 1D y 2D para almacenes, tiendas y control de inventario.",
    ["Lectura de códigos 1D y 2D.", "Para almacenes, cajas e inventarios.", "Configuración y soporte de Misión Tecnológica."],
  ),
  genericDemo(
    "escaner-documental-demo",
    "escaner",
    "Escáner documental",
    "Escáneres",
    "Digitalización de documentos a alta velocidad con alimentador automático, para áreas con mucho archivo.",
    ["Escaneo dúplex con alimentador automático.", "Ideal para proyectos de digitalización.", "Instalación y soporte de Misión Tecnológica."],
  ),
];

/** Catálogo completo: modelos de lanzamiento, generación anterior (todos se venden) y genéricos de demostración. */
export const products: Product[] = [...launchModels, ...previousModels, ...demoModels];

/** Productos publicables: los genéricos de demostración solo se ven en desarrollo/pruebas. */
export function visibleProducts(showPlaceholders: boolean) {
  return products.filter((p) => !p.placeholder || showPlaceholders);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

/** Modelos de generación anterior que reemplaza un modelo del catálogo. */
export function predecessorsOf(slug: string) {
  return products.filter((p) => p.successor === slug);
}

/* ------------------------------------------------------------------ */
/* Upgrade: escaleras por tipo de impresión                             */
/* ------------------------------------------------------------------ */

export type PrintColor = "mono" | "color";

/**
 * Escaleras de upgrade, de menor a mayor clase (capacidad y volumen), sin importar la generación.
 * El asesor del comparador recomienda los dos peldaños siguientes del mismo tipo de impresión.
 */
export const upgradeLadders: Record<PrintColor, string[]> = {
  mono: [
    "hp-laserjet-managed-mfp-e42540f",
    "hp-laserjet-managed-mfp-e52645dn",
    "hp-laserjet-enterprise-mfp-x52952dn",
    "hp-laserjet-enterprise-mfp-x53052dn",
    "hp-laserjet-managed-mfp-e62655dn",
    "hp-laserjet-enterprise-mfp-x62757dn",
  ],
  color: ["hp-color-laserjet-pro-mfp-m479fdw", "hp-color-laserjet-managed-mfp-e47528f", "hp-color-laserjet-enterprise-mfp-5800f"],
};

export function printColorOf(slug: string): PrintColor | null {
  if (upgradeLadders.mono.includes(slug)) return "mono";
  if (upgradeLadders.color.includes(slug)) return "color";
  return null;
}

/** Posición en su escalera (para saber si un modelo es un upgrade de otro). */
export function ladderRank(slug: string) {
  const color = printColorOf(slug);
  return color ? upgradeLadders[color].indexOf(slug) : -1;
}

/** Los dos modelos siguientes de la misma escalera (mismo tipo de impresión). */
export function upgradesFor(slug: string): Product[] {
  const color = printColorOf(slug);
  if (!color) return [];
  const ladder = upgradeLadders[color];
  return ladder
    .slice(ladder.indexOf(slug) + 1, ladder.indexOf(slug) + 3)
    .map(getProduct)
    .filter((p): p is Product => !!p);
}

/**
 * Pasar de color a monocromo: los dos primeros peldaños monocromo que imprimen más rápido que el equipo actual.
 * (Se pierde el color; se gana velocidad y capacidad.)
 */
export function monoSwitchFor(slug: string, speedOf: (p: Product) => number | null): Product[] {
  const current = getProduct(slug);
  if (!current || printColorOf(slug) !== "color") return [];
  const base = speedOf(current) ?? 0;
  return upgradeLadders.mono
    .map(getProduct)
    .filter((p): p is Product => !!p && (speedOf(p) ?? 0) > base)
    .slice(0, 2);
}

export const productHref = (slug: string) => `/catalogo/${slug}`;

export const productsByKind = (kind: ProductKind) => products.filter((p) => p.kind === kind);
