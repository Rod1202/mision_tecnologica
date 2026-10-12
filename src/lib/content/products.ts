/**
 * Catálogo de DEMOSTRACIÓN — futura colección `Products` de Payload.
 * No hay pagos ni stock: la tienda arma una solicitud de cotización por WhatsApp.
 *
 * PRECIOS: `price` es un precio REFERENCIAL DE DEMOSTRACIÓN (`priceIsDemo: true`) para probar
 * el filtro y el orden por precio. Se muestra siempre rotulado como demo. Reemplazar por el precio
 * referencial real (y poner `priceIsDemo: false`) o dejar `price` sin definir para mostrar "A cotizar".
 *
 * Verificar nomenclatura y ficha técnica oficial de HP antes de publicar especificaciones.
 */

export type Product = {
  slug: string;
  name: string;
  model: string;
  brand: "HP";
  family: string;
  category: string;
  /** Precio referencial en soles (PEN). Sin definir = "A cotizar". */
  price?: number;
  priceIsDemo?: boolean;
  summary: string;
  highlights: string[];
  /** Pares etiqueta/valor de la ficha técnica. Vacío hasta contar con la ficha oficial. */
  specs: { label: string; value: string }[];
  demo: true;
  verified: boolean;
  note?: string;
};

const PENDING_SPEC = "Verificar nomenclatura y ficha técnica oficial del fabricante.";

export const products: Product[] = [
  {
    slug: "hp-laserjet-enterprise-mfp-x53052dn",
    name: "HP LaserJet Enterprise MFP X53052dn",
    model: "X53052dn",
    brand: "HP",
    family: "HP LaserJet Enterprise",
    category: "Multifuncional láser",
    price: 5200,
    priceIsDemo: true,
    summary:
      "Multifuncional láser de la línea HP LaserJet Enterprise para áreas y oficinas con impresión diaria de documentos.",
    highlights: [
      "Impresión, copia y escaneo en un solo equipo.",
      "Línea empresarial HP LaserJet Enterprise.",
      "Disponible con implementación y soporte de Misión Tecnológica.",
    ],
    specs: [],
    demo: true,
    verified: false,
    note: PENDING_SPEC,
  },
  {
    slug: "hp-laserjet-enterprise-mfp-x52952dn",
    name: "HP LaserJet Enterprise MFP X52952dn",
    model: "X52952dn",
    brand: "HP",
    family: "HP LaserJet Enterprise",
    category: "Multifuncional láser",
    price: 4500,
    priceIsDemo: true,
    summary: "Multifuncional láser HP LaserJet Enterprise para equipos de trabajo que necesitan imprimir, copiar y digitalizar.",
    highlights: [
      "Impresión, copia y escaneo en un solo equipo.",
      "Línea empresarial HP LaserJet Enterprise.",
      "Disponible con implementación y soporte de Misión Tecnológica.",
    ],
    specs: [],
    demo: true,
    verified: false,
    note: PENDING_SPEC,
  },
  {
    slug: "hp-laserjet-enterprise-mfp-x62757dn",
    name: "HP LaserJet Enterprise MFP X62757dn",
    model: "X62757dn",
    brand: "HP",
    family: "HP LaserJet Enterprise",
    category: "Multifuncional láser",
    price: 8900,
    priceIsDemo: true,
    summary: "Multifuncional láser HP LaserJet Enterprise para sedes y áreas con mayor volumen de documentos.",
    highlights: [
      "Impresión, copia y escaneo en un solo equipo.",
      "Línea empresarial HP LaserJet Enterprise.",
      "Disponible con implementación y soporte de Misión Tecnológica.",
    ],
    specs: [],
    demo: true,
    verified: false,
    note: PENDING_SPEC,
  },
];

const priceFormatter = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 });

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const productHref = (slug: string) => `/tienda/${slug}`;
