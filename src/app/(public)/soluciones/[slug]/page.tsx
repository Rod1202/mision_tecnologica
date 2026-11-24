import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator, Check, ChevronDown } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { Eyebrow, IsoStrokes } from "@/components/brand/pills";
import { ProductVisual } from "@/components/catalog/product-visual";
import { CtaBand } from "@/components/layout/page-intro";
import { SolutionsShell } from "@/components/solutions/solutions-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { productHref, products } from "@/lib/content/products";
import { getSector } from "@/lib/content/sectors";
import { getSolution, processSteps, solutionHref, solutions } from "@/lib/content/solutions";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  const path = solutionHref(s.slug);
  return {
    title: s.seo.title,
    description: s.seo.description,
    alternates: { canonical: path },
    openGraph: { title: s.seo.title, description: s.seo.description, url: path, type: "website" },
  };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const isPrinting = solution.slug === "outsourcing-de-impresion";
  const related = solution.relatedSectors.map(getSector).filter((s) => s !== undefined);
  const url = new URL(solutionHref(solution.slug), siteConfig.url).toString();
  const quoteService = solution.quoteService;

  return (
    <>
      <SolutionsShell activeSlug={solution.slug} breadcrumbs={[{ label: "Soluciones", href: "/soluciones" }, { label: solution.title }]}>
        <article aria-labelledby="solucion-title" className="space-y-14">
          {/* Cabecera del detalle */}
          <header className="relative isolate overflow-hidden rounded-[2rem] bg-brand-blue p-7 text-white sm:p-10 lg:p-12">
            <IsoStrokes className="top-[-30%] right-[-25%] -z-10 h-[160%] w-[70%] opacity-[0.09] lg:right-[-6%] lg:w-[40%]" />
            <span aria-hidden className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 ring-inset">
              <Icon name={solution.icon} className="size-6" />
            </span>
            <Eyebrow tone="inverse" className="mt-6">
              {solution.title}
            </Eyebrow>
            <h1 id="solucion-title" className="mt-4 max-w-3xl text-3xl leading-[1.1] font-extrabold sm:text-4xl lg:text-5xl">
              {solution.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">{solution.hero.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="inverse" size="lg">
                <Link href={quoteService ? `/cotizador?servicio=${quoteService}` : "/cotizador"}>
                  <Calculator aria-hidden />
                  Cotizar proyecto
                </Link>
              </Button>
              <Button asChild variant="outline-inverse" size="lg">
                <Link href="/asesoria">Solicitar asesoría</Link>
              </Button>
            </div>
          </header>

          {/* Qué incluye */}
          <section aria-labelledby="incluye-title">
            <Eyebrow>Qué incluye</Eyebrow>
            <h2 id="incluye-title" className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
              Alcance del servicio
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {solution.features.map((f) => (
                <li key={f.title} className="flex gap-4 rounded-3xl border border-line bg-white p-6 shadow-soft">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                    <Check aria-hidden className="size-4" strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">{f.title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-soft">{f.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Beneficios */}
          <section aria-labelledby="beneficios-title" className="rounded-[2rem] bg-surface p-7 sm:p-10">
            <Eyebrow>Lo que gana tu empresa</Eyebrow>
            <h2 id="beneficios-title" className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
              Una operación más ordenada y predecible.
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {solution.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-line ring-inset">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed text-ink">{b}</span>
                </li>
              ))}
            </ul>
          </section>

          {isPrinting ? (
            <section aria-labelledby="equipos-title">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Eyebrow>Partner Platinum de HP</Eyebrow>
                  <h2 id="equipos-title" className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
                    Equipos HP LaserJet Enterprise
                  </h2>
                </div>
                <Link href="/catalogo" className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-blue hover:underline">
                  Ver el catálogo
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products
                  .filter((p) => p.generation === "lanzamiento")
                  .map((p) => (
                    <li key={p.slug}>
                      <Link href={productHref(p.slug)} className="group block rounded-3xl border border-line bg-white p-4 shadow-soft transition-shadow hover:shadow-lift">
                        <ProductVisual model={p.model} kind={p.kind} />
                        <p className="mt-4 px-2 text-sm font-semibold text-ink-soft">{p.family}</p>
                        <h3 className="mt-1 px-2 pb-2 font-bold text-ink group-hover:text-brand-blue">{p.name}</h3>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ) : null}

          {/* Proceso claro */}
          <section aria-labelledby="proceso-title">
            <Eyebrow>Cómo trabajamos</Eyebrow>
            <h2 id="proceso-title" className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
              Un proceso claro, de principio a fin.
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {processSteps.map((step, i) => (
                <li key={step.title} className="rounded-3xl border border-line bg-white p-6 shadow-soft">
                  <span className="inline-flex h-9 w-12 items-center justify-center rounded-full bg-brand-gradient font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-bold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.description}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Preguntas frecuentes */}
          <section aria-labelledby="faq-title">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 id="faq-title" className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
              Sobre {solution.title.toLowerCase()}
            </h2>
            <div className="mt-6 divide-y divide-line rounded-3xl border border-line">
              {solution.faqs.map((f) => (
                <details key={f.question} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-ink">
                    {f.question}
                    <ChevronDown aria-hidden className="size-5 shrink-0 text-brand-blue transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-soft">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {related.length ? (
            <section aria-labelledby="sectores-title">
              <h2 id="sectores-title" className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">
                Sectores donde aplica
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {related.map((sec) => (
                  <li key={sec.slug}>
                    <Link
                      href={`/sectores#${sec.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-semibold text-ink transition-colors hover:border-brand-blue hover:text-brand-blue"
                    >
                      <Icon name={sec.icon} className="size-4" />
                      {sec.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </SolutionsShell>

      <CtaBand className="pb-16 sm:pb-20 lg:pb-28" secondary={{ label: "Cotizar proyecto", href: quoteService ? `/cotizador?servicio=${quoteService}` : "/cotizador" }} />

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: solution.title,
            description: solution.seo.description,
            url,
            serviceType: solution.title,
            areaServed: { "@type": "Country", name: "Perú" },
            provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: solution.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]}
      />
    </>
  );
}
