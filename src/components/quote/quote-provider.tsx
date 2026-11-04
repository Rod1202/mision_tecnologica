"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { serviceIds, type ServiceId } from "@/lib/content/quote";
import { defaultQuote, estimateQuote, type Estimate, type QuoteState } from "@/lib/quote";
import { quoteStateSchema } from "@/lib/validation/quote";

/**
 * Estado del cotizador, compartido entre el selector de la cabecera y el área de configuración.
 * - Borrador en el navegador (puede no estar disponible: modo privado, bloqueos…; funciona igual en memoria).
 * - `?servicio=impresion,computo` preselecciona servicios (lo usan los botones del sitio).
 */

type Section = "project" | "computo" | "impresion" | "digitalizacion";

type QuoteCtx = {
  quote: QuoteState;
  estimate: Estimate;
  hydrated: boolean;
  toggleService: (id: ServiceId, on?: boolean) => void;
  patch: <S extends Section>(section: S, value: Partial<QuoteState[S]>) => void;
  reset: () => void;
};

const STORAGE_KEY = "mt-cotizador-v1";
const Ctx = createContext<QuoteCtx | null>(null);

const isServiceId = (v: string): v is ServiceId => (serviceIds as readonly string[]).includes(v);
/** Orden fijo de los servicios, sin importar en qué orden se eligieron. */
const ordered = (ids: Iterable<ServiceId>) => {
  const set = new Set(ids);
  return serviceIds.filter((id) => set.has(id));
};

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [quote, setQuote] = useState<QuoteState>(defaultQuote);
  const [hydrated, setHydrated] = useState(false);
  const skipFirstSave = useRef(true);
  const restored = useRef(false);

  useEffect(() => {
    // Una sola restauración (el modo estricto ejecuta el efecto dos veces y la URL ya se limpió en la primera).
    if (restored.current) return;
    restored.current = true;
    let next = defaultQuote;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = quoteStateSchema.safeParse(JSON.parse(raw));
        if (parsed.success) next = parsed.data;
      }
    } catch {
      /* sin persistencia */
    }
    const fromUrl = (new URLSearchParams(window.location.search).get("servicio") ?? "").split(",").filter(isServiceId);
    if (fromUrl.length) {
      next = { ...next, services: ordered([...next.services, ...fromUrl]) };
      // Se aplica una sola vez: si el usuario luego quita el servicio, recargar no debe volver a agregarlo.
      try {
        window.history.replaceState(window.history.state, "", window.location.pathname + window.location.hash);
      } catch {
        /* ignorar */
      }
    }
    setQuote(next);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
    } catch {
      /* ignorar */
    }
  }, [quote, hydrated]);

  const toggleService = useCallback((id: ServiceId, on?: boolean) => {
    setQuote((q) => {
      const has = q.services.includes(id);
      const want = on ?? !has;
      if (want === has) return q;
      return { ...q, services: want ? ordered([...q.services, id]) : q.services.filter((s) => s !== id) };
    });
  }, []);

  const patch = useCallback(<S extends Section>(section: S, value: Partial<QuoteState[S]>) => {
    setQuote((q) => ({ ...q, [section]: { ...q[section], ...value } }));
  }, []);

  const reset = useCallback(() => setQuote(defaultQuote), []);

  const estimate = useMemo(() => estimateQuote(quote), [quote]);
  const value = useMemo<QuoteCtx>(
    () => ({ quote, estimate, hydrated, toggleService, patch, reset }),
    [quote, estimate, hydrated, toggleService, patch, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Mueve el foco tras el próximo render (el elemento puede no existir todavía). */
export function focusSoon(id: string) {
  requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(id)?.focus()));
}

export function useQuote() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuote debe usarse dentro de QuoteProvider");
  return ctx;
}
