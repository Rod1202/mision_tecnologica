"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { ProductCard } from "@/components/catalog/product-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-controls";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { catalogLines, lineOfKind, type CatalogLine, type CatalogLineId } from "@/lib/content/catalog";
import type { Product } from "@/lib/content/products";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Estado de filtros ⇄ URL                                             */
/* ------------------------------------------------------------------ */

export const sortOptions = [
  { value: "relevancia", label: "Relevancia" },
  { value: "nombre-asc", label: "Nombre: A–Z" },
  { value: "nombre-desc", label: "Nombre: Z–A" },
] as const;
type Sort = (typeof sortOptions)[number]["value"];

type Filters = {
  line: CatalogLineId | "todo";
  categories: string[];
  brands: string[];
  sort: Sort;
};

const list = (v: string | null) => (v ? v.split(",").map(decodeURIComponent).filter(Boolean) : []);
const isLine = (v: string | null): v is CatalogLineId => catalogLines.some((l) => l.id === v);

function readFilters(params: URLSearchParams): Filters {
  const sort = params.get("orden") as Sort | null;
  const line = params.get("linea");
  return {
    line: isLine(line) ? line : "todo",
    categories: list(params.get("categoria")),
    brands: list(params.get("marca")),
    sort: sortOptions.some((o) => o.value === sort) ? (sort as Sort) : "relevancia",
  };
}

function toQuery(f: Filters) {
  const q = new URLSearchParams();
  if (f.line !== "todo") q.set("linea", f.line);
  if (f.categories.length) q.set("categoria", f.categories.map(encodeURIComponent).join(","));
  if (f.brands.length) q.set("marca", f.brands.map(encodeURIComponent).join(","));
  if (f.sort !== "relevancia") q.set("orden", f.sort);
  const s = q.toString();
  return s ? `?${s}` : "";
}

/* ------------------------------------------------------------------ */
/* Lógica de filtrado                                                   */
/* ------------------------------------------------------------------ */

type Facet = "categories" | "brands";

const lineOf = (p: Product) => lineOfKind[p.kind];

function matches(p: Product, f: Filters, skip?: Facet) {
  if (f.line !== "todo" && lineOf(p) !== f.line) return false;
  if (skip !== "categories" && f.categories.length && !f.categories.includes(p.category)) return false;
  if (skip !== "brands" && f.brands.length && !f.brands.includes(p.brand)) return false;
  return true;
}

function sortProducts(items: Product[], sort: Sort, original: Product[]) {
  const sorted = [...items];
  switch (sort) {
    case "nombre-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
    case "nombre-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name, "es"));
    default:
      return sorted.sort((a, b) => original.indexOf(a) - original.indexOf(b));
  }
}

function facetCounts(products: Product[], f: Filters, key: "category" | "brand", facet: Facet) {
  const inLine = products.filter((p) => f.line === "todo" || lineOf(p) === f.line);
  const values = Array.from(new Set(inLine.map((p) => p[key]))).sort((a, b) => a.localeCompare(b, "es"));
  return values.map((value) => ({
    value,
    count: inLine.filter((p) => p[key] === value && matches(p, f, facet)).length,
  }));
}

/* ------------------------------------------------------------------ */
/* Componente                                                           */
/* ------------------------------------------------------------------ */

