"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ArrowRight, Columns3, X } from "lucide-react";

import { ProductVisual } from "@/components/catalog/product-visual";
import { COMPARE_MAX, getProductKind, type ProductKind } from "@/lib/content/compare";
import { getProduct } from "@/lib/content/products";
import { cn } from "@/lib/utils";

/**
 * Selección de equipos para comparar (hasta COMPARE_MAX, del mismo tipo).
 * Se guarda en el navegador y se refleja en /catalogo/comparar?modelos=a,b,c para poder compartirla.
 */

type CompareCtx = {
  slugs: string[];
  kind: ProductKind | null;
  /** La selección guardada ya se restauró desde el navegador. */
  hydrated: boolean;
  /** Mensaje breve tras una acción (lista llena, cambio de tipo). */
  notice: string | null;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  replace: (slugs: string[]) => void;
  clear: () => void;
};

const STORAGE_KEY = "mt-comparar";
const Ctx = createContext<CompareCtx | null>(null);

/** Deja solo productos existentes, sin repetir, del mismo tipo que el primero y hasta el máximo. */
export function sanitizeCompare(slugs: string[]) {
  const valid = Array.from(new Set(slugs)).filter((s) => getProduct(s));
  const kind = valid.length ? getProduct(valid[0])!.kind : null;
  return valid.filter((s) => getProduct(s)!.kind === kind).slice(0, COMPARE_MAX);
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restauración única desde localStorage
      if (raw) setSlugs(sanitizeCompare(JSON.parse(raw) as string[]));
    } catch {
      /* sin persistencia */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      /* ignorar */
    }
  }, [slugs, hydrated]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(t);
  }, [notice]);

  const toggle = useCallback(
    (slug: string) => {
      const product = getProduct(slug);
      if (!product) return;
      if (slugs.includes(slug)) {
        setSlugs(slugs.filter((s) => s !== slug));
        return;
      }
      const currentKind = slugs.length ? getProduct(slugs[0])?.kind : null;
      if (currentKind && currentKind !== product.kind) {
        setNotice(`Empezaste una comparación de ${getProductKind(product.kind).plural.toLowerCase()}: solo se comparan equipos del mismo tipo.`);
        setSlugs([slug]);
        return;
      }
      if (slugs.length >= COMPARE_MAX) {
        setNotice(`Puedes comparar hasta ${COMPARE_MAX} equipos. Quita uno para agregar otro.`);
        return;
      }
      setSlugs([...slugs, slug]);
    },
    [slugs],
  );
  const remove = useCallback((slug: string) => setSlugs((prev) => prev.filter((s) => s !== slug)), []);
  const replace = useCallback((next: string[]) => setSlugs(sanitizeCompare(next)), []);
  const clear = useCallback(() => setSlugs([]), []);
  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const value = useMemo<CompareCtx>(
    () => ({ slugs, kind: slugs.length ? (getProduct(slugs[0])?.kind ?? null) : null, hydrated, notice, has, toggle, remove, replace, clear }),
    [slugs, hydrated, notice, has, toggle, remove, replace, clear],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CompareTray />
    </Ctx.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCompare debe usarse dentro de CompareProvider");
  return ctx;
}

export function compareHref(slugs: string[]) {
  return slugs.length ? `/catalogo/comparar?modelos=${slugs.map(encodeURIComponent).join(",")}` : "/catalogo/comparar";
}

/** Bandeja flotante en el catálogo: muestra lo elegido y lleva al comparador. */
function CompareTray() {
  const pathname = usePathname();
  const { slugs, kind, notice, remove, clear } = useCompare();
  const inStore = pathname === "/catalogo" || pathname.startsWith("/catalogo/");
  const visible = inStore && pathname !== "/catalogo/comparar" && slugs.length > 0;

  useEffect(() => {
    document.documentElement.classList.toggle("has-compare-tray", visible);
    return () => document.documentElement.classList.remove("has-compare-tray");
  }, [visible]);

  if (!visible) return null;

  const ready = slugs.length >= 2;
  const plural = kind ? getProductKind(kind).plural.toLowerCase() : "equipos";

  return (
    <div
      role="region"
      aria-label="Equipos para comparar"
      className="animate-panel-in fixed inset-x-4 bottom-4 z-30 mr-18 sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:mr-0 sm:w-[min(40rem,calc(100%-10rem))] sm:-translate-x-1/2"
    >
      {notice ? (
        <p role="status" className="mb-2 rounded-2xl bg-ink px-4 py-2.5 text-sm text-white shadow-lift">
          {notice}
        </p>
      ) : (
        <p role="status" className="sr-only">
          {slugs.length} de {COMPARE_MAX} {plural} para comparar
        </p>
      )}
      <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-[0_16px_40px_-12px_rgb(11_26_51/0.35)] ring-1 ring-line sm:gap-3 sm:p-2">
        <ul className="flex min-w-0 shrink items-center gap-1.5 pl-0.5">
          {Array.from({ length: COMPARE_MAX }, (_, i) => {
            const p = slugs[i] ? getProduct(slugs[i]) : null;
            return (
              <li key={i} className={p ? undefined : "hidden sm:block"}>
                {p ? (
                  <button
                    type="button"
                    onClick={() => remove(p.slug)}
                    className="group relative block size-10 rounded-full sm:size-11"
                    aria-label={`Quitar ${p.name} de la comparación`}
                    title={`Quitar ${p.model}`}
                  >
                    <ProductVisual model={p.model} kind={p.kind} size="sm" className="size-10 rounded-full sm:size-11" />
                    <span
                      aria-hidden
                      className="absolute -top-1 -right-1 inline-flex size-5 items-center justify-center rounded-full bg-ink text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                    >
                      <X className="size-3" />
                    </span>
                  </button>
                ) : (
                  <span aria-hidden className="block size-11 rounded-full border-2 border-dashed border-input" />
                )}
              </li>
            );
          })}
        </ul>
        <p className="hidden min-w-0 flex-1 text-sm leading-tight text-ink-soft sm:block">
          <span className="font-bold text-ink">
            {slugs.length} de {COMPARE_MAX}
          </span>{" "}
          {ready ? `${plural} listas para comparar` : "· agrega otro para comparar"}
        </p>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={clear}
            className="hidden h-11 items-center rounded-full px-3 text-sm font-semibold text-ink-soft hover:bg-surface hover:text-destructive sm:inline-flex"
          >
            Limpiar
          </button>
          <Link
            href={compareHref(slugs)}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full px-4 font-semibold transition-colors sm:px-5",
              ready ? "bg-brand-blue text-white hover:bg-brand-blue-700" : "bg-brand-blue-50 text-brand-blue hover:bg-brand-blue-100",
            )}
          >
            <Columns3 aria-hidden className="hidden size-4 sm:block" />
            Comparar
            <span className="tabular-nums sm:hidden">· {slugs.length}</span>
            <ArrowRight aria-hidden className="hidden size-4 sm:block" />
          </Link>
        </div>
      </div>
    </div>
  );
}
