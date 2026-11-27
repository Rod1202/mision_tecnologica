import { Eyebrow } from "@/components/brand/pills";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  id,
  align = "left",
  tone = "default",
  as: Heading = "h2",
  className,
}: {
  eyebrow: string;
  title: string;
  /** Parte del título que se destaca en color (debe aparecer tal cual dentro de `title`). */
  highlight?: string;
  description?: string;
  id?: string;
  align?: "left" | "center";
  tone?: "default" | "inverse";
  /** Nivel del título: h2 en secciones; h1 cuando la sección es la cabecera de la página. */
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <Heading
        id={id}
        className={cn(
          "mt-4 text-3xl leading-[1.1] font-bold sm:text-4xl lg:text-5xl",
          tone === "inverse" ? "text-white" : "text-ink",
        )}
      >
        <Highlighted text={title} part={highlight} tone={tone} />
      </Heading>
      {description ? (
        <p className={cn("mt-5 text-lg leading-relaxed", tone === "inverse" ? "text-white/85" : "text-ink-soft")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** Jerarquía por color: la parte clave del título en azul de acento (o turquesa sobre fondos azules). */
export function Highlighted({ text, part, tone = "default" }: { text: string; part?: string; tone?: "default" | "inverse" }) {
  const i = part ? text.indexOf(part) : -1;
  if (!part || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className={tone === "inverse" ? "text-brand-teal" : "text-brand-bright"}>{part}</span>
      {text.slice(i + part.length)}
    </>
  );
}
