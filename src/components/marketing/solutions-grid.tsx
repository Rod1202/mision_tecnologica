import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { IsoStrokes } from "@/components/brand/pills";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { solutionHref, solutions, type Solution } from "@/lib/content/solutions";
import { cn } from "@/lib/utils";

/** 03 · La respuesta: líneas de servicio, con el outsourcing como prioridad comercial. */
export function SolutionsGrid() {
  const [featured, ...rest] = [...solutions].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <section aria-labelledby="soluciones-title" className="section-y bg-white">
      <div className="container-mt">
        <SectionHeading
          id="soluciones-title"
          eyebrow="Nuestras soluciones"
          title="Un enfoque especializado para cada necesidad."
          description="Convertimos las necesidades de tu operación en soluciones concretas, desde el servicio continuo hasta la puesta en marcha de nuevos equipos."
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <li className="md:col-span-2">
            <FeaturedCard solution={featured} />
          </li>
          {rest.map((solution) => (
            <li key={solution.slug}>
              <SolutionCard solution={solution} />
            </li>
          ))}
          <li>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-dashed border-brand-blue/35 bg-brand-blue-50/60 p-7 lg:p-8">
              <div>
                <h3 className="text-xl font-bold text-ink">¿No sabes por dónde empezar?</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  Cuéntanos cómo opera tu empresa y te ayudamos a identificar qué solución conviene primero.
                </p>
              </div>
              <Button asChild className="mt-8 self-start">
                <Link href="/#contacto">
                  Solicitar asesoría
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function FeaturedCard({ solution }: { solution: Solution }) {
  return (
    <Link
      href={solutionHref(solution.slug)}
      className="group relative flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-3xl bg-brand-blue p-7 text-white shadow-lift transition-transform hover:-translate-y-0.5 focus-visible:outline-offset-4 lg:p-10"
    >
      <IsoStrokes className="top-[-30%] right-[-6%] h-[160%] w-[42%] opacity-[0.09]" />
      <div className="relative">
        <span className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 ring-inset">
          <Icon name={solution.icon} className="size-6" />
        </span>
        <p className="mt-6 text-sm font-bold tracking-[0.08em] text-white/70 uppercase">Línea principal</p>
        <h3 className="mt-2 text-3xl font-bold sm:text-4xl">{solution.title}</h3>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/85">{solution.summary}</p>
      </div>
      <span className="relative mt-8 inline-flex items-center gap-2 font-semibold">
        Conocer el servicio
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function SolutionCard({ solution }: { solution: Solution }) {
  const isPrinting = solution.slug === "impresion-empresarial";
  return (
    <Link
      href={solutionHref(solution.slug)}
      className={cn(
        "group relative flex h-full flex-col rounded-3xl border bg-white p-7 shadow-soft transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-lift lg:p-8",
        isPrinting ? "border-brand-teal/50" : "border-line",
      )}
    >
      {isPrinting ? <span aria-hidden className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-brand-gradient" /> : null}
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "inline-flex h-12 w-16 items-center justify-center rounded-full",
            isPrinting ? "bg-brand-teal-50 text-brand-teal-700" : "bg-brand-blue-50 text-brand-blue",
          )}
        >
          <Icon name={solution.icon} className="size-6" />
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-5 text-ink-faint transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-blue"
        />
      </div>
      <h3 className="mt-7 text-xl font-bold text-ink">{solution.title}</h3>
      <p className="mt-3 leading-relaxed text-ink-soft">{solution.summary}</p>
      <span className="mt-auto pt-6 text-sm font-semibold text-brand-blue">Conocer más</span>
    </Link>
  );
}
