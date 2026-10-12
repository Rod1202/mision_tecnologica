import Link from "next/link";

import { AddToQuoteButton } from "@/components/catalog/add-to-quote";
import { ProductPrice } from "@/components/catalog/product-price";
import { ProductVisual } from "@/components/catalog/product-visual";
import { Badge } from "@/components/ui/badge";
import { productHref, type Product } from "@/lib/content/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col rounded-[2rem] border border-line bg-white p-4 shadow-soft transition-shadow hover:shadow-lift">
      <Link href={productHref(product.slug)} aria-label={`Ver ficha de ${product.name}`} className="block rounded-3xl">
        <ProductVisual model={product.model} />
      </Link>
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge>{product.category}</Badge>
          <Badge variant="teal">{product.brand}</Badge>
        </div>
        <h3 className="mt-4 text-xl leading-snug font-bold text-ink">
          <Link href={productHref(product.slug)} className="hover:text-brand-blue">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 leading-relaxed text-ink-soft">{product.summary}</p>
        <ProductPrice product={product} className="mt-4" />
        {/* Acciones apiladas: las tarjetas pueden ser angostas (catálogo con filtros laterales) */}
        <div className="mt-auto flex flex-col gap-1 pt-6">
          <AddToQuoteButton slug={product.slug} name={product.name} className="w-full" />
          <Link
            href={productHref(product.slug)}
            className="inline-flex h-11 w-full items-center justify-center rounded-full px-5 font-semibold text-brand-blue hover:bg-brand-blue-50"
          >
            Ver ficha
          </Link>
        </div>
      </div>
    </article>
  );
}
