/**
 * Configuración general del sitio.
 * En la fase de CMS estos datos pasarán a la colección global `SiteSettings` de Payload.
 */

export const siteConfig = {
  name: "Misión Tecnológica",
  shortName: "MT",
  description:
    "Outsourcing tecnológico e impresión empresarial para optimizar recursos, mejorar el servicio y acompañar el crecimiento de tu organización.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://misiontecnologica.com",
  locale: "es_PE",

  contact: {
    email: "contacto@misiontecnologica.com",
    // TODO: reemplazar por el número oficial de WhatsApp (formato internacional, sin "+").
    whatsapp: "51999999999",
    whatsappDisplay: "+51 999 999 999",
    whatsappIsPlaceholder: true,
    whatsappDefaultMessage: "Hola, Misión Tecnológica. Me gustaría recibir asesoría.",
  },

  social: {
    // TODO: completar con la URL oficial de la página de empresa en LinkedIn.
    linkedin: "",
  },

  integrations: {
    // Widget de SociableKit para publicaciones de la página de LinkedIn.
    sociableKitLinkedInEmbedId: "25721309",
  },
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Soluciones", href: "/soluciones" },
  { label: "Sectores", href: "/sectores" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Tienda", href: "/tienda" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Soluciones",
    items: [
      { label: "Outsourcing tecnológico", href: "/soluciones/outsourcing-tecnologico" },
      { label: "Impresión empresarial", href: "/soluciones/impresion-empresarial" },
      { label: "Implementación y despliegue", href: "/soluciones/implementacion-y-despliegue" },
      { label: "Soporte y continuidad", href: "/soluciones/soporte-y-continuidad" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Sectores", href: "/sectores" },
      { label: "Publicaciones", href: "/publicaciones" },
      { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
    ],
  },
  {
    title: "Explora",
    items: [
      { label: "Tienda", href: "/tienda" },
      { label: "Contacto", href: "/contacto" },
      { label: "Privacidad", href: "/privacidad" },
    ],
  },
];

/**
 * Contenido pendiente de validación (clientes, modelos HP, hito 2026):
 * - En desarrollo (`pnpm dev`) se muestra siempre, con una etiqueta "Por validar".
 * - En builds (Netlify, VPS) solo se muestra si SHOW_UNVERIFIED_CONTENT=true.
 */
export function showUnverifiedContent() {
  return process.env.NODE_ENV === "development" || process.env.SHOW_UNVERIFIED_CONTENT === "true";
}
