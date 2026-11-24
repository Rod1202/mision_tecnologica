"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Calculator, Check, Info, Link2, Plus, ShoppingBag, Trophy, X } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { IsoStrokes } from "@/components/brand/pills";
import { ProductVisual } from "@/components/catalog/product-visual";
import { useQuoteCart } from "@/components/catalog/quote-cart";
import { compareHref, sanitizeCompare, useCompare } from "@/components/compare/compare-provider";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-controls";
import {
  COMPARE_MAX,
  getProductKind,
  productKinds,
  rowNumber,
  specRows,
  type ProductKind,
  type SpecRow,
} from "@/lib/content/compare";
import {
  getProduct,
  ladderRank,
  monoSwitchFor,
  printColorOf,
  productHref,
  upgradeLadders,
  upgradesFor,
  type Product,
} from "@/lib/content/products";
import { cn } from "@/lib/utils";

type Delta = {
  text: string;
  improved: boolean;
  pct: number;
  /** Valor del modelo base → valor de este modelo (para mostrar el salto con cifras, no solo con %). */
  from: number;
  to: number;
  unit: string;
  better: "higher" | "lower";
};

type Row = {
  key: string;
  label: string;
  group: string;
  /** Un valor por columna (null = sin dato). */
  values: (React.ReactNode | null)[];
  /** Texto comparable de cada columna (para detectar diferencias). */
  plain: (string | null)[];
  /** Índices de las columnas con el mejor valor numérico. */
  best: number[];
  bestLabel?: string;
  /** Diferencia de cada columna frente al modelo base del salto de generación. */
  deltas: (Delta | null)[];
  /** Columnas con un equipo (las demás son espacios libres). */
  present: boolean[];
};

// Mismo formato que los textos de las fichas: "10.000", "1,1".
const nf = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1, useGrouping: "always" });

/** Mueve el foco tras el próximo render (el elemento puede no existir todavía). */
function focusSoon(find: () => HTMLElement | null | undefined) {
  requestAnimationFrame(() => requestAnimationFrame(() => find()?.focus()));
}

/**
 * Comparador lado a lado. La selección vive en `CompareProvider` y se refleja en la URL
 * (?modelos=a,b,c) para poder compartirla. La primera columna es la base: las demás muestran
 * la diferencia frente a ella y, si son un upgrade, el resumen del salto.
 * Arriba, el asesor de upgrade parte del equipo que el cliente tiene hoy (?actual=slug).
 */
