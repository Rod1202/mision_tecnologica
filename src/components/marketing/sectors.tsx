import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { SectionHeading } from "@/components/marketing/section-heading";
import { PendingBadge } from "@/components/ui/pending-badge";
import { sectors } from "@/lib/content/sectors";
import { showUnverifiedContent } from "@/lib/site";
import { cn } from "@/lib/utils";

/** 05 · Confianza: experiencia por sectores. Los clientes solo se listan si están autorizados. */
export function Sectors() {
  const preview = showUnverifiedContent();
  const visible = sectors.map((s) => ({ ...s, clients: s.clients.filter((c) => c.verified || preview) }));
  const hasPending = visible.some((s) => s.clients.some((c) => !c.verified));

  return (
    <section aria-labelledby="sectores-title" className="section-y bg-surface">
      <div className="container-mt">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="sectores-title"
            eyebrow="Experiencia"
            title="Soluciones para diferentes realidades empresariales."
            description="Cada sector opera distinto. Adaptamos el servicio a la forma de trabajar de cada organización."
          />
          <Link
            href="/sectores"
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-blue hover:underline"
          >
            Ver todos los sectores
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        {hasPending ? (
          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-amber-500/60 bg-amber-50/70 px-5 py-3 text-sm text-amber-900">
            <PendingBadge />
            Referencias de clientes pendientes de autorización. Solo se muestran en desarrollo y pruebas.
          </div>
        ) : null}

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {visible.map((sector, index) => (
            <li
              key={sector.slug}
              className={cn(
                "flex flex-col rounded-3xl border border-line bg-white p-7 shadow-soft",
                // 2 tarjetas anchas arriba, 3 abajo en escritorio
                index < 2 ? "lg:col-span-3" : "lg:col-span-2",
                index === visible.length - 1 && visible.length % 2 === 1 && "md:col-span-2 lg:col-span-2",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-16 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
                  <Icon name={sector.icon} className="size-6" />
                </span>
                <h3 className="text-xl font-bold text-ink">{sector.title}</h3>
              </div>
              <p className="mt-4 leading-relaxed text-ink-soft">{sector.summary}</p>

              {sector.clients.length > 0 ? (
                <ul aria-label={`Clientes de ${sector.title}`} className="mt-6 flex flex-wrap gap-2">
                  {sector.clients.map((client) => (
                    <li
                      key={client.name}
                      title={client.verified ? undefined : client.note}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-sm font-semibold",
                        client.verified
                          ? "bg-surface text-ink"
                          : "border border-dashed border-amber-500/60 bg-amber-50/60 text-ink",
                      )}
                    >
                      {client.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
