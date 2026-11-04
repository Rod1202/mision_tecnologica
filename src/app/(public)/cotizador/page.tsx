import { PageIntro } from "@/components/layout/page-intro";
import { QuoteProvider } from "@/components/quote/quote-provider";
import { QuoteWorkspace } from "@/components/quote/quote-workspace";
import { ServicePicker } from "@/components/quote/service-picker";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cotizador de proyecto: cómputo, impresión y digitalización",
  description:
    "Arma tu proyecto de cómputo, impresión o digitalización, ajusta equipos, volúmenes y sedes, y obtén una estimación en vivo. Envíala a un asesor de Misión Tecnológica por formulario o WhatsApp.",
  path: "/cotizador",
});

/**
 * Cotizador de proyecto. El selector de servicios vive en la cabecera y comparte estado con el
 * área de configuración a través de `QuoteProvider`. Preselección: /cotizador?servicio=impresion
 */
export default function CotizadorPage() {
  return (
    <QuoteProvider>
      <PageIntro
        breadcrumbs={[{ label: "Cotizador" }]}
        eyebrow="Cotizador de proyecto"
        title="Cotiza tu proyecto."
        description="Elige los servicios, ajusta equipos, volúmenes y sedes, y mira cómo cambia la estimación. Cuando esté listo, lo envías a un asesor."
      >
        <ServicePicker />
      </PageIntro>
      <QuoteWorkspace />
    </QuoteProvider>
  );
}
