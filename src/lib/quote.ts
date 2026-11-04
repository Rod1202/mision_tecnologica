import {
  SHEETS_PER_BOX,
  computoExtraOptions,
  computoModeOptions,
  deviceOptions,
  docTypeOptions,
  getQuoteService,
  locationOptions,
  printExtraOptions,
  printFormatOptions,
  printModeOptions,
  profileOptions,
  rates,
  ratesAreDemo,
  scanLocationOptions,
  scanServiceOptions,
  startOptions,
  termOptions,
  urgencyOptions,
  type ComputoExtra,
  type ComputoMode,
  type DeviceType,
  type DocType,
  type Location,
  type Option,
  type PrintExtra,
  type PrintFormat,
  type PrintMode,
  type Profile,
  type ScanLocation,
  type ScanService,
  type ScanUnit,
  type ServiceId,
  type Start,
  type Term,
  type Urgency,
} from "@/lib/content/quote";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

/**
 * Motor del cotizador: funciones puras (sin React) para que el navegador muestre la estimación
 * en vivo y el servidor la recalcule al recibir la solicitud, sin confiar en lo que envía el cliente.
 */

export type QuoteState = {
  services: ServiceId[];
  project: { sites: number; location: Location; term: Term; start: Start };
  computo: { devices: Record<DeviceType, number>; profile: Profile; mode: ComputoMode; extras: ComputoExtra[] };
  impresion: {
    pages: number;
    /** Porcentaje de páginas a color (0–100). */
    color: number;
    format: PrintFormat;
    mode: PrintMode;
    /** `null` = cantidad sugerida automáticamente según el volumen y las sedes. */
    devices: number | null;
    extras: PrintExtra[];
  };
  digitalizacion: {
    unit: ScanUnit;
    /** Cantidad en la unidad elegida (páginas o cajas). */
    amount: number;
    docType: DocType;
    location: ScanLocation;
    services: ScanService[];
    urgency: Urgency;
  };
};

export const defaultQuote: QuoteState = {
  services: [],
  project: { sites: 1, location: "lima", term: 24, start: "trimestre" },
  computo: {
    devices: { laptop: 20, desktop: 0, workstation: 0 },
    profile: "estandar",
    mode: "alquiler",
    extras: ["soporte"],
  },
  impresion: { pages: 10_000, color: 15, format: "a4", mode: "outsourcing", devices: null, extras: ["monitoreo"] },
  digitalizacion: {
    unit: "cajas",
    amount: 40,
    docType: "expedientes",
    location: "centro",
    services: ["ocr", "indexacion"],
    urgency: "estandar",
  },
};

/* ------------------------------------------------------------------ */
/* Derivados                                                            */
/* ------------------------------------------------------------------ */

export function suggestedPrintDevices(pages: number, sites: number) {
  const { pagesPerDevice, minPagesPerSite } = rates.impresion;
  const byVolume = Math.ceil(pages / pagesPerDevice);
  const bySite = Math.min(sites, Math.floor(pages / minPagesPerSite));
  return Math.max(1, byVolume, bySite);
}

export function printDevices(q: QuoteState) {
  return q.impresion.devices ?? suggestedPrintDevices(q.impresion.pages, q.project.sites);
}

export function scanPages(d: QuoteState["digitalizacion"]) {
  return d.unit === "cajas" ? d.amount * SHEETS_PER_BOX[d.docType] : d.amount;
}

export function scanBoxes(d: QuoteState["digitalizacion"]) {
  return d.unit === "cajas" ? d.amount : Math.max(1, Math.ceil(d.amount / SHEETS_PER_BOX[d.docType]));
}

/** Días hábiles estimados de captura (urgente = dos estaciones o doble turno). */
export function scanWorkdays(d: QuoteState["digitalizacion"]) {
  const perDay = rates.digitalizacion.pagesPerDay[d.docType] * (d.urgency === "urgente" ? 2 : 1);
  return Math.max(1, Math.ceil(scanPages(d) / perDay));
}

export function computoDeviceCount(c: QuoteState["computo"]) {
  return c.devices.laptop + c.devices.desktop + c.devices.workstation;
}

/* ------------------------------------------------------------------ */
/* Estimación                                                           */
/* ------------------------------------------------------------------ */

