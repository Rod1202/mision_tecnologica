import { presence, presenceKinds, type PresenceKind } from "@/lib/content/company";
import { LATAM_MAP_SIZE, latamCountries } from "@/lib/content/latam-map";
import { cn } from "@/lib/utils";

const fillOf: Record<PresenceKind, string> = {
  sede: "fill-brand-blue",
  filial: "fill-brand-teal",
  alianza: "fill-brand-blue/45",
};

const dotOf: Record<PresenceKind, string> = {
  sede: "bg-brand-blue",
  filial: "bg-brand-teal",
  alianza: "bg-brand-blue/45",
};

/**
 * Mapa de presencia (sede, filial y alianzas). El SVG es decorativo; la información accesible está en la
 * leyenda/lista que lo acompaña.
 */
export function PresenceMap({ className }: { className?: string }) {
  const kindOf = new Map(presence.locations.map((l) => [l.countryId, l.kind as PresenceKind]));
  const { width, height } = LATAM_MAP_SIZE;

  return (
    <div className={cn("relative", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden className="h-auto w-full">
        {latamCountries.map((c) => {
          const kind = kindOf.get(c.id);
          return (
            <path
              key={c.id}
              d={c.d}
              className={cn("stroke-white stroke-[1.2]", kind ? fillOf[kind] : "fill-[#e3e9f2]")}
            />
          );
        })}
        {latamCountries
          .filter((c) => kindOf.has(c.id))
          .map((c) => {
            const kind = kindOf.get(c.id)!;
            return (
              <g key={`pin-${c.id}`} transform={`translate(${c.x} ${c.y})`}>
                <circle r={kind === "sede" ? 13 : 9} className="fill-white" />
                <circle r={kind === "sede" ? 7 : 5} className={kind === "sede" ? "fill-brand-blue-800" : kind === "filial" ? "fill-brand-teal-700" : "fill-brand-blue"} />
              </g>
            );
          })}
      </svg>
    </div>
  );
}

/** El grupo ya dice "Alianzas estratégicas" o "Filial": solo se muestra el detalle adicional. */
const detailOf = (detail: string) => detail.replace(/^(Alianza estratégica|Filial)( · )?/, "");

export function PresenceLegend() {
  const groups = (Object.keys(presenceKinds) as PresenceKind[]).map((kind) => ({
    kind,
    label: presenceKinds[kind].label,
    items: presence.locations.filter((l) => l.kind === kind),
  }));

  return (
    <dl className="space-y-6">
      {groups.map((g) => (
        <div key={g.kind}>
          <dt className="flex items-center gap-2.5 text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">
            <span aria-hidden className={cn("size-3.5 rounded-full", dotOf[g.kind])} />
            {g.label}
          </dt>
          {g.items.map((l) => (
            <dd key={l.countryId} className="mt-2 pl-6">
              <span className="font-bold text-ink">{l.country}</span>
              {detailOf(l.detail) ? <span className="text-ink-soft"> · {detailOf(l.detail)}</span> : null}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  );
}
