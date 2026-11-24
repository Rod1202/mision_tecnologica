"use server";

import { getProduct } from "@/lib/content/products";
import { buildQuoteSummary } from "@/lib/quote";
import { isHoneypotFilled, isRateLimited } from "@/lib/server/guard";
import { fieldErrors, leadSchema, readLead } from "@/lib/validation/lead";
import { catalogItemsSchema, quoteExtraSchema, quoteStateSchema, type QuoteField, type QuoteRequestState } from "@/lib/validation/quote";

/**
 * Recepción de solicitudes "Sé lo que necesito" (cotizador de proyecto).
 *
 * Estado actual (fase de desarrollo): valida en servidor los datos B2B (correo corporativo, empresa,
 * RUC, nombre y apellido), la configuración del proyecto y los equipos del catálogo; filtra spam y
 * limita la frecuencia, pero TODAVÍA NO almacena ni envía la solicitud. Lo indica con claridad.
 * Siguiente fase: colección `Quotes` de Payload + notificación por correo con `buildQuoteSummary`.
 */

const QUOTES_STORAGE_READY = false;

function parseJson(value: FormDataEntryValue | null) {
  try {
    return JSON.parse(String(value ?? ""));
  } catch {
    return null;
  }
}

export async function submitQuote(_prev: QuoteRequestState, formData: FormData): Promise<QuoteRequestState> {
  const raw = { ...readLead(formData), message: String(formData.get("message") ?? "") };

  if (isHoneypotFilled(formData)) {
    return { status: "success", message: "Gracias. Recibimos tu solicitud." };
  }
  if (await isRateLimited("quote")) {
    return { status: "error", message: "Recibimos varias solicitudes seguidas. Espera unos minutos e inténtalo de nuevo.", values: raw };
  }

  const quote = quoteStateSchema.safeParse(parseJson(formData.get("quote")));
  const items = catalogItemsSchema.safeParse(parseJson(formData.get("items")) ?? []);
  if (!quote.success || !items.success) {
    return { status: "error", message: "No pudimos leer la configuración del proyecto. Recarga la página e inténtalo otra vez.", values: raw };
  }
  const catalog = items.data.filter((i) => getProduct(i.slug));
  if (quote.data.services.length === 0 && catalog.length === 0) {
    return { status: "error", message: "Elige al menos un servicio o agrega equipos del catálogo.", values: raw };
  }

  const lead = leadSchema.safeParse(raw);
  const extra = quoteExtraSchema.safeParse(raw);
  if (!lead.success || !extra.success) {
    const errors = {
      ...(lead.success ? {} : fieldErrors<QuoteField>(lead.error.issues)),
      ...(extra.success ? {} : fieldErrors<QuoteField>(extra.error.issues)),
    };
    return { status: "error", message: "Revisa los campos marcados.", errors, values: raw };
  }

  // Lo que recibirá el área comercial cuando exista el almacenamiento.
  const summary = buildQuoteSummary(quote.data, catalog);

  if (!QUOTES_STORAGE_READY) {
    void summary;
    return {
      status: "success",
      message:
        "Formulario en modo de pruebas: tu proyecto y tus datos se validaron correctamente, pero todavía no se almacenan ni se envían. Mientras tanto, escríbenos a contacto@misiontecnologica.com.",
    };
  }

  return { status: "success", message: "Gracias. Un asesor revisará tu proyecto y te enviará la propuesta." };
}