export type EstimateLine = { label: string; monthly: number; oneTime: number; note?: string };
export type ServiceEstimate = {
  service: ServiceId;
  monthly: number;
  oneTime: number;
  lines: EstimateLine[];
  /** Datos derivados que ayudan a entender la estimación (equipos sugeridos, plazo, etc.). */
  facts: { label: string; value: string }[];
  /** El servicio está elegido pero falta información para estimarlo. */
  incomplete?: string;
};
export type Estimate = {
  services: ServiceEstimate[];
  deployment: number;
  monthly: number;
  oneTime: number;
  /** Cuotas mensuales por el plazo del contrato + pagos únicos. */
  total: number;
  term: Term;
  demo: boolean;
};

const nf = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });
const fmtInt = (n: number) => nf.format(n);

function line(label: string, monthly: number, oneTime: number, note?: string): EstimateLine {
  return { label, monthly, oneTime, note };
}

function estimateComputo(q: QuoteState): ServiceEstimate {
  const c = q.computo;
  const r = rates.computo;
  const tf = rates.termFactor[q.project.term];
  const pf = r.profileFactor[c.profile];
  const count = computoDeviceCount(c);
  const lines: EstimateLine[] = [];

  if (count === 0) {
    return { service: "computo", monthly: 0, oneTime: 0, lines, facts: [], incomplete: "Indica cuántos equipos necesitas." };
  }

  for (const d of deviceOptions) {
    const n = c.devices[d.value];
    if (!n) continue;
    if (c.mode === "alquiler") lines.push(line(`${fmtInt(n)} ${d.label.toLowerCase()}`, n * r.rentPerMonth[d.value] * pf * tf, 0));
    else lines.push(line(`${fmtInt(n)} ${d.label.toLowerCase()}`, 0, n * r.purchase[d.value] * pf));
  }
  if (c.extras.includes("soporte")) lines.push(line("Mesa de ayuda y soporte en sitio", count * r.soportePerDeviceMonth, 0));
  if (c.extras.includes("gestion")) lines.push(line("Gestión remota y antivirus", count * r.gestionPerDeviceMonth, 0));
  if (c.extras.includes("imagen")) lines.push(line("Imagen y configuración inicial", 0, count * r.imagenPerDevice));
  if (c.extras.includes("perifericos")) {
    lines.push(
      c.mode === "alquiler"
        ? line("Monitor, teclado y mouse", count * r.perifericos.rentPerMonth * tf, 0)
        : line("Monitor, teclado y mouse", 0, count * r.perifericos.purchase),
    );
  }

  return {
    service: "computo",
    ...sum(lines),
    lines,
    facts: [
      { label: "Equipos", value: fmtInt(count) },
      { label: "Perfil", value: labelOf(profileOptions, c.profile) },
    ],
  };
}

function estimateImpresion(q: QuoteState): ServiceEstimate {
  const p = q.impresion;
  const r = rates.impresion;
  const tf = rates.termFactor[q.project.term];
  const devices = printDevices(q);
  const colorShare = p.color / 100;
  const bwPages = p.pages * (1 - colorShare);
  const colorPages = p.pages * colorShare;
  const a3 = p.format === "a3" ? r.a3Factor : 1;
  const deviceColor = p.color > 0 ? r.colorDeviceFactor : 1;
  const lines: EstimateLine[] = [];

  if (p.mode === "outsourcing") {
    lines.push(line(`${fmtInt(p.pages)} páginas al mes`, (bwPages * r.outsourcing.bwPage + colorPages * r.outsourcing.colorPage) * a3, 0));
    lines.push(line(`Cuota de servicio · ${devices} ${devices === 1 ? "equipo" : "equipos"}`, devices * r.outsourcing.feePerDeviceMonth * tf, 0));
  } else if (p.mode === "alquiler") {
    lines.push(line(`Alquiler · ${devices} ${devices === 1 ? "equipo" : "equipos"}`, devices * r.alquiler.perDeviceMonth * a3 * deviceColor * tf, 0));
    lines.push(line("Consumibles estimados", bwPages * r.alquiler.bwPage + colorPages * r.alquiler.colorPage, 0));
  } else {
    lines.push(line(`Compra · ${devices} ${devices === 1 ? "equipo" : "equipos"}`, 0, devices * r.compra.perDevice * a3 * deviceColor));
    lines.push(line("Consumibles estimados", bwPages * r.compra.bwPage + colorPages * r.compra.colorPage, 0));
  }
  if (p.extras.includes("segura")) {
    lines.push(line("Impresión segura con PIN o tarjeta", devices * r.segura.perDeviceMonth, devices * r.segura.perDevice));
  }
  if (p.extras.includes("monitoreo")) {
    lines.push(
      p.mode === "outsourcing"
        ? line("Monitoreo y reportes de volumetría", 0, 0, "Incluido")
        : line("Monitoreo y reportes de volumetría", devices * r.monitoreoPerDeviceMonth, 0),
    );
  }

  return {
    service: "impresion",
    ...sum(lines),
    lines,
    facts: [
      { label: p.devices === null ? "Equipos sugeridos" : "Equipos", value: fmtInt(devices) },
      { label: "Color", value: `${p.color}%` },
    ],
  };
}

