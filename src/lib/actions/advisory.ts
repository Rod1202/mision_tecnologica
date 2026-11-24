"use server";

import { isHoneypotFilled, isRateLimited } from "@/lib/server/guard";
import { advisoryNeedOptions, advisorySchema, type AdvisoryField, type AdvisoryState } from "@/lib/validation/advisory";
import { fieldErrors, leadSchema, readLead } from "@/lib/validation/lead";

/**
 * Recepción de solicitudes "Quiero que me asesoren" (reunión exploratoria).
 *
 * Estado actual (fase de desarrollo): valida en servidor, filtra spam y limita la frecuencia, pero
 * TODAVÍA NO almacena, no agenda y no envía la solicitud. Lo indica con claridad al usuario.
 * Siguiente fase: colección `Leads` de Payload + notificación por correo (y, si se decide, agenda en
 * Microsoft Bookings o similar).
 */

const ADVISORY_STORAGE_READY = false;

export async function submitAdvisory(_prev: AdvisoryState, formData: FormData): Promise<AdvisoryState> {
  const lead = readLead(formData);
  const own = {
    needs: formData.getAll("needs").map(String),
    sites: String(formData.get("sites") ?? ""),
    users: String(formData.get("users") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const values = { ...lead, ...own };

  if (isHoneypotFilled(formData)) {
    return { status: "success", message: "Gracias. Recibimos tu solicitud." };
  }
  if (await isRateLimited("advisory")) {
    return { status: "error", message: "Recibimos varias solicitudes seguidas. Espera unos minutos e inténtalo de nuevo.", values };
  }

  const leadResult = leadSchema.safeParse(lead);
  const ownResult = advisorySchema.safeParse(own);
  if (!leadResult.success || !ownResult.success) {
    const errors = {
      ...(leadResult.success ? {} : fieldErrors<AdvisoryField>(leadResult.error.issues)),
      ...(ownResult.success ? {} : fieldErrors<AdvisoryField>(ownResult.error.issues)),
    };
    return { status: "error", message: "Revisa los campos marcados.", errors, values };
  }

  const a = ownResult.data;
  const needs = advisoryNeedOptions.filter((o) => a.needs.includes(o.value)).map((o) => o.label);
  const when = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(`${a.date}T12:00:00Z`),
  );

  // Lo que recibirá el área comercial cuando exista el almacenamiento.
  const summary = [
    `Necesidad: ${needs.join(", ")}`,
    `Sedes: ${a.sites} · Usuarios: ${a.users}`,
    `Reunión exploratoria propuesta: ${when}, ${a.time} (hora de Lima)`,
    a.message ? `Comentario: ${a.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  if (!ADVISORY_STORAGE_READY) {
    void summary;
    return {
      status: "success",
      message: `Formulario en modo de pruebas: tus datos y la reunión propuesta (${when}, ${a.time}) se validaron correctamente, pero todavía no se almacenan ni se agendan. Mientras tanto, escríbenos a contacto@misiontecnologica.com.`,
    };
  }

  return { status: "success", message: `Gracias. Un asesor confirmará la reunión del ${when} a las ${a.time} por correo.` };
}
