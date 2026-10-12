import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronDown } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { ProductVisual } from "@/components/catalog/product-visual";
import { CtaBand, PageIntro } from "@/components/layout/page-intro";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { SectionHeading } from "@/components/marketing/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { productHref, products } from "@/lib/content/products";
import { getSector } from "@/lib/content/sectors";
import { getSolution, solutionHref, solutions } from "@/lib/content/solutions";
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

  const isPrinting = solution.slug === "impresion-empresarial";
  const others = solutions.filter((s) => s.slug !== solution.slug);
  const related = solution.relatedSectors.map(getSector).filter((s) => s !== undefined);
  const url = new URL(solutionHref(solution.slug), siteConfig.url).toString();

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Soluciones", href: "/soluciones" }, { label: solution.title }]}
        eyebrow={solution.title}
        title={solution.hero.title}
        description={solution.hero.intro}
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="inverse" size="lg">
            <Link href="/contacto">
              Solicitar asesoría
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          {isPrinting ? (
            <Button asChild variant="outline-inverse" size="lg">
              <Link href="/tienda">Ver equipos HP</Link>
            </Button>
          ) : null}
        </div>
      </PageIntro>

      {/* Qué incluye */}
      <section aria-labelledby="incluye-title" className="section-y bg-white">
        <div className="container-mt">
          <SectionHeading id="incluye-title" eyebrow="Qué incluye" title={`${solution.title}: alcance del servicio`} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {solution.features.map((f) => (
              <li key={f.title} className="flex flex-col rounded-3xl border border-line bg-white p-7 shadow-soft">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-gradient text-white">
                  <Check aria-hidden className="size-4" strokeWidth={3} />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Beneficios + equipos (impresión) */}
      <section aria-labelledby="beneficios-title" className="section-y bg-brand-blue text-white">
        <div className="container-mt grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="beneficios-title" tone="inverse" eyebrow="Lo que gana tu empresa" title="Una operación más ordenada y predecible." />
          </div>
          <ul className="grid gap-4 lg:col-span-7">
            {solution.benefits.map((b) => (
              <li key={b} className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 ring-inset">
                <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-brand-blue">
                  <Check aria-hidden className="size-4" strokeWidth={3} />
                </span>
                <span className="text-lg leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isPrinting ? (
        <section aria-labelledby="equipos-title" className="section-y bg-white">
          <div className="container-mt">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                id="equipos-title"
                eyebrow="Partner de HP"
                title="Equipos HP LaserJet Enterprise"
                description="Modelos de referencia disponibles con implementación y soporte. Solicita tu cotización desde la tienda."
              />
              <Link href="/tienda" className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-blue hover:underline">
                Ir a la tienda
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={productHref(p.slug)} className="group block rounded-3xl border border-line bg-white p-4 shadow-soft transition-shadow hover:shadow-lift">
                    <ProductVisual model={p.model} />
                    <p className="mt-5 px-2 text-sm font-semibold text-ink-soft">{p.family}</p>
                    <h3 className="mt-1 px-2 pb-2 text-lg font-bold text-ink group-hover:text-brand-blue">{p.name}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <ProcessSteps />

      {/* Sectores relacionados + preguntas frecuentes */}
      <section aria-labelledby="faq-title" className="section-y bg-white">
        <div className="container-mt grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">Sectores donde aplica</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
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
          </div>

          <div className="lg:col-span-8">
            <SectionHeading id="faq-title" eyebrow="Preguntas frecuentes" title={`Sobre ${solution.title.toLowerCase()}`} />
            <div className="mt-8 divide-y divide-line rounded-3xl border border-line">
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
          </div>
        </div>
      </section>

      {/* Otras soluciones (enlazado interno) */}
      <section aria-labelledby="otras-title" className="section-y bg-surface">
        <div className="container-mt">
          <SectionHeading id="otras-title" eyebrow="Otras soluciones" title="Complementa tu operación." />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={solutionHref(o.slug)}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <span className="inline-flex h-11 w-14 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
                    <Icon name={o.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-ink group-hover:text-brand-blue">{o.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{o.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />

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
