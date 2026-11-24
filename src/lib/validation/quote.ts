import { z } from "zod";

import {
  avNeedOptions,
  computoExtraOptions,
  computoModeOptions,
  docTypeOptions,
  headsetFeatureOptions,
  headsetUserOptions,
  limits,
  locationOptions,
  platformOptions,
  printExtraOptions,
  printFleetOptions,
  printModeOptions,
  profileOptions,
  roomDeviceOptions,
  scanLocationOptions,
  scanServiceOptions,
  scanTermOptions,
  scanUnitOptions,
  serviceIds,
  startOptions,
  termOptions,
} from "@/lib/content/quote";
import type { QuoteState } from "@/lib/quote";
import type { LeadField } from "@/lib/validation/lead";

const values = <T extends readonly { value: string }[]>(o: T) => o.map((x) => x.value) as unknown as [T[number]["value"], ...T[number]["value"][]];
const int = (min: number, max: number) => z.number().int().min(min).max(max);
const unique = <T extends z.ZodType>(item: T) => z.array(item).max(10).transform((a) => Array.from(new Set(a)));

/** Forma del cotizador. Se usa para restaurar el borrador del navegador y para validar en servidor. */
export const quoteStateSchema = z.object({
  services: unique(z.enum(serviceIds)).pipe(z.array(z.enum(serviceIds)).max(serviceIds.length)),
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
    fleet: z.enum(values(printFleetOptions)),
    devices: int(limits.printDevices.min, limits.printDevices.max),
    bwPages: int(limits.printPages.min, limits.printPages.max),
    colorPages: int(limits.printPages.min, limits.printPages.max),
    formats: z.object({
      a4: int(limits.formatPages.min, limits.formatPages.max),
      oficio: int(limits.formatPages.min, limits.formatPages.max),
      a3: int(limits.formatPages.min, limits.formatPages.max),
    }),
    mode: z.enum(values(printModeOptions)),
    extras: unique(z.enum(values(printExtraOptions))),
  }),
  digitalizacion: z.object({
    unit: z.enum(values(scanUnitOptions)),
    amount: int(limits.scanAmount.min, limits.scanAmount.max),
    docType: z.enum(values(docTypeOptions)),
    location: z.enum(values(scanLocationOptions)),
    services: unique(z.enum(values(scanServiceOptions))),
    term: z.enum(values(scanTermOptions)),
  }),
  audiovideo: z.object({
    needs: unique(z.enum(values(avNeedOptions))),
    rooms: z
      .array(z.object({ rooms: int(limits.rooms.min, limits.rooms.max), users: int(limits.roomUsers.min, limits.roomUsers.max) }))
      .min(1)
      .max(limits.roomGroups.max),
    roomDevices: unique(z.enum(values(roomDeviceOptions))),
    platform: z.enum(values(platformOptions)),
    headsets: int(limits.headsets.min, limits.headsets.max),
    headsetUser: z.enum(values(headsetUserOptions)),
    headsetFeatures: unique(z.enum(values(headsetFeatureOptions))),
  }),
}) satisfies z.ZodType<QuoteState, unknown>;

/** Equipos del catálogo que acompañan la solicitud. */
export const catalogItemsSchema = z
  .array(z.object({ slug: z.string().min(1).max(120), qty: int(1, 99) }))
  .max(30);

export const quoteExtraSchema = z.object({
  message: z.string().trim().max(2000, "Máximo 2000 caracteres.").optional().or(z.literal("")),
});

export type QuoteField = LeadField | "message";

export type QuoteRequestState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<QuoteField, string>>;
  values?: Partial<Record<QuoteField, string>>;
};
