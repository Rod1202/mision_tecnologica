"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { ProductVisual } from "@/components/catalog/product-visual";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { getProduct, productHref } from "@/lib/content/products";
import { siteConfig } from "@/lib/site";
import { cn, whatsappLink } from "@/lib/utils";

/**
 * Carrito de COTIZACIÓN (sin precios ni pagos). Se guarda en el navegador del visitante
 * y genera un mensaje de WhatsApp con los equipos y cantidades.
 */

type Line = { slug: string; qty: number };
type QuoteCart = {
  lines: Line[];
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "mt-cotizacion";
const MAX_QTY = 99;
const Ctx = createContext<QuoteCart | null>(null);

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restaurar desde el navegador (puede no estar disponible: modo privado, bloqueos, etc.)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Line[];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restauración única desde localStorage
        setLines(parsed.filter((l) => getProduct(l.slug) && l.qty > 0));
      }
    } catch {
      /* sin persistencia: el carrito funciona igual en memoria */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignorar */
    }
  }, [lines, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      return [...prev, { slug, qty }];
    });
  }, []);
  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);
  const remove = useCallback((slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<QuoteCart>(
    () => ({ lines, count: lines.reduce((n, l) => n + l.qty, 0), open, setOpen, add, setQty, remove, clear }),
    [lines, open, add, setQty, remove, clear],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <QuoteCartSheet />
    </Ctx.Provider>
  );
}

export function useQuoteCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuoteCart debe usarse dentro de QuoteCartProvider");
  return ctx;
}

export function buildQuoteMessage(lines: Line[]) {
  const items = lines
    .map((l) => {
      const p = getProduct(l.slug);
      return p ? `• ${l.qty} × ${p.name}` : null;
    })
    .filter(Boolean)
    .join("\n");
  return `Hola, Misión Tecnológica. Quisiera solicitar una cotización de:\n${items}\n\nEmpresa: \nCiudad / sede: `;
}

/** Botón de la cabecera: solo aparece cuando hay equipos en la cotización. */
export function QuoteCartButton({ className }: { className?: string }) {
  const { count, setOpen } = useQuoteCart();
  if (count === 0) return null;
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpen(true)}
      aria-label={`Ver cotización (${count} ${count === 1 ? "equipo" : "equipos"})`}
      className={cn("relative", className)}
    >
      <ShoppingBag className="size-5!" aria-hidden />
      <span className="absolute top-1 right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-blue px-1 text-[0.7rem] leading-5 font-bold text-white tabular-nums">
        {count}
      </span>
    </Button>
  );
}

function QuoteCartSheet() {
  const { lines, open, setOpen, setQty, remove, clear, count } = useQuoteCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent closeLabel="Cerrar cotización">
        <div className="border-b border-line px-5 py-5 pr-16">
          <SheetTitle className="text-xl font-bold text-ink">Tu cotización</SheetTitle>
          <SheetDescription className="mt-1 text-sm text-ink-soft">
            Sin precios ni pagos: enviaremos tu solicitud por WhatsApp a un asesor.
          </SheetDescription>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="inline-flex h-14 w-20 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
              <ShoppingBag aria-hidden className="size-7" />
            </span>
            <p className="font-semibold text-ink">Aún no agregaste equipos.</p>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link href="/tienda">Ver la tienda</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((line) => {
                const p = getProduct(line.slug);
                if (!p) return null;
                return (
                  <li key={line.slug} className="flex gap-4 py-5">
                    <ProductVisual model={p.model} size="sm" className="w-20 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={productHref(p.slug)}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 font-semibold text-ink hover:text-brand-blue"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-ink-soft">{p.category}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-line" role="group" aria-label={`Cantidad de ${p.name}`}>
                          <button
                            type="button"
                            onClick={() => setQty(p.slug, line.qty - 1)}
                            className="inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-surface"
                            aria-label="Quitar uno"
                          >
                            <Minus aria-hidden className="size-4" />
                          </button>
                          <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(p.slug, line.qty + 1)}
                            className="inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-surface"
                            aria-label="Agregar uno"
                          >
                            <Plus aria-hidden className="size-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(p.slug)}
                          className="inline-flex size-9 items-center justify-center rounded-full text-ink-soft hover:bg-red-50 hover:text-destructive"
                          aria-label={`Quitar ${p.name} de la cotización`}
                        >
                          <Trash2 aria-hidden className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-3 border-t border-line p-5">
              <p className="flex justify-between text-sm text-ink-soft">
                <span>Equipos en la cotización</span>
                <span className="font-bold text-ink tabular-nums">{count}</span>
              </p>
              <Button asChild size="lg" className="w-full bg-[#1fa855] shadow-none hover:bg-[#178a45]">
                <a href={whatsappLink(siteConfig.contact.whatsapp, buildQuoteMessage(lines))} target="_blank" rel="noopener noreferrer">
                  Solicitar cotización por WhatsApp
                </a>
              </Button>
              <button type="button" onClick={clear} className="mx-auto flex items-center gap-1.5 text-sm text-ink-soft hover:text-destructive">
                <X aria-hidden className="size-3.5" />
                Vaciar cotización
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
