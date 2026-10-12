"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { ProductCard } from "@/components/catalog/product-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-controls";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, type Product } from "@/lib/content/products";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Estado de filtros ⇄ URL                                             */
/* ------------------------------------------------------------------ */

export const sortOptions = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre-asc", label: "Nombre: A–Z" },
  { value: "nombre-desc", label: "Nombre: Z–A" },
] as const;
type Sort = (typeof sortOptions)[number]["value"];

type Filters = {
  categories: string[];
  brands: string[];
  min?: number;
  max?: number;
  sort: Sort;
};

const list = (v: string | null) => (v ? v.split(",").map(decodeURIComponent).filter(Boolean) : []);
const num = (v: string | null) => {
  if (v === null || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

function readFilters(params: URLSearchParams): Filters {
  const sort = params.get("orden") as Sort | null;
  return {
    categories: list(params.get("categoria")),
    brands: list(params.get("marca")),
    min: num(params.get("min")),
    max: num(params.get("max")),
    sort: sortOptions.some((o) => o.value === sort) ? (sort as Sort) : "relevancia",
  };
}

function toQuery(f: Filters) {
  const q = new URLSearchParams();
  if (f.categories.length) q.set("categoria", f.categories.map(encodeURIComponent).join(","));
  if (f.brands.length) q.set("marca", f.brands.map(encodeURIComponent).join(","));
  if (f.min !== undefined) q.set("min", String(f.min));
  if (f.max !== undefined) q.set("max", String(f.max));
  if (f.sort !== "relevancia") q.set("orden", f.sort);
  const s = q.toString();
  return s ? `?${s}` : "";
}

/* ------------------------------------------------------------------ */
/* Lógica de filtrado                                                   */
/* ------------------------------------------------------------------ */

type Facet = "categories" | "brands" | "price";

function matches(p: Product, f: Filters, skip?: Facet) {
  if (skip !== "categories" && f.categories.length && !f.categories.includes(p.category)) return false;
  if (skip !== "brands" && f.brands.length && !f.brands.includes(p.brand)) return false;
  if (skip !== "price" && (f.min !== undefined || f.max !== undefined)) {
    if (p.price === undefined) return false; // "A cotizar" no entra en un rango de precio
    if (f.min !== undefined && p.price < f.min) return false;
    if (f.max !== undefined && p.price > f.max) return false;
  }
  return true;
}

function sortProducts(items: Product[], sort: Sort, original: Product[]) {
  const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
    if (a.price === undefined) return 1; // sin precio al final
    if (b.price === undefined) return -1;
    return (a.price - b.price) * dir;
  };
  const sorted = [...items];
  switch (sort) {
    case "precio-asc":
      return sorted.sort(byPrice(1));
    case "precio-desc":
      return sorted.sort(byPrice(-1));
    case "nombre-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
    case "nombre-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name, "es"));
    default:
      return sorted.sort((a, b) => original.indexOf(a) - original.indexOf(b));
  }
}

function facetCounts(products: Product[], f: Filters, key: "category" | "brand", facet: Facet) {
  const values = Array.from(new Set(products.map((p) => p[key]))).sort((a, b) => a.localeCompare(b, "es"));
  return values.map((value) => ({
    value,
    count: products.filter((p) => p[key] === value && matches(p, f, facet)).length,
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

  // La URL se actualiza con la History API: sin navegación ni petición al servidor (Next sincroniza useSearchParams).
  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    try {
      window.history.replaceState(window.history.state, "", `${pathname}${toQuery(next)}`);
    } catch {
      /* ignorar */
    }
  };
  const clearAll = () => update({ categories: [], brands: [], min: undefined, max: undefined, sort: "relevancia" });

  const results = useMemo(
    () => sortProducts(products.filter((p) => matches(p, filters)), filters.sort, products),
    [products, filters],
  );
  const categories = facetCounts(products, filters, "category", "categories");
  const brands = facetCounts(products, filters, "brand", "brands");
  const prices = products.map((p) => p.price).filter((v): v is number => v !== undefined);
  const priceBounds = prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null;

  const activeChips = [
    ...filters.categories.map((c) => ({ label: c, onRemove: () => update({ categories: filters.categories.filter((x) => x !== c) }) })),
    ...filters.brands.map((b) => ({ label: `Marca: ${b}`, onRemove: () => update({ brands: filters.brands.filter((x) => x !== b) }) })),
    ...(filters.min !== undefined ? [{ label: `Desde ${formatPrice(filters.min)}`, onRemove: () => update({ min: undefined }) }] : []),
    ...(filters.max !== undefined ? [{ label: `Hasta ${formatPrice(filters.max)}`, onRemove: () => update({ max: undefined }) }] : []),
  ];

  const panel = (
    <FilterPanel
      filters={filters}
      categories={categories}
      brands={brands}
      priceBounds={priceBounds}
      onToggle={(key, value) => {
        const current = filters[key];
        update({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] } as Partial<Filters>);
      }}
      onPrice={(min, max) => update({ min, max })}
      onClear={clearAll}
      hasActive={activeChips.length > 0}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
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
            <div className="min-w-0 flex-1 sm:w-60 sm:flex-none">
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
            <p className="mt-2 text-ink-soft">Prueba quitando algún filtro o ampliando el rango de precio.</p>
            <Button variant="outline" className="mt-6" onClick={clearAll}>
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

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
/* Panel de filtros (compartido entre escritorio y móvil)               */
/* ------------------------------------------------------------------ */

function FilterPanel({
  filters,
  categories,
  brands,
  priceBounds,
  onToggle,
  onPrice,
  onClear,
  hasActive,
}: {
  filters: Filters;
  categories: { value: string; count: number }[];
  brands: { value: string; count: number }[];
  priceBounds: { min: number; max: number } | null;
  onToggle: (key: "categories" | "brands", value: string) => void;
  onPrice: (min?: number, max?: number) => void;
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

      <CheckboxGroup
        legend="Categoría"
        options={categories}
        selected={filters.categories}
        onToggle={(v) => onToggle("categories", v)}
      />
      <CheckboxGroup legend="Marca" options={brands} selected={filters.brands} onToggle={(v) => onToggle("brands", v)} />

      {priceBounds ? <PriceRange bounds={priceBounds} min={filters.min} max={filters.max} onChange={onPrice} /> : null}
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

function PriceRange({
  bounds,
  min,
  max,
  onChange,
}: {
  bounds: { min: number; max: number };
  min?: number;
  max?: number;
  onChange: (min?: number, max?: number) => void;
}) {
  const [draftMin, setDraftMin] = useState(min?.toString() ?? "");
  const [draftMax, setDraftMax] = useState(max?.toString() ?? "");

  // Sincroniza los campos si los filtros cambian desde fuera (chips, "Limpiar").
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reflejar el estado de la URL en los campos
    setDraftMin(min?.toString() ?? "");
    setDraftMax(max?.toString() ?? "");
  }, [min, max]);

  // Aplica el rango tras una breve pausa al escribir.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const nMin = draftMin.trim() === "" ? undefined : Math.max(0, Number(draftMin));
      const nMax = draftMax.trim() === "" ? undefined : Math.max(0, Number(draftMax));
      const valid = (v?: number) => v === undefined || Number.isFinite(v);
      if (!valid(nMin) || !valid(nMax)) return;
      if (nMin !== min || nMax !== max) onChange(nMin, nMax);
    }, 450);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo reaccionar a lo que escribe el usuario
  }, [draftMin, draftMax]);

  const invalid = draftMin !== "" && draftMax !== "" && Number(draftMin) > Number(draftMax);

  return (
    <fieldset>
      <legend className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">Precio referencial (S/)</legend>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="precio-min" className="text-xs font-semibold text-ink-soft">
            Mínimo
          </label>
          <input
            id="precio-min"
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            placeholder={String(bounds.min)}
            value={draftMin}
            onChange={(e) => setDraftMin(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-input bg-white px-3 text-ink tabular-nums outline-none focus-visible:border-brand-blue focus-visible:ring-4 focus-visible:ring-brand-blue/15"
          />
        </div>
        <div>
          <label htmlFor="precio-max" className="text-xs font-semibold text-ink-soft">
            Máximo
          </label>
          <input
            id="precio-max"
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            placeholder={String(bounds.max)}
            value={draftMax}
            onChange={(e) => setDraftMax(e.target.value)}
            aria-invalid={invalid}
            className="mt-1 h-11 w-full rounded-xl border border-input bg-white px-3 text-ink tabular-nums outline-none focus-visible:border-brand-blue focus-visible:ring-4 focus-visible:ring-brand-blue/15 aria-[invalid=true]:border-destructive"
          />
        </div>
      </div>
      <p className={cn("mt-2 text-xs", invalid ? "font-medium text-destructive" : "text-ink-faint")}>
        {invalid
          ? "El mínimo no puede ser mayor que el máximo."
          : `Catálogo: ${formatPrice(bounds.min)} – ${formatPrice(bounds.max)}`}
      </p>
    </fieldset>
  );
}
