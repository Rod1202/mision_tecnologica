import { z } from "zod";

export const needOptions = [
  { value: "outsourcing", label: "Outsourcing tecnológico" },
  { value: "impresion", label: "Impresión empresarial" },
  { value: "implementacion", label: "Implementación y despliegue" },
  { value: "soporte", label: "Soporte y continuidad" },
  { value: "cotizacion", label: "Solicitud de cotización" },
  { value: "otra", label: "Otra necesidad" },
] as const;

const needValues = needOptions.map((o) => o.value) as [string, ...string[]];

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Ingresa tu nombre y apellidos.").max(120, "Máximo 120 caracteres."),
  company: z.string().trim().min(2, "Ingresa el nombre de tu empresa.").max(120, "Máximo 120 caracteres."),
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido.").max(160),
  phone: z
    .string()
    .trim()
    .max(30, "Máximo 30 caracteres.")
    .regex(/^[+\d\s()-]*$/, "Usa solo números, espacios y los signos + ( ) -.")
    .optional()
    .or(z.literal("")),
  need: z.enum(needValues, { message: "Selecciona el tipo de necesidad." }),
  message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres).").max(2000, "Máximo 2000 caracteres."),
  consent: z.literal("on", { message: "Necesitamos tu autorización para responderte." }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  /** Valores enviados, para no perder lo escrito si hay errores. */
  values?: Partial<Record<ContactField, string>>;
};
