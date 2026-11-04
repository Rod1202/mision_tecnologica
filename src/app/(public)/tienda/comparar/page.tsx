import { CompareView } from "@/components/compare/compare-view";
import { PageIntro } from "@/components/layout/page-intro";
import { products } from "@/lib/content/products";
import { pageMetadata } from "@/lib/seo";
import { showUnverifiedContent } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Comparar impresoras y laptops",
  description:
    "Compara lado a lado los equipos de la tienda de Misión Tecnológica: velocidad, capacidad, escaneo, conectividad y precio referencial. Elige y agrégalos a tu cotización.",
  path: "/tienda/comparar",
});

/** Comparador de equipos. La selección llega por ?modelos=a,b,c o desde la bandeja de la tienda. */
export default function CompararPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Tienda", href: "/tienda" }, { label: "Comparar" }]}
        eyebrow="Comparador"
        title="Compara equipos lado a lado."
        description="Elige hasta tres impresoras o laptops y revisa en qué se diferencian. Las mejores cifras de cada fila se resaltan solas."
      />
      <CompareView products={products} showUnverified={showUnverifiedContent()} />
    </>
  );
}
