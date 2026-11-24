import type { Metadata } from "next";

import { ContactCta } from "@/components/marketing/contact-cta";
import { Hero } from "@/components/marketing/hero";
import { PartnersStrip } from "@/components/marketing/partners-strip";
import { PublicationsTeaser } from "@/components/marketing/publications-teaser";
import { Sectors } from "@/components/marketing/sectors";
import { ServiceLayers } from "@/components/marketing/service-layers";
import { SolutionFinder } from "@/components/marketing/solution-finder";
import { SolutionsGrid } from "@/components/marketing/solutions-grid";

export const metadata: Metadata = {
  title: { absolute: "Misión Tecnológica | Soluciones TI, cómputo e impresión" },
  alternates: { canonical: "/" },
};

/**
 * Inicio — landing de conversión (documento "Arquitectura UX/UI"):
 * hero → soluciones → encuentra tu solución → capas de servicio y sustentabilidad → sectores → LinkedIn → contacto.
 * Fondos alternados (azul · blanco · gris): nunca dos secciones seguidas del mismo color.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersStrip />
      <SolutionsGrid />
      <SolutionFinder />
      <ServiceLayers />
      <Sectors />
      <PublicationsTeaser />
      <ContactCta />
    </>
  );
}
