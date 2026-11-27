import {
  avNeedOptions,
  computoModeOptions,
  deviceOptions,
  docTypeOptions,
  getQuoteService,
  headsetFeatureOptions,
  headsetUserOptions,
  locationOptions,
  paperFormats,
  platformOptions,
  printFleetOptions,
  printModeOptions,
  profileOptions,
  roomDeviceOptions,
  scanLocationOptions,
  scanServiceOptions,
  scanTermOptions,
  scanUnitWords,
  startOptions,
  termOptions,
  type AvNeed,
  type ComputoMode,
  type DeviceType,
  type DocType,
  type HeadsetFeature,
  type HeadsetUser,
  type Location,
  type Option,
  type PaperFormat,
  type Platform,
  type PrintFleet,
  type PrintMode,
  type Profile,
  type RoomDevice,
  type ScanLocation,
  type ScanService,
  type ScanTerm,
  type ScanUnit,
  type ServiceId,
  type Start,
  type Term,
} from "@/lib/content/quote";
import { getProduct } from "@/lib/content/products";

/**
 * Motor del cotizador "Sé lo que necesito": estado, valores por defecto y resumen en texto.
 * Funciones puras (sin React) para que el navegador y el servidor describan la solicitud igual.
 * No calcula montos: la propuesta económica la prepara un asesor.
 */

export type RoomGroup = { rooms: number; users: number };
export type CatalogItem = { slug: string; qty: number };

export type QuoteState = {
  services: ServiceId[];
  project: { sites: number; location: Location; term: Term; start: Start };
  computo: { devices: Record<DeviceType, number>; profile: Profile; mode: ComputoMode };
  impresion: {
    fleet: PrintFleet;
    /** Cantidad de equipos actuales o estimados. */
    devices: number;
    /** Páginas al mes en blanco y negro y a color. */
    bwPages: number;
    colorPages: number;
    /** Páginas al mes por formato de papel (0 = no se usa). */
    formats: Record<PaperFormat, number>;
    mode: PrintMode;
  };
  digitalizacion: {
    unit: ScanUnit;
    /** Cantidad en la unidad elegida. */
    amount: number;
    docType: DocType;
    location: ScanLocation;
    services: ScanService[];
    term: ScanTerm;
  };
  audiovideo: {
    needs: AvNeed[];
    rooms: RoomGroup[];
    roomDevices: RoomDevice[];
    platform: Platform;
    headsets: number;
    headsetUser: HeadsetUser;
    headsetFeatures: HeadsetFeature[];
  };
};

export const defaultQuote: QuoteState = {
  services: [],
  project: { sites: 1, location: "lima", term: 24, start: "trimestre" },
  computo: {
    devices: { laptop: 20, desktop: 0, workstation: 0 },
    profile: "estandar",
    mode: "alquiler",
  },
  impresion: {
    fleet: "estimado",
    devices: 3,
    bwPages: 8_000,
    colorPages: 1_500,
    formats: { a4: 9_500, oficio: 0, a3: 0 },
    mode: "pagina",
  },
  digitalizacion: {
    unit: "cajas",
    amount: 40,
    docType: "expedientes",
    location: "centro",
    services: ["ocr", "indexacion"],
    term: "3m",
  },
  audiovideo: {
    needs: ["salas"],
    rooms: [{ rooms: 2, users: 10 }],
    roomDevices: ["camaras", "microfonos", "display"],
    platform: "teams",
    headsets: 20,
    headsetUser: "estandar",
    headsetFeatures: ["mic-anc"],
  },
};

/* ------------------------------------------------------------------ */
/* Derivados                                                            */
/* ------------------------------------------------------------------ */

const nf = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });
export const fmtInt = (n: number) => nf.format(n);

export function computoDeviceCount(c: QuoteState["computo"]) {
  return c.devices.laptop + c.devices.desktop + c.devices.workstation;
}

export function printTotal(p: QuoteState["impresion"]) {
  return p.bwPages + p.colorPages;
}

export function formatTotal(p: QuoteState["impresion"]) {
  return p.formats.a4 + p.formats.oficio + p.formats.a3;
}

/** Hojas aproximadas cuando la unidad tiene una equivalencia conocida (tomos y cajas). */
export function scanSheets(d: QuoteState["digitalizacion"]) {
  const per = scanUnitWords[d.unit].sheets;
  return per ? d.amount * per : null;
}

export function scanAmountLabel(d: QuoteState["digitalizacion"]) {
  const w = scanUnitWords[d.unit];
  return `${fmtInt(d.amount)} ${d.amount === 1 ? w.one : w.many}`;
}

/** Plazo del contrato: solo cómputo e impresión (digitalización tiene plazo propio; audio y video no lleva contrato). */
export function usesContractTerm(services: ServiceId[]) {
  return services.includes("computo") || services.includes("impresion");
}

