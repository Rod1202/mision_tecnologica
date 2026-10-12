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
      { source: "/impresion-empresarial", destination: "/soluciones/impresion-empresarial", permanent: true },
      { source: "/liderazgo", destination: "/nosotros", permanent: true },
    ];
  },
  // Cuando se integre Payload CMS, esta configuración se envolverá con `withPayload()`.
};

export default nextConfig;
