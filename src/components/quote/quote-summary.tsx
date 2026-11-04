"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Mail, MessageCircle } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { IsoStrokes } from "@/components/brand/pills";
import { useQuote } from "@/components/quote/quote-provider";
import { Button } from "@/components/ui/button";
import { getQuoteService, termOptions } from "@/lib/content/quote";
import { estimateRange, formatPEN, formatRange, labelOf, quoteDirectChannel, type ServiceEstimate } from "@/lib/quote";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Números animados                                                     */
/* ------------------------------------------------------------------ */

/** Interpola hacia el valor nuevo (ease-out). Con "reducir movimiento" el cambio es inmediato. */
function useTweenedNumber(target: number, duration = 480) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = current.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.min(1, (now - start) / duration);
      const v = from + (target - from) * (1 - (1 - t) ** 4);
      current.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return Math.round(value);
}

function AnimatedRange({ value, className }: { value: number; className?: string }) {
  const [lo, hi] = estimateRange(value);
  const a = useTweenedNumber(lo);
  const b = useTweenedNumber(hi);
  return (
    <span className={cn("tabular-nums", className)}>
      {formatPEN(a)}
      <span className="mx-1.5 font-semibold opacity-60">–</span>
      {formatPEN(b)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Resumen                                                              */
/* ------------------------------------------------------------------ */

export function QuoteSummary({ className }: { className?: string }) {
  const { quote, estimate } = useQuote();
  const termLabel = labelOf(termOptions, quote.project.term);
  const hasAmounts = estimate.monthly > 0 || estimate.oneTime > 0;
  const direct = quoteDirectChannel(quote);

  // Anuncio para lectores de pantalla, con pausa para no leer cada paso del deslizador.
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => {
      const parts = [
        estimate.monthly > 0 ? `${formatRange(estimate.monthly)} al mes` : null,
        estimate.oneTime > 0 ? `${formatRange(estimate.oneTime)} en pagos únicos` : null,
      ].filter(Boolean);
      setAnnouncement(parts.length ? `Estimación actualizada: ${parts.join(" y ")}.` : "");
    }, 900);
    return () => window.clearTimeout(t);
  }, [estimate.monthly, estimate.oneTime]);

  return (
    <section
      id="resumen"
      aria-labelledby="resumen-title"
      className={cn("relative isolate scroll-mt-24 overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,var(--color-brand-blue)_0%,var(--color-brand-blue-700)_55%,var(--color-brand-blue-800)_100%)] p-6 text-white shadow-lift sm:p-8", className)}
    >
      <IsoStrokes className="top-[-35%] right-[-30%] -z-10 h-[150%] w-[80%] opacity-[0.08]" />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="resumen-title" className="text-xl font-bold">
          Tu estimación
        </h2>
        {estimate.demo ? (
          <span className="inline-flex rounded-full border border-dashed border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            Tarifas de demostración
          </span>
        ) : null}
      </div>

      <dl className="mt-6 space-y-5">
        <div>
          <dt className="text-sm font-semibold text-white">Cuota mensual</dt>
          <dd className="mt-1">
            {estimate.monthly > 0 ? (
              <>
                <AnimatedRange value={estimate.monthly} className="block text-3xl leading-tight font-extrabold tracking-[-0.02em] sm:text-[2.1rem]" />
                <span className="text-sm text-white">al mes · contrato de {termLabel}</span>
              </>
            ) : (
              <span className="block text-2xl font-bold text-white">—</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-white">Pagos únicos</dt>
          <dd className="mt-1">
            {estimate.oneTime > 0 ? (
              <AnimatedRange value={estimate.oneTime} className="block text-2xl leading-tight font-bold" />
            ) : (
              <span className="block text-2xl font-bold text-white">—</span>
            )}
          </dd>
        </div>
      </dl>

      {estimate.services.length > 0 ? (
        <ul className="mt-7 space-y-2 border-t border-white/20 pt-6">
          {estimate.services.map((s) => (
            <ServiceRow key={s.service} estimate={s} />
          ))}
          {estimate.deployment > 0 ? (
            <li className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm">
              <span className="text-white">
                Despliegue en {quote.project.sites} {quote.project.sites === 1 ? "sede" : "sedes"}
              </span>
              <span className="font-semibold tabular-nums">{formatPEN(estimate.deployment)}</span>
            </li>
          ) : null}
        </ul>
      ) : null}

      {hasAmounts && estimate.monthly > 0 ? (
        <p className="mt-5 flex flex-wrap items-baseline justify-between gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm ring-1 ring-white/15 ring-inset">
          <span className="text-white">Valor estimado en {termLabel}</span>
          <span className="font-bold tabular-nums">{formatRange(estimate.total)}</span>
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3">
        <Button asChild variant="inverse" size="lg" className="w-full">
          <a href="#enviar">
            Enviar a un asesor
            <ArrowRight aria-hidden />
          </a>
        </Button>
        <Button asChild variant="outline-inverse" size="lg" className="w-full">
          <a href={direct.href} {...(direct.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {direct.kind === "whatsapp" ? <MessageCircle aria-hidden /> : <Mail aria-hidden />}
            {direct.label}
          </a>
        </Button>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-white">
        {estimate.demo
          ? "Montos calculados con tarifas de prueba para demostrar el cotizador: no son una oferta. La propuesta final depende del diagnóstico de tu operación."
          : "Montos referenciales. La propuesta final depende del diagnóstico de tu operación."}
      </p>
    </section>
  );
}

function ServiceRow({ estimate: s }: { estimate: ServiceEstimate }) {
  const [open, setOpen] = useState(false);
  const service = getQuoteService(s.service);
  const amount = [s.monthly > 0 ? `${formatPEN(s.monthly)}/mes` : null, s.oneTime > 0 ? `${formatPEN(s.oneTime)} único` : null]
    .filter(Boolean)
    .join(" + ");

  return (
    <li className="rounded-2xl bg-white/[0.07] ring-1 ring-white/10 ring-inset">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        disabled={!!s.incomplete}
        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-white disabled:cursor-default"
      >
        <span aria-hidden className="inline-flex h-8 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Icon name={service.icon} className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{service.title}</span>
          <span className="block text-sm text-white tabular-nums">{s.incomplete ?? amount}</span>
        </span>
        {!s.incomplete ? (
          open ? <ChevronUp aria-hidden className="size-4 text-white/70" /> : <ChevronDown aria-hidden className="size-4 text-white/70" />
        ) : null}
      </button>
      {open && !s.incomplete ? (
        <div className="animate-panel-in px-3 pb-3">
          <ul className="space-y-1.5 border-t border-white/15 pt-3 text-sm">
            {s.lines.map((l) => (
              <li key={l.label} className="flex justify-between gap-3">
                <span className="text-white">{l.label}</span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {l.note ??
                    [l.monthly > 0 ? `${formatPEN(l.monthly)}/mes` : null, l.oneTime > 0 ? formatPEN(l.oneTime) : null]
                      .filter(Boolean)
                      .join(" + ")}
                </span>
              </li>
            ))}
          </ul>
          {s.facts.length ? (
            <dl className="mt-3 flex flex-wrap gap-2">
              {s.facts.map((f) => (
                <div key={f.label} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                  <dt className="inline text-white">{f.label}: </dt>
                  <dd className="inline font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

/** Barra flotante en móvil: muestra la estimación mientras se configuran los paneles y el resumen no está a la vista. */
export function QuoteMobileBar() {
  const { quote, estimate } = useQuote();
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

  const main = estimate.monthly > 0 ? estimate.monthly : estimate.oneTime;
  return (
    <a
      href="#resumen"
      className="animate-panel-in fixed bottom-4 left-4 z-30 flex h-14 max-w-[calc(100%-6.5rem)] items-center gap-3 rounded-full bg-ink py-2 pr-5 pl-2 text-white shadow-[0_16px_32px_-12px_rgb(11_26_51/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:bottom-6 sm:left-6 lg:hidden"
    >
      <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-blue">
        <ChevronUp className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-white/70">
          {estimate.monthly > 0 ? "Estimación mensual" : "Estimación"}
          {estimate.demo ? " · demo" : ""}
        </span>
        <span className="block truncate font-bold tabular-nums">{main > 0 ? `desde ${formatPEN(estimateRange(main)[0])}` : "Completa los datos"}</span>
      </span>
    </a>
  );
}
