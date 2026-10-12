import type { Metadata } from "next";

/**
 * Metadatos de páginas interiores.
 * `draft: true` → página en preparación: noindex y fuera del sitemap hasta tener contenido real.
 */
export function pageMetadata({
  title,
  description,
  path,
  draft = false,
}: {
  title: string;
  description: string;
  path: string;
  draft?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    ...(draft ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Rutas públicas con contenido final (las únicas que entran al sitemap). */
export const publishedRoutes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/soluciones", priority: 0.9 },
  { path: "/sectores", priority: 0.8 },
  { path: "/nosotros", priority: 0.8 },
  { path: "/tienda", priority: 0.7 },
  { path: "/contacto", priority: 0.8 },
  { path: "/trabaja-con-nosotros", priority: 0.5 },
];
