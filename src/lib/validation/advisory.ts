import { z } from "zod";

import { advisoryNeedOptions, isWeekday, limaToday, meetingSlots, type AdvisoryNeed } from "@/lib/validation/advisory-options";
import type { LeadField } from "@/lib/validation/lead";

export { advisoryNeedOptions, isWeekday, limaToday, meetingSlots, type AdvisoryNeed };

/**
 * "Encuentra tu solución" · perfil "Quiero que me asesoren": necesidad general, escala (sedes y usuarios)
 * y fecha y hora para una primera reunión exploratoria. Los datos B2B se validan con `leadSchema`.
 */

const needValues = advisoryNeedOptions.map((o) => o.value) as [AdvisoryNeed, ...AdvisoryNeed[]];

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
