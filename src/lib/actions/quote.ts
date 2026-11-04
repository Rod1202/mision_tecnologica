"use server";

import { headers } from "next/headers";

import { buildQuoteSummary, estimateQuote } from "@/lib/quote";
import { quoteContactSchema, quoteStateSchema, type QuoteField, type QuoteRequestState } from "@/lib/validation/quote";

/**
 * Recepción de solicitudes del cotizador de proyecto.
 *
 * Estado actual (fase de desarrollo): valida contacto y configuración en servidor, recalcula la
 * estimación (no confía en el monto del navegador), filtra spam y limita la frecuencia, pero
 * TODAVÍA NO almacena ni envía la solicitud. Lo indica con claridad al usuario.
 * Siguiente fase: colección `Quotes` de Payload + notificación por correo con `buildQuoteSummary`.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

const QUOTES_STORAGE_READY = false;

export async function submitQuote(_prev: QuoteRequestState, formData: FormData): Promise<QuoteRequestState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") ? "on" : "",
  };

  // Honeypot: campo invisible para personas. Si viene lleno, se descarta en silencio.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success", message: "Gracias. Recibimos tu solicitud." };
  }

  const h = await headers();
  const ip = h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "Recibimos varias solicitudes seguidas. Espera unos minutos e inténtalo de nuevo.",
      values: raw,
    };
  }

  let quoteJson: unknown;
  try {
    quoteJson = JSON.parse(String(formData.get("quote") ?? ""));
  } catch {
    quoteJson = null;
  }
  const quote = quoteStateSchema.safeParse(quoteJson);
  if (!quote.success) {
    return { status: "error", message: "No pudimos leer la configuración del proyecto. Recarga la página e inténtalo otra vez.", values: raw };
  }
  if (quote.data.services.length === 0) {
    return { status: "error", message: "Elige al menos un servicio (cómputo, impresión o digitalización).", values: raw };
  }

  const parsed = quoteContactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<QuoteField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as QuoteField;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", errors, values: raw };
  }

  // Lo que recibirá el área comercial cuando exista el almacenamiento.
  const summary = buildQuoteSummary(quote.data, estimateQuote(quote.data));

  if (!QUOTES_STORAGE_READY) {
    void summary;
    return {
      status: "success",
      message:
        "Cotizador en modo de pruebas: tu proyecto y tus datos se validaron correctamente, pero todavía no se almacenan ni se envían. Mientras tanto, envíanos el resumen con el botón de abajo o escríbenos a contacto@misiontecnologica.com.",
    };
  }

  return { status: "success", message: "Gracias. Un asesor revisará tu proyecto y te enviará la propuesta." };
}
