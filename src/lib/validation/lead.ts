import { z } from "zod";

/**
 * Datos B2B obligatorios para cualquier cotización o asesoría (filtro de leads calificados):
 * correo corporativo real, empresa, RUC, nombre y apellido. El teléfono es opcional.
 */

/** Proveedores de correo gratuito: no se aceptan como correo corporativo. */
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.es",
  "outlook.com",
  "outlook.es",
  "live.com",
  "live.com.pe",
  "msn.com",
  "yahoo.com",
  "yahoo.es",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "gmx.es",
  "mail.com",
  "yandex.com",
  "zoho.com",
]);

export function isFreeEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase().trim() ?? "";
  return FREE_EMAIL_DOMAINS.has(domain) || /^(yahoo|hotmail|outlook|live)\.[a-z.]+$/.test(domain);
}

/**
 * RUC peruano: 11 dígitos, prefijo de contribuyente válido (10 persona natural, 15/16/17 otros,
 * 20 persona jurídica) y dígito verificador (módulo 11 con pesos 5-4-3-2-7-6-5-4-3-2).
 */
export function isValidRuc(ruc: string) {
  if (!/^\d{11}$/.test(ruc)) return false;
  if (!["10", "15", "16", "17", "20"].includes(ruc.slice(0, 2))) return false;
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((n, w, i) => n + w * Number(ruc[i]), 0);
  const check = 11 - (sum % 11);
  const expected = check === 10 ? 0 : check === 11 ? 1 : check;
  return expected === Number(ruc[10]);
}

export const leadSchema = z.object({
  firstName: z.string().trim().min(2, "Ingresa tu nombre.").max(60, "Máximo 60 caracteres."),
  lastName: z.string().trim().min(2, "Ingresa tu apellido.").max(80, "Máximo 80 caracteres."),
  company: z.string().trim().min(2, "Ingresa el nombre de tu empresa.").max(120, "Máximo 120 caracteres."),
  ruc: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s|-/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{11}$/, "El RUC tiene 11 dígitos.")
        .refine(isValidRuc, "Revisa el RUC: no es un número válido."),
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ingresa un correo válido.")
    .max(160)
    .refine((v) => !isFreeEmail(v), "Usa tu correo corporativo (no Gmail, Hotmail, Outlook u otros correos personales)."),
  phone: z
    .string()
    .trim()
    .max(30, "Máximo 30 caracteres.")
    .regex(/^[+\d\s()-]*$/, "Usa solo números, espacios y los signos + ( ) -.")
    .optional()
    .or(z.literal("")),
  consent: z.literal("on", { message: "Necesitamos tu autorización para responderte." }),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadField = keyof LeadInput;

export const leadFields: LeadField[] = ["firstName", "lastName", "company", "ruc", "email", "phone", "consent"];

/** Lee los campos del lead desde un FormData (el consentimiento llega como casilla). */
export function readLead(formData: FormData): Record<LeadField, string> {
  return {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    company: String(formData.get("company") ?? ""),
    ruc: String(formData.get("ruc") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    consent: formData.get("consent") ? "on" : "",
  };
}

/** Errores de zod → { campo: primer mensaje }. */
export function fieldErrors<F extends string>(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Partial<Record<F, string>> = {};
  for (const issue of issues) {
    const key = issue.path[0] as F;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