export function CatalogBrowser({ products }: { products: Product[] }) {
  const pathname = usePathname();
  const params = useSearchParams();
  // Estado local (respuesta inmediata) inicializado desde la URL, para que los enlaces filtrados se puedan compartir.
  const [filters, setFilters] = useState<Filters>(() => readFilters(new URLSearchParams(params.toString())));
  const [mobileOpen, setMobileOpen] = useState(false);

  // La URL se actualiza con la History API: sin navegación ni petición al servidor.
  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    try {
      window.history.replaceState(window.history.state, "", `${pathname}${toQuery(next)}`);
    } catch {
      /* ignorar */
    }
  };
  const clearAll = () => update({ categories: [], brands: [], sort: "relevancia" });

  const results = useMemo(
    () => sortProducts(products.filter((p) => matches(p, filters)), filters.sort, products),
    [products, filters],
  );
  const categories = facetCounts(products, filters, "category", "categories");
  const brands = facetCounts(products, filters, "brand", "brands");
  const line = filters.line === "todo" ? null : catalogLines.find((l) => l.id === filters.line)!;
  const lineCount = (id: CatalogLineId) => products.filter((p) => lineOf(p) === id).length;

  const activeChips = [
    ...filters.categories.map((c) => ({ label: c, onRemove: () => update({ categories: filters.categories.filter((x) => x !== c) }) })),
    ...filters.brands.map((b) => ({ label: `Marca: ${b}`, onRemove: () => update({ brands: filters.brands.filter((x) => x !== b) }) })),
  ];

  const panel = (
    <FilterPanel
      filters={filters}
      categories={categories}
      brands={brands}
      onToggle={(key, value) => {
        const current = filters[key];
        update({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] } as Partial<Filters>);
      }}
      onClear={clearAll}
      hasActive={activeChips.length > 0}
    />
  );

  return (
    <div>
      {/* Líneas del catálogo */}
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div role="group" aria-label="Líneas del catálogo" className="inline-flex min-w-max gap-1 rounded-full bg-white p-1.5 ring-1 ring-line ring-inset">
          {[{ id: "todo" as const, title: "Todo el catálogo", icon: null }, ...catalogLines].map((l) => {
            const active = filters.line === l.id;
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={active}
                onClick={() => update({ line: l.id, categories: [], brands: [] })}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.95rem] font-semibold whitespace-nowrap transition-colors sm:px-5",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
                  active ? "bg-brand-blue text-white shadow-[0_8px_20px_-10px_rgb(0_61_153/0.7)]" : "text-ink-soft hover:text-ink",
                )}
              >
                {l.icon ? <Icon name={l.icon} className="size-4" /> : null}
                {l.title}
              </button>
            );
          })}
        </div>
      </div>

      {line ? <LineOverview line={line} count={lineCount(line.id)} /> : null}

      {line && lineCount(line.id) === 0 ? null : (
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Filtros: barra lateral en escritorio */}
          <aside aria-label="Filtros" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28 rounded-3xl border border-line bg-white p-6 shadow-soft">{panel}</div>
          </aside>

          <div className="min-w-0 lg:col-span-9">
            {/* Barra de resultados y orden */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p role="status" aria-live="polite" className="font-semibold text-ink">
                {results.length} {results.length === 1 ? "equipo" : "equipos"}
                {activeChips.length > 0 ? <span className="font-normal text-ink-soft"> con los filtros aplicados</span> : null}
              </p>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="lg:hidden" onClick={() => setMobileOpen(true)}>
                  <SlidersHorizontal aria-hidden />
                  Filtros{activeChips.length > 0 ? ` (${activeChips.length})` : ""}
                </Button>
                <label htmlFor="orden" className="sr-only">
                  Ordenar por
                </label>
                <div className="min-w-0 flex-1 sm:w-56 sm:flex-none">
                  <Select id="orden" value={filters.sort} onChange={(e) => update({ sort: e.target.value as Sort })} className="h-11">
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value === "relevancia" ? "Ordenar: Relevancia" : o.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Filtros activos */}
            {activeChips.length > 0 ? (
              <ul aria-label="Filtros activos" className="mt-5 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <li key={chip.label}>
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-50 py-1.5 pr-2.5 pl-3.5 text-sm font-semibold text-brand-blue-800 hover:bg-brand-blue-100"
                      aria-label={`Quitar filtro ${chip.label}`}
                    >
                      {chip.label}
                      <X aria-hidden className="size-3.5" />
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={clearAll} className="px-2 text-sm font-semibold text-ink-soft underline-offset-4 hover:text-brand-blue hover:underline">
                    Limpiar todo
                  </button>
                </li>
              </ul>
            ) : null}

            {/* Resultados */}
            {results.length > 0 ? (
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p) => (
                  <li key={p.slug}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 rounded-[2rem] border border-dashed border-line bg-white p-10 text-center">
                <p className="text-lg font-semibold text-ink">No encontramos equipos con estos filtros.</p>
                <p className="mt-2 text-ink-soft">Prueba quitando algún filtro.</p>
                <Button variant="outline" className="mt-6" onClick={clearAll}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtros: panel lateral en móvil */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent closeLabel="Cerrar filtros">
          <div className="border-b border-line px-5 py-5 pr-16">
            <SheetTitle className="text-xl font-bold text-ink">Filtros</SheetTitle>
            <SheetDescription className="mt-1 text-sm text-ink-soft">Los resultados se actualizan al instante.</SheetDescription>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{panel}</div>
          <div className="border-t border-line p-5">
            <Button size="lg" className="w-full" onClick={() => setMobileOpen(false)}>
              Ver {results.length} {results.length === 1 ? "equipo" : "equipos"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Resumen de la línea: qué cotizamos, aunque aún no tenga fichas        */
/* ------------------------------------------------------------------ */

function LineOverview({ line, count }: { line: CatalogLine; count: number }) {
  return (
    <div className="mt-8 grid gap-6 rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-12 lg:items-center">
      <div className="flex gap-4 lg:col-span-7">
        <span aria-hidden className="inline-flex h-12 w-16 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
          <Icon name={line.icon} className="size-6" />
        </span>
        <div className="min-w-0">
          <h3 className="text-2xl font-bold text-ink">{line.title}</h3>
          <p className="mt-1 leading-relaxed text-ink-soft">{line.summary}</p>
          {line.brands.length ? (
            <p className="mt-2 text-sm font-semibold text-ink-soft">
              Marcas: <span className="text-ink">{line.brands.join(" · ")}</span>
            </p>
          ) : null}
          <ul aria-label={`Categorías de ${line.title}`} className="mt-4 flex flex-wrap gap-2">
            {line.categories.map((c) => (
              <li key={c} className="rounded-full bg-surface px-3 py-1 text-sm font-semibold text-ink-soft">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-3xl bg-surface p-6 lg:col-span-5">
        <p className="font-bold text-ink">
          {count === 0 ? "Estamos publicando las fichas de esta línea." : "¿No ves el modelo que buscas?"}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Cotizamos todas estas categorías. Cuéntanos qué equipos necesitas y te enviamos una propuesta con modelos y condiciones.
        </p>
        <Button asChild className="mt-5">
          <Link href={`/cotizador?servicio=${line.quoteService}`}>
            Cotizar {line.title.toLowerCase()}
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel de filtros (compartido entre escritorio y móvil)               */
/* ------------------------------------------------------------------ */

function FilterPanel({
  filters,
  categories,
  brands,
  onToggle,
  onClear,
  hasActive,
}: {
  filters: Filters;
  categories: { value: string; count: number }[];
  brands: { value: string; count: number }[];
  onToggle: (key: "categories" | "brands", value: string) => void;
  onClear: () => void;
  hasActive: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Filtrar</h2>
        {hasActive ? (
          <button type="button" onClick={onClear} className="text-sm font-semibold text-brand-blue hover:underline">
            Limpiar
          </button>
        ) : null}
      </div>

      <CheckboxGroup legend="Categoría" options={categories} selected={filters.categories} onToggle={(v) => onToggle("categories", v)} />
      <CheckboxGroup legend="Marca" options={brands} selected={filters.brands} onToggle={(v) => onToggle("brands", v)} />
    </div>
  );
}

function CheckboxGroup({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  options: { value: string; count: number }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">{legend}</legend>
      <ul className="mt-3 space-y-1">
        {options.map((o) => {
          const checked = selected.includes(o.value);
          const disabled = o.count === 0 && !checked;
          return (
            <li key={o.value}>
              <label
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 transition-colors hover:bg-surface",
                  disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(o.value)}
                  className="size-5 shrink-0 rounded accent-brand-blue"
                />
                <span className="flex-1 font-medium text-ink">{o.value}</span>
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-ink-soft tabular-nums">{o.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
