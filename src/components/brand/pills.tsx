import { cn } from "@/lib/utils";

/**
 * Recursos gráficos derivados de las formas del isotipo (brandbook · Redes · Lineamientos):
 * píldoras de extremos redondeados, inclinadas como los trazos del isotipo o en horizontal.
 * Son decorativas: siempre `aria-hidden`.
 */

/** Trazos inclinados al estilo del isotipo (///), como textura de fondo. */
export function IsoStrokes({ className, tone = "white" }: { className?: string; tone?: "white" | "blue" }) {
  const color = tone === "white" ? "bg-white" : "bg-brand-blue";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute flex gap-[6%]", className)}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={cn("block h-full w-[22%] origin-center rotate-[15deg] rounded-full", color)} />
      ))}
    </div>
  );
}

/** Pequeñas píldoras horizontales ("guiones") usadas como acento en las piezas de marca. */
export function Dash({ className }: { className?: string }) {
  return <span aria-hidden className={cn("pointer-events-none absolute block h-2.5 w-14 rounded-full", className)} />;
}

/** Marcador de antetítulo: una píldora turquesa corta antes del texto. */
export function Eyebrow({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "inverse";
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 text-sm font-bold tracking-[0.08em] uppercase",
        tone === "inverse" ? "text-white/90" : "text-brand-blue",
        className,
      )}
    >
      <span aria-hidden className={cn("h-2 w-8 rounded-full", tone === "inverse" ? "bg-brand-teal" : "bg-brand-gradient")} />
      {children}
    </p>
  );
}
