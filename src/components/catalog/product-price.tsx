import { formatPrice, type Product } from "@/lib/content/products";
import { cn } from "@/lib/utils";

/**
 * Precio referencial. Si es de demostración, SIEMPRE se rotula como tal (regla del proyecto:
 * no presentar precios ficticios como reales). Sin precio → "A cotizar".
 */
export function ProductPrice({ product, size = "md", className }: { product: Product; size?: "md" | "lg"; className?: string }) {
  if (product.price === undefined) {
    return <p className={cn("font-bold text-ink", size === "lg" ? "text-2xl" : "text-lg", className)}>A cotizar</p>;
  }
  return (
    <div className={className}>
      <p className={cn("font-bold text-ink tabular-nums", size === "lg" ? "text-3xl" : "text-xl")}>
        {formatPrice(product.price)}
        <span className="ml-1.5 text-sm font-semibold text-ink-soft">referencial</span>
      </p>
      {product.priceIsDemo ? (
        <p className="mt-1 inline-flex rounded-full border border-dashed border-amber-500/70 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
          Precio de demostración
        </p>
      ) : null}
    </div>
  );
}
