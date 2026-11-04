"use client";

import { Building2, X } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { ChipGroup, Choice, ControlGroup, RangeField, Stepper } from "@/components/quote/controls";
import { focusSoon, useQuote } from "@/components/quote/quote-provider";
import {
  SHEETS_PER_BOX,
  computoExtraOptions,
  computoModeOptions,
  deviceOptions,
  docTypeOptions,
  getQuoteService,
  limits,
  locationOptions,
  printExtraOptions,
  printFormatOptions,
  printModeOptions,
  printVolumePresets,
  profileOptions,
  scanLocationOptions,
  scanServiceOptions,
  scanUnitOptions,
  startOptions,
  termOptions,
  urgencyOptions,
  type ServiceId,
} from "@/lib/content/quote";
import {
  computoDeviceCount,
  formatPEN,
  printDevices,
  scanBoxes,
  scanPages,
  scanWorkdays,
  suggestedPrintDevices,
} from "@/lib/quote";
import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });
const compact = (v: number) => (v >= 1_000_000 ? `${nf.format(v / 1_000_000)} M` : v >= 1_000 ? `${nf.format(v / 1_000)} mil` : nf.format(v));

/* ------------------------------------------------------------------ */
/* Estructura de panel                                                  */
/* ------------------------------------------------------------------ */

function Panel({
  id,
  title,
  description,
  icon,
  aside,
  onRemove,
  children,
}: {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  aside?: React.ReactNode;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="animate-panel-in scroll-mt-24 rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8"
    >
      <header className="flex items-start gap-4">
        <span aria-hidden className="inline-flex h-12 w-16 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${id}-title`} tabIndex={-1} className="text-2xl font-bold text-ink outline-none">
            {title}
          </h2>
          <p className="mt-1 leading-relaxed text-ink-soft">{description}</p>
        </div>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="-mt-1 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-red-50 hover:text-destructive"
            aria-label={`Quitar ${title} del proyecto`}
          >
            <X aria-hidden className="size-5" />
          </button>
        ) : null}
      </header>
      {aside ? <div className="mt-5">{aside}</div> : null}
      <div className="mt-7 space-y-8">{children}</div>
    </section>
  );
}

/** Al quitar un servicio, el foco pasa a su botón "Agregar" (o al estado vacío si no queda ninguno). */
function removeService(quote: { services: ServiceId[] }, toggleService: (id: ServiceId, on?: boolean) => void, id: ServiceId) {
  toggleService(id, false);
  focusSoon(quote.services.length > 1 ? `agregar-${id}` : "cotizador-vacio");
}