export function CompareView({ products, showUnverified }: { products: Product[]; showUnverified: boolean }) {
  const { slugs, hydrated, replace, remove, toggle } = useCompare();
  const [activeKind, setActiveKind] = useState<ProductKind>("impresora");
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [status, setStatus] = useState<{ text: string; tone: "ok" | "error" } | null>(null);
  const initialized = useRef(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const ofKind = useMemo(() => products.filter((p) => p.kind === activeKind), [products, activeKind]);
  const selected = slugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => !!p && p.kind === activeKind);
  const columns: (Product | null)[] = Array.from({ length: COMPARE_MAX }, (_, i) => selected[i] ?? null);

  // Al abrir: la URL manda; si no hay nada elegido, se muestran los modelos de lanzamiento del tipo.
  useEffect(() => {
    if (!hydrated || initialized.current) return;
    initialized.current = true;
    const fromUrl = sanitizeCompare((new URLSearchParams(window.location.search).get("modelos") ?? "").split(",").filter(Boolean));
    const initial = fromUrl.length
      ? fromUrl
      : slugs.length
        ? slugs
        : products.filter((p) => p.kind === "impresora" && p.generation === "lanzamiento" && printColorOf(p.slug) === "mono").map((p) => p.slug);
    if (initial !== slugs) replace(initial);
    const first = products.find((p) => p.slug === initial[0]);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el tipo visible sigue a la selección restaurada
    if (first) setActiveKind(first.kind);
  }, [hydrated, slugs, products, replace]);

  // URL compartible siempre al día (sin navegar).
  useEffect(() => {
    if (!initialized.current) return;
    try {
      window.history.replaceState(window.history.state, "", compareHref(slugs));
    } catch {
      /* ignorar */
    }
  }, [slugs]);

  useEffect(() => {
    if (!status) return;
    const t = window.setTimeout(() => setStatus(null), 3000);
    return () => window.clearTimeout(t);
  }, [status]);

  const specsVisible = (p: Product) => p.verified || showUnverified;
  // La primera columna es la base: el resto muestra la diferencia frente a ella.
  const base = selected.length >= 2 && specsVisible(selected[0]) ? 0 : null;
  const upgradeTargets = base === null ? [] : columns.flatMap((p, i) => (p && i !== base && specsVisible(p) && isUpgrade(columns[base]!, p) ? [i] : []));
  const rows = buildRows(columns, activeKind, specsVisible, base);
  const comparable = selected.length >= 2;
  const diffOn = onlyDiff && comparable;
  const visibleRows = rows.filter((r) => !diffOn || differs(r));
  const groups = Array.from(new Set(visibleRows.map((r) => r.group)));
  const hiddenCount = rows.length - visibleRows.length;
  const anySpecShown = selected.some((p) => specsVisible(p) && p.specValues && Object.keys(p.specValues).length > 0);
  const sources = selected.filter((p) => specsVisible(p) && p.specSources?.length);
  const quoteService = activeKind === "laptop" ? "computo" : "impresion";
  /** Lleva una combinación (tu equipo primero) a la tabla. */
  const compareModels = (list: string[], message: string) => {
    setActiveKind("impresora");
    replace(list);
    setStatus({ text: message, tone: "ok" });
    tableRef.current?.scrollIntoView({ block: "start" });
    focusSoon(() => document.getElementById("comparar-tabla"));
  };

  const removeColumn = (slug: string) => {
    const p = products.find((x) => x.slug === slug);
    remove(slug);
    setStatus({ text: `${p?.model ?? "Equipo"} quitado de la comparación.`, tone: "ok" });
    // El botón desaparece con la columna: el foco pasa a la siguiente columna o al primer espacio libre.
    focusSoon(
      () =>
        document.querySelector<HTMLElement>("[data-compare-remove]") ??
        document.querySelector<HTMLElement>("[data-compare-empty] select") ??
        document.getElementById("comparar-tabla"),
    );
  };

  const addColumn = (slug: string) => {
    toggle(slug);
    focusSoon(() => document.getElementById(`columna-${slug}`));
  };

  return (
    <>
      <UpgradeAdvisor products={products} specsVisible={specsVisible} onCompare={compareModels} />

      <section aria-labelledby="comparar-tabla" className="section-y bg-surface">
        <div className="container-mt" ref={tableRef}>
          <h2 id="comparar-tabla" tabIndex={-1} className="scroll-mt-28 text-2xl font-bold text-ink outline-none sm:text-3xl">
            {upgradeTargets.length ? "El salto, fila por fila" : "Comparación lado a lado"}
          </h2>

          {/* Barra de herramientas */}
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label="Tipo de equipo" className="inline-flex w-fit gap-1 rounded-full bg-white p-1.5 ring-1 ring-line ring-inset">
              {productKinds.map((k) => {
                const count = products.filter((p) => p.kind === k.id).length;
                const on = activeKind === k.id;
                return (
                  <button
                    key={k.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActiveKind(k.id)}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.95rem] font-semibold whitespace-nowrap transition-colors sm:px-5",
                      on ? "bg-brand-blue text-white shadow-[0_8px_20px_-10px_rgb(0_61_153/0.7)]" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <Icon name={k.icon} className="size-4" />
                    {k.plural}
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold tabular-nums", on ? "bg-white/20 text-white" : "bg-surface text-ink-soft")}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {ofKind.length > 0 ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={diffOn}
                  disabled={!comparable}
                  onClick={() => setOnlyDiff((v) => !v)}
                  className="inline-flex min-h-11 items-center gap-3 rounded-full px-3 font-semibold text-ink transition-colors hover:bg-white disabled:opacity-50"
                >
                  <span
                    aria-hidden
                    className={cn("relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-200", diffOn ? "bg-brand-blue" : "bg-ink-faint")}
                  >
                    <span className={cn("absolute left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200", diffOn && "translate-x-4")} />
                  </span>
                  Solo diferencias
                </button>
                <p className="inline-flex items-center gap-2 px-2 text-sm text-ink-soft">
                  <span aria-hidden className="size-2 rounded-full bg-brand-teal-800" />
                  Valores distintos
                </p>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(new URL(compareHref(slugs), window.location.origin).toString());
                      setStatus({ text: "Enlace copiado", tone: "ok" });
                    } catch {
                      setStatus({ text: "No se pudo copiar: copia la dirección de la barra del navegador.", tone: "error" });
                    }
                  }}
                >
                  {status?.text === "Enlace copiado" ? <Check aria-hidden /> : <Link2 aria-hidden />}
                  {status?.text === "Enlace copiado" ? "Enlace copiado" : "Copiar enlace"}
                </Button>
              </div>
            ) : null}
          </div>
          <p role="status" className={cn("text-sm", status?.tone === "error" ? "mt-3 font-semibold text-destructive" : "sr-only")}>
            {status?.text ?? ""}
          </p>

          {ofKind.length === 0 ? (
            <EmptyKind kind={activeKind} />
          ) : (
            <>

              {base !== null && upgradeTargets.length ? <GenerationSummary rows={rows} columns={columns} base={base} targets={upgradeTargets} /> : null}

              {/* Tabla: en móvil se desplaza en horizontal; en escritorio la cabecera queda fija al bajar. */}
              <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 md:overflow-visible">
                <div role="table" aria-label={`Comparación de ${getProductKind(activeKind).plural.toLowerCase()}`} className="min-w-[28rem] md:min-w-0">
                  <div role="rowgroup" className="compare-sticky">
                    <div role="row" className="compare-grid gap-3 pb-3">
                      <div role="columnheader" className="sr-only md:not-sr-only md:self-end md:pb-2">
                        <span className="sr-only">Característica</span>
                        <span aria-hidden className="text-sm font-semibold text-ink-soft">
                          {selected.length} de {COMPARE_MAX} {getProductKind(activeKind).plural.toLowerCase()}
                        </span>
                      </div>
                      {columns.map((p, i) =>
                        p ? (
                          <ProductHeader
                            key={p.slug}
                            product={p}
                            isBase={base === i}
                            successor={p.successor ? products.find((x) => x.slug === p.successor) : undefined}
                            successorShown={!!p.successor && slugs.includes(p.successor)}
                            onRemove={() => removeColumn(p.slug)}
                            onShowSuccessor={() => compareModels([p.slug, p.successor!], `Comparando ${p.model} con su sucesor.`)}
                          />
                        ) : (
                          <EmptySlot key={`vacio-${i}`} kind={activeKind} options={ofKind.filter((o) => !slugs.includes(o.slug))} onAdd={addColumn} />
                        ),
                      )}
                    </div>
                  </div>

                  <div role="rowgroup" className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
                    {groups.map((group) => (
                      <div key={group} role="presentation">
                        <div role="row" className="border-b border-line bg-surface/60 px-5 py-2.5 md:px-6">
                          <span role="rowheader" className="text-xs font-bold tracking-[0.08em] text-ink-soft uppercase">
                            {group}
                          </span>
                        </div>
                        {visibleRows
                          .filter((r) => r.group === group)
                          .map((r) => (
                            <CompareRow key={r.key} row={r} comparable={comparable} columns={columns} />
                          ))}
                      </div>
                    ))}
                    {!anySpecShown && selected.length > 0 ? (
                      <div role="row" className="border-t border-line px-5 py-6 md:px-6">
                        <p role="cell" className="flex items-start gap-3 leading-relaxed text-ink-soft">
                          <Info aria-hidden className="mt-1 size-4 shrink-0 text-brand-blue" />
                          Estamos validando las fichas técnicas oficiales de estos equipos. Agrégalos a tu cotización y un asesor te enviará las
                          especificaciones completas.
                        </p>
                      </div>
                    ) : null}
                    {visibleRows.length === 0 ? (
                      <div role="row" className="px-6 py-10">
                        <p role="cell" className="text-center text-ink-soft">
                          Estos equipos coinciden en todos los datos disponibles.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {diffOn && hiddenCount > 0 ? (
                <p className="mt-3 text-sm text-ink-soft">
                  {hiddenCount} {hiddenCount === 1 ? "fila oculta porque es igual" : "filas ocultas porque son iguales"} en todos los equipos.
                </p>
              ) : null}

              <CompareActions selected={selected} quoteService={quoteService} />

              {sources.length > 0 ? (
                <div className="mt-10 border-t border-line pt-6">
                  <h3 className="text-sm font-bold text-ink">Fuentes de las fichas técnicas</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                    {sources.map((p) =>
                      p.specSources!.map((s) => (
                        <li key={`${p.slug}-${s.url}`}>
                          <span className="font-semibold text-ink">{p.model}:</span>{" "}
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline-offset-4 hover:underline">
                            {s.label}
                          </a>
                        </li>
                      )),
                    )}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Salto de generación                                                  */
/* ------------------------------------------------------------------ */

/** Un modelo es upgrade de otro si está más arriba en su escalera, si es el paso a monocromo recomendado o si es su sucesor. */
function isUpgrade(base: Product, p: Product) {
  const sameLadder = printColorOf(base.slug) !== null && printColorOf(base.slug) === printColorOf(p.slug);
  if (sameLadder) return ladderRank(p.slug) > ladderRank(base.slug);
  if (base.successor === p.slug) return true;
  return monoSwitchFor(base.slug, printSpeedOf).some((m) => m.slug === p.slug);
}

const printSpeedRow = specRows.impresora.find((r) => r.key === "printSpeed")!;
const printSpeedOf = (p: Product) => rowNumber(printSpeedRow, p.specValues?.printSpeed);

function deltaFor(row: SpecRow, baseValue: number | null, value: number | null): Delta | null {
  if (!row.better || baseValue === null || value === null || baseValue === 0 || value === baseValue) return null;
  const diff = value - baseValue;
  const pct = Math.round((diff / baseValue) * 100);
  const improved = row.better === "higher" ? diff > 0 : diff < 0;
  const unit = row.unit ?? "";
  const abs = `${nf.format(Math.abs(diff))}${unit ? `\u00a0${unit}` : ""}`;
  // Donde menos es mejor (tiempo, peso), la mejora se dice en palabras: "1,1 s menos", no "−1,1 s".
  const text = diff < 0 ? `${abs} menos (${Math.abs(pct)}\u00a0% menos)` : `+${abs} (+${pct}\u00a0%)`;
  return { text, improved, pct, from: baseValue, to: value, unit, better: row.better };
}

/** "43 → 50 ppm": el salto con cifras. */
function fromTo(d: Delta) {
  return `${nf.format(d.from)} → ${nf.format(d.to)}${d.unit ? `\u00a0${d.unit}` : ""}`;
}

/** "+16 %" o "21 % menos", según si la fila mejora subiendo o bajando. */
function pctLabel(d: Delta) {
  return d.pct > 0 ? `+${d.pct}\u00a0%` : `${Math.abs(d.pct)}\u00a0% menos`;
}

/** Mejoras de un par (anterior → lanzamiento), de mayor a menor. */
function pairImprovements(old: Product, next: Product) {
  return specRows[old.kind]
    .map((row) => ({ label: row.label, delta: deltaFor(row, rowNumber(row, old.specValues?.[row.key]), rowNumber(row, next.specValues?.[row.key])) }))
    .filter((x): x is { label: string; delta: Delta } => !!x.delta && x.delta.improved)
    .sort((a, b) => Math.abs(b.delta.pct) - Math.abs(a.delta.pct));
}

/** Mejoras más grandes del salto, para el resumen. */
function topImprovements(rows: Row[], column: number) {
  return rows
    .map((r) => ({ label: r.label, delta: r.deltas[column] }))
    .filter((x): x is { label: string; delta: Delta } => !!x.delta && x.delta.improved)
    .sort((a, b) => Math.abs(b.delta.pct) - Math.abs(a.delta.pct))
    .slice(0, 4);
}

function GenerationSummary({ rows, columns, base, targets: indexes }: { rows: Row[]; columns: (Product | null)[]; base: number; targets: number[] }) {
  const old = columns[base]!;
  const targets = indexes.map((i) => ({ p: columns[i]!, i }));
  return (
    <div className="relative isolate mt-6 overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,var(--color-brand-blue)_0%,var(--color-brand-blue-700)_55%,var(--color-brand-blue-800)_100%)] p-6 text-white shadow-lift sm:p-8">
      <IsoStrokes className="top-[-40%] right-[-12%] -z-10 h-[180%] w-[45%] opacity-[0.08]" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-10">
        {targets.map(({ p, i }) => {
          const wins = topImprovements(rows, i);
          return (
            <div key={p.slug} className="contents">
              <div>
                <p className="text-2xl leading-tight font-bold sm:text-3xl">
                  {old.model}
                  {old.launchYear ? <span className="font-semibold"> ({old.launchYear})</span> : null}
                  <ArrowRight aria-label="a" className="mx-2 inline size-6 align-[-0.15em]" />
                  {p.model}
                  {p.launchYear ? <span className="font-semibold"> ({p.launchYear})</span> : null}
                </p>
                {printColorOf(old.slug) === "color" && printColorOf(p.slug) === "mono" ? (
                  <p className="mt-3 text-sm leading-relaxed text-white">Pasas a monocromo: dejas de imprimir a color.</p>
                ) : old.successorNote && old.successor === p.slug ? (
                  <p className="mt-3 text-sm leading-relaxed text-white">{old.successorNote}</p>
                ) : null}
              </div>
              {wins.length > 0 ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {wins.map((w) => (
                    <li key={w.label} className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 ring-inset">
                      <p className="text-sm text-white">{w.label}</p>
                      <p className="mt-1 text-xl leading-tight font-extrabold tabular-nums">{fromTo(w.delta)}</p>
                      <p className="mt-1 text-sm font-semibold text-white tabular-nums">{pctLabel(w.delta)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="self-center text-white">Las fichas de estos modelos aún no permiten calcular el salto.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Filas                                                                */
/* ------------------------------------------------------------------ */

function buildRows(columns: (Product | null)[], kind: ProductKind, specsVisible: (p: Product) => boolean, base: number | null): Row[] {
  const present = columns.map((p) => p !== null);
  const none = columns.map(() => null);
  const summary: Omit<Row, "present">[] = [
    {
      key: "generation",
      label: "Generación",
      group: "Resumen",
      values: columns.map((p) => (p ? `${p.generation === "anterior" ? "Anterior" : "Lanzamiento"}${p.launchYear ? ` (${p.launchYear})` : ""}` : null)),
      plain: columns.map((p) => (p ? `${p.generation}-${p.launchYear ?? ""}` : null)),
      best: [],
      deltas: none,
    },
    {
      key: "family",
      label: "Línea",
      group: "Resumen",
      values: columns.map((p) => (p ? (p.lineNote ? `${p.family}. ${p.lineNote}` : p.family) : null)),
      plain: columns.map((p) => p?.family ?? null),
      best: [],
      deltas: none,
    },
  ];

  const anySpec = columns.some((p) => p && specsVisible(p) && p.specValues && Object.keys(p.specValues).length > 0);
  const specs: Omit<Row, "present">[] = anySpec
    ? specRows[kind].map((spec) => {
        const plain = columns.map((p) => (p && specsVisible(p) ? (p.specValues?.[spec.key] ?? null) : null));
        const nums = plain.map((v) => rowNumber(spec, v));
        return {
          key: spec.key,
          label: spec.label,
          group: spec.group,
          values: plain,
          plain,
          best: spec.better ? bestOf(nums, spec.better) : [],
          deltas: nums.map((n, i) => (base === null || i === base || !columns[i] ? null : deltaFor(spec, nums[base], n))),
        };
      })
    : [];

  return [...summary, ...specs].map((r) => ({ ...r, present }));
}

/** Columnas con el mejor valor, solo si hay al menos dos valores y no son todos iguales. */
function bestOf(nums: (number | null)[], better: "higher" | "lower"): number[] {
  const present = nums.filter((n): n is number => n !== null);
  if (present.length < 2 || new Set(present).size < 2) return [];
  const target = better === "higher" ? Math.max(...present) : Math.min(...present);
  return nums.flatMap((n, i) => (n === target ? [i] : []));
}

/** Hay diferencia si los equipos presentes no tienen todos el mismo valor (un dato faltante cuenta como distinto). */
function differs(r: Row) {
  const values = r.plain.filter((_, i) => r.present[i]);
  return new Set(values.map((v) => v ?? "—")).size > 1;
}

function CompareRow({ row, comparable, columns }: { row: Row; comparable: boolean; columns: (Product | null)[] }) {
  const isDiff = comparable && differs(row);
  return (
    <div role="row" className="compare-grid gap-x-3 border-b border-line px-5 py-4 last:border-b-0 md:px-6">
      <div role="rowheader" className="col-span-full flex items-center gap-2 pb-2 font-semibold text-ink md:col-span-1 md:pb-0">
        {row.label}
        {isDiff ? (
          <>
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-brand-teal-800" />
            <span className="sr-only">(valores distintos)</span>
          </>
        ) : null}
      </div>
      {row.values.map((v, i) => {
        const best = row.best.includes(i);
        const delta = row.deltas[i];
        const p = columns[i];
        return (
          <div role="cell" key={i} className="min-w-0 text-[0.95rem] leading-relaxed">
            {/* En móvil la cabecera no queda fija: cada celda repite el modelo. */}
            {p ? <span className="mb-0.5 block text-xs font-bold text-ink-soft md:hidden">{p.model}</span> : null}
            {!row.present[i] ? null : v === null ? (
              <span className="text-ink-soft italic">Por confirmar</span>
            ) : (
              <div className={cn("flex max-w-full flex-col items-start gap-1", best && "w-fit rounded-xl bg-brand-teal-50 px-2.5 py-1.5 md:-mx-2.5 md:-my-1.5")}>
                <span className={cn("max-w-full break-words text-ink", best && "font-semibold")}>{v}</span>
                {best ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal-800">
                    <Trophy aria-hidden className="size-3" />
                    {row.bestLabel ?? "Mejor en esta fila"}
                  </span>
                ) : null}
                {delta ? (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                      delta.improved ? "bg-brand-blue text-white" : "bg-surface text-ink-soft",
                    )}
                  >
                    {delta.improved ? <Check aria-hidden className="size-3" strokeWidth={3} /> : null}
                    <span className="sr-only">{delta.improved ? "Mejora frente a la primera columna:" : "Frente a la primera columna:"}</span>
                    {delta.text}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cabeceras de columna                                                 */
/* ------------------------------------------------------------------ */

function ProductHeader({
  product: p,
  isBase,
  successor,
  successorShown,
  onRemove,
  onShowSuccessor,
}: {
  product: Product;
  isBase: boolean;
  successor?: Product;
  successorShown: boolean;
  onRemove: () => void;
  onShowSuccessor: () => void;
}) {
  const { add, setOpen } = useQuoteCart();
  const launch = p.generation === "lanzamiento";

  return (
    <div
      role="columnheader"
      aria-label={isBase ? `${p.model} (base de comparación)` : p.model}
      className={cn(
        "animate-panel-in relative flex min-w-0 flex-col rounded-3xl border bg-white p-3 shadow-soft md:p-4",
        isBase ? "border-brand-blue/40 ring-2 ring-brand-blue/15" : "border-line",
      )}
    >
      <button
        type="button"
        data-compare-remove
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-sm hover:bg-red-50 hover:text-destructive"
        aria-label={`Quitar ${p.name} de la comparación`}
      >
        <X aria-hidden className="size-4" />
      </button>
      <Link href={productHref(p.slug)} tabIndex={-1} aria-hidden className="block rounded-2xl">
        <ProductVisual model={p.model} kind={p.kind} size="sm" className="aspect-[16/9] w-full md:aspect-[2/1]" />
      </Link>
      <span className="mt-3 flex flex-wrap gap-1.5">
        {isBase ? <span className="inline-flex rounded-full bg-brand-blue px-2.5 py-0.5 text-xs font-bold text-white">Base de comparación</span> : null}
        <span
          className={cn(
            "inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-bold",
            launch ? "bg-brand-teal-50 text-brand-teal-800" : "bg-surface text-ink-soft",
          )}
        >
          {launch ? "Lanzamiento" : "Generación anterior"}
          {p.launchYear ? ` · ${p.launchYear}` : ""}
        </span>
      </span>
      <Link
        id={`columna-${p.slug}`}
        href={productHref(p.slug)}
        className="mt-2 mb-3 line-clamp-3 rounded-md text-sm leading-snug font-bold text-ink outline-none hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-brand-blue md:text-base"
      >
        {p.name}
      </Link>
      <div className="mt-auto flex flex-col gap-1.5">
        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            add(p.slug);
            setOpen(true);
          }}
          aria-label={`Agregar ${p.name} a la cotización`}
        >
          <Plus aria-hidden />
          Cotizar
        </Button>
        {successor && !successorShown ? (
          <button type="button" onClick={onShowSuccessor} className="min-h-9 rounded-full text-sm font-semibold text-brand-blue hover:bg-brand-blue-50">
            Ver su sucesor
          </button>
        ) : null}
      </div>
    </div>
  );
}

function EmptySlot({ kind, options, onAdd }: { kind: ProductKind; options: Product[]; onAdd: (slug: string) => void }) {
  const id = useId();
  const [choice, setChoice] = useState("");
  const label = getProductKind(kind).label.toLowerCase();
  const current = options.filter((o) => o.generation === "lanzamiento");
  const previous = options.filter((o) => o.generation === "anterior");

  return (
    <div
      role="columnheader"
      aria-label="Espacio libre"
      data-compare-empty
      className="flex min-h-40 min-w-0 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-input p-4 text-center"
    >
      {options.length > 0 ? (
        <>
          <label htmlFor={id} className="text-sm font-semibold text-ink">
            Agregar {label}
          </label>
          {/* Elegir y confirmar por separado: con el teclado, mover las flechas no agrega nada por accidente. */}
          <Select id={id} value={choice} onChange={(e) => setChoice(e.target.value)} className="h-10 text-sm">
            <option value="">Elige un modelo</option>
            {current.length ? (
              <optgroup label="Lanzamiento">
                {current.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.model}
                  </option>
                ))}
              </optgroup>
            ) : null}
            {previous.length ? (
              <optgroup label="Generación anterior">
                {previous.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.model}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </Select>
          <Button size="sm" variant="outline" className="w-full" aria-disabled={!choice} onClick={() => choice && onAdd(choice)}>
            <Plus aria-hidden />
            Agregar
          </Button>
        </>
      ) : (
        <p className="text-sm text-ink-soft">No hay más {getProductKind(kind).plural.toLowerCase()} para comparar.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Acciones y estados                                                   */
/* ------------------------------------------------------------------ */

function CompareActions({ selected, quoteService }: { selected: Product[]; quoteService: "computo" | "impresion" }) {
  const { add, setOpen } = useQuoteCart();
  const sellable = selected;
  if (selected.length === 0) return null;
  return (
    <div className="mt-8 flex flex-col gap-3 rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-line sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <p className="text-lg font-bold text-ink">{sellable.length ? "¿Ya elegiste?" : "¿Quieres renovar tus equipos?"}</p>
        <p className="mt-1 text-ink-soft">
          {sellable.length
            ? "Agrega los equipos a tu cotización o cotiza el servicio completo con instalación y soporte."
            : "Te ayudamos a pasar a la nueva generación con instalación, consumibles y soporte."}
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
        {sellable.length ? (
          <Button
            size="lg"
            onClick={() => {
              sellable.forEach((p) => add(p.slug));
              setOpen(true);
            }}
          >
            <ShoppingBag aria-hidden />
            {sellable.length === 1 ? `Agregar ${sellable[0].model}` : `Agregar los ${sellable.length}`}
          </Button>
        ) : null}
        <Button asChild variant="outline" size="lg">
          <Link href={`/cotizador?servicio=${quoteService}`}>
            <Calculator aria-hidden />
            Cotizar proyecto
          </Link>
        </Button>
      </div>
    </div>
  );
}

function EmptyKind({ kind }: { kind: ProductKind }) {
  const k = getProductKind(kind);
  return (
    <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center rounded-[2rem] border border-dashed border-input bg-white px-6 py-12 text-center sm:px-12">
      <span aria-hidden className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
        <Icon name={k.icon} className="size-6" />
      </span>
      <h3 className="mt-6 text-2xl font-bold text-ink">Pronto sumaremos {k.plural.toLowerCase()} al catálogo.</h3>
      <p className="mt-3 leading-relaxed text-ink-soft">
        Mientras tanto, cuéntanos cuántos equipos necesitas y con qué perfil: te enviamos una propuesta con modelos y condiciones.
      </p>
      <Button asChild className="mt-8">
        <Link href={`/cotizador?servicio=${kind === "laptop" ? "computo" : "impresion"}`}>
          Cotizar {kind === "laptop" ? "cómputo" : "impresión"}
          <ArrowRight aria-hidden />
        </Link>
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Asesor de upgrade                                                    */
/* ------------------------------------------------------------------ */

/**
 * Parte del equipo que el cliente tiene hoy y recomienda los dos peldaños siguientes de su escalera
 * (mismo tipo de impresión). Si su equipo es a color, puede considerar pasarse a monocromo.
 */
function UpgradeAdvisor({
  products,
  specsVisible,
  onCompare,
}: {
  products: Product[];
  specsVisible: (p: Product) => boolean;
  onCompare: (slugs: string[], message: string) => void;
}) {
  const { add, setOpen } = useQuoteCart();
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [toMono, setToMono] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // ?actual=slug (desde la ficha de un producto) preselecciona el equipo actual.
  useEffect(() => {
    const actual = new URLSearchParams(window.location.search).get("actual");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de la URL
    if (actual && printColorOf(actual)) setCurrentSlug(actual);
  }, []);

  const current = currentSlug ? getProduct(currentSlug) : undefined;
  const isColor = current ? printColorOf(current.slug) === "color" : false;
  const mono = isColor && toMono;
  const options = current ? (mono ? monoSwitchFor(current.slug, printSpeedOf) : upgradesFor(current.slug)) : [];

  const choose = (slug: string) => {
    setCurrentSlug(slug);
    setToMono(false);
    focusSoon(() => optionsRef.current);
  };

  const groups: { label: string; color: "mono" | "color" }[] = [
    { label: "Monocromo", color: "mono" },
    { label: "Color", color: "color" },
  ];

  return (
    <section id="upgrade" aria-labelledby="upgrade-title" className="scroll-mt-20 bg-white pt-14 pb-6 sm:pt-16 lg:pt-20">
      <div className="container-mt">
        <div className="max-w-3xl">
          <h2 id="upgrade-title" className="text-3xl leading-tight font-bold text-ink sm:text-4xl">
            ¿Qué equipo tienes hoy?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Elige tu modelo y te recomendamos dos opciones de mejora del mismo tipo de impresión, con lo que ganas en cada una.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {groups.map((g) => (
            <div key={g.color} role="group" aria-label={`Equipos ${g.label.toLowerCase()}`}>
              <p className="text-sm font-bold text-ink">{g.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {upgradeLadders[g.color].map((slug) => {
                  const p = products.find((x) => x.slug === slug);
                  if (!p) return null;
                  const on = currentSlug === slug;
                  return (
                    <button
                      key={slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => choose(slug)}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                        on ? "border-brand-blue bg-brand-blue text-white" : "border-line bg-white text-ink hover:border-brand-blue/40",
                      )}
                    >
                      {p.model}
                      {p.launchYear ? <span className={cn("text-xs font-medium", on ? "text-white" : "text-ink-soft")}>{p.launchYear}</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {current ? (
          <div ref={optionsRef} tabIndex={-1} className="animate-panel-in mt-10 rounded-[2rem] bg-surface p-5 outline-none sm:p-8" aria-live="polite">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-soft">Tienes un {current.name}</p>
                <h3 className="mt-1 text-2xl font-bold text-ink">
                  {options.length
                    ? mono
                      ? "Si te pasas a monocromo, te recomendamos:"
                      : "Te recomendamos estas mejoras:"
                    : mono
                      ? "No hay un monocromo más rápido en el catálogo."
                      : `Tu ${current.model} es el ${isColor ? "color" : "monocromo"} de mayor clase del catálogo.`}
                </h3>
              </div>
              {isColor ? (
                <div role="group" aria-label="Tipo de impresión del upgrade" className="inline-flex w-fit gap-1 rounded-full bg-white p-1.5 ring-1 ring-line ring-inset">
                  {[
                    { value: false, label: "Seguir en color" },
                    { value: true, label: "Pasar a monocromo" },
                  ].map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      aria-pressed={toMono === o.value}
                      onClick={() => setToMono(o.value)}
                      className={cn(
                        "inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors",
                        toMono === o.value ? "bg-brand-blue text-white" : "text-ink-soft hover:text-ink",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {mono && options.length ? (
              <p className="mt-3 text-sm text-ink-soft">Al pasar a monocromo dejas de imprimir a color, y ganas velocidad y capacidad.</p>
            ) : null}

            {options.length ? (
              <>
                <ul className="mt-6 grid gap-4 md:grid-cols-2">
                  {options.map((o, n) => {
                    const wins = specsVisible(current) && specsVisible(o) ? pairImprovements(current, o).slice(0, 3) : [];
                    return (
                      <li key={o.slug} className="flex flex-col rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-6">
                        <span className="text-xs font-bold text-brand-blue">Opción {n + 1}</span>
                        <p className="mt-1 text-xl font-bold text-ink">{o.name}</p>
                        <span
                          className={cn(
                            "mt-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-bold",
                            o.generation === "lanzamiento" ? "bg-brand-teal-50 text-brand-teal-800" : "bg-surface text-ink-soft",
                          )}
                        >
                          {o.generation === "lanzamiento" ? "Lanzamiento" : "Generación anterior"}
                          {o.launchYear ? ` · ${o.launchYear}` : ""}
                        </span>
                        {wins.length ? (
                          <ul className="mt-4 space-y-2">
                            {wins.map((w) => (
                              <li key={w.label} className="flex items-start gap-2.5 text-sm">
                                <span aria-hidden className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
                                  <Check className="size-3" strokeWidth={3} />
                                </span>
                                <span>
                                  <span className="font-semibold text-ink">{w.label}:</span>{" "}
                                  <span className="text-ink-soft tabular-nums">
                                    {fromTo(w.delta)} ({pctLabel(w.delta)})
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
                          <Button
                            variant="outline"
                            className="sm:flex-1"
                            onClick={() => onCompare([current.slug, o.slug], `Comparando tu ${current.model} con el ${o.model}.`)}
                          >
                            Comparar con mi equipo
                          </Button>
                          <Button
                            className="sm:flex-1"
                            onClick={() => {
                              add(o.slug);
                              setOpen(true);
                            }}
                            aria-label={`Agregar ${o.name} a la cotización`}
                          >
                            <Plus aria-hidden />
                            Cotizar
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {options.length > 1 ? (
                  <Button
                    size="lg"
                    className="mt-6 h-auto min-h-13 w-full py-3 whitespace-normal sm:w-auto"
                    onClick={() =>
                      onCompare(
                        [current.slug, ...options.map((o) => o.slug)],
                        `Comparando tu ${current.model} con sus ${options.length} opciones de mejora.`,
                      )
                    }
                  >
                    Comparar mi equipo con las dos opciones
                    <ArrowDown aria-hidden />
                  </Button>
                ) : null}
              </>
            ) : (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {isColor && !mono ? (
                  <Button variant="outline" onClick={() => setToMono(true)}>
                    Ver opciones en monocromo
                  </Button>
                ) : null}
                <Button asChild>
                  <Link href="/cotizador?servicio=impresion">
                    <Calculator aria-hidden />
                    Cotizar más equipos o el servicio completo
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
