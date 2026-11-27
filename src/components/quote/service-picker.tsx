"use client";

import { Check } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { useQuote } from "@/components/quote/quote-provider";
import { quoteServices } from "@/lib/content/quote";
import { cn } from "@/lib/utils";

/** Paso 1 del cotizador: elegir uno o varios servicios. Al elegirlos aparecen sus paneles debajo. */
export function ServicePicker() {
  const { quote, toggleService, hydrated } = useQuote();

  return (
    <fieldset id="servicios" className="min-w-0">
      <legend className="sr-only">Servicios que necesita tu proyecto</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {quoteServices.map((s) => {
          const on = quote.services.includes(s.id);
          return (
            <label
              key={s.id}
              className={cn(
                "group relative flex cursor-pointer items-start gap-4 rounded-3xl border-2 bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 active:scale-[0.99]",
                "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-bright",
                on ? "border-brand-bright shadow-[0_18px_40px_-24px_rgb(0_82_204/0.6)]" : "border-transparent shadow-soft ring-1 ring-line hover:ring-brand-bright/40",
                !hydrated && "pointer-events-none opacity-70",
              )}
            >
              <input id={`servicio-${s.id}`} type="checkbox" checked={on} onChange={() => toggleService(s.id)} className="sr-only" />
              <span
                aria-hidden
                className={cn(
                  "inline-flex h-12 w-16 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                  on ? "bg-brand-bright text-white" : "bg-brand-blue-50 text-brand-bright",
                )}
              >
                <Icon name={s.icon} className="size-6" />
              </span>
              <span className="min-w-0 pr-8">
                <span className="block text-lg font-bold text-ink">{s.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{s.summary}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute top-5 right-5 inline-flex size-7 items-center justify-center rounded-full border-2 transition-[background-color,border-color] duration-200",
                  on ? "border-brand-bright bg-brand-bright text-white" : "border-line",
                )}
              >
                <Check className={cn("size-4 transition-transform duration-200", on ? "scale-100" : "scale-0")} strokeWidth={3} />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
