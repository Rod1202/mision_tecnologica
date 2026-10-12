import { z } from "zod";

export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const CV_ACCEPT = "application/pdf";

export const applicationSchema = z.object({
  job: z.string().trim().min(1).max(120),
  name: z.string().trim().min(3, "Ingresa tu nombre y apellidos.").max(120, "Máximo 120 caracteres."),
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido.").max(160),
  phone: z
    .string()
    .trim()
    .min(6, "Ingresa un teléfono de contacto.")
    .max(30, "Máximo 30 caracteres.")
    .regex(/^[+\d\s()-]+$/, "Usa solo números, espacios y los signos + ( ) -."),
  linkedin: z
    .string()
    .trim()
    .max(200)
    .refine((v) => v === "" || /^https?:\/\/([\w-]+\.)?linkedin\.com\//i.test(v), "Ingresa la URL de tu perfil de LinkedIn.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(1500, "Máximo 1500 caracteres.").optional().or(z.literal("")),
  consent: z.literal("on", { message: "Necesitamos tu autorización para evaluar tu postulación." }),
});

export type ApplicationField = keyof z.infer<typeof applicationSchema> | "cv";

export type ApplicationState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ApplicationField, string>>;
  values?: Partial<Record<ApplicationField, string>>;
};

/** Valida el CV: PDF real (firma %PDF) y tamaño máximo. */
export async function validateCv(file: FormDataEntryValue | null): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return "Adjunta tu CV en PDF.";
  if (file.size > CV_MAX_BYTES) return "El CV no debe superar los 5 MB.";
  const isPdfName = /\.pdf$/i.test(file.name);
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const isPdfMagic = String.fromCharCode(...head).startsWith("%PDF");
  if (!isPdfName || !isPdfMagic) return "El CV debe ser un archivo PDF.";
  return null;
}
