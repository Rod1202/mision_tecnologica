import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, FileSearch } from "lucide-react";

import { AddToQuoteButton } from "@/components/catalog/add-to-quote";
import { DemoNotice } from "@/components/catalog/demo-notice";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductVisual } from "@/components/catalog/product-visual";
import { CompareToggle, CompareWithLink } from "@/components/compare/compare-toggle";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { isComparableKind, specRows } from "@/lib/content/compare";
import { getProduct, predecessorsOf, printColorOf, productHref, upgradesFor, visibleProducts } from "@/lib/content/products";
import { showUnverifiedContent } from "@/lib/site";
import { solutionHref } from "@/lib/content/solutions";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return visibleProducts(showUnverifiedContent()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = `${p.name} | Catálogo Misión Tecnológica`;
  return {
    title: { absolute: title },
    description: `${p.summary} Solicita tu cotización a un asesor de Misión Tecnológica.`,
    alternates: { canonical: productHref(p.slug) },
    openGraph: { title, url: productHref(p.slug) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const others = visibleProducts(showUnverifiedContent()).filter((p) => p.slug !== product.slug && p.kind === product.kind);
  // Ficha: datos ya validados, o los de la hoja de datos pública mientras se validan (solo donde se permite contenido no validado).
  const showSpecs = product.verified || showUnverifiedContent();
  const specs = [
    ...product.specs,
    ...(showSpecs
      ? specRows[product.kind].flatMap((r) => (product.specValues?.[r.key] ? [{ label: r.label, value: product.specValues[r.key]! }] : []))
      : []),
  ];

  return (
    <>
      <section className="bg-white pt-8 pb-16 sm:pb-20 lg:pb-24">
        <div className="container-mt">
          <Breadcrumbs tone="default" items={[{ label: "Catálogo", href: "/catalogo" }, { label: product.name }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <ProductVisual model={product.model} kind={product.kind} size="lg" className="rounded-[2rem]" />
            </div>

            <div className="lg:col-span-6">
              <div className="flex flex-wrap gap-2">
                <Badge>{product.category}</Badge>
                <Badge variant="teal">{product.family}</Badge>
              </div>
              <h1 className="mt-5 text-3xl leading-tight font-extrabold text-ink sm:text-4xl lg:text-5xl">{product.name}</h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{product.summary}</p>

              <ul className="mt-7 space-y-3">
                {product.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                      <Check aria-hidden className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="leading-relaxed text-ink">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-3xl bg-surface p-6">
                <p className="font-bold text-ink">Precio a cotizar</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Te enviamos la propuesta según cantidad, modalidad (venta, alquiler o servicio) y sedes.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <AddToQuoteButton slug={product.slug} name={product.name} size="lg" className="flex-1" />
                  {isComparableKind(product.kind) ? <CompareToggle slug={product.slug} name={product.name} className="h-13 px-5" /> : null}
                  <Link
                    href={solutionHref("outsourcing-de-impresion")}
                    className="inline-flex h-13 items-center justify-center rounded-full px-6 font-semibold text-brand-bright hover:bg-white"
                  >
                    Servicio de impresión
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <DemoNotice />
              </div>
            </div>
          </div>

          {/* Ficha técnica */}
          <section aria-labelledby="ficha-title" className="mt-16 lg:mt-20">
            <h2 id="ficha-title" className="text-2xl font-bold text-ink sm:text-3xl">
              Ficha técnica
            </h2>
            {specs.length > 0 ? (
              <>
                {!product.verified ? (
                  <p className="mt-4 inline-flex rounded-full border border-dashed border-amber-500/70 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                    Datos de la hoja de datos pública del fabricante, por validar
                  </p>
                ) : null}
                <dl className="mt-6 divide-y divide-line overflow-hidden rounded-3xl border border-line">
                  {specs.map((s) => (
                    <div key={s.label} className="grid gap-1 px-6 py-4 sm:grid-cols-3">
                      <dt className="font-semibold text-ink">{s.label}</dt>
                      <dd className="text-ink-soft sm:col-span-2">{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  <CompareWithLink slug={product.slug} className="inline-flex items-center gap-2 font-semibold text-brand-bright hover:underline">
                    Comparar con otros equipos
                    <ArrowRight aria-hidden className="size-4" />
                  </CompareWithLink>
                  {upgradesFor(product.slug).length || printColorOf(product.slug) === "color" ? (
                    <Link
                      href={`/catalogo/comparar?actual=${product.slug}#upgrade`}
                      className="inline-flex items-center gap-2 font-semibold text-brand-bright hover:underline"
                    >
                      ¿Ya tienes este equipo? Mira sus opciones de upgrade
                      <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  ) : null}
                  {predecessorsOf(product.slug)
                    .filter((old) => old.verified || showUnverifiedContent())
                    .map((old) => (
                    <Link
                      key={old.slug}
                      href={`/catalogo/comparar?modelos=${old.slug},${product.slug}`}
                      className="inline-flex items-center gap-2 font-semibold text-brand-bright hover:underline"
                    >
                      Salto de generación desde el {old.model}
                      <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-6 flex items-start gap-4 rounded-3xl border border-dashed border-line bg-surface p-6">
                <FileSearch aria-hidden className="mt-0.5 size-6 shrink-0 text-brand-bright" />
                <p className="leading-relaxed text-ink-soft">
                  Estamos validando la ficha técnica oficial de HP para este modelo. Solicita tu cotización y un asesor te enviará las
                  especificaciones completas.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>

      {others.length > 0 ? (
        <section aria-labelledby="otros-title" className="section-y bg-surface">
          <div className="container-mt">
            <div className="flex items-end justify-between gap-4">
              <h2 id="otros-title" className="text-2xl font-bold text-ink sm:text-3xl">
                Otros equipos
              </h2>
              <Link href="/catalogo" className="inline-flex items-center gap-2 font-semibold text-brand-bright hover:underline">
                Ver catálogo
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
