import { CtaBand, PageIntro } from "@/components/layout/page-intro";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SectorTabs } from "@/components/sectors/sector-tabs";
import { sectors } from "@/lib/content/sectors";
import { pageMetadata } from "@/lib/seo";
import { showUnverifiedContent } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Sectores que atendemos",
  description:
    "Experiencia en educación, sector financiero, logística, retail y otros sectores: soluciones tecnológicas e impresión empresarial adaptadas a cada operación.",
  path: "/sectores",
});

export default function SectoresPage() {
  // En producción solo se listan los clientes con autorización confirmada.
  const preview = showUnverifiedContent();
  const visible = sectors.map((s) => ({ ...s, clients: s.clients.filter((c) => c.verified || preview) }));

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Sectores" }]}
        eyebrow="Sectores"
        title="Soluciones para diferentes realidades empresariales."
        description="Cada sector opera distinto. Conoce cómo acompañamos a cada uno y las empresas que ya trabajan con nosotros."
      />

      <section aria-labelledby="sectores-tabs-title" className="section-y bg-white">
        <div className="container-mt">
          <SectionHeading
            id="sectores-tabs-title"
            eyebrow="Experiencia por sector"
            title="Elige un sector."
            description="Selecciona una pestaña para ver cómo ayudamos y qué empresas confían en nosotros."
          />
          <SectorTabs sectors={visible} />
        </div>
      </section>

      <CtaBand className="pb-16 sm:pb-20 lg:pb-28" title="¿Tu empresa es de otro sector?" text="Adaptamos nuestras soluciones a la forma de trabajar de cada organización." />
    </>
  );
}
