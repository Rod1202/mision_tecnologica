"use client";

import Link from "next/link";
import { Check, Columns3 } from "lucide-react";

import { compareHref, sanitizeCompare, useCompare } from "@/components/compare/compare-provider";
import { cn } from "@/lib/utils";

/** Casilla "Comparar" de tarjetas y fichas de producto. */
export function CompareToggle({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const { has, toggle } = useCompare();
  const on = has(slug);

  return (
    <label
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2.5 rounded-full border px-4 text-sm font-semibold transition-[border-color,background-color,color] duration-200 select-none",
        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-bright",
        on ? "border-brand-bright bg-brand-blue-50 text-brand-blue-800" : "border-line bg-white text-ink-soft hover:border-brand-bright/40 hover:text-ink",
        className,
      )}
    >
      <input type="checkbox" checked={on} onChange={() => toggle(slug)} className="sr-only" />
      <span
        aria-hidden
        className={cn(
          "inline-flex size-5 items-center justify-center rounded-md border-2 transition-colors",
          on ? "border-brand-bright bg-brand-blue text-white" : "border-input bg-white",
        )}
      >
        {on ? <Check className="size-3" strokeWidth={3.5} /> : null}
      </span>
      <span>
        Comparar<span className="sr-only"> {name}</span>
      </span>
      <Columns3 aria-hidden className={cn("size-4", on ? "text-brand-bright" : "opacity-60")} />
    </label>
  );
}

/** Enlace al comparador que suma este equipo a lo que ya se eligió (no borra la selección). */
export function CompareWithLink({ slug, className, children }: { slug: string; className?: string; children: React.ReactNode }) {
  const { slugs } = useCompare();
  return (
    <Link href={compareHref(sanitizeCompare([slug, ...slugs.filter((s) => s !== slug)]))} className={className}>
      {children}
    </Link>
  );
}
