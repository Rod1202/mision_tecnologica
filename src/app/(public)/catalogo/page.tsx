import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Columns3 } from "lucide-react";

import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { DemoNotice } from "@/components/catalog/demo-notice";
import { ProductCard } from "@/components/catalog/product-card";
import { CtaBand, PageIntro } from "@/components/layout/page-intro";
import { products, visibleProducts } from "@/lib/content/products";
import { showUnverifiedContent } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Catálogo corporativo: impresión, cómputo y audio y video",
  description:
    "Portafolio de equipos para empresas: impresoras HP, ticketeras, plotters y escáneres; laptops, PC y workstations HP, ASUS y Lenovo; y audio y video para salas. Arma tu cotización con un asesor de Misión Tecnológica.",
  path: "/catalogo",
});

/** El salto de generación solo tiene sentido si las fichas del modelo anterior y su sucesor se pueden mostrar. */
function showGenerationLink() {
  const visible = (p: { verified: boolean }) => p.verified || showUnverifiedContent();
  return products.some((old) => {
    const next = products.find((p) => p.slug === old.successor);
    return old.generation === "anterior" && !!next && visible(old) && visible(next);
  });
}

/** Vista inicial sin filtros: se usa mientras carga el catálogo interactivo (y la ven los buscadores). */
function StaticGrid() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProducts(showUnverifiedContent()).map((p) => (
        <li key={p.slug}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

export default function CatalogoPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Catálogo" }]}
        eyebrow="Catálogo"
        title="Portafolio corporativo de equipos."
        description="Impresión y digitalización, cómputo HP, ASUS y Lenovo, y audio y video para tus salas. Elige los equipos, agrégalos a tu cotización y un asesor te enviará la propuesta."
      />

      <section aria-labelledby="catalogo-title" className="section-y bg-surface">
        <div className="container-mt">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="catalogo-title" className="text-2xl font-bold text-ink sm:text-3xl">
                Equipos por línea
              </h2>
              <p className="mt-2 text-ink-soft">Elige una línea, filtra por categoría y marca, y ordena los resultados.</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button asChild variant="outline">
                  <Link href="/catalogo/comparar">
                    <Columns3 aria-hidden />
                    Comparar equipos
                  </Link>
                </Button>
                {showGenerationLink() ? (
                  <Link href="/catalogo/comparar#upgrade" className="inline-flex items-center gap-2 font-semibold text-brand-bright hover:underline">
                    ¿Ya tienes un equipo? Mira tus opciones de upgrade
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="lg:max-w-xl">
              <DemoNotice />
            </div>
          </div>

          <div className="mt-10">
            <Suspense fallback={<StaticGrid />}>
              <CatalogBrowser products={visibleProducts(showUnverifiedContent())} />
            </Suspense>
          </div>
        </div>
      </section>

      <CtaBand
        title="¿Necesitas una solución completa de impresión?"
        text="Además de los equipos, nos encargamos de la implementación, los consumibles y el soporte."
        primary={{ label: "Solicitar asesoría", href: "/asesoria" }}
        secondary={{ label: "Ver outsourcing de impresión", href: "/soluciones/outsourcing-de-impresion" }}
      />
    </>
  );
}
