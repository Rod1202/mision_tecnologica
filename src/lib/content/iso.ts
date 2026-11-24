/**
 * Portal ISO — se conserva igual que en la web actual (misiontecnologica.com/portal-iso, /portal-iso-27001
 * y /portal-iso-37001) por cumplimiento normativo y auditorías.
 *
 * DOCUMENTOS: hoy enlazan a los PDF publicados en la web actual (WordPress). ANTES de cambiar el dominio,
 * descargar cada PDF a /public/documentos/iso/ y reemplazar `href` por la ruta local, o los enlaces se romperán.
 */

export type IsoDocument = { title: string; href: string };
export type IsoChannel = { title: string; text: string; links: { label: string; href: string; external?: boolean }[] };

export const isoIntro =
  "Desde el año 2016 hemos mantenido nuestra condición de Partner Platinum de HP Inc, la categoría más elevada que otorga HP a sus canales. Trabajamos bajo sistemas de gestión certificados: aquí encontrarás nuestras políticas y los canales para reportar consultas o incidencias.";

export const isoPortals: {
  id: string;
  code: string;
  name: string;
  commitment: string;
  documents: IsoDocument[];
  channel: IsoChannel;
}[] = [
  {
    id: "iso-27001",
    code: "ISO/IEC 27001",
    name: "Seguridad de la información",
    commitment: "Estamos comprometidos con proteger la información y mantener la confianza de quienes confían en nosotros.",
    documents: [
      {
        title: "Política corporativa de seguridad de la información",
        href: "https://misiontecnologica.com/wp-content/uploads/2025/11/Politica-Corporativa-Seguridad-de-Informacion-Firmado-1.pdf",
      },
    ],
    channel: {
      title: "Canal de reporte sobre protección de la información",
      text: "Reporta cualquier incidente o consulta relacionada con la seguridad de la información.",
      // En la web actual el botón apunta a canaldeintegridad@ pero se muestra segurinfo@. CONFIRMAR cuál corresponde.
      links: [{ label: "segurinfo@misiontecnologica.com", href: "mailto:segurinfo@misiontecnologica.com" }],
    },
  },
  {
    id: "iso-37001",
    code: "ISO 37001",
    name: "Gestión antisoborno",
    commitment: "Estamos comprometidos con la integridad y la transparencia en todas nuestras operaciones.",
    documents: [
      {
        title: "Código de Ética y Conducta",
        href: "https://misiontecnologica.com/wp-content/uploads/2025/11/Codigo-de-Etica-y-conducta-1.pdf",
      },
      {
        title: "Política Corporativa de Gestión Antisoborno",
        href: "https://misiontecnologica.com/wp-content/uploads/2026/05/1-Politica-Coporativa-sistema-de-gestion-antisoborno1-1.pdf",
      },
    ],
    channel: {
      title: "Canal de Integridad",
      text: "Reporta aquí consultas o incidencias. Puedes hacerlo por el formulario, por teléfono o por correo.",
      links: [
        {
          label: "Formulario del Canal de Integridad",
          href: "https://docs.google.com/forms/d/e/1FAIpQLSeNf-gu-CnC4ZIfqLLR4PU3sX4UDixftgMkPcM1u5xz7h6nAg/viewform",
          external: true,
        },
        { label: "(51) 987 570 919", href: "tel:+51987570919" },
        { label: "canaldeintegridad@misiontecnologica.com", href: "mailto:canaldeintegridad@misiontecnologica.com" },
      ],
    },
  },
];
