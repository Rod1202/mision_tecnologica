"use server";

import { isHoneypotFilled, isRateLimited } from "@/lib/server/guard";
import { contactSchema, type ContactField, type ContactState } from "@/lib/validation/contact";
import { fieldErrors } from "@/lib/validation/lead";

/**
 * Recepción del formulario de contacto simple.
 *
 * Estado actual (fase de desarrollo): valida en servidor, filtra spam y limita la frecuencia, pero
 * TODAVÍA NO almacena ni envía el mensaje. Lo indica con claridad al usuario.
 * Siguiente fase: colección `Leads` de Payload + notificación a contacto@misiontecnologica.com.
 */

const CONTACT_STORAGE_READY = false;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values: Record<ContactField, string> = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    topic: String(formData.get("topic") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") ? "on" : "",
  };

  if (isHoneypotFilled(formData)) {
    return { status: "success", message: "Gracias. Recibimos tu mensaje." };
  }
  if (await isRateLimited("contact")) {
    return { status: "error", message: "Recibimos varios mensajes seguidos. Espera unos minutos e inténtalo de nuevo.", values };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos marcados.", errors: fieldErrors<ContactField>(parsed.error.issues), values };
  }

  if (!CONTACT_STORAGE_READY) {
    return {
      status: "success",
      message:
        "Formulario en modo de pruebas: tus datos se validaron correctamente, pero todavía no se almacenan ni se envían. Mientras tanto, escríbenos a contacto@misiontecnologica.com o llámanos al 919 280 810.",
    };
  }

  return { status: "success", message: `Gracias, ${parsed.data.firstName}. Un asesor te responderá por correo a la brevedad.` };
}