export function labelOf<V extends string | number>(options: readonly Option<V>[], value: V) {
  return options.find((o) => o.value === value)?.label ?? String(value);
}

const labelsOf = <V extends string>(options: readonly Option<V>[], values: V[]) =>
  options.filter((o) => values.includes(o.value)).map((o) => o.label);

/* ------------------------------------------------------------------ */
/* Resumen en texto (panel, correo y notificación al área comercial)   */
/* ------------------------------------------------------------------ */

export function describeService(q: QuoteState, id: ServiceId): string[] {
  if (id === "computo") {
    const c = q.computo;
    const devices = deviceOptions
      .filter((d) => c.devices[d.value] > 0)
      .map((d) => `${fmtInt(c.devices[d.value])} ${d.label.toLowerCase()}`)
      .join(", ");
    return [
      `${devices || "Cantidad por definir"} · perfil ${labelOf(profileOptions, c.profile).toLowerCase()} · ${labelOf(computoModeOptions, c.mode).toLowerCase()}`,
    ];
  }

  if (id === "impresion") {
    const p = q.impresion;
    const formats = paperFormats.filter((f) => p.formats[f.value] > 0).map((f) => `${f.label} = ${fmtInt(p.formats[f.value])}`);
    return [
      `${fmtInt(p.devices)} ${p.devices === 1 ? "equipo" : "equipos"} (${labelOf(printFleetOptions, p.fleet).toLowerCase()})`,
      `${fmtInt(printTotal(p))} páginas al mes: ${fmtInt(p.bwPages)} B/N y ${fmtInt(p.colorPages)} color`,
      ...(formats.length ? [`Por formato: ${formats.join(" · ")}`] : []),
      `Modalidad: ${labelOf(printModeOptions, p.mode).toLowerCase()}`,
    ];
  }

  if (id === "digitalizacion") {
    const d = q.digitalizacion;
    const sheets = scanSheets(d);
    const services = labelsOf(scanServiceOptions, d.services);
    return [
      `${scanAmountLabel(d)}${sheets ? ` (≈ ${fmtInt(sheets)} hojas)` : ""} · ${labelOf(docTypeOptions, d.docType).toLowerCase()}`,
      `${labelOf(scanLocationOptions, d.location)} · plazo del servicio: ${labelOf(scanTermOptions, d.term).toLowerCase()}`,
      ...(services.length ? [`Después de escanear: ${services.join(", ")}`] : []),
    ];
  }

  const a = q.audiovideo;
  const lines: string[] = [];
  if (a.needs.includes("salas")) {
    const rooms = a.rooms.map((r) => `${fmtInt(r.rooms)} ${r.rooms === 1 ? "sala" : "salas"} de ${fmtInt(r.users)} usuarios`).join(" · ");
    const devices = labelsOf(roomDeviceOptions, a.roomDevices);
    lines.push(`Salas: ${rooms}`);
    lines.push(`Plataforma: ${labelOf(platformOptions, a.platform)}${devices.length ? ` · dispositivos: ${devices.join(", ").toLowerCase()}` : ""}`);
  }
  if (a.needs.includes("headsets")) {
    const features = labelsOf(headsetFeatureOptions, a.headsetFeatures);
    lines.push(
      `Headsets: ${fmtInt(a.headsets)} · usuario ${labelOf(headsetUserOptions, a.headsetUser).toLowerCase()}${features.length ? ` · ${features.join(", ").toLowerCase()}` : ""}`,
    );
  }
  return lines.length ? lines : [`Necesidad por definir (${labelsOf(avNeedOptions, a.needs).join(", ") || "salas o headsets"})`];
}

/** Equipos del catálogo agregados a la cotización. */
export function describeCatalogItems(items: CatalogItem[]) {
  return items.flatMap((l) => {
    const p = getProduct(l.slug);
    return p ? [`${fmtInt(l.qty)} × ${p.name}`] : [];
  });
}

export function projectLine(q: QuoteState) {
  const p = q.project;
  return [
    `Sedes: ${p.sites} (${labelOf(locationOptions, p.location).toLowerCase()})`,
    usesContractTerm(q.services) ? `Plazo del contrato: ${labelOf(termOptions, p.term)}` : null,
    `Inicio: ${labelOf(startOptions, p.start).toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function buildQuoteSummary(q: QuoteState, items: CatalogItem[] = []) {
  const blocks = q.services.map((id) =>
    [getQuoteService(id).title.toUpperCase(), ...describeService(q, id).map((l) => `• ${l}`)].join("\n"),
  );
  const catalog = describeCatalogItems(items);
  return [
    projectLine(q),
    ...blocks,
    catalog.length ? ["EQUIPOS DEL CATÁLOGO", ...catalog.map((l) => `• ${l}`)].join("\n") : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}
