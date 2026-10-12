import type { Metadata } from "next";

import { Challenges } from "@/components/marketing/challenges";
import { ContactCta } from "@/components/marketing/contact-cta";
import { Hero } from "@/components/marketing/hero";
import { Innovation } from "@/components/marketing/innovation";
import { PrintingSpotlight } from "@/components/marketing/printing-spotlight";
import { PublicationsTeaser } from "@/components/marketing/publications-teaser";
import { Sectors } from "@/components/marketing/sectors";
import { SolutionsGrid } from "@/components/marketing/solutions-grid";

export const metadata: Metadata = {
  title: { absolute: "Misión Tecnológica | Outsourcing tecnológico e impresión empresarial" },
  alternates: { canonical: "/" },
};

/**
 * Página de inicio — sigue el storyline de 8 secciones:
 * contexto → propuesta → capacidad → confianza → futuro (asesoría).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Challenges />
      <SolutionsGrid />
      <PrintingSpotlight />
      <Sectors />
      <Innovation />
      <PublicationsTeaser />
      <ContactCta />
    </>
  );
}
