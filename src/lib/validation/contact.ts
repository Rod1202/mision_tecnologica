import { z } from "zod";

import { leadSchema } from "@/lib/validation/lead";

/**
 * Formulario de contacto simple (botón "Contáctanos"): para consultas generales.
 * Pide lo mínimo para responder a una empresa: nombre, apellido, empresa, correo corporativo y el mensaje.
 * El RUC y el dimensionamiento quedan para "Encuentra tu solución" (cotizador y asesoría).
 */

export const contactTopicOptions = [
  { value: "impresion", label: "Outsourcing de impresión" },
  { value: "computo", label: "Arrendamiento y venta de cómputo" },
  { value: "digitalizacion", label: "Digitalización documental" },
  { value: "infraestructura", label: "Infraestructura tecnológica" },
  { value: "otro", label: "Otro tema" },
] as const;

const topicValues = contactTopicOptions.map((o) => o.value) as [string, ...string[]];

export const contactSchema = leadSchema
  .pick({ firstName: true, lastName: true, company: true, email: true, phone: true, consent: true })
  .extend({
    topic: z.enum(topicValues).optional().or(z.literal("")),
    message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres).").max(2000, "Máximo 2000 caracteres."),
  });

export type ContactField = keyof z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};
