"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";

import type { Option } from "@/lib/content/quote";
import { cn } from "@/lib/utils";

/**
 * Controles del cotizador. Todos usan elementos nativos (radio, checkbox, number, range) para
 * conservar el teclado y los lectores de pantalla; solo cambia la presentación.
 */

/* ------------------------------------------------------------------ */
/* Grupo con título                                                     */
/* ------------------------------------------------------------------ */

export function ControlGroup({
  legend,
  hint,
  aside,
  className,
  children,
}: {
  legend: string;
  hint?: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      {/* La leyenda queda como primer hijo (nombre accesible del grupo); flotar permite alinear el texto auxiliar a la derecha. */}
      <legend className="float-left mr-4 mb-3 font-semibold text-ink">{legend}</legend>
      {aside || hint ? <div className="float-right mb-3 text-sm text-ink-faint">{aside ?? hint}</div> : null}
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Opción única: píldoras (opciones cortas) o tarjetas (con descripción) */
/* ------------------------------------------------------------------ */

export function Choice<V extends string | number>({
  name,
  options,
  value,
  onChange,
  variant = "pills",
  columns,
}: {
  name: string;
  options: readonly Option<V>[];
  value: V;
  onChange: (v: V) => void;
  variant?: "pills" | "cards";
  columns?: 2 | 3;
}) {
  const id = useId();

  if (variant === "pills") {
    return (
      <div
        className="grid gap-1 rounded-full bg-surface p-1 ring-1 ring-line ring-inset"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((o) => (
          <label key={o.value} className="relative min-w-0">
            <input
              type="radio"
              name={`${name}-${id}`}
              value={String(o.value)}
              checked={o.value === value}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "flex min-h-10 cursor-pointer items-center justify-center rounded-full px-2 text-center text-sm leading-tight font-semibold text-ink-soft transition-[background-color,color,box-shadow] duration-200 sm:px-3",
                "hover:text-ink peer-checked:bg-brand-blue peer-checked:text-white peer-checked:shadow-[0_8px_20px_-10px_rgb(0_61_153/0.7)]",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue",
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3", columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
      {options.map((o) => {
        const checked = o.value === value;
        return (
          <label
            key={o.value}
            className={cn(
              "group relative flex cursor-pointer gap-3 rounded-2xl border bg-white p-4 transition-[border-color,background-color,box-shadow] duration-200",
              "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-blue",
              checked ? "border-brand-blue bg-brand-blue-50 shadow-[0_10px_24px_-18px_rgb(0_61_153/0.9)]" : "border-line hover:border-brand-blue/40",
            )}
          >
            <input
              type="radio"
              name={`${name}-${id}`}
              value={String(o.value)}
              checked={checked}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                checked ? "border-brand-blue bg-brand-blue" : "border-input bg-white",
              )}
            >
              <span className={cn("size-2 rounded-full bg-white transition-transform duration-200", checked ? "scale-100" : "scale-0")} />
            </span>
            <span className="min-w-0">
              <span className={cn("block font-semibold", checked ? "text-brand-blue-800" : "text-ink")}>{o.label}</span>
              {o.hint ? <span className="mt-0.5 block text-sm leading-snug text-ink-soft">{o.hint}</span> : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Opción múltiple en chips                                             */
/* ------------------------------------------------------------------ */

export function ChipGroup<V extends string>({
  options,
  values,
  onChange,
  tags,
}: {
  options: readonly Option<V>[];
  values: V[];
  onChange: (v: V[]) => void;
  /** Etiqueta breve por opción (por ejemplo "Incluido"). */
  tags?: Partial<Record<V, string>>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const checked = values.includes(o.value);
        return (
          <label
            key={o.value}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 text-sm font-semibold transition-[border-color,background-color,color] duration-200",
              "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-blue",
              checked ? "border-brand-blue bg-brand-blue-50 text-brand-blue-800" : "border-line bg-white text-ink-soft hover:border-brand-blue/40 hover:text-ink",
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onChange(checked ? values.filter((v) => v !== o.value) : [...values, o.value])}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                checked ? "bg-brand-blue text-white" : "bg-surface text-ink-faint",
              )}
            >
              {checked ? <Check className="size-3.5" strokeWidth={3} /> : <Plus className="size-3.5" strokeWidth={2.5} />}
            </span>
            {o.label}
            {tags?.[o.value] ? (
              <span className="rounded-full bg-brand-teal-50 px-2 py-0.5 text-xs font-bold text-brand-teal-700">{tags[o.value]}</span>
            ) : null}
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Número: campo editable con botones − / +                              */
/* ------------------------------------------------------------------ */

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Campo numérico que deja escribir libremente y corrige el valor al salir del campo. */
function useDraftNumber(value: number, min: number, max: number, onChange: (v: number) => void) {
  const [draft, setDraft] = useState(String(value));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setDraft(String(value));
  }, [value]);

  return {
    value: draft,
    onFocus: () => {
      focused.current = true;
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value.replace(/[^\d]/g, "");
      setDraft(text);
      if (text !== "") onChange(clamp(Number(text), min, max));
    },
    onBlur: () => {
      focused.current = false;
      const n = draft === "" ? min : clamp(Number(draft), min, max);
      // Solo confirmar si cambió: enfocar y salir no debe fijar un valor sugerido automáticamente.
      if (n !== value) onChange(n);
      setDraft(String(n));
    },
  };
}

export function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  size = "md",
}: {
  /** Nombre accesible del campo (por ejemplo "Cantidad de laptops"). */
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "md" | "lg";
}) {
  const draft = useDraftNumber(value, min, max, onChange);
  // aria-disabled (no `disabled`) en los límites: el botón conserva el foco del teclado.
  const btn =
    "inline-flex shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface aria-disabled:cursor-not-allowed aria-disabled:opacity-35 aria-disabled:hover:bg-transparent";

  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white p-0.5" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => value > min && onChange(clamp(value - step, min, max))}
        aria-disabled={value <= min}
        className={cn(btn, size === "lg" ? "size-11" : "size-10")}
        aria-label={`Restar ${step}`}
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        {...draft}
        className={cn(
          "h-10 min-w-0 rounded-lg bg-transparent text-center font-bold text-ink tabular-nums focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-blue",
          size === "lg" ? "w-16 text-lg" : "w-12",
        )}
      />
      <button
        type="button"
        onClick={() => value < max && onChange(clamp(value + step, min, max))}
        aria-disabled={value >= max}
        className={cn(btn, size === "lg" ? "size-11" : "size-10")}
        aria-label={`Sumar ${step}`}
      >
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Deslizador con valor editable y atajos                                */
/* ------------------------------------------------------------------ */

const nf = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });

/** Escala logarítmica para volúmenes (de cientos a millones), con valores redondeados. */
function toPosition(v: number, min: number, max: number, log: boolean) {
  if (!log) return ((v - min) / (max - min)) * 1000;
  return ((Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 1000;
}
/** En escala logarítmica el paso crece con el valor (100, 500, 1 000…) para no mostrar cifras falsamente precisas. */
function stepAt(v: number, log: boolean, step: number) {
  return log ? Math.max(step, 10 ** Math.max(0, Math.floor(Math.log10(Math.max(1, v))) - 1) * (v >= 10_000 ? 5 : 1)) : step;
}
function fromPosition(p: number, min: number, max: number, log: boolean, step: number) {
  const raw = log ? Math.exp(Math.log(min) + (p / 1000) * (Math.log(max) - Math.log(min))) : min + (p / 1000) * (max - min);
  const s = stepAt(raw, log, step);
  return clamp(Math.round(raw / s) * s, min, max);
}
/** Siguiente valor redondeado hacia arriba o abajo (flechas del teclado). */
function nudge(v: number, dir: 1 | -1, min: number, max: number, log: boolean, step: number) {
  const s = stepAt(dir === 1 ? v : v - 1, log, step);
  const next = dir === 1 ? Math.floor(v / s) * s + s : Math.ceil(v / s) * s - s;
  return clamp(next, min, max);
}

const ARROWS: Record<string, 1 | -1> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };

export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  log = false,
  unit,
  presets,
  formatPreset = (v) => nf.format(v),
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  log?: boolean;
  /** Texto después del valor ("páginas al mes", "%"). */
  unit: string;
  presets?: number[];
  formatPreset?: (v: number) => string;
  description?: React.ReactNode;
}) {
  const id = useId();
  const draft = useDraftNumber(value, min, max, onChange);
  const position = toPosition(value, min, max, log);

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <label htmlFor={`${id}-range`} className="font-semibold text-ink">
          {label}
        </label>
        <div className="flex items-baseline gap-2">
          <input
            type="text"
            inputMode="numeric"
            aria-label={`${label} (${unit})`}
            {...draft}
            className="h-10 w-28 rounded-xl border border-input bg-white px-3 text-right text-lg font-bold text-ink tabular-nums outline-none transition-[border-color,box-shadow] focus-visible:border-brand-blue focus-visible:ring-4 focus-visible:ring-brand-blue/15"
          />
          <span className="text-sm font-semibold text-ink-soft">{unit}</span>
        </div>
      </div>
      <input
        id={`${id}-range`}
        type="range"
        min={0}
        max={1000}
        step={1}
        value={Math.round(position)}
        onChange={(e) => onChange(fromPosition(Number(e.target.value), min, max, log, step))}
        onKeyDown={(e) => {
          // La escala interna (0–1000) es más fina que los valores redondeados: las flechas avanzan al siguiente valor.
          const dir = ARROWS[e.key];
          if (!dir) return;
          e.preventDefault();
          onChange(nudge(value, dir, min, max, log, step));
        }}
        aria-valuetext={`${nf.format(value)} ${unit}`}
        className="range-mt mt-2"
        style={{ "--fill": `${position / 10}%` } as React.CSSProperties}
      />
      {presets?.length ? (
        <div className="mt-1 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-pressed={p === value}
              className={cn(
                "inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-semibold tabular-nums transition-colors",
                p === value ? "border-brand-blue bg-brand-blue text-white" : "border-line bg-white text-ink-soft hover:border-brand-blue/40 hover:text-ink",
              )}
            >
              {formatPreset(p)}
            </button>
          ))}
        </div>
      ) : null}
      {description ? <div className="mt-3 text-sm leading-relaxed text-ink-soft">{description}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Número grande con unidad (volúmenes que pueden ser 0)                 */
/* ------------------------------------------------------------------ */

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  unit,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max: number;
  /** Texto después del valor ("páginas al mes"). */
  unit?: string;
  hint?: string;
}) {
  const id = useId();
  const draft = useDraftNumber(value, min, max, onChange);
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
      </label>
      <div className="mt-2 flex items-center rounded-xl border border-input bg-white focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-brand-blue/15">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          {...draft}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="h-12 min-w-0 flex-1 rounded-xl bg-transparent px-4 text-lg font-bold text-ink tabular-nums outline-none"
        />
        {unit ? <span className="shrink-0 pr-4 text-sm text-ink-soft">{unit}</span> : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
