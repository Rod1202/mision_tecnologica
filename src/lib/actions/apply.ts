"use server";

import { headers } from "next/headers";

import { getJob } from "@/lib/content/jobs";
import {
  applicationSchema,
  validateCv,
  type ApplicationField,
  type ApplicationState,
} from "@/lib/validation/application";

/**
 * Recepción de postulaciones.
 *
 * Estado actual (fase de desarrollo): valida datos y CV en servidor, filtra spam y limita la frecuencia,
 * pero TODAVÍA NO almacena la postulación ni el CV, y así se le informa al postulante.
 * Siguiente fase: colección `Applications` en Payload + CV en almacenamiento privado (no público)
 * con acceso restringido a RR. HH. y plazo de retención definido en la política de privacidad.
 */

const WINDOW_MS = 30 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

const APPLICATIONS_STORAGE_READY = false;

export async function submitApplication(_prev: ApplicationState, formData: FormData): Promise<ApplicationState> {
  const raw = {
    job: String(formData.get("job") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    linkedin: String(formData.get("linkedin") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") ? "on" : "",
  };

  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success", message: "Gracias. Recibimos tu postulación." };
  }

  const h = await headers();
  const ip = h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return { status: "error", message: "Recibimos varias postulaciones seguidas. Inténtalo de nuevo más tarde.", values: raw };
  }

  const errors: Partial<Record<ApplicationField, string>> = {};
  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ApplicationField;
      if (key && !errors[key]) errors[key] = issue.message;
    }
  }
  if (raw.job !== "general" && !getJob(raw.job)) errors.job = "La convocatoria no existe o ya no está activa.";

  const cvError = await validateCv(formData.get("cv"));
  if (cvError) errors.cv = cvError;

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Revisa los campos marcados.", errors, values: raw };
  }

  if (!APPLICATIONS_STORAGE_READY) {
    return {
      status: "success",
      message:
        "Bolsa de empleo en modo de pruebas: tus datos y tu CV se validaron correctamente, pero todavía no se almacenan ni se envían.",
    };
  }

  return { status: "success", message: "¡Gracias por postular! Revisaremos tu perfil y te contactaremos si avanzas en el proceso." };
}
