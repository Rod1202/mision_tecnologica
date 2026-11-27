import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Check, Compass, Eye } from "lucide-react";

import { IsoStrokes } from "@/components/brand/pills";
import { PresenceLegend, PresenceMap } from "@/components/company/presence-map";
import { CtaBand, PageIntro } from "@/components/layout/page-intro";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SustainabilityCard } from "@/components/marketing/service-layers";
import { Button } from "@/components/ui/button";
import { about, certifications, hpPartnership, leaders, presence } from "@/lib/content/company";
import { solutionHref } from "@/lib/content/solutions";
import { pageMetadata } from "@/lib/seo";
import { showUnverifiedContent } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Nosotros: HP Power Services Partner, normas ISO y presencia en Latinoamérica",
  description:
    "Misión Tecnológica es una empresa peruana de soluciones TI, cómputo e impresión: HP Power Services Partner y Centro de Servicio Autorizado HP, con normas ISO, sede en Lima, filial en Bolivia y alianzas en la región.",
  path: "/nosotros",
});

export default function NosotrosPage() {
  const preview = showUnverifiedContent();
  const team = leaders.filter((l) => l.verified || preview);

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Nosotros" }]}
        eyebrow="Nosotros"
        title="Tecnología que acompaña la operación de las empresas."
        description={about.intro}
      >
        <ul className="mt-9 flex flex-wrap gap-3" aria-label="Credenciales">
          {[hpPartnership.badge, ...certifications.map((c) => c.code), "Presencia en Latinoamérica"].map((t) => (
            <li key={t} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-ink shadow-soft ring-1 ring-line ring-inset">
              <Check aria-hidden className="size-4 text-brand-bright" strokeWidth={3} />
              {t}
            </li>
          ))}
        </ul>
      </PageIntro>

      {/* Qué es Misión + presencia */}
      <section aria-labelledby="presencia-title" className="section-y bg-white">
        <div className="container-mt">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <SectionHeading
                id="presencia-title"
                eyebrow="Qué es Misión"
                title="Presencia en toda Latinoamérica."
                highlight="toda Latinoamérica."
                description={presence.intro}
              />
              <dl className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
                {[...about.stats, { value: String(presence.locations.length), label: "países con presencia" }].map((st) => (
                  <div key={st.label} className="flex flex-col-reverse rounded-3xl bg-surface px-4 py-5 sm:px-6">
                    <dt className="mt-1 text-sm font-semibold text-ink-soft">{st.label}</dt>
                    <dd className="text-3xl font-extrabold text-brand-bright sm:text-4xl">{st.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-6">
              <PresenceMap />
            </div>
          </div>
          <div className="mt-10">
            <PresenceLegend />
          </div>
        </div>
      </section>

      {/* Misión, visión y valores */}
      <section aria-labelledby="proposito-title" className="section-y bg-surface">
        <div className="container-mt">
          <SectionHeading id="proposito-title" eyebrow="Propósito" title="Misión, visión y valores." highlight="valores." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-white p-8 shadow-soft sm:p-10">
              <IsoStrokes tone="blue" className="top-[-30%] right-[-25%] -z-10 h-[160%] w-[70%] opacity-[0.05]" />
              <span className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-blue text-white">
                <Compass aria-hidden className="size-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-6 text-sm font-bold tracking-[0.08em] text-brand-bright uppercase">Misión</h3>
              <p className="mt-2 text-xl leading-relaxed font-semibold text-ink sm:text-2xl">{about.mission}</p>
            </div>
            <div className="rounded-[2rem] border border-line bg-white p-8 shadow-soft sm:p-10">
              <span className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-blue-50 text-brand-bright">
                <Eye aria-hidden className="size-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-6 text-sm font-bold tracking-[0.08em] text-brand-bright uppercase">Visión</h3>
              <p className="mt-2 text-xl leading-relaxed font-semibold text-ink sm:text-2xl">{about.vision}</p>
            </div>
          </div>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {about.values.map((v, i) => (
              <li key={v.title} className="rounded-3xl border border-line bg-white p-6 shadow-soft">
                <span className="text-sm font-extrabold text-brand-bright tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-bold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* HP Power Services Partner */}
      <section aria-labelledby="hp-title" className="section-y bg-white">
        <div className="container-mt grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="hp-title" eyebrow="Alianza con HP" title={hpPartnership.title} highlight="Power Services" description={hpPartnership.description} />
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{hpPartnership.meaning}</p>
            <Button asChild variant="outline" size="lg" className="mt-8">
              <Link href={solutionHref("outsourcing-de-impresion")}>
                Ver outsourcing de impresión
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand-blue p-8 text-white sm:p-10 lg:col-span-6">
            <IsoStrokes className="top-[-30%] right-[-20%] -z-10 h-[160%] w-[70%] opacity-[0.09]" />
            <p className="text-sm font-bold tracking-[0.08em] text-white/80 uppercase">Estatus</p>
            <p className="mt-2 text-4xl font-extrabold sm:text-5xl">{hpPartnership.badge}</p>
            <ul className="mt-8 space-y-4">
              {hpPartnership.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-brand-bright">
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-lg leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Certificaciones */}
      <section aria-labelledby="certificaciones-title" className="section-y bg-surface">
        <div className="container-mt">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="certificaciones-title"
              eyebrow="Normas internacionales"
              title="Trabajamos bajo normas ISO."
              highlight="normas ISO."
              description="Trabajamos bajo sistemas de gestión certificados en calidad, seguridad de la información y antisoborno."
            />
            <Link href="/portal-iso" className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-bright hover:underline">
              Ir al Portal ISO
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {certifications.map((c) => (
              <li key={c.code} className="flex flex-col gap-6 rounded-[2rem] border border-line bg-white p-8 shadow-soft">
                <span className="inline-flex size-24 shrink-0 flex-col items-center justify-center rounded-full bg-brand-gradient-deep text-white shadow-lift">
                  <Award aria-hidden className="size-7" />
                  <span className="mt-1 text-[0.7rem] font-bold tracking-wider uppercase">Certificado</span>
                </span>
                <div>
                  <h3 className="text-3xl font-extrabold text-ink">{c.code}</h3>
                  <p className="mt-1 font-semibold text-brand-bright">{c.name}</p>
                  <p className="mt-4 leading-relaxed text-ink-soft">{c.description}</p>
                  {c.scope ? <p className="mt-3 text-sm text-ink-faint">Alcance: {c.scope}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sustentabilidad */}
      <section aria-label="Sustentabilidad" className="section-y bg-white">
        <div className="container-mt grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Sustentabilidad"
              title="Tecnología con menor impacto."
              highlight="menor impacto."
              description="Gestionamos el ciclo de vida de los equipos y los consumibles con prácticas responsables, y ofrecemos la compensación de carbono como capa del servicio."
            />
          </div>
          <div className="lg:col-span-7">
            <SustainabilityCard />
          </div>
        </div>
      </section>

      {/* Liderazgo */}
      {team.length > 0 ? (
        <section id="liderazgo" aria-labelledby="liderazgo-title" className="section-y scroll-mt-20 bg-surface">
          <div className="container-mt">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading id="liderazgo-title" eyebrow="Liderazgo" title="Nuestro equipo directivo." highlight="equipo directivo." />
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((l) => (
                <li key={l.name} className="flex items-center gap-5 rounded-[2rem] border border-line bg-white p-6 shadow-soft">
                  {l.photo ? (
                    <Image src={l.photo} alt={l.name} width={80} height={80} className="size-20 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden className="relative isolate inline-flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-blue text-2xl font-extrabold text-white">
                      {l.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-ink">{l.name}</h3>
                    <p className="mt-1 font-semibold text-brand-bright">{l.role}</p>
                    {l.bio ? <p className="mt-2 text-sm leading-relaxed text-ink-soft">{l.bio}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Trabaja con nosotros */}
      <section aria-labelledby="talento-title" className="border-y border-line bg-smoke py-14">
        <div className="container-mt flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold tracking-[0.08em] text-brand-bright uppercase">Talento</p>
            <h2 id="talento-title" className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
              ¿Quieres ser parte del equipo?
            </h2>
          </div>
          <Button asChild size="lg">
            <Link href="/trabaja-con-nosotros">
              Ver convocatorias
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
