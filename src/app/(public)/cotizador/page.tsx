import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageIntro } from "@/components/layout/page-intro";
import { QuoteProvider } from "@/components/quote/quote-provider";
import { QuoteWorkspace } from "@/components/quote/quote-workspace";
import { ServicePicker } from "@/components/quote/service-picker";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cotiza tu proyecto: cómputo, impresión, digitalización y audio y video",
  description:
    "Arma tu proyecto de cómputo, impresión, digitalización o audio y video: equipos, volúmenes, sedes y plazos. Un asesor de Misión Tecnológica te envía la propuesta.",
  path: "/cotizador",
});

/**
 * "Encuentra tu solución" · perfil "Sé lo que necesito". El selector de servicios vive en la cabecera
 * y comparte estado con el área de configuración a través de `QuoteProvider`.
 * Preselección: /cotizador?servicio=impresion
 */
export default function CotizadorPage() {
  return (
    <QuoteProvider>
      <PageIntro
        breadcrumbs={[{ label: "Encuentra tu solución", href: "/#encuentra-tu-solucion" }, { label: "Cotizar proyecto" }]}
        eyebrow="Sé lo que necesito"
        title="Cotiza tu proyecto."
        description="Elige los servicios, indica cantidades, volúmenes, sedes y plazos, y envíalo a un asesor. Te respondemos con la propuesta."
      >
        <Link href="/asesoria" className="mt-6 inline-flex items-center gap-2 font-semibold text-white underline-offset-4 hover:underline">
          ¿Prefieres que te asesoremos? Agenda una reunión
          <ArrowRight aria-hidden className="size-4" />
        </Link>
        <ServicePicker />
      </PageIntro>
      <QuoteWorkspace />
    </QuoteProvider>
  );
}
