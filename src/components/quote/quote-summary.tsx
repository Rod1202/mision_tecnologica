"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronUp, ShoppingBag } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { IsoStrokes } from "@/components/brand/pills";
import { useQuoteCart } from "@/components/catalog/quote-cart";
import { useQuote } from "@/components/quote/quote-provider";
import { Button } from "@/components/ui/button";
import { getQuoteService } from "@/lib/content/quote";
import { describeCatalogItems, describeService, projectLine } from "@/lib/quote";
import { cn } from "@/lib/utils";

/** Resumen en vivo de la solicitud (sin montos: la propuesta económica la prepara un asesor). */
export function QuoteSummary({ className }: { className?: string }) {
  const { quote } = useQuote();
  const { lines } = useQuoteCart();
  const catalog = describeCatalogItems(lines);

  return (
    <section
      id="resumen"
      aria-labelledby="resumen-title"
      className={cn(
        "relative isolate scroll-mt-24 overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,var(--color-brand-blue)_0%,var(--color-brand-blue-700)_55%,var(--color-brand-blue-800)_100%)] p-6 text-white shadow-lift sm:p-8",
        className,
      )}
    >
      <IsoStrokes className="top-[-35%] right-[-30%] -z-10 h-[150%] w-[80%] opacity-[0.08]" />

      <h2 id="resumen-title" className="text-xl font-bold">
        Resumen de tu solicitud
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white">{projectLine(quote)}</p>

      <ul className="mt-6 space-y-2 border-t border-white/20 pt-6">
        {quote.services.map((id) => {
          const s = getQuoteService(id);
          return (
            <li key={id} className="rounded-2xl bg-white/[0.07] p-3 ring-1 ring-white/10 ring-inset">
              <p className="flex items-center gap-3 font-semibold">
                <span aria-hidden className="inline-flex h-8 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon name={s.icon} className="size-4" />
                </span>
                {s.title}
              </p>
              <ul className="mt-2 space-y-1 pl-14 text-sm leading-snug text-white">
                {describeService(quote, id).map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </li>
          );
        })}
        {catalog.length ? (
          <li className="rounded-2xl bg-white/[0.07] p-3 ring-1 ring-white/10 ring-inset">
            <p className="flex items-center gap-3 font-semibold">
              <span aria-hidden className="inline-flex h-8 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <ShoppingBag className="size-4" />
              </span>
              Equipos del catálogo
            </p>
            <ul className="mt-2 space-y-1 pl-14 text-sm leading-snug text-white">
              {catalog.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </li>
        ) : null}
      </ul>

      <Button asChild variant="inverse" size="lg" className="mt-7 w-full">
        <a href="#enviar">
          Enviar a un asesor
          <ArrowRight aria-hidden />
        </a>
      </Button>

      <p className="mt-5 text-xs leading-relaxed text-white">
        No mostramos precios en línea: un asesor revisa tu proyecto y te envía la propuesta con montos, alcance y plazos.
      </p>
    </section>
  );
}

/** Barra flotante en móvil: lleva al resumen mientras se configuran los paneles. */
export function QuoteMobileBar() {
  const { quote } = useQuote();
  const [visible, setVisible] = useState({ configurar: false, resumen: false });

  useEffect(() => {
    const ids = ["configurar", "resumen"] as const;
    const io = new IntersectionObserver((entries) => {
      setVisible((prev) => {
        const next = { ...prev };
        for (const e of entries) next[e.target.id as (typeof ids)[number]] = e.isIntersecting;
        return next;
      });
    });
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [quote.services.length]);

  if (quote.services.length === 0 || !visible.configurar || visible.resumen) return null;

  const n = quote.services.length;
  return (
    <a
      href="#resumen"
      className="animate-panel-in fixed bottom-4 left-4 z-30 flex h-14 max-w-[calc(100%-6.5rem)] items-center gap-3 rounded-full bg-ink py-2 pr-5 pl-2 text-white shadow-[0_16px_32px_-12px_rgb(11_26_51/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:bottom-6 sm:left-6 lg:hidden"
    >
      <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-blue">
        <ChevronUp className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-white/70">Tu solicitud</span>
        <span className="block truncate font-bold">
          {n} {n === 1 ? "servicio" : "servicios"} · Ver resumen
        </span>
      </span>
    </a>
  );
}
