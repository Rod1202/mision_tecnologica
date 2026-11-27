import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Leaf } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { SectionHeading } from "@/components/marketing/section-heading";
import { serviceLayers, sustainability } from "@/lib/content/home";

/**
 * 04 · Autoridad y valor agregado.
 * Izquierda: capas de servicio que complementan cada solución. Derecha: sustentabilidad (insignia sobre fondo de selva).
 */
export function ServiceLayers() {
  return (
    <section aria-labelledby="capas-title" className="section-y bg-smoke">
      <div className="container-mt grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <SectionHeading
            id="capas-title"
            eyebrow="Valor agregado"
            title="Servicios adaptables, con capas que suman."
            highlight="con capas que suman."
            description="Ofrecemos servicios adaptables a los requerimientos de cada cliente y los complementamos con capas de servicio."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {serviceLayers.map((l) => (
              <li key={l.title} className="flex gap-4 rounded-3xl border border-line bg-white p-5 shadow-soft">
                <span aria-hidden className="inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-bright">
                  <Icon name={l.icon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-ink">{l.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{l.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <SustainabilityCard />
        </div>
      </div>
    </section>
  );
}

export function SustainabilityCard({ className }: { className?: string }) {
  const s = sustainability;
  return (
    <article
      aria-labelledby="sustentabilidad-title"
      className={`relative isolate flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[2rem] p-7 text-white shadow-lift sm:p-10 ${className ?? ""}`}
    >
      {s.background ? (
        <>
          <Image src={s.background} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="-z-20 object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(1_26_71/0.15)_0%,rgb(1_40_38/0.85)_70%)]" />
        </>
      ) : (
        // Respaldo mientras llega la foto de selva: degradé verde azulado con hojas del isotipo.
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_85%_0%,#0c7a63_0%,#064d45_45%,#022b2c_100%)]">
          <Leaf className="absolute top-8 right-8 size-40 rotate-12 text-white/[0.07]" strokeWidth={1} />
          <Leaf className="absolute top-36 right-40 size-24 -rotate-12 text-white/[0.06]" strokeWidth={1} />
        </div>
      )}

      <span className="inline-flex size-20 items-center justify-center rounded-full bg-white text-[#0b6b58] shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)]">
        <Award aria-hidden className="size-9" strokeWidth={1.6} />
      </span>
      <p className="mt-6 text-sm font-bold tracking-[0.08em] text-white/85 uppercase">Sustentabilidad</p>
      <h2 id="sustentabilidad-title" className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">
        {s.title}
      </h2>
      <p className="mt-2 inline-flex self-start rounded-full bg-white/15 px-3 py-1 font-semibold ring-1 ring-white/25 ring-inset">{s.streak}</p>
      <p className="mt-4 leading-relaxed text-white/90">{s.text}</p>

      {s.badges.length ? (
        <ul aria-label="Reconocimientos" className="mt-6 grid gap-3 sm:grid-cols-2">
          {s.badges.map((b) => (
            <li key={b.label} className="flex items-center gap-3 rounded-2xl bg-white/12 p-3 ring-1 ring-white/20 ring-inset">
              {b.image ? (
                <span className="relative size-12 shrink-0 rounded-full bg-white">
                  <Image src={b.image} alt="" fill sizes="48px" className="object-contain p-1.5" />
                </span>
              ) : (
                <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0b6b58]">
                  <Leaf className="size-5" />
                </span>
              )}
              <span className="min-w-0">
                <span className="block font-bold leading-snug">{b.label}</span>
                <span className="block text-sm text-white/85">{b.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <Link
        href="/asesoria"
        className="mt-7 inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-white px-6 font-semibold text-[#0b6b58] transition-colors hover:bg-white/90"
      >
        Suma sustentabilidad a tu operación
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </article>
  );
}
