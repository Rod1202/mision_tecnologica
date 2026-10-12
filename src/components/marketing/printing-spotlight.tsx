import Link from "next/link";
import { ArrowRight, Check, Printer } from "lucide-react";

import { Dash, IsoStrokes } from "@/components/brand/pills";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { PendingBadge } from "@/components/ui/pending-badge";
import { printingCapabilities } from "@/lib/content/home";
import { productHref, products } from "@/lib/content/products";
import { solutionHref } from "@/lib/content/solutions";
import { showUnverifiedContent } from "@/lib/site";

/** 04 · Especialización: impresión empresarial, conectada con el catálogo. */
export function PrintingSpotlight() {
  const models = products;
  const preview = showUnverifiedContent();

  return (
    <section aria-labelledby="impresion-title" className="section-y overflow-hidden bg-white">
      <div className="container-mt grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Composición gráfica en píldora vertical (se reemplazará por fotografía de producto cuando exista) */}
        <div aria-hidden className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:col-span-5 lg:max-w-md">
          <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-full bg-brand-gradient opacity-90" />
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-full bg-brand-blue">
            <IsoStrokes className="inset-y-[-10%] left-[18%] w-[70%] opacity-[0.12]" />
            <span className="relative inline-flex size-28 items-center justify-center rounded-full bg-white text-brand-blue shadow-[0_24px_48px_-20px_rgb(1_26_71/0.7)] sm:size-32">
              <Printer className="size-12 sm:size-14" strokeWidth={1.6} />
            </span>
          </div>
          <Dash className="top-8 -left-3 bg-brand-teal" />
          <Dash className="bottom-16 -left-6 w-10 bg-brand-blue" />
        </div>

        <div className="lg:col-span-7">
          <SectionHeading
            id="impresion-title"
            eyebrow="Especialización"
            title="Más que equipos: soluciones de impresión para empresas."
            description="Como partner de HP, acompañamos a cada organización desde la elección del equipo hasta su operación diaria, con HP como marca principal en impresión láser empresarial."
          />

          <ul className="mt-9 grid gap-4 sm:grid-cols-2">
            {printingCapabilities.map((item) => (
              <li key={item} className="flex gap-3 rounded-2xl bg-surface p-4">
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                  <Check aria-hidden className="size-3.5" strokeWidth={3} />
                </span>
                <span className="leading-relaxed text-ink">{item}</span>
              </li>
            ))}
          </ul>

          {models.length > 0 ? (
            <div className="mt-9">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">Equipos HP destacados</h3>
                {preview && models.some((m) => !m.verified) ? (
                  <PendingBadge note="Verificar nomenclatura y fichas oficiales de HP." />
                ) : null}
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {models.map((model) => (
                  <li key={model.slug}>
                    <Link
                      href={productHref(model.slug)}
                      className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-blue hover:text-brand-blue"
                    >
                      {model.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/tienda">
                Explorar equipos de impresión
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={solutionHref("impresion-empresarial")}>Conocer la solución</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