function estimateDigitalizacion(q: QuoteState): ServiceEstimate {
  const d = q.digitalizacion;
  const r = rates.digitalizacion;
  const pages = scanPages(d);
  const boxes = scanBoxes(d);
  const urgent = d.urgency === "urgente" ? r.urgentFactor : 1;
  const region = q.project.location === "lima" ? 1 : r.provinciasFactor;
  const lines: EstimateLine[] = [];

  if (pages <= 0) {
    return { service: "digitalizacion", monthly: 0, oneTime: 0, lines, facts: [], incomplete: "Indica el volumen a digitalizar." };
  }

  const unit = d.docType === "planos" ? "planos" : "páginas";
  lines.push(line(`Captura de ${fmtInt(pages)} ${unit}`, 0, pages * r.perPage[d.docType] * urgent * region));
  for (const s of scanServiceOptions) {
    if (d.services.includes(s.value)) lines.push(line(s.label, 0, pages * r.services[s.value] * urgent));
  }
  if (d.services.includes("gestor")) lines.push(line("Configuración del gestor documental", 0, r.gestorSetup));
  lines.push(
    d.location === "sitio"
      ? line("Estación de captura en tus instalaciones", 0, r.sitioSetup * (d.urgency === "urgente" ? 2 : 1) * region)
      : line(`Recojo y traslado · ${fmtInt(boxes)} ${boxes === 1 ? "caja" : "cajas"}`, 0, boxes * r.centroPerBox * region),
  );

  const days = scanWorkdays(d);
  return {
    service: "digitalizacion",
    ...sum(lines),
    lines,
    facts: [
      { label: "Volumen", value: `${fmtInt(pages)} ${unit}` },
      { label: "Plazo estimado", value: `${fmtInt(days)} ${days === 1 ? "día hábil" : "días hábiles"}` },
    ],
  };
}

const estimators: Record<ServiceId, (q: QuoteState) => ServiceEstimate> = {
  computo: estimateComputo,
  impresion: estimateImpresion,
  digitalizacion: estimateDigitalizacion,
};

export function estimateQuote(q: QuoteState): Estimate {
  const services = q.services.map((id) => estimators[id](q));
  // El despliegue solo se cobra si hay equipos que instalar (un servicio incompleto no suma).
  const needsDeployment = services.some((s) => (s.service === "computo" || s.service === "impresion") && !s.incomplete);
  const deployment = needsDeployment ? q.project.sites * rates.deploymentPerSite[q.project.location] : 0;
  const monthly = round(services.reduce((n, s) => n + s.monthly, 0));
  const oneTime = round(services.reduce((n, s) => n + s.oneTime, 0) + deployment);
  return {
    services,
    deployment,
    monthly,
    oneTime,
    total: monthly * q.project.term + oneTime,
    term: q.project.term,
    demo: ratesAreDemo,
  };
}

function sum(lines: EstimateLine[]) {
  return {
    monthly: round(lines.reduce((n, l) => n + l.monthly, 0)),
    oneTime: round(lines.reduce((n, l) => n + l.oneTime, 0)),
  };
}

function round(n: number) {
  return Math.round(n);
}

/* ------------------------------------------------------------------ */
/* Formato                                                              */
/* ------------------------------------------------------------------ */

const pen = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 });

export function formatPEN(n: number) {
  return pen.format(n);
}

/** Redondeo "comercial" para rangos: evita cifras falsamente precisas. */
function nice(n: number, dir: "down" | "up") {
  const step = n < 1_000 ? 10 : n < 10_000 ? 50 : n < 100_000 ? 100 : 1_000;
  return (dir === "down" ? Math.floor(n / step) : Math.ceil(n / step)) * step;
}

/** Rango referencial alrededor de la estimación (−10 % / +12 %). */
export function estimateRange(n: number): [number, number] {
  if (n <= 0) return [0, 0];
  return [nice(n * 0.9, "down"), nice(n * 1.12, "up")];
}

export function formatRange(n: number) {
  const [lo, hi] = estimateRange(n);
  return `${formatPEN(lo)} – ${formatPEN(hi)}`;
}

