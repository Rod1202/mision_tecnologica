import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Dash } from "@/components/brand/pills";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { PendingBadge } from "@/components/ui/pending-badge";
import { featuredMilestone } from "@/lib/content/home";
import { showUnverifiedContent } from "@/lib/site";

/**
 * 06 · Innovación: despliegues y novedades.
 * El hito solo se publica cuando está validado; mientras tanto, la sección no se renderiza en producción.
 */
export function Innovation() {
  const milestone = featuredMilestone;
  if (!milestone.verified && !showUnverifiedContent()) return null;

  return (
    <section aria-labelledby="innovacion-title" className="section-y relative isolate overflow-hidden bg-brand-blue text-white">
      <div className="container-mt">
        <SectionHeading
          id="innovacion-title"
          tone="inverse"
          eyebrow="Innovación"
          title="Llevamos nuevas tecnologías a entornos reales."
          description="Las implementaciones muestran cómo las soluciones pasan del catálogo a la operación diaria de nuestros clientes."
        />

        <article className="mt-12 grid overflow-hidden rounded-[2rem] bg-white text-ink shadow-[0_40px_80px_-40px_rgb(1_26_71/0.7)] lg:grid-cols-12">
          {/* Composición gráfica con las formas del isotipo */}
          <div aria-hidden className="relative min-h-64 overflow-hidden bg-[linear-gradient(200deg,var(--color-brand-teal)_0%,var(--color-brand-blue)_65%)] lg:col-span-5 lg:min-h-full">
            {/* Píldoras a la derecha; el año arriba a la izquierda, sin superponerse */}
            <div className="absolute inset-y-[16%] right-[9%] flex w-[48%] items-stretch justify-end gap-[9%]">
              <span className="block w-[26%] rotate-[15deg] rounded-full bg-white/95" />
              <span className="block w-[26%] rotate-[15deg] rounded-full bg-white/70" />
              <span className="block w-[26%] rotate-[15deg] rounded-full bg-white/45" />
            </div>
            <span className="absolute top-7 left-7 text-6xl leading-none font-extrabold tracking-tight text-white sm:text-7xl">
              {milestone.year}
            </span>
            <Dash className="bottom-8 left-7 bg-white" />
          </div>

          <div className="flex flex-col p-7 sm:p-10 lg:col-span-7 lg:p-12">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">{milestone.category}</Badge>
              <Badge variant="teal">{milestone.year}</Badge>
              {!milestone.verified ? <PendingBadge note={milestone.note} /> : null}
            </div>
            <h3 className="mt-6 text-2xl leading-tight font-bold sm:text-3xl">{milestone.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{milestone.summary}</p>
            <Link
              href={milestone.href}
              className="mt-8 inline-flex items-center gap-2 self-start font-semibold text-brand-blue hover:underline lg:mt-auto lg:pt-8"
            >
              Conocer impresión empresarial
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
