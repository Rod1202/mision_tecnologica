import { z } from "zod";

import type { LeadField } from "@/lib/validation/lead";

/**
 * "Encuentra tu solución" · perfil "Quiero que me asesoren": necesidad general, escala (sedes y usuarios)
 * y fecha y hora para una primera reunión exploratoria. Los datos B2B se validan con `leadSchema`.
 */

export const advisoryNeedOptions = [
  { value: "impresion", label: "Impresión" },
  { value: "computo", label: "Cómputo" },
  { value: "digitalizacion", label: "Digitalización" },
  { value: "audiovideo", label: "Audio y video" },
  { value: "no-se", label: "Aún no lo sé" },
] as const;
export type AdvisoryNeed = (typeof advisoryNeedOptions)[number]["value"];

/** Horarios de atención para la reunión exploratoria (lunes a viernes). */
export const meetingSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"] as const;

const needValues = advisoryNeedOptions.map((o) => o.value) as [AdvisoryNeed, ...AdvisoryNeed[]];

/** Fecha local de Lima (UTC−5, sin horario de verano) en formato AAAA-MM-DD. */
export function limaToday(now = new Date()) {
  return new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function isWeekday(iso: string) {
  const day = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return day !== 0 && day !== 6;
}

export const advisorySchema = z.object({
  needs: z.array(z.enum(needValues)).min(1, "Elige al menos una necesidad.").max(needValues.length),
  sites: z.coerce.number({ message: "Indica el número de sedes." }).int("Usa un número entero.").min(1, "Mínimo 1 sede.").max(500, "Máximo 500."),
  users: z.coerce.number({ message: "Indica la cantidad de usuarios." }).int("Usa un número entero.").min(1, "Mínimo 1 usuario.").max(100_000, "Revisa la cantidad."),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha.")
    .refine((d) => d > limaToday(), "Elige una fecha a partir de mañana.")
    .refine(isWeekday, "Elige un día de lunes a viernes."),
  time: z.enum(meetingSlots, { message: "Elige un horario." }),
  message: z.string().trim().max(2000, "Máximo 2000 caracteres.").optional().or(z.literal("")),
});

export type AdvisoryOwnField = keyof z.infer<typeof advisorySchema>;
export type AdvisoryField = LeadField | AdvisoryOwnField;

export type AdvisoryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<AdvisoryField, string>>;
  values?: Partial<Record<Exclude<AdvisoryField, "needs">, string>> & { needs?: string[] };
};
