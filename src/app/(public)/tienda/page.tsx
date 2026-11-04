import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Columns3 } from "lucide-react";

import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { DemoNotice } from "@/components/catalog/demo-notice";
import { ProductCard } from "@/components/catalog/product-card";
import { CtaBand, PageIntro } from "@/components/layout/page-intro";
import { products } from "@/lib/content/products";
import { showUnverifiedContent } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tienda: impresoras HP LaserJet Enterprise",
  description:
    "Catálogo de multifuncionales HP LaserJet Enterprise. Filtra por categoría, marca y precio, agrega los equipos a tu cotización y recibe atención de un asesor por WhatsApp.",
  path: "/tienda",
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
      {products.map((p) => (
        <li key={p.slug}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

export default function TiendaPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Tienda" }]}
        eyebrow="Tienda"
        title="Equipos de impresión HP para empresas."
        description="Elige los equipos, agrégalos a tu cotización y envíala por WhatsApp. Un asesor te responderá con la propuesta."
      />

      <section aria-labelledby="catalogo-title" className="section-y bg-surface">
        <div className="container-mt">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="catalogo-title" className="text-2xl font-bold text-ink sm:text-3xl">
                Catálogo
              </h2>
              <p className="mt-2 text-ink-soft">Filtra por categoría, marca y precio, y ordena los resultados.</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button asChild variant="outline">
                  <Link href="/tienda/comparar">
                    <Columns3 aria-hidden />
                    Comparar equipos
                  </Link>
                </Button>
                {showGenerationLink() ? (
                  <Link href="/tienda/comparar#upgrade" className="inline-flex items-center gap-2 font-semibold text-brand-blue hover:underline">
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
              <CatalogBrowser products={products} />
            </Suspense>
          </div>
        </div>
      </section>

      <CtaBand
        title="¿Necesitas una solución completa de impresión?"
        text="Además de los equipos, nos encargamos de la implementación, los consumibles y el soporte."
        primary={{ label: "Solicitar asesoría", href: "/contacto" }}
        secondary={{ label: "Ver impresión empresarial", href: "/soluciones/impresion-empresarial" }}
      />
    </>
  );
}
