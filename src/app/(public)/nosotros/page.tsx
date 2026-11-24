import Link from "next/link";
import { ArrowRight, Award, Check, ClipboardCheck, Compass, Eye, GraduationCap, RefreshCw, ShieldCheck, Trophy, Users, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { IsoStrokes } from "@/components/brand/pills";
import { PresenceLegend, PresenceMap } from "@/components/company/presence-map";
import { CtaBand, PageIntro } from "@/components/layout/page-intro";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SustainabilityCard } from "@/components/marketing/service-layers";
import { Button } from "@/components/ui/button";
import { about, awards, certifications, hpPartnership, leaders, presence, qualityStandards } from "@/lib/content/company";
import { solutionHref } from "@/lib/content/solutions";
import { pageMetadata } from "@/lib/seo";
import { showUnverifiedContent } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Nosotros: Partner Platinum de HP, normas ISO y presencia en Latinoamérica",
  description:
    "Misión Tecnológica es una empresa peruana de soluciones TI, cómputo e impresión: Partner Platinum de HP desde 2016, Centro de Servicio Autorizado HP, con normas ISO, sede en Lima, filial en Bolivia y alianzas en la región.",
  path: "/nosotros",
});

const standardIcons: LucideIcon[] = [Workflow, Users, RefreshCw, ShieldCheck, ClipboardCheck, GraduationCap];

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
            <li key={t} className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 font-semibold ring-1 ring-white/25 ring-inset">
              <Check aria-hidden className="size-4 text-brand-teal" strokeWidth={3} />
              {t}
            </li>
          ))}
        </ul>
      </PageIntro>

      {/* Qué es Misión + presencia */}
      <section aria-labelledby="presencia-title" className="section-y bg-white">
        <div className="container-mt grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading id="presencia-title" eyebrow="Qué es Misión" title={presence.title} description={presence.intro} />
            <dl className="mt-8 flex flex-wrap gap-3">
              {about.stats.map((st) => (
                <div key={st.label} className="rounded-3xl bg-surface px-6 py-4">
                  <dt className="sr-only">{st.label}</dt>
                  <dd className="text-3xl font-extrabold text-brand-blue">{st.value}</dd>
                  <dd className="text-sm font-semibold text-ink-soft">{st.label}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <PresenceLegend />
            </div>
          </div>
          <div className="lg:col-span-6">
            <PresenceMap className="mx-auto max-w-md" />
          </div>
        </div>
      </section>

      {/* Misión, visión y valores */}
      <section aria-labelledby="proposito-title" className="section-y bg-surface">
        <div className="container-mt">
          <SectionHeading id="proposito-title" eyebrow="Propósito" title="Misión, visión y valores." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { title: "Misión", text: about.mission, Ico: Compass },
              { title: "Visión", text: about.vision, Ico: Eye },
            ].map(({ title, text, Ico }) => (
              <div key={title} className="rounded-[2rem] border border-line bg-white p-8 shadow-soft">
                <span className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-blue text-white">
                  <Ico aria-hidden className="size-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 text-2xl font-bold text-ink">{title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {about.values.map((v) => (
              <li key={v.title} className="rounded-3xl border border-line bg-white p-6 shadow-soft">
                <h3 className="font-bold text-brand-blue">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partner Platinum de HP */}
      <section aria-labelledby="hp-title" className="section-y bg-white">
        <div className="container-mt grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="hp-title" eyebrow="Alianza" title={hpPartnership.title} description={hpPartnership.description} />
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{hpPartnership.meaning}</p>
            <Button asChild variant="outline" size="lg" className="mt-8">
              <Link href={solutionHref("outsourcing-de-impresion")}>
                Ver impresión empresarial
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
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-brand-blue">
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-lg leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Premios */}
      <section aria-labelledby="premios-title" className="section-y bg-surface">
        <div className="container-mt">
          <SectionHeading
            id="premios-title"
            eyebrow="Reconocimientos"
            title="Premios otorgados."
            description="Reconocimientos de HP en el Perú y de Candefero en Latinoamérica."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {(["HP", "Candefero"] as const).map((group) => (
              <div key={group} className="rounded-[2rem] border border-line bg-white p-7 shadow-soft sm:p-8">
                <h3 className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">
                  {group === "HP" ? "Premios nacionales · HP" : "Premios internacionales · Candefero"}
                </h3>
                <ol className="mt-5 space-y-3">
                  {awards
                    .filter((a) => a.group === group)
                    .map((a) => (
                      <li key={`${a.title}-${a.year}`} className="flex items-start gap-4 rounded-2xl bg-surface p-4">
                        <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                          <Trophy className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-bold text-ink">{a.title}</span>
                          {a.detail ? <span className="block text-sm text-ink-soft">{a.detail}</span> : null}
                        </span>
                        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-bold text-brand-blue ring-1 ring-line ring-inset">{a.year}</span>
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificaciones */}
      <section aria-labelledby="certificaciones-title" className="section-y bg-white">
        <div className="container-mt">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="certificaciones-title"
              eyebrow="Normas internacionales"
              title="Trabajamos bajo normas ISO."
              description="Trabajamos bajo sistemas de gestión certificados en calidad, seguridad de la información y antisoborno."
            />
            <Link href="/portal-iso" className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-blue hover:underline">
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
                  <p className="mt-1 font-semibold text-brand-blue">{c.name}</p>
                  <p className="mt-4 leading-relaxed text-ink-soft">{c.description}</p>
                  {c.scope ? <p className="mt-3 text-sm text-ink-faint">Alcance: {c.scope}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Estándares de calidad */}
      <section aria-labelledby="estandares-title" className="section-y bg-surface">
        <div className="container-mt">
          <SectionHeading
            id="estandares-title"
            eyebrow="Estándares de calidad"
            title="Cómo aseguramos la calidad de cada servicio."
            description="Trabajamos con los estándares que exigen nuestros sistemas de gestión certificados."
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {qualityStandards.map((q, i) => {
              const Ico = standardIcons[i % standardIcons.length];
              return (
                <li key={q.title} className="rounded-3xl border border-line bg-white p-7 shadow-soft">
                  <span className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
                    <Ico aria-hidden className="size-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-ink">{q.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{q.description}</p>
                </li>
              );
            })}
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
              <SectionHeading id="liderazgo-title" eyebrow="Liderazgo" title="Nuestro equipo directivo." />
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((l) => (
                <li key={l.role} className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
                  <div aria-hidden className="relative isolate flex aspect-[4/3] items-end overflow-hidden bg-brand-gradient-deep p-6">
                    <IsoStrokes className="top-[-20%] right-[-15%] -z-10 h-[150%] w-[70%] opacity-[0.12]" />
                    <span className="inline-flex size-20 items-center justify-center rounded-full bg-white text-2xl font-extrabold text-brand-blue">
                      {l.role
                        .split(" ")
                        .filter((w) => w.length > 2)
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl font-bold text-ink">{l.name}</h3>
                    <p className="mt-1 font-semibold text-brand-blue">{l.role}</p>
                    {l.bio ? <p className="mt-3 leading-relaxed text-ink-soft">{l.bio}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Trabaja con nosotros */}
      <section aria-labelledby="talento-title" className="bg-brand-blue py-14 text-white">
        <div className="container-mt flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold tracking-[0.08em] text-white/80 uppercase">Talento</p>
            <h2 id="talento-title" className="mt-3 text-2xl font-bold sm:text-3xl">
              ¿Quieres ser parte del equipo?
            </h2>
          </div>
          <Button asChild variant="inverse" size="lg">
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