/** Subtotal en vivo del servicio, dentro de su panel. */
function Subtotal({ service }: { service: ServiceId }) {
  const { estimate } = useQuote();
  const s = estimate.services.find((x) => x.service === service);
  if (!s) return null;
  const parts = [s.monthly > 0 ? `${formatPEN(s.monthly)} al mes` : null, s.oneTime > 0 ? `${formatPEN(s.oneTime)} único` : null].filter(Boolean);
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-surface px-4 py-3 text-sm">
      <span className="font-semibold text-ink-soft">Subtotal estimado</span>
      <span className={cn("font-bold tabular-nums", s.incomplete ? "text-ink-soft" : "text-ink")}>{s.incomplete ?? parts.join(" + ")}</span>
      {s.facts.map((f) => (
        <span key={f.label} className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-ink-soft ring-1 ring-line ring-inset">
          {f.label}: <span className="text-ink">{f.value}</span>
        </span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Proyecto                                                             */
/* ------------------------------------------------------------------ */

export function ProjectPanel() {
  const { quote, patch } = useQuote();
  const p = quote.project;
  const hasMonthly = quote.services.some((s) => s === "computo" || s === "impresion");

  return (
    <Panel
      id="proyecto"
      title="Tu proyecto"
      description="Dónde y cuándo: con esto calculamos el despliegue y las cuotas."
      icon={<Building2 className="size-6" strokeWidth={1.8} />}
    >
      <div className="grid gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-10">
        <ControlGroup legend="Sedes">
          <Stepper label="Número de sedes" value={p.sites} onChange={(sites) => patch("project", { sites })} min={limits.sites.min} max={limits.sites.max} size="lg" />
        </ControlGroup>
        <ControlGroup legend="Ubicación">
          <Choice name="ubicacion" options={locationOptions} value={p.location} onChange={(location) => patch("project", { location })} />
        </ControlGroup>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-10">
        <ControlGroup legend="Plazo del contrato" hint={hasMonthly ? "Más plazo, menor cuota" : "Aplica a servicios mensuales"}>
          <Choice name="plazo" options={termOptions} value={p.term} onChange={(term) => patch("project", { term })} />
        </ControlGroup>
        <ControlGroup legend="Inicio">
          <Choice name="inicio" options={startOptions} value={p.start} onChange={(start) => patch("project", { start })} />
        </ControlGroup>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Cómputo                                                              */
/* ------------------------------------------------------------------ */

export function ComputoPanel() {
  const { quote, patch, toggleService } = useQuote();
  const c = quote.computo;
  const svc = getQuoteService("computo");
  const count = computoDeviceCount(c);

  return (
    <Panel
      id="computo"
      title={svc.title}
      description="Equipos para tus colaboradores, con el perfil y la modalidad que prefieras."
      icon={<Icon name={svc.icon} className="size-6" />}
      onRemove={() => removeService(quote, toggleService, "computo")}
      aside={<Subtotal service="computo" />}
    >
      <ControlGroup legend="Equipos" aside={<span className="font-semibold text-ink tabular-nums">{nf.format(count)} en total</span>}>
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {deviceOptions.map((d) => (
            <li key={d.value} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{d.label}</p>
                <p className="text-sm text-ink-soft">{d.hint}</p>
              </div>
              <Stepper
                label={`Cantidad de ${d.label.toLowerCase()}`}
                value={c.devices[d.value]}
                onChange={(n) => patch("computo", { devices: { ...c.devices, [d.value]: n } })}
                min={limits.devices.min}
                max={limits.devices.max}
              />
            </li>
          ))}
        </ul>
      </ControlGroup>

      <ControlGroup legend="Perfil de uso">
        <Choice name="perfil" variant="cards" columns={3} options={profileOptions} value={c.profile} onChange={(profile) => patch("computo", { profile })} />
      </ControlGroup>

      <ControlGroup legend="Modalidad">
        <Choice name="modalidad-computo" variant="cards" options={computoModeOptions} value={c.mode} onChange={(mode) => patch("computo", { mode })} />
      </ControlGroup>

      <ControlGroup legend="Servicios adicionales" hint="Opcional">
        <ChipGroup options={computoExtraOptions} values={c.extras} onChange={(extras) => patch("computo", { extras })} />
      </ControlGroup>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Impresión                                                            */
/* ------------------------------------------------------------------ */

export function ImpresionPanel() {
  const { quote, patch, toggleService } = useQuote();
  const p = quote.impresion;
  const svc = getQuoteService("impresion");
  const suggested = suggestedPrintDevices(p.pages, quote.project.sites);
  const devices = printDevices(quote);

  return (
    <Panel
      id="impresion"
      title={svc.title}
      description="Cuánto imprimes al mes y cómo prefieres pagar el servicio."
      icon={<Icon name={svc.icon} className="size-6" />}
      onRemove={() => removeService(quote, toggleService, "impresion")}
      aside={<Subtotal service="impresion" />}
    >
      <RangeField
        label="Volumen mensual"
        unit="páginas al mes"
        value={p.pages}
        onChange={(pages) => patch("impresion", { pages })}
        min={limits.printPages.min}
        max={limits.printPages.max}
        step={100}
        log
        presets={printVolumePresets}
        formatPreset={compact}
        description="Si no lo sabes con exactitud, un cálculo aproximado es suficiente: lo afinamos en el diagnóstico."
      />

      <RangeField
        label="Páginas a color"
        unit="%"
        value={p.color}
        onChange={(color) => patch("impresion", { color })}
        min={0}
        max={100}
        step={5}
        presets={[0, 10, 25, 50]}
        formatPreset={(v) => (v === 0 ? "Solo B/N" : `${v} %`)}
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <ControlGroup legend="Formato">
          <Choice name="formato" options={printFormatOptions} value={p.format} onChange={(format) => patch("impresion", { format })} />
        </ControlGroup>
        <ControlGroup
          legend="Equipos"
          aside={
            p.devices !== null && p.devices !== suggested ? (
              <button type="button" onClick={() => patch("impresion", { devices: null })} className="font-semibold text-brand-blue hover:underline">
                Usar sugerencia ({suggested})
              </button>
            ) : (
              <span className="rounded-full bg-brand-teal-50 px-2.5 py-0.5 text-xs font-bold text-brand-teal-700">Sugerido</span>
            )
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <Stepper
              label="Número de equipos de impresión"
              value={devices}
              onChange={(n) => patch("impresion", { devices: n })}
              min={limits.printDevices.min}
              max={limits.printDevices.max}
              size="lg"
            />
            <p className="min-w-0 flex-1 text-sm leading-snug text-ink-soft">
              Según {compact(p.pages)} páginas en {quote.project.sites} {quote.project.sites === 1 ? "sede" : "sedes"}.
            </p>
          </div>
        </ControlGroup>
      </div>

      <ControlGroup legend="Modalidad">
        <Choice name="modalidad-impresion" variant="cards" columns={3} options={printModeOptions} value={p.mode} onChange={(mode) => patch("impresion", { mode })} />
      </ControlGroup>

      <ControlGroup legend="Servicios adicionales" hint="Opcional">
        <ChipGroup
          options={printExtraOptions}
          values={p.extras}
          onChange={(extras) => patch("impresion", { extras })}
          tags={p.mode === "outsourcing" ? { monitoreo: "Incluido" } : undefined}
        />
      </ControlGroup>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Digitalización                                                       */
/* ------------------------------------------------------------------ */

export function DigitalizacionPanel() {
  const { quote, patch, toggleService } = useQuote();
  const d = quote.digitalizacion;
  const svc = getQuoteService("digitalizacion");
  const inBoxes = d.unit === "cajas";
  const pages = scanPages(d);
  const days = scanWorkdays(d);
  const planos = d.docType === "planos";
  const perBox = SHEETS_PER_BOX[d.docType];
  const docUnit = planos ? "planos" : "páginas";

  const changeUnit = (unit: typeof d.unit) => {
    if (unit === d.unit) return;
    const amount =
      unit === "cajas"
        ? Math.min(limits.scanBoxes.max, Math.max(limits.scanBoxes.min, Math.ceil(d.amount / perBox)))
        : Math.min(limits.scanPages.max, Math.max(limits.scanPages.min, d.amount * perBox));
    patch("digitalizacion", { unit, amount });
  };

  return (
    <Panel
      id="digitalizacion"
      title={svc.title}
      description="El archivo que quieres digitalizar y qué necesitas hacer con él después."
      icon={<Icon name={svc.icon} className="size-6" />}
      onRemove={() => removeService(quote, toggleService, "digitalizacion")}
      aside={<Subtotal service="digitalizacion" />}
    >
      <ControlGroup legend="¿Cómo prefieres medir el volumen?">
        <div className="max-w-sm">
          <Choice name="unidad" options={scanUnitOptions} value={d.unit} onChange={changeUnit} />
        </div>
      </ControlGroup>

      <RangeField
        key={`${d.unit}-${planos}`}
        label={inBoxes ? "Cajas de archivo" : planos ? "Planos a digitalizar" : "Páginas a digitalizar"}
        unit={inBoxes ? "cajas" : docUnit}
        value={d.amount}
        onChange={(amount) => patch("digitalizacion", { amount })}
        min={inBoxes ? limits.scanBoxes.min : limits.scanPages.min}
        max={inBoxes ? limits.scanBoxes.max : limits.scanPages.max}
        step={inBoxes ? 1 : planos ? 10 : 500}
        log
        presets={inBoxes ? [10, 40, 150, 500] : planos ? [200, 1_000, 5_000, 20_000] : [20_000, 100_000, 500_000, 1_500_000]}
        formatPreset={inBoxes ? (v) => `${nf.format(v)} cajas` : compact}
        description={
          inBoxes
            ? `Calculamos unas ${nf.format(perBox)} ${planos ? "planos" : "hojas"} por caja: ≈ ${nf.format(pages)} ${docUnit}.`
            : `≈ ${nf.format(scanBoxes(d))} ${scanBoxes(d) === 1 ? "caja" : "cajas"} de archivo.`
        }
      />

      <ControlGroup legend="Tipo de documento">
        <Choice name="documento" variant="cards" columns={3} options={docTypeOptions} value={d.docType} onChange={(docType) => patch("digitalizacion", { docType })} />
      </ControlGroup>

      <ControlGroup legend="¿Dónde se digitaliza?">
        <Choice name="lugar" variant="cards" options={scanLocationOptions} value={d.location} onChange={(location) => patch("digitalizacion", { location })} />
      </ControlGroup>

      <ControlGroup legend="Después de escanear" hint="Opcional">
        <ChipGroup options={scanServiceOptions} values={d.services} onChange={(services) => patch("digitalizacion", { services })} />
      </ControlGroup>

      <ControlGroup legend="Plazo" aside={<span className="font-semibold text-ink tabular-nums">≈ {nf.format(days)} {days === 1 ? "día hábil" : "días hábiles"} de captura</span>}>
        <div className="max-w-sm">
          <Choice name="urgencia" options={urgencyOptions} value={d.urgency} onChange={(urgency) => patch("digitalizacion", { urgency })} />
        </div>
      </ControlGroup>
    </Panel>
  );
}

export const servicePanels: Record<ServiceId, () => React.ReactNode> = {
  computo: ComputoPanel,
  impresion: ImpresionPanel,
  digitalizacion: DigitalizacionPanel,
};
