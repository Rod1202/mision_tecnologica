import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, FileSearch } from "lucide-react";

import { AddToQuoteButton } from "@/components/catalog/add-to-quote";
import { DemoNotice } from "@/components/catalog/demo-notice";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductPrice } from "@/components/catalog/product-price";
import { ProductVisual } from "@/components/catalog/product-visual";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { PendingBadge } from "@/components/ui/pending-badge";
import { getProduct, productHref, products } from "@/lib/content/products";
import { solutionHref } from "@/lib/content/solutions";
import { showUnverifiedContent } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = `${p.name} | Cotiza con Misión Tecnológica`;
  return {
    title: { absolute: title },
    description: `${p.summary} Solicita tu cotización por WhatsApp.`,
    alternates: { canonical: productHref(p.slug) },
    openGraph: { title, url: productHref(p.slug) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      <section className="bg-white pt-8 pb-16 sm:pb-20 lg:pb-24">
        <div className="container-mt">
          <Breadcrumbs tone="default" items={[{ label: "Tienda", href: "/tienda" }, { label: product.name }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <ProductVisual model={product.model} size="lg" className="rounded-[2rem]" />
            </div>

            <div className="lg:col-span-6">
              <div className="flex flex-wrap gap-2">
                <Badge>{product.category}</Badge>
                <Badge variant="teal">{product.family}</Badge>
                {showUnverifiedContent() && !product.verified ? <PendingBadge note={product.note} /> : null}
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
                <p className="text-sm font-semibold text-ink-soft">Precio</p>
                <ProductPrice product={product} size="lg" className="mt-1" />
                <p className="mt-2 text-sm text-ink-soft">El precio final se confirma en la cotización según cantidad, servicio y sede.</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <AddToQuoteButton slug={product.slug} name={product.name} size="lg" className="flex-1" />
                  <Link
                    href={solutionHref("impresion-empresarial")}
                    className="inline-flex h-13 items-center justify-center rounded-full px-6 font-semibold text-brand-blue hover:bg-white"
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
            {product.specs.length > 0 ? (
              <dl className="mt-6 divide-y divide-line overflow-hidden rounded-3xl border border-line">
                {product.specs.map((s) => (
                  <div key={s.label} className="grid gap-1 px-6 py-4 sm:grid-cols-3">
                    <dt className="font-semibold text-ink">{s.label}</dt>
                    <dd className="text-ink-soft sm:col-span-2">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="mt-6 flex items-start gap-4 rounded-3xl border border-dashed border-line bg-surface p-6">
                <FileSearch aria-hidden className="mt-0.5 size-6 shrink-0 text-brand-blue" />
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
              <Link href="/tienda" className="inline-flex items-center gap-2 font-semibold text-brand-blue hover:underline">
                Ver tienda
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
