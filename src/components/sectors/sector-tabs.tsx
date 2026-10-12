"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { IsoStrokes } from "@/components/brand/pills";
import { PendingBadge } from "@/components/ui/pending-badge";
import type { Sector } from "@/lib/content/sectors";
import { cn } from "@/lib/utils";

/**
 * Sectores en pestañas (patrón WAI-ARIA Tabs, sin dependencias externas).
 * - Teclado: flechas izquierda/derecha, Inicio y Fin cambian de pestaña.
 * - La pestaña activa se refleja en la URL (#educacion, #logistica…) para poder enlazarla.
 */
export function SectorTabs({ sectors }: { sectors: Sector[] }) {
  const [active, setActive] = useState(sectors[0]?.slug ?? "");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(window.location.hash.replace("#", ""));
      if (sectors.some((s) => s.slug === h)) setActive(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [sectors]);

  const onChange = (value: string) => {
    setActive(value);
    try {
      window.history.replaceState(null, "", `#${value}`);
    } catch {
      /* ignorar */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = sectors.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    onChange(sectors[next].slug);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="mt-10">
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div role="tablist" aria-label="Sectores" className="inline-flex min-w-max gap-1 rounded-full bg-surface p-1.5 ring-1 ring-line ring-inset">
          {sectors.map((s, i) => (
            <button
              key={s.slug}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${s.slug}`}
              aria-selected={active === s.slug}
              aria-controls={s.slug}
              tabIndex={active === s.slug ? 0 : -1}
              data-state={active === s.slug ? "active" : "inactive"}
              onClick={() => onChange(s.slug)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.95rem] font-semibold whitespace-nowrap text-ink-soft transition-colors sm:px-5",
                "hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
                "data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_-10px_rgb(0_102_255/0.7)]",
              )}
            >
              <Icon name={s.icon} className="size-4" />
              {s.tabLabel}
            </button>
          ))}
        </div>
      </div>

      {sectors.map((s) => (
        <div
          key={s.slug}
          role="tabpanel"
          id={s.slug}
          aria-labelledby={`tab-${s.slug}`}
          hidden={active !== s.slug}
          tabIndex={0}
          className="mt-8 scroll-mt-28 outline-none"
        >
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Descripción del sector */}
            <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand-blue p-7 text-white sm:p-10 lg:col-span-5">
              <IsoStrokes className="top-[-30%] right-[-25%] -z-10 h-[160%] w-[75%] opacity-[0.09]" />
              <span className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 ring-inset">
                <Icon name={s.icon} className="size-6" />
              </span>
              <h3 className="mt-6 text-3xl font-bold">{s.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-white/85">{s.summary}</p>
              <h4 className="mt-8 text-sm font-bold tracking-[0.08em] text-white/70 uppercase">Cómo ayudamos</h4>
              <ul className="mt-4 space-y-3">
                {s.howWeHelp.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-brand-blue">
                      <Check aria-hidden className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clientes */}
            <div className="rounded-[2rem] border border-line bg-white p-7 shadow-soft sm:p-10 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-xl font-bold text-ink">Empresas que trabajan con nosotros</h4>
                {s.clients.some((c) => !c.verified) ? <PendingBadge note="Confirmar autorización de uso de nombres y logotipos." /> : null}
              </div>

              {s.clients.length > 0 ? (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.clients.map((c) => (
                    <li
                      key={c.name}
                      title={c.verified ? undefined : c.note}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl p-4",
                        c.verified ? "bg-surface" : "border border-dashed border-amber-500/50 bg-amber-50/40",
                      )}
                    >
                      <span
                        aria-hidden
                        className="inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-full bg-white text-brand-blue ring-1 ring-line"
                      >
                        <Icon name={s.icon} className="size-5" />
                      </span>
                      <span className="font-semibold leading-snug text-ink">{c.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-2xl bg-surface p-6 text-ink-soft">
                  Pronto compartiremos las empresas de este sector que confían en nosotros.
                </p>
              )}

              <Link href="/contacto" className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-blue hover:underline">
                Conversemos sobre tu empresa
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
