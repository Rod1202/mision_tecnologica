import { PageIntro } from "@/components/layout/page-intro";
import { QuoteFlow } from "@/components/quote/quote-flow";
import { QuoteProvider } from "@/components/quote/quote-provider";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cotiza tu proyecto: cómputo, impresión, digitalización y audio y video",
  description:
    "Arma tu proyecto de cómputo, impresión, digitalización o audio y video: equipos, volúmenes, sedes y plazos. Un asesor de Misión Tecnológica te envía la propuesta.",
  path: "/cotizador",
});

/**
 * "Encuentra tu solución" · perfil "Sé lo que necesito": recorrido en 3 pasos (servicios → dimensionamiento
 * → datos) con el resumen al costado. Preselección: /cotizador?servicio=impresion
 */
export default function CotizadorPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Encuentra tu solución", href: "/#encuentra-tu-solucion" }, { label: "Cotizar proyecto" }]}
        eyebrow="Sé lo que necesito"
        title="Cotiza tu proyecto."
        description="Elige los servicios, indica cantidades, volúmenes, sedes y plazos, y envíalo a un asesor. Te respondemos con la propuesta."
      />
      <section aria-label="Cotizador" className="section-y bg-surface">
        <div className="container-mt">
          <QuoteProvider>
            <QuoteFlow />
          </QuoteProvider>
        </div>
      </section>
    </>
  );
}
