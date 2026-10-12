import Link from "next/link";
import { ArrowRight, Construction } from "lucide-react";

import { Eyebrow, IsoStrokes } from "@/components/brand/pills";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Cabecera de páginas interiores (fondo de marca + franjas del isotipo). */
export function PageIntro({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-blue text-white">
      <IsoStrokes className="top-[-30%] right-[-45%] -z-10 h-[170%] w-[95%] opacity-[0.09] sm:right-[-20%] sm:w-[70%] lg:right-[-4%] lg:w-[42%]" />
      <div className="container-mt py-14 sm:py-20 lg:py-24">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} className="mb-8" /> : null}
        <Eyebrow tone="inverse">{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-4xl text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">{title}</h1>
        {description ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}

/** Aviso de contenido en preparación: deja claro que la página aún no está completa. */
export function ComingSoon({ text }: { text?: string }) {
  return (
    <section className="section-y bg-white">
      <div className="container-mt">
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-dashed border-line bg-surface px-6 py-12 text-center sm:px-12">
          <span className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
            <Construction aria-hidden className="size-6" />
          </span>
          <h2 className="mt-6 text-2xl font-bold text-ink">Contenido en preparación</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            {text ?? "Estamos preparando esta sección. Mientras tanto, conversemos sobre lo que necesita tu empresa."}
          </p>
          <Button asChild className="mt-8">
            <Link href="/#contacto">
              Solicitar asesoría
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/** Banda final de conversión para páginas interiores. */
export function CtaBand({
  title = "¿Qué necesita mejorar tu empresa?",
  text = "Cuéntanos qué necesita tu organización y te ayudaremos a identificar el siguiente paso.",
  primary = { label: "Solicitar asesoría", href: "/contacto" },
  secondary,
  className = "section-y",
}: {
  title?: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Por defecto `section-y`; si la sección anterior también es blanca, usar solo padding inferior. */
  className?: string;
}) {
  return (
    <section className={cn("bg-white", className)}>
      <div className="container-mt">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand-gradient-deep px-6 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-16 lg:py-16">
          <IsoStrokes className="top-[-40%] right-[-10%] -z-10 h-[180%] w-[45%] opacity-[0.09]" />
          <div className="max-w-2xl">
            <h2 className="text-3xl leading-tight font-bold sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg text-white/85">{text}</p>
          </div>
          <div className="mt-8 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0">
            <Button asChild variant="inverse" size="lg">
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            {secondary ? (
              <Button asChild variant="outline-inverse" size="lg">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
