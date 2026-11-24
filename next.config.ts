import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Postulaciones con CV (PDF de hasta 5 MB) enviadas por Server Action.
    serverActions: { bodySizeLimit: "6mb" },
  },
  // URLs antiguas → nuevas (301). Documentar aquí cada cambio de URL.
  async redirects() {
    return [
      { source: "/impresion-empresarial", destination: "/soluciones/outsourcing-de-impresion", permanent: true },
      // Nombres anteriores de las soluciones (ronda 2) → 4 líneas de negocio de la web actual
      { source: "/soluciones/impresion-empresarial", destination: "/soluciones/outsourcing-de-impresion", permanent: true },
      { source: "/soluciones/outsourcing-tecnologico", destination: "/soluciones/arrendamiento-y-venta-de-computo", permanent: true },
      { source: "/soluciones/implementacion-y-despliegue", destination: "/soluciones/infraestructura-tecnologica", permanent: true },
      { source: "/soluciones/soporte-y-continuidad", destination: "/soluciones/infraestructura-tecnologica", permanent: true },
      { source: "/liderazgo", destination: "/nosotros", permanent: true },
      // Tienda → Catálogo (sin precios)
      { source: "/tienda", destination: "/catalogo", permanent: true },
      { source: "/tienda/:path*", destination: "/catalogo/:path*", permanent: true },
      // URLs de la web actual (WordPress) para conservar enlaces y posicionamiento al cambiar el dominio
      { source: "/inicio-2", destination: "/nosotros", permanent: true },
      { source: "/contactanos", destination: "/contacto", permanent: true },
      { source: "/hp-brand-showcase", destination: "/catalogo", permanent: true },
      { source: "/portal-iso-27001", destination: "/portal-iso#iso-27001", permanent: true },
      { source: "/portal-iso-37001", destination: "/portal-iso#iso-37001", permanent: true },
    ];
  },
  // Cuando se integre Payload CMS, esta configuración se envolverá con `withPayload()`.
};

export default nextConfig;
