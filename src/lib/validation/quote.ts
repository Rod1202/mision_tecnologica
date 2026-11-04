import { z } from "zod";

import {
  computoExtraOptions,
  computoModeOptions,
  docTypeOptions,
  limits,
  locationOptions,
  printExtraOptions,
  printFormatOptions,
  printModeOptions,
  profileOptions,
  scanLocationOptions,
  scanServiceOptions,
  scanUnitOptions,
  serviceIds,
  startOptions,
  termOptions,
  urgencyOptions,
} from "@/lib/content/quote";
import type { QuoteState } from "@/lib/quote";
import { contactSchema } from "@/lib/validation/contact";

const values = <T extends readonly { value: string }[]>(o: T) => o.map((x) => x.value) as unknown as [T[number]["value"], ...T[number]["value"][]];
const int = (min: number, max: number) => z.number().int().min(min).max(max);
const unique = <T extends z.ZodType>(item: T) => z.array(item).max(10).transform((a) => Array.from(new Set(a)));

/** Forma del cotizador. Se usa para restaurar el borrador del navegador y para validar en servidor. */
export const quoteStateSchema = z.object({
  services: unique(z.enum(serviceIds)).pipe(z.array(z.enum(serviceIds)).max(3)),
  project: z.object({
    sites: int(limits.sites.min, limits.sites.max),
    location: z.enum(values(locationOptions)),
    term: z.union([z.literal(12), z.literal(24), z.literal(36)]).refine((t) => termOptions.some((o) => o.value === t)),
    start: z.enum(values(startOptions)),
  }),
  computo: z.object({
    devices: z.object({
      laptop: int(limits.devices.min, limits.devices.max),
      desktop: int(limits.devices.min, limits.devices.max),
      workstation: int(limits.devices.min, limits.devices.max),
    }),
    profile: z.enum(values(profileOptions)),
    mode: z.enum(values(computoModeOptions)),
    extras: unique(z.enum(values(computoExtraOptions))),
  }),
  impresion: z.object({
    pages: int(limits.printPages.min, limits.printPages.max),
    color: int(0, 100),
    format: z.enum(values(printFormatOptions)),
    mode: z.enum(values(printModeOptions)),
    devices: int(limits.printDevices.min, limits.printDevices.max).nullable(),
    extras: unique(z.enum(values(printExtraOptions))),
  }),
  digitalizacion: z.object({
    unit: z.enum(values(scanUnitOptions)),
    amount: int(1, limits.scanPages.max),
    docType: z.enum(values(docTypeOptions)),
    location: z.enum(values(scanLocationOptions)),
    services: unique(z.enum(values(scanServiceOptions))),
    urgency: z.enum(values(urgencyOptions)),
  }),
}) satisfies z.ZodType<QuoteState, unknown>;

/** Datos de contacto de la solicitud: los mismos criterios que el formulario de asesoría. */
export const quoteContactSchema = contactSchema
  .pick({ name: true, company: true, email: true, phone: true, consent: true })
  .extend({
    message: z.string().trim().max(2000, "Máximo 2000 caracteres.").optional().or(z.literal("")),
  });

export type QuoteContactInput = z.infer<typeof quoteContactSchema>;
export type QuoteField = keyof QuoteContactInput;

export type QuoteRequestState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<QuoteField, string>>;
  values?: Partial<Record<QuoteField, string>>;
};
