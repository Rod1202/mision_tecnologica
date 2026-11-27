"use client";

import { Building2, Plus, Trash2, X } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { ChipGroup, Choice, ControlGroup, NumberField, RangeField, Stepper } from "@/components/quote/controls";
import { focusSoon, useQuote } from "@/components/quote/quote-provider";
import {
  avNeedOptions,
  computoModeOptions,
  deviceOptions,
  docTypeOptions,
  getQuoteService,
  headsetFeatureOptions,
  headsetUserOptions,
  limits,
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
  scanUnitOptions,
  scanUnitWords,
  startOptions,
  termOptions,
  type ServiceId,
} from "@/lib/content/quote";
import { computoDeviceCount, fmtInt, formatTotal, printTotal, scanSheets, usesContractTerm } from "@/lib/quote";
import { cn } from "@/lib/utils";

const compact = (v: number) => (v >= 1_000_000 ? `${fmtInt(v / 1_000_000)} M` : v >= 1_000 ? `${fmtInt(v / 1_000)} mil` : fmtInt(v));

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
        <span aria-hidden className="inline-flex h-12 w-16 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-bright">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={`${id}-title`} tabIndex={-1} className="text-2xl font-bold text-ink outline-none">
            {title}
          </h3>
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

/** Al quitar un servicio, el foco vuelve a su casilla en el paso 1. */
function removeService(toggleService: (id: ServiceId, on?: boolean) => void, id: ServiceId) {
  toggleService(id, false);
  focusSoon(`servicio-${id}`);
}

