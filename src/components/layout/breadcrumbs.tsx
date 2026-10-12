import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** Migas de pan visibles + BreadcrumbList (schema.org) para SEO. */
export function Breadcrumbs({ items, tone = "inverse", className }: { items: Crumb[]; tone?: "inverse" | "default"; className?: string }) {
  const all: Crumb[] = [{ label: "Inicio", href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Ruta de navegación" className={className}>
        <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", tone === "inverse" ? "text-white/75" : "text-ink-soft")}>
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={`${c.label}-${i}`} className="inline-flex items-center gap-1.5">
                {c.href && !last ? (
                  <Link href={c.href} className={cn("hover:underline", tone === "inverse" ? "hover:text-white" : "hover:text-brand-blue")}>
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={cn("font-semibold", tone === "inverse" ? "text-white" : "text-ink")}>
                    {c.label}
                  </span>
                )}
                {!last ? <ChevronRight aria-hidden className="size-3.5 opacity-60" /> : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: new URL(c.href, siteConfig.url).toString() } : {}),
          })),
        }}
      />
    </>
  );
}
