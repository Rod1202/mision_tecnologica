/**
 * Configuración general del sitio.
 * En la fase de CMS estos datos pasarán a la colección global `SiteSettings` de Payload.
 */

export const siteConfig = {
  name: "Misión Tecnológica",
  shortName: "MT",
  description:
    "Soluciones TI, cómputo e impresión: outsourcing de impresión HP, arrendamiento y venta de cómputo, digitalización documental e infraestructura tecnológica para empresas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://misiontecnologica.com",
  locale: "es_PE",

  contact: {
    email: "contacto@misiontecnologica.com",
    // Datos de la web actual (misiontecnologica.com/contactanos)
    phone: "+51919280810",
    phoneDisplay: "919 280 810",
    hours: "Lunes a viernes, de 9:00 a 18:00",
    address: {
      street: "Av. Circunvalación Golf Los Incas 134, Edificio Patio Panorama, Torre 1, Oficina 602",
      district: "Santiago de Surco",
      city: "Lima",
      country: "PE",
    },
    // TODO: reemplazar por el número oficial de WhatsApp (formato internacional, sin "+").
    whatsapp: "51999999999",
    whatsappDisplay: "+51 999 999 999",
    whatsappIsPlaceholder: true,
    whatsappDefaultMessage: "Hola, Misión Tecnológica. Me gustaría recibir asesoría.",
  },

  social: {
    // Enlaces de la web actual (misiontecnologica.com)
    linkedin: "https://www.linkedin.com/company/10482785/",
    facebook: "https://www.facebook.com/misiontecnologica/",
    instagram: "https://www.instagram.com/misiontecnologica/",
  },

  integrations: {
    // Widget de SociableKit para publicaciones de la página de LinkedIn.
    sociableKitLinkedInEmbedId: "25731703",
  },
} as const;

export type NavItem = { label: string; href: string; external?: boolean };

/** Menú principal (documento "Arquitectura UX/UI"). Los botones "Cotizar proyecto" y "Contáctanos" van aparte. */
export const mainNav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Soluciones", href: "/soluciones" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Portal ISO", href: "/portal-iso" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Soluciones",
    items: [
      { label: "Outsourcing de impresión", href: "/soluciones/outsourcing-de-impresion" },
      { label: "Arrendamiento y venta de cómputo", href: "/soluciones/arrendamiento-y-venta-de-computo" },
      { label: "Digitalización documental", href: "/soluciones/digitalizacion-documental" },
      { label: "Infraestructura tecnológica", href: "/soluciones/infraestructura-tecnologica" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Sectores", href: "/sectores" },
      { label: "Publicaciones", href: "/publicaciones" },
      { label: "Portal ISO", href: "/portal-iso" },
      { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
    ],
  },
  {
    title: "Explora",
    items: [
      { label: "Catálogo", href: "/catalogo" },
      { label: "Comparar equipos", href: "/catalogo/comparar" },
      { label: "Encuentra tu solución", href: "/#encuentra-tu-solucion" },
      { label: "Outlet (Clicprint)", href: "https://clicprint.pe", external: true },
      { label: "Privacidad", href: "/privacidad" },
      {
        label: "Derechos ARCO",
        // Guía publicada en la web actual. Copiarla a /public/documentos/ antes de cambiar el dominio.
        href: "https://misiontecnologica.com/wp-content/uploads/2025/11/GUIA_DE_PROCEDIMIENTO_DE_DERECHOS_ARCO.pdf",
        external: true,
      },
    ],
  },
];

/**
 * Contenido pendiente de validación (clientes, modelos HP, hito 2026):
 * - En desarrollo (`pnpm dev`) se muestra siempre (sin etiquetas visibles).
 * - En builds (Netlify, VPS) solo se muestra si SHOW_UNVERIFIED_CONTENT=true.
 */
export function showUnverifiedContent() {
  return process.env.NODE_ENV === "development" || process.env.SHOW_UNVERIFIED_CONTENT === "true";
}
