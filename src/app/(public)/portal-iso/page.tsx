import { ArrowUpRight, FileText, Mail, Phone, ShieldCheck } from "lucide-react";

import { PageIntro } from "@/components/layout/page-intro";
import { isoIntro, isoPortals } from "@/lib/content/iso";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Portal ISO: seguridad de la información y gestión antisoborno",
  description:
    "Políticas de Misión Tecnológica bajo ISO/IEC 27001 e ISO 37001: seguridad de la información, Código de Ética y Conducta, política antisoborno y Canal de Integridad.",
  path: "/portal-iso",
});

const linkIcon = (href: string) => (href.startsWith("mailto:") ? Mail : href.startsWith("tel:") ? Phone : ArrowUpRight);

/** Portal ISO: misma estructura que la web actual (cumplimiento normativo y auditorías). */
export default function PortalIsoPage() {
  return (
    <>
      <PageIntro breadcrumbs={[{ label: "Portal ISO" }]} eyebrow="Portal ISO" title="Cumplimiento y transparencia." description={isoIntro}>
        <ul className="mt-9 flex flex-wrap gap-3" aria-label="Portales">
          {isoPortals.map((p) => (
            <li key={p.id}>
              <a
                href={`#${p.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-semibold text-ink shadow-soft ring-1 ring-line ring-inset hover:text-brand-bright"
              >
                <ShieldCheck aria-hidden className="size-4 text-brand-bright" />
                Portal {p.code}
              </a>
            </li>
          ))}
        </ul>
      </PageIntro>

      {isoPortals.map((portal, i) => (
        <section
          key={portal.id}
          id={portal.id}
          aria-labelledby={`${portal.id}-title`}
          className={cn("section-y", i % 2 === 0 ? "bg-white" : "bg-surface")}
        >
          <div className="container-mt grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <span className="inline-flex size-20 flex-col items-center justify-center rounded-full bg-brand-gradient-deep text-white shadow-lift">
                <ShieldCheck aria-hidden className="size-8" />
              </span>
              <h2 id={`${portal.id}-title`} className="mt-6 text-3xl font-extrabold text-ink sm:text-4xl">
                Portal {portal.code}
              </h2>
              <p className="mt-1 text-lg font-semibold text-brand-bright">{portal.name}</p>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">{portal.commitment}</p>
            </div>

            <div className="space-y-6 lg:col-span-7">
              <ul className="space-y-3">
                {portal.documents.map((d) => (
                  <li key={d.href}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-3xl border border-line bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
                    >
                      <span aria-hidden className="inline-flex h-12 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-bright">
                        <FileText className="size-6" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-ink group-hover:text-brand-bright">{d.title}</span>
                        <span className="block text-sm text-ink-soft">PDF · se abre en una pestaña nueva</span>
                      </span>
                      <span className="hidden shrink-0 rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white sm:inline-flex">Descargar</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="rounded-3xl bg-brand-blue p-6 text-white sm:p-8">
                <h3 className="text-xl font-bold">{portal.channel.title}</h3>
                <p className="mt-2 text-white/90">{portal.channel.text}</p>
                <ul className="mt-5 flex flex-col gap-2">
                  {portal.channel.links.map((l) => {
                    const Ico = linkIcon(l.href);
                    return (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="inline-flex min-h-11 items-center gap-3 font-semibold break-all hover:underline"
                        >
                          <Ico aria-hidden className="size-5 shrink-0" />
                          {l.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