/** Datos clave del servicio, en una franja (sin montos: la propuesta la prepara un asesor). */
function Facts({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-sm">
      {items.map((f) => (
        <div key={f.label} className="rounded-full bg-white px-3 py-1 ring-1 ring-line ring-inset">
          <dt className="inline font-semibold text-ink-soft">{f.label}: </dt>
          <dd className="inline font-bold text-ink tabular-nums">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Proyecto                                                             */
/* ------------------------------------------------------------------ */

export function ProjectPanel() {
  const { quote, patch } = useQuote();
  const p = quote.project;
  const showTerm = usesContractTerm(quote.services);

  return (
    <Panel
      id="proyecto"
      title="Tu proyecto"
      description="Dónde y cuándo: con esto planificamos el despliegue y la propuesta."
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
      <div className={cn("grid gap-8 sm:gap-x-10", showTerm && "sm:grid-cols-2")}>
        {showTerm ? (
          <ControlGroup legend="Plazo del contrato" hint="Cómputo e impresión">
            <Choice name="plazo" options={termOptions} value={p.term} onChange={(term) => patch("project", { term })} />
          </ControlGroup>
        ) : null}
        <ControlGroup legend="Inicio">
          <div className={cn(!showTerm && "max-w-md")}>
            <Choice name="inicio" options={startOptions} value={p.start} onChange={(start) => patch("project", { start })} />
          </div>
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
      onRemove={() => removeService(toggleService, "computo")}
      aside={
        <Facts
          items={[
            { label: "Equipos", value: fmtInt(count) },
            { label: "Perfil", value: profileOptions.find((o) => o.value === c.profile)!.label },
          ]}
        />
      }
    >
      <ControlGroup legend="Equipos" aside={<span className="font-semibold text-ink tabular-nums">{fmtInt(count)} en total</span>}>
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
  const total = printTotal(p);
  const byFormat = formatTotal(p);
  const mismatch = byFormat > 0 && byFormat !== total;

  return (
    <Panel
      id="impresion"
      title={svc.title}
      description="Tu parque de equipos, cuánto imprimes al mes y cómo prefieres el servicio."
      icon={<Icon name={svc.icon} className="size-6" />}
      onRemove={() => removeService(toggleService, "impresion")}
      aside={
        <Facts
          items={[
            { label: "Equipos", value: fmtInt(p.devices) },
            { label: "Páginas al mes", value: fmtInt(total) },
          ]}
        />
      }
    >
      <ControlGroup legend="Parque de equipos">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="sm:w-80">
            <Choice name="parque" options={printFleetOptions} value={p.fleet} onChange={(fleet) => patch("impresion", { fleet })} />
          </div>
          <Stepper
            label={p.fleet === "actual" ? "Cantidad de equipos actuales" : "Cantidad de equipos estimada"}
            value={p.devices}
            onChange={(devices) => patch("impresion", { devices })}
            min={limits.printDevices.min}
            max={limits.printDevices.max}
            size="lg"
          />
        </div>
      </ControlGroup>

      <ControlGroup legend="Volumen mensual" aside={<span className="font-semibold text-ink tabular-nums">{fmtInt(total)} en total</span>}>
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField label="Total blanco y negro" unit="páginas al mes" value={p.bwPages} onChange={(bwPages) => patch("impresion", { bwPages })} max={limits.printPages.max} />
          <NumberField label="Total color" unit="páginas al mes" value={p.colorPages} onChange={(colorPages) => patch("impresion", { colorPages })} max={limits.printPages.max} />
        </div>
        <p className="mt-3 text-sm text-ink-soft">Si no lo sabes con exactitud, un cálculo aproximado es suficiente: lo afinamos en el diagnóstico.</p>
      </ControlGroup>

      <ControlGroup legend="Cantidad por formato" hint="Páginas al mes">
        <div className="grid gap-5 sm:grid-cols-3">
          {paperFormats.map((f) => (
            <NumberField
              key={f.value}
              label={`${f.label} =`}
              unit="páginas"
              value={p.formats[f.value]}
              onChange={(n) => patch("impresion", { formats: { ...p.formats, [f.value]: n } })}
              max={limits.formatPages.max}
            />
          ))}
        </div>
        {mismatch ? (
          <p role="status" className="mt-3 text-sm text-ink-soft">
            La suma por formato ({fmtInt(byFormat)}) no coincide con el volumen total ({fmtInt(total)}).{" "}
            <button
              type="button"
              onClick={() => patch("impresion", { formats: { a4: total, oficio: 0, a3: 0 } })}
              className="font-semibold text-brand-bright hover:underline"
            >
              Usar el total en A4
            </button>
          </p>
        ) : null}
      </ControlGroup>

      <ControlGroup legend="Modalidad">
        <Choice name="modalidad-impresion" variant="cards" columns={3} options={printModeOptions} value={p.mode} onChange={(mode) => patch("impresion", { mode })} />
      </ControlGroup>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Digitalización                                                       */
/* ------------------------------------------------------------------ */

const scanPresets: Record<string, number[]> = {
  paginas: [20_000, 100_000, 500_000, 1_500_000],
  files: [50, 200, 1_000, 5_000],
  tomos: [50, 200, 1_000, 5_000],
  cajas: [10, 40, 150, 500],
};

export function DigitalizacionPanel() {
  const { quote, patch, toggleService } = useQuote();
  const d = quote.digitalizacion;
  const svc = getQuoteService("digitalizacion");
  const words = scanUnitWords[d.unit];
  const sheets = scanSheets(d);

  const changeUnit = (unit: typeof d.unit) => {
    if (unit === d.unit) return;
    patch("digitalizacion", { unit, amount: scanPresets[unit][1] });
  };

  return (
    <Panel
      id="digitalizacion"
      title={svc.title}
      description="El archivo que quieres digitalizar, en cuánto tiempo y qué necesitas hacer con él después."
      icon={<Icon name={svc.icon} className="size-6" />}
      onRemove={() => removeService(toggleService, "digitalizacion")}
      aside={
        <Facts
          items={[
            { label: "Volumen", value: `${fmtInt(d.amount)} ${d.amount === 1 ? words.one : words.many}` },
            ...(sheets ? [{ label: "Aprox.", value: `${fmtInt(sheets)} hojas` }] : []),
          ]}
        />
      }
    >
      <ControlGroup legend="Plazo del servicio">
        <Choice name="plazo-digitalizacion" options={scanTermOptions} value={d.term} onChange={(term) => patch("digitalizacion", { term })} />
      </ControlGroup>

      <ControlGroup legend="¿Cómo mides el volumen?">
        <Choice name="unidad" variant="cards" columns={2} options={scanUnitOptions} value={d.unit} onChange={changeUnit} />
      </ControlGroup>

      <RangeField
        key={d.unit}
        label={`Número de ${words.many}`}
        unit={words.many}
        value={d.amount}
        onChange={(amount) => patch("digitalizacion", { amount })}
        min={limits.scanAmount.min}
        max={d.unit === "paginas" ? limits.scanAmount.max : 20_000}
        step={1}
        log
        presets={scanPresets[d.unit]}
        formatPreset={d.unit === "paginas" ? compact : (v) => `${fmtInt(v)} ${words.many}`}
        description={sheets ? `Equivale a unas ${fmtInt(sheets)} hojas.` : undefined}
      />

      <ControlGroup legend="Tipo de documentos">
        <Choice name="documento" variant="cards" columns={3} options={docTypeOptions} value={d.docType} onChange={(docType) => patch("digitalizacion", { docType })} />
      </ControlGroup>

      <ControlGroup legend="¿Dónde se digitaliza?">
        <Choice name="lugar" variant="cards" options={scanLocationOptions} value={d.location} onChange={(location) => patch("digitalizacion", { location })} />
      </ControlGroup>

      <ControlGroup legend="Después de escanear" hint="Opcional">
        <ChipGroup options={scanServiceOptions} values={d.services} onChange={(services) => patch("digitalizacion", { services })} />
      </ControlGroup>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Audio y video                                                        */
/* ------------------------------------------------------------------ */

export function AudioVideoPanel() {
  const { quote, patch, toggleService } = useQuote();
  const a = quote.audiovideo;
  const svc = getQuoteService("audiovideo");
  const salas = a.needs.includes("salas");
  const headsets = a.needs.includes("headsets");
  const totalRooms = a.rooms.reduce((n, r) => n + r.rooms, 0);

  const setRoom = (index: number, value: Partial<(typeof a.rooms)[number]>) =>
    patch("audiovideo", { rooms: a.rooms.map((r, i) => (i === index ? { ...r, ...value } : r)) });

  return (
    <Panel
      id="audiovideo"
      title={svc.title}
      description="Salas de reuniones para videoconferencia y headsets para tus colaboradores."
      icon={<Icon name={svc.icon} className="size-6" />}
      onRemove={() => removeService(toggleService, "audiovideo")}
      aside={
        <Facts
          items={[
            ...(salas ? [{ label: "Salas", value: fmtInt(totalRooms) }] : []),
            ...(headsets ? [{ label: "Headsets", value: fmtInt(a.headsets) }] : []),
            ...(!salas && !headsets ? [{ label: "Necesidad", value: "por elegir" }] : []),
          ]}
        />
      }
    >
      <ControlGroup legend="¿Qué necesitas?" hint="Puedes elegir ambas">
        <ChipGroup options={avNeedOptions} values={a.needs} onChange={(needs) => patch("audiovideo", { needs })} />
      </ControlGroup>

      {salas ? (
        <div className="space-y-8 rounded-3xl bg-surface p-5 sm:p-6">
          <ControlGroup legend="Número de salas y usuarios" hint="Ej.: 2 salas de 10 usuarios">
            <ul className="space-y-3">
              {a.rooms.map((r, i) => (
                <li key={i} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line ring-inset">
                  <Stepper label={`Grupo ${i + 1}: número de salas`} value={r.rooms} onChange={(rooms) => setRoom(i, { rooms })} min={limits.rooms.min} max={limits.rooms.max} />
                  <span className="text-sm font-semibold text-ink-soft">{r.rooms === 1 ? "sala de" : "salas de"}</span>
                  <Stepper label={`Grupo ${i + 1}: usuarios por sala`} value={r.users} onChange={(users) => setRoom(i, { users })} min={limits.roomUsers.min} max={limits.roomUsers.max} />
                  <span className="text-sm font-semibold text-ink-soft">usuarios</span>
                  {a.rooms.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => patch("audiovideo", { rooms: a.rooms.filter((_, j) => j !== i) })}
                      className="ml-auto inline-flex size-10 items-center justify-center rounded-full text-ink-soft hover:bg-red-50 hover:text-destructive"
                      aria-label={`Quitar el grupo ${i + 1} de salas`}
                    >
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
            {a.rooms.length < limits.roomGroups.max ? (
              <button
                type="button"
                onClick={() => patch("audiovideo", { rooms: [...a.rooms, { rooms: 1, users: 4 }] })}
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-brand-bright hover:bg-white"
              >
                <Plus aria-hidden className="size-4" />
                Agregar otro tamaño de sala
              </button>
            ) : null}
          </ControlGroup>

          <ControlGroup legend="Dispositivos requeridos">
            <ChipGroup options={roomDeviceOptions} values={a.roomDevices} onChange={(roomDevices) => patch("audiovideo", { roomDevices })} />
          </ControlGroup>

          <ControlGroup legend="Plataforma de videocolaboración">
            <Choice name="plataforma" variant="cards" columns={3} options={platformOptions} value={a.platform} onChange={(platform) => patch("audiovideo", { platform })} />
          </ControlGroup>
        </div>
      ) : null}

      {headsets ? (
        <div className="space-y-8 rounded-3xl bg-surface p-5 sm:p-6">
          <ControlGroup legend="Cantidad de headsets">
            <Stepper label="Cantidad de headsets" value={a.headsets} onChange={(n) => patch("audiovideo", { headsets: n })} min={limits.headsets.min} max={limits.headsets.max} size="lg" />
          </ControlGroup>

          <ControlGroup legend="Tipo de usuario">
            <Choice name="usuario-headset" variant="cards" columns={3} options={headsetUserOptions} value={a.headsetUser} onChange={(headsetUser) => patch("audiovideo", { headsetUser })} />
          </ControlGroup>

          <ControlGroup legend="Funcionalidades específicas">
            <ChipGroup options={headsetFeatureOptions} values={a.headsetFeatures} onChange={(headsetFeatures) => patch("audiovideo", { headsetFeatures })} />
          </ControlGroup>
        </div>
      ) : null}
    </Panel>
  );
}

export const servicePanels: Record<ServiceId, () => React.ReactNode> = {
  computo: ComputoPanel,
  impresion: ImpresionPanel,
  digitalizacion: DigitalizacionPanel,
  audiovideo: AudioVideoPanel,
};
