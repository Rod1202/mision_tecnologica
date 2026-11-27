"use client";

import { RotateCcw, ShoppingBag } from "lucide-react";

import { useQuoteCart } from "@/components/catalog/quote-cart";
import { ProjectPanel, servicePanels } from "@/components/quote/quote-panels";
import { focusSoon, useQuote } from "@/components/quote/quote-provider";
import { QuoteRequestForm } from "@/components/quote/quote-request-form";
import { QuoteMobileBar, QuoteSummary } from "@/components/quote/quote-summary";
import { ServicePicker } from "@/components/quote/service-picker";
import { describeCatalogItems } from "@/lib/quote";
import { cn } from "@/lib/utils";

/**
 * "Sé lo que necesito": un solo recorrido en 3 pasos (servicios → dimensionamiento → datos),
 * con el resumen siempre visible al costado. Se usa en la página /cotizador.
 */
export function QuoteFlow() {
  const { quote, reset } = useQuote();
  const { lines } = useQuoteCart();
  const catalog = describeCatalogItems(lines);
  const selected = quote.services;

  return (
    <>
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          <Step n={1} id="paso-servicios" title="¿Qué necesita tu proyecto?" hint="Elige uno o varios servicios.">
            <ServicePicker />
          </Step>

          <Step
            n={2}
            id="configurar"
            title="Dimensiona tu proyecto"
            hint="Cantidades, volúmenes, sedes y plazos: lo que un asesor necesita para preparar tu propuesta."
          >
            {selected.length === 0 && catalog.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-input bg-white/60 px-6 py-8 text-center text-ink-soft">
                Elige al menos un servicio en el paso 1 y aquí aparecerán sus opciones.
              </p>
            ) : (
              <div className="space-y-6">
                {selected.length > 0 ? <ProjectPanel /> : null}
                {selected.map((id) => {
                  const PanelFor = servicePanels[id];
                  return <PanelFor key={id} />;
                })}

                {catalog.length > 0 ? (
                  <div className="flex gap-4 rounded-[2rem] border border-line bg-white p-6 shadow-soft">
                    <span aria-hidden className="inline-flex h-12 w-16 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-bright">
                      <ShoppingBag className="size-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xl font-bold text-ink">Equipos del catálogo</p>
                      <ul className="mt-2 space-y-1 text-ink-soft">
                        {catalog.map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}

                {selected.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      focusSoon("servicios-titulo");
                    }}
                    className="inline-flex min-h-10 items-center gap-2 px-2 text-sm font-semibold text-ink-soft hover:text-destructive"
                  >
                    <RotateCcw aria-hidden className="size-4" />
                    Empezar de nuevo
                  </button>
                ) : null}
              </div>
            )}
          </Step>

          <Step n={3} id="enviar" title="Tus datos" hint="Recibimos tu proyecto completo: no tendrás que explicarlo otra vez." last>
            <QuoteRequestForm className="ring-1 ring-line" />
          </Step>
        </div>

        <div className="lg:sticky lg:top-24 lg:col-span-5 xl:col-span-4">
          <QuoteSummary />
        </div>
      </div>

      <QuoteMobileBar />
    </>
  );
}

/** Paso numerado. Una línea vertical une los pasos para que se lean como un solo recorrido. */
function Step({
  n,
  id,
  title,
  hint,
  last,
  children,
}: {
  n: number;
  id: string;
  title: string;
  hint: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  const titleId = n === 1 ? "servicios-titulo" : `${id}-titulo`;
  return (
    <section id={id} aria-labelledby={titleId} className={cn("relative pl-12 sm:pl-16", !last && "pb-12")}>
      {!last ? <span aria-hidden className="absolute top-12 bottom-0 left-[1.125rem] w-0.5 rounded-full bg-brand-bright/25 sm:left-[1.375rem]" /> : null}
      <span
        aria-hidden
        className="absolute top-0 left-0 inline-flex size-9 items-center justify-center rounded-full bg-brand-bright font-bold text-white tabular-nums ring-4 ring-surface sm:size-11 sm:text-lg"
      >
        {n}
      </span>
      <p className="text-sm font-bold tracking-[0.06em] text-brand-bright uppercase">Paso {n} de 3</p>
      <h2 id={titleId} tabIndex={-1} className="mt-1 text-2xl font-bold text-ink outline-none sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-ink-soft">{hint}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
