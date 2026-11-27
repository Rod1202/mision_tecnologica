import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { Eyebrow, IsoStrokes } from "@/components/brand/pills";
import { CtaBand } from "@/components/layout/page-intro";
import { SolutionsShell } from "@/components/solutions/solutions-shell";
import { JsonLd } from "@/components/seo/json-ld";
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

  const url = new URL(solutionHref(solution.slug), siteConfig.url).toString();
  const quoteService = solution.quoteService;

  return (
    <>
      <SolutionsShell activeSlug={solution.slug} breadcrumbs={[{ label: "Soluciones" }, { label: solution.title }]}>
        <article aria-labelledby="solucion-title" className="space-y-14">
          {/* Cabecera del detalle */}
          <header className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-white p-7 text-ink shadow-soft sm:p-10 lg:p-12">
            <IsoStrokes tone="blue" className="top-[-30%] right-[-25%] -z-10 h-[160%] w-[70%] opacity-[0.05] lg:right-[-6%] lg:w-[40%]" />
            <span aria-hidden className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-blue text-white">
              <Icon name={solution.icon} className="size-6" />
            </span>
            <Eyebrow className="mt-6">
              {solution.title}
            </Eyebrow>
            <h1 id="solucion-title" className="mt-4 max-w-3xl text-3xl leading-[1.1] font-extrabold sm:text-4xl lg:text-5xl">
              {solution.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{solution.hero.intro}</p>
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
            <div className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
              {solution.faqs.map((f) => (
                <details key={f.question} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-ink">
                    {f.question}
                    <ChevronDown aria-hidden className="size-5 shrink-0 text-brand-bright transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-soft">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

        </article>
      </SolutionsShell>

      <CtaBand
        title={`¿Te interesa ${solution.title.toLowerCase()}?`}
        text="Cotiza tu proyecto o pide que un asesor te recomiende la mejor opción para tu empresa."
        primary={{ label: "Cotizar proyecto", href: quoteService ? `/cotizador?servicio=${quoteService}` : "/cotizador" }}
        secondary={{ label: "Solicitar asesoría", href: "/asesoria" }}
      />

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
