"use client";

import { ArrowDown, Check } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { useQuote } from "@/components/quote/quote-provider";
import { Button } from "@/components/ui/button";
import { quoteServices } from "@/lib/content/quote";
import { cn } from "@/lib/utils";

/** Selector de servicios en la cabecera de /cotizador: se puede elegir uno o varios. */
export function ServicePicker() {
  const { quote, toggleService } = useQuote();
  const count = quote.services.length;

  return (
    <fieldset id="servicios" className="mt-10 scroll-mt-24 lg:mt-12">
      <legend className="text-lg font-bold text-white">¿Qué necesita tu proyecto?</legend>
      <p className="mt-1 text-white">Elige uno o varios servicios.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {quoteServices.map((s) => {
          const on = quote.services.includes(s.id);
          return (
            <label
              key={s.id}
              className={cn(
                "group relative flex cursor-pointer gap-4 rounded-3xl p-5 transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.99] sm:flex-col sm:p-6",
                "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-white",
                on
                  ? "bg-white text-ink shadow-[0_24px_48px_-24px_rgb(1_26_71/0.75)]"
                  : "bg-brand-blue-800/45 text-white ring-1 ring-white/30 ring-inset hover:bg-brand-blue-800/60",
              )}
            >
              <input type="checkbox" checked={on} onChange={() => toggleService(s.id)} className="sr-only" />
              <span
                aria-hidden
                className={cn(
                  "inline-flex h-12 w-16 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                  on ? "bg-brand-blue text-white" : "bg-white/20 text-white",
                )}
              >
                <Icon name={s.icon} className="size-6" />
              </span>
              <span className="min-w-0 pr-8 sm:pr-0">
                <span className="block text-xl font-bold">{s.title}</span>
                <span className={cn("mt-1 block text-sm leading-relaxed", on ? "text-ink-soft" : "text-white")}>{s.summary}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute top-5 right-5 inline-flex size-7 items-center justify-center rounded-full border-2 transition-[background-color,border-color] duration-200 sm:top-6 sm:right-6",
                  on ? "border-brand-blue bg-brand-blue text-white" : "border-white/50",
                )}
              >
                <Check className={cn("size-4 transition-transform duration-200", on ? "scale-100" : "scale-0")} strokeWidth={3} />
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex min-h-13 flex-wrap items-center gap-x-5 gap-y-3">
        {count > 0 ? (
          <>
            <Button asChild variant="inverse" size="lg" className="animate-panel-in">
              <a href="#configurar">
                Configurar {count === 1 ? "el servicio" : `${count} servicios`}
                <ArrowDown aria-hidden />
              </a>
            </Button>
            <p className="text-sm text-white" aria-live="polite">
              La estimación se actualiza mientras ajustas cada opción.
            </p>
          </>
        ) : (
          <p className="text-sm text-white" aria-live="polite">
            Al elegir un servicio verás sus opciones y una estimación en vivo.
          </p>
        )}
      </div>
    </fieldset>
  );
}