export function labelOf<V extends string | number>(options: readonly Option<V>[], value: V) {
  return options.find((o) => o.value === value)?.label ?? String(value);
}

/* ------------------------------------------------------------------ */
/* Resumen en texto (WhatsApp y correo)                                 */
/* ------------------------------------------------------------------ */

export function describeService(q: QuoteState, id: ServiceId): string[] {
  if (id === "computo") {
    const c = q.computo;
    const devices = deviceOptions
      .filter((d) => c.devices[d.value] > 0)
      .map((d) => `${fmtInt(c.devices[d.value])} ${d.label.toLowerCase()}`)
      .join(", ");
    const extras = computoExtraOptions.filter((e) => c.extras.includes(e.value)).map((e) => e.label);
    return [
      `${devices || "Cantidad por definir"} · perfil ${labelOf(profileOptions, c.profile).toLowerCase()} · ${labelOf(computoModeOptions, c.mode).toLowerCase()}`,
      ...(extras.length ? [`Incluye: ${extras.join(", ")}`] : []),
    ];
  }
  if (id === "impresion") {
    const p = q.impresion;
    const devices = printDevices(q);
    const extras = printExtraOptions.filter((e) => p.extras.includes(e.value)).map((e) => e.label);
    return [
      `${fmtInt(p.pages)} páginas al mes · ${p.color}% color · ${labelOf(printFormatOptions, p.format)}`,
      `${labelOf(printModeOptions, p.mode)} · ${devices} ${devices === 1 ? "equipo" : "equipos"}${p.devices === null ? " (sugerido)" : ""}`,
      ...(extras.length ? [`Incluye: ${extras.join(", ")}`] : []),
    ];
  }
  const d = q.digitalizacion;
  const services = scanServiceOptions.filter((s) => d.services.includes(s.value)).map((s) => s.label);
  return [
    `${fmtInt(scanPages(d))} ${d.docType === "planos" ? "planos" : "páginas"} (${fmtInt(scanBoxes(d))} ${scanBoxes(d) === 1 ? "caja" : "cajas"} aprox.) · ${labelOf(docTypeOptions, d.docType).toLowerCase()}`,
    `${labelOf(scanLocationOptions, d.location)} · ${labelOf(urgencyOptions, d.urgency).toLowerCase()}`,
    ...(services.length ? [`Incluye: ${services.join(", ")}`] : []),
  ];
}

export function buildQuoteSummary(q: QuoteState, e: Estimate = estimateQuote(q)) {
  const p = q.project;
  const blocks = q.services.map((id) =>
    [getQuoteService(id).title.toUpperCase(), ...describeService(q, id).map((l) => `• ${l}`)].join("\n"),
  );
  const tag = e.demo ? " (tarifas de demostración)" : "";
  const amounts = [
    e.monthly > 0 ? `${formatRange(e.monthly)} al mes` : null,
    e.oneTime > 0 ? `${formatRange(e.oneTime)} en pagos únicos` : null,
  ].filter(Boolean);

  return [
    `Sedes: ${p.sites} (${labelOf(locationOptions, p.location).toLowerCase()}) · Plazo: ${labelOf(termOptions, p.term)} · Inicio: ${labelOf(startOptions, p.start).toLowerCase()}`,
    ...blocks,
    amounts.length ? `Estimación referencial${tag}: ${amounts.join(" + ")}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function buildQuoteWhatsApp(q: QuoteState) {
  return `Hola, Misión Tecnológica. Quisiera una cotización para este proyecto:\n\n${buildQuoteSummary(q)}\n\nEmpresa: \nContacto: `;
}

/** Envío por correo con el resumen prellenado (alternativa mientras el WhatsApp oficial no esté configurado). */
export function buildQuoteMailto(q: QuoteState) {
  const subject = "Solicitud de cotización de proyecto";
  const body = `Hola, Misión Tecnológica. Quisiera una cotización para este proyecto:

${buildQuoteSummary(q)}

Empresa: 
Contacto: `;
  return `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Canal directo del cotizador: WhatsApp si el número oficial está configurado; si no, correo. */
export function quoteDirectChannel(q: QuoteState) {
  return siteConfig.contact.whatsappIsPlaceholder
    ? { kind: "email" as const, label: "Enviar por correo", href: buildQuoteMailto(q) }
    : { kind: "whatsapp" as const, label: "Enviar por WhatsApp", href: whatsappLink(siteConfig.contact.whatsapp, buildQuoteWhatsApp(q)) };
}
