import { presence, presenceKinds, type PresenceKind } from "@/lib/content/company";
import { LATAM_MAP_SIZE, latamCountries } from "@/lib/content/latam-map";
import { cn } from "@/lib/utils";

const fillOf: Record<PresenceKind, string> = {
  sede: "fill-white",
  filial: "fill-brand-teal",
  alianza: "fill-brand-bright",
};

const dotOf: Record<PresenceKind, string> = {
  sede: "bg-brand-blue ring-2 ring-brand-blue-100",
  filial: "bg-brand-teal",
  alianza: "bg-brand-bright",
};

/** Desplazamiento de la etiqueta respecto del punto (en % del mapa) para que no se encimen. */
const labelOffset: Record<string, { dx: number; dy: number; align?: "left" | "right" }> = {
  "484": { dx: 3, dy: -3 }, // México
  "188": { dx: -3, dy: 0, align: "right" }, // Costa Rica
  "170": { dx: 3, dy: -2 }, // Colombia
  "218": { dx: -3, dy: 0, align: "right" }, // Ecuador
  "604": { dx: -3, dy: 1, align: "right" }, // Perú
  "068": { dx: 3, dy: 0 }, // Bolivia
  "152": { dx: -3, dy: 3, align: "right" }, // Chile
};

/**
 * Mapa de presencia sobre tarjeta azul: sede (blanco), filial (turquesa) y alianzas (azul de acento),
 * con el nombre de cada país junto a su punto. Es decorativo: la información accesible está en la lista.
 */
export function PresenceMap({ className }: { className?: string }) {
  const kindOf = new Map(presence.locations.map((l) => [l.countryId, l.kind as PresenceKind]));
  const { width, height } = LATAM_MAP_SIZE;
  const marked = latamCountries.filter((c) => kindOf.has(c.id));

  return (
    <div aria-hidden className={cn("relative isolate overflow-hidden rounded-[2rem] bg-brand-blue p-6 shadow-lift sm:p-10", className)}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_30%_20%,rgb(0_82_204/0.35),transparent_70%)]" />
      <div className="relative mx-auto max-w-sm">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
          {latamCountries.map((c) => {
            const kind = kindOf.get(c.id);
            return <path key={c.id} d={c.d} className={cn("stroke-brand-blue stroke-[1.5]", kind ? fillOf[kind] : "fill-white/12")} />;
          })}
          {marked.map((c) => {
            const kind = kindOf.get(c.id)!;
            return (
              <g key={`pin-${c.id}`} transform={`translate(${c.x} ${c.y})`}>
                {kind === "sede" ? <circle r={20} className="fill-brand-teal/30 motion-safe:animate-ping [transform-box:fill-box] [transform-origin:center]" /> : null}
                <circle r={kind === "sede" ? 11 : 8} className="fill-brand-blue stroke-white stroke-[3]" />
              </g>
            );
          })}
        </svg>

        {marked.map((c) => {
          const kind = kindOf.get(c.id)!;
          const loc = presence.locations.find((l) => l.countryId === c.id)!;
          const off = labelOffset[c.id] ?? { dx: 3, dy: 0 };
          const right = off.align === "right";
          return (
            <span
              key={`label-${c.id}`}
              className={cn(
                "absolute -translate-y-1/2 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap shadow-sm sm:text-sm",
                kind === "sede" ? "bg-white text-brand-blue" : kind === "filial" ? "bg-brand-teal text-brand-blue" : "bg-brand-blue-800/90 text-white ring-1 ring-white/30",
                right && "-translate-x-full",
              )}
              style={{ left: `${(c.x / width) * 100 + off.dx}%`, top: `${(c.y / height) * 100 + off.dy}%` }}
            >
              {loc.country}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Lista accesible de la presencia, agrupada por tipo. */
export function PresenceLegend() {
  const groups = (Object.keys(presenceKinds) as PresenceKind[]).map((kind) => ({
    kind,
    label: presenceKinds[kind].label,
    items: presence.locations.filter((l) => l.kind === kind),
  }));

  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {groups.map((g) => (
        <div key={g.kind} className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <dt className="flex items-center gap-2.5 text-sm font-bold tracking-[0.06em] text-brand-bright uppercase">
            <span aria-hidden className={cn("size-3 rounded-full", dotOf[g.kind])} />
            {g.label}
          </dt>
          {g.items.map((l) => (
            <dd key={l.countryId} className="mt-3">
              <span className="block font-bold text-ink">{l.country}</span>
              {detailOf(l.detail) ? <span className="block text-sm text-ink-soft">{detailOf(l.detail)}</span> : null}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  );
}

/** El grupo ya dice "Alianzas estratégicas" o "Filial": solo se muestra el detalle adicional. */
const detailOf = (detail: string) => detail.replace(/^(Alianza estratégica|Filial)( · )?/, "");
