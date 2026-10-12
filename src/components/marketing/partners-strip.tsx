import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { partners, type Partner } from "@/lib/content/partners";
import { showUnverifiedContent } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Franja de marcas aliadas (Inicio, justo después del hero). */
export function PartnersStrip() {
  const preview = showUnverifiedContent();
  const visible = partners.filter((p) => !p.placeholder || preview);
  if (visible.length === 0) return null;

  return (
    <section aria-labelledby="partners-title" className="bg-white">
      <div className="container-mt flex flex-col items-center gap-6 py-10 lg:flex-row lg:gap-12 lg:py-12">
        <h2
          id="partners-title"
          className="shrink-0 text-center text-sm font-bold tracking-[0.08em] text-ink-soft uppercase lg:max-w-40 lg:text-left"
        >
          Marcas aliadas
        </h2>
        <span aria-hidden className="hidden h-12 w-px shrink-0 bg-line lg:block" />
        <ul className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 lg:flex-1 lg:justify-start">
          {visible.map((p, i) => (
            <li key={`${p.name}-${i}`} className="w-[calc(50%-0.375rem)] sm:w-40 xl:w-44">
              <PartnerLogo partner={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const body = partner.logo ? (
    <Image
      src={partner.logo}
      alt={partner.name}
      fill
      sizes="160px"
      className="object-contain p-3 opacity-70 grayscale transition-[opacity,filter] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
    />
  ) : partner.placeholder ? (
    <>
      <ImageIcon aria-hidden className="size-5 text-ink-faint/60" strokeWidth={1.5} />
      <span className="sr-only">Espacio para logotipo</span>
    </>
  ) : (
    <span className="text-2xl font-extrabold tracking-tight text-ink-soft transition-colors group-hover:text-brand-blue">
      {partner.name}
    </span>
  );

  const box = cn(
    "group relative flex h-16 w-full items-center justify-center rounded-2xl",
    partner.placeholder ? "border border-dashed border-ink-faint/40" : "bg-white ring-1 ring-line shadow-soft",
  );

  return partner.url ? (
    <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={partner.name} className={box}>
      {body}
    </a>
  ) : (
    <div className={box}>{body}</div>
  );
}
