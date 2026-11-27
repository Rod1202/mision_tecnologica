import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { SectorTabs } from "@/components/sectors/sector-tabs";
import { sectors } from "@/lib/content/sectors";
import { showUnverifiedContent } from "@/lib/site";

/**
 * 05 · Prueba social B2B: sectores en pestañas, con los clientes de cada uno.
 * Los clientes solo se listan si están autorizados (`verified`), salvo en desarrollo/pruebas.
 */
export function Sectors() {
  const preview = showUnverifiedContent();
  const visible = sectors.map((s) => ({ ...s, clients: s.clients.filter((c) => c.verified || preview) }));

  return (
    <section id="sectores" aria-labelledby="sectores-title" className="section-y bg-white">
      <div className="container-mt">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="sectores-title"
            eyebrow="Experiencia por sector"
            title="Contamos con experiencia en diferentes rubros."
            highlight="en diferentes rubros."
            description="Cada sector opera distinto: adaptamos el servicio a la forma de trabajar de cada organización."
          />
          <Link href="/sectores" className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-bright hover:underline">
            Ver todos los sectores
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <p className="mt-10 text-sm font-bold tracking-[0.06em] text-brand-bright uppercase">Elige un sector</p>
        <SectorTabs sectors={visible} syncHash={false} className="mt-3" />
      </div>
    </section>
  );
}
