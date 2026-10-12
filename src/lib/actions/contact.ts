"use server";

import { headers } from "next/headers";

import { contactSchema, type ContactField, type ContactState } from "@/lib/validation/contact";

/**
 * Recepción de solicitudes de asesoría.
 *
 * Estado actual (fase de desarrollo): valida en servidor, filtra spam y limita la frecuencia,
 * pero TODAVÍA NO almacena ni envía la solicitud. Lo indica con claridad al usuario.
 * Siguiente fase: guardar en la colección `Leads` de Payload y notificar por correo.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Límite en memoria: suficiente para desarrollo. En Netlify (serverless) y en el VPS
// se reemplazará por un límite persistente (base de datos o proxy inverso).
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

const LEADS_STORAGE_READY = false;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    need: String(formData.get("need") ?? ""),
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

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", errors, values: raw };
  }

  if (!LEADS_STORAGE_READY) {
    return {
      status: "success",
      message:
        "Formulario en modo de pruebas: tus datos se validaron correctamente, pero todavía no se almacenan ni se envían. Mientras tanto, escríbenos a contacto@misiontecnologica.com.",
    };
  }

  return { status: "success", message: "Gracias. Un asesor revisará tu solicitud y te contactará." };
}
