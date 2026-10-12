import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { IsoStrokes } from "@/components/brand/pills";
import { CtaBand, PageIntro } from "@/components/layout/page-intro";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { solutionHref, solutions } from "@/lib/content/solutions";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Soluciones tecnológicas para empresas",
  description:
    "Outsourcing tecnológico, impresión empresarial con HP, implementación y despliegue, y soporte técnico para empresas en todo el Perú.",
  path: "/soluciones",
});

export default function SolucionesPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Soluciones" }]}
        eyebrow="Soluciones"
        title="Un enfoque especializado para cada necesidad."
        description="Convertimos las necesidades de tu operación en soluciones concretas, desde el servicio continuo hasta la puesta en marcha de nuevos equipos."
      />

      <section aria-label="Listado de soluciones" className="section-y bg-white">
        <div className="container-mt">
          <ul className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {solutions.map((s) => (
              <li key={s.slug}>
                <Link
                  href={solutionHref(s.slug)}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-[box-shadow,transform] hover:-translate-y-0.5 sm:p-10",
                    s.featured ? "bg-brand-blue text-white shadow-lift" : "border border-line bg-white shadow-soft hover:shadow-lift",
                  )}
                >
                  {s.featured ? <IsoStrokes className="top-[-30%] right-[-8%] h-[160%] w-[45%] opacity-[0.09]" /> : null}
                  <span
                    className={cn(
                      "relative inline-flex h-12 w-16 items-center justify-center rounded-full",
                      s.featured ? "bg-white/15 ring-1 ring-white/25 ring-inset" : "bg-brand-blue-50 text-brand-blue",
                    )}
                  >
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <h2 className={cn("relative mt-7 text-2xl font-bold sm:text-3xl", !s.featured && "text-ink")}>{s.title}</h2>
                  <p className={cn("relative mt-3 text-lg leading-relaxed", s.featured ? "text-white/85" : "text-ink-soft")}>
                    {s.summary}
                  </p>
                  <span
                    className={cn(
                      "relative mt-auto inline-flex items-center gap-2 pt-8 font-semibold",
                      s.featured ? "text-white" : "text-brand-blue",
                    )}
                  >
                    Conocer la solución
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProcessSteps />
      <CtaBand />
    </>
  );
}
