"use client";

import Link from "next/link";
import { ArrowRight, Plus, RotateCcw, ShoppingBag } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { useQuoteCart } from "@/components/catalog/quote-cart";
import { ProjectPanel, servicePanels } from "@/components/quote/quote-panels";
import { focusSoon, useQuote } from "@/components/quote/quote-provider";
import { QuoteRequestForm } from "@/components/quote/quote-request-form";
import { QuoteMobileBar, QuoteSummary } from "@/components/quote/quote-summary";
import { SectionHeading } from "@/components/marketing/section-heading";
import { quoteServices } from "@/lib/content/quote";
import { describeCatalogItems, describeService } from "@/lib/quote";

const nextSteps = [
  { title: "Revisamos tu proyecto", text: "Un asesor valida volúmenes, sedes y modalidad." },
  { title: "Hacemos el diagnóstico", text: "Coordinamos una visita o una llamada para conocer tu operación." },
  { title: "Te enviamos la propuesta", text: "Con montos reales, alcance y plazos de implementación." },
];

/** Área de configuración: paneles por servicio + resumen en vivo + envío. */
export function QuoteWorkspace() {
  const { quote, hydrated, toggleService, reset } = useQuote();
  const { lines } = useQuoteCart();
  const catalog = describeCatalogItems(lines);
  const selected = quote.services;
  const missing = quoteServices.filter((s) => !selected.includes(s.id));

  return (
    <>
      <section id="configurar" aria-label="Configuración del proyecto" className="section-y scroll-mt-16 bg-surface">
        <div className="container-mt">
          {selected.length === 0 ? (
            <EmptyState ready={hydrated} />
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="space-y-6 lg:col-span-7 xl:col-span-8">
                <ProjectPanel />
                {selected.map((id) => {
                  const PanelFor = servicePanels[id];
                  return <PanelFor key={id} />;
                })}

                {missing.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-3 rounded-[2rem] border border-dashed border-input px-6 py-5">
                    <p className="mr-auto font-semibold text-ink">¿Tu proyecto incluye algo más?</p>
                    {missing.map((s) => (
                      <button
                        key={s.id}
                        id={`agregar-${s.id}`}
                        type="button"
                        onClick={() => {
                          toggleService(s.id, true);
                          focusSoon(`${s.id}-title`);
                        }}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-blue/30 bg-white px-4 text-sm font-semibold text-brand-blue transition-colors hover:border-brand-blue hover:bg-brand-blue-50"
                      >
                        <Plus aria-hidden className="size-4" />
                        Agregar {s.title.toLowerCase()}
                      </button>
                    ))}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    focusSoon("cotizador-vacio");
                  }}
                  className="inline-flex min-h-10 items-center gap-2 px-2 text-sm font-semibold text-ink-soft hover:text-destructive"
                >
                  <RotateCcw aria-hidden className="size-4" />
                  Empezar de nuevo
                </button>
              </div>

              <div className="lg:sticky lg:top-24 lg:col-span-5 xl:col-span-4">
                <QuoteSummary />
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="enviar" aria-labelledby="enviar-title" className="section-y scroll-mt-16 bg-white">
        <div className="container-mt grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="enviar-title"
              eyebrow="Último paso"
              title="Envía tu proyecto a un asesor."
              description="Recibimos la configuración completa: no tendrás que explicarla otra vez."
            />

            {catalog.length > 0 ? (
              <div className="mt-8 flex gap-4 rounded-2xl bg-surface p-4">
                <span aria-hidden className="inline-flex h-10 w-13 shrink-0 items-center justify-center rounded-full bg-white text-brand-blue">
                  <ShoppingBag className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-ink">Equipos del catálogo</p>
                  {catalog.map((l) => (
                    <p key={l} className="text-sm leading-relaxed text-ink-soft">
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {selected.length > 0 ? (
              <div className="mt-3 space-y-3">
                {selected.map((id) => {
                  const s = quoteServices.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="flex gap-4 rounded-2xl bg-surface p-4">
                      <span aria-hidden className="inline-flex h-10 w-13 shrink-0 items-center justify-center rounded-full bg-white text-brand-blue">
                        <Icon name={s.icon} className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-ink">{s.title}</p>
                        {describeService(quote, id).map((l) => (
                          <p key={l} className="text-sm leading-relaxed text-ink-soft">
                            {l}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <ol className="mt-10 space-y-5">
              {nextSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="inline-flex h-9 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{step.title}</p>
                    <p className="text-ink-soft">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-10 rounded-2xl border border-dashed border-input p-5 text-ink-soft">
              ¿Prefieres que te guiemos?{" "}
              <Link href="/asesoria" className="inline-flex items-center gap-1 font-semibold text-brand-blue hover:underline">
                Agenda una reunión con un asesor
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </p>
          </div>

          <div className="lg:col-span-7">
            <QuoteRequestForm className="ring-1 ring-line" />
          </div>
        </div>
      </section>

      <QuoteMobileBar />
    </>
  );
}

function EmptyState({ ready }: { ready: boolean }) {
  const { toggleService } = useQuote();
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] border border-dashed border-input bg-white px-6 py-12 text-center sm:px-12">
      <h2 id="cotizador-vacio" tabIndex={-1} className="text-2xl font-bold text-ink outline-none sm:text-3xl">
        Empieza por un servicio.
      </h2>
      <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
        Elige arriba lo que necesita tu proyecto o empieza aquí. Puedes combinar cómputo, impresión, digitalización y audio y
        video en una sola cotización.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {quoteServices.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={!ready}
            onClick={() => {
              toggleService(s.id, true);
              focusSoon(`${s.id}-title`);
            }}
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-brand-blue/30 bg-white py-1.5 pr-5 pl-1.5 font-semibold text-brand-blue transition-colors hover:border-brand-blue hover:bg-brand-blue-50 disabled:opacity-60"
          >
            <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-full bg-brand-blue-50">
              <Icon name={s.icon} className="size-4.5" />
            </span>
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
