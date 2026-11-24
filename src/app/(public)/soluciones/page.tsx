import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { Eyebrow, IsoStrokes } from "@/components/brand/pills";
import { CtaBand } from "@/components/layout/page-intro";
import { SolutionsShell } from "@/components/solutions/solutions-shell";
import { processSteps, solutionHref, solutions } from "@/lib/content/solutions";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Soluciones tecnológicas para empresas",
  description:
    "Outsourcing de impresión HP, arrendamiento y venta de cómputo, digitalización documental e infraestructura tecnológica para empresas en todo el Perú.",
  path: "/soluciones",
});

/** Soluciones: vista maestro-detalle. Sin una solución elegida, el detalle muestra el panorama general. */
export default function SolucionesPage() {
  return (
    <>
      <SolutionsShell breadcrumbs={[{ label: "Soluciones" }]}>
        <div className="space-y-14">
          <header className="relative isolate overflow-hidden rounded-[2rem] bg-brand-blue p-7 text-white sm:p-10 lg:p-12">
            <IsoStrokes className="top-[-30%] right-[-25%] -z-10 h-[160%] w-[70%] opacity-[0.09] lg:right-[-6%] lg:w-[40%]" />
            <Eyebrow tone="inverse">Soluciones</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-3xl leading-[1.1] font-extrabold sm:text-4xl lg:text-5xl">
              Un enfoque especializado para cada necesidad.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
              Convertimos las necesidades de tu operación en soluciones concretas, desde el servicio continuo hasta la puesta en marcha de
              nuevos equipos. Elige una solución para ver su detalle.
            </p>
          </header>

          <ul className="grid gap-5 md:grid-cols-2">
            {solutions.map((s) => (
              <li key={s.slug}>
                <Link
                  href={solutionHref(s.slug)}
                  className={cn(
                    "group flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-soft transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-lift",
                  )}
                >
                  <span aria-hidden className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <h2 className="mt-6 text-2xl font-bold text-ink group-hover:text-brand-blue">{s.title}</h2>
                  <p className="mt-2 leading-relaxed text-ink-soft">{s.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-brand-blue">
                    Ver el detalle
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <section aria-labelledby="proceso-title" className="rounded-[2rem] bg-surface p-7 sm:p-10">
            <Eyebrow>Cómo trabajamos</Eyebrow>
            <h2 id="proceso-title" className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
              Un proceso claro, de principio a fin.
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {processSteps.map((step, i) => (
                <li key={step.title} className="rounded-3xl bg-white p-6 ring-1 ring-line ring-inset">
                  <span className="inline-flex h-9 w-12 items-center justify-center rounded-full bg-brand-gradient font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-bold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.description}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </SolutionsShell>

      <CtaBand className="pb-16 sm:pb-20 lg:pb-28" secondary={{ label: "Cotizar proyecto", href: "/cotizador" }} />
    </>
  );
}
