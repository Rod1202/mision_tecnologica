import Link from "next/link";
import { ArrowRight, Award, Check, ClipboardCheck, GraduationCap, MapPin, RefreshCw, ShieldCheck, Users, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Eyebrow, IsoStrokes } from "@/components/brand/pills";
import { CtaBand, PageIntro } from "@/components/layout/page-intro";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { about, certifications, coverage, hpPartnership, leaders, qualityStandards } from "@/lib/content/company";
import { solutionHref } from "@/lib/content/solutions";
import { pageMetadata } from "@/lib/seo";
import { showUnverifiedContent } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Nosotros: partner de HP, certificaciones ISO y cobertura nacional",
  description:
    "Misión Tecnológica es partner de HP, cuenta con certificaciones ISO 9001 e ISO/IEC 27001 y atiende a empresas con cobertura a nivel nacional en el Perú.",
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
          {["Partner de HP", "ISO 9001", "ISO/IEC 27001", "Cobertura nacional"].map((t) => (
            <li key={t} className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 font-semibold ring-1 ring-white/25 ring-inset">
              <Check aria-hidden className="size-4 text-brand-teal" strokeWidth={3} />
              {t}
            </li>
          ))}
        </ul>
      </PageIntro>

      {/* Partner de HP */}
      <section aria-labelledby="hp-title" className="section-y bg-white">
        <div className="container-mt grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="hp-title" eyebrow="Alianza" title={hpPartnership.title} description={hpPartnership.description} />
            <Button asChild variant="outline" size="lg" className="mt-8">
              <Link href={solutionHref("impresion-empresarial")}>
                Ver impresión empresarial
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand-blue p-8 text-white sm:p-10 lg:col-span-6">
            <IsoStrokes className="top-[-30%] right-[-20%] -z-10 h-[160%] w-[70%] opacity-[0.09]" />
            <p className="text-sm font-bold tracking-[0.08em] text-white/70 uppercase">Misión Tecnológica</p>
            <p className="mt-2 text-4xl font-extrabold sm:text-5xl">Partner de HP</p>
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

      {/* Certificaciones */}
      <section aria-labelledby="certificaciones-title" className="section-y bg-surface">
        <div className="container-mt">
          <SectionHeading
            id="certificaciones-title"
            eyebrow="Certificaciones"
            title="Gestión certificada bajo normas internacionales."
            description="Nuestros procesos están certificados en calidad y en seguridad de la información."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {certifications.map((c) => (
              <li key={c.code} className="flex flex-col gap-6 rounded-[2rem] border border-line bg-white p-8 shadow-soft sm:flex-row sm:items-start sm:p-10">
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
      <section aria-labelledby="estandares-title" className="section-y bg-white">
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

      {/* Cobertura nacional */}
      <section aria-labelledby="cobertura-title" className="section-y relative isolate overflow-hidden bg-brand-blue text-white">
        <IsoStrokes className="top-[-30%] right-[-30%] -z-10 h-[170%] w-[80%] opacity-[0.09] lg:right-[-4%] lg:w-[42%]" />
        <div className="container-mt grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="cobertura-title" tone="inverse" eyebrow="Cobertura" title={coverage.title} description={coverage.description} />
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-7 lg:self-center">
            {coverage.regions.map((r) => (
              <li key={r.name} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/20 ring-inset">
                <MapPin aria-hidden className="size-6 text-brand-teal" />
                <p className="mt-4 text-2xl font-bold">{r.name}</p>
                <p className="mt-1 text-white/80">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Liderazgo */}
      {team.length > 0 ? (
        <section id="liderazgo" aria-labelledby="liderazgo-title" className="section-y scroll-mt-20 bg-white">
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
      <section aria-labelledby="talento-title" className="bg-surface py-14">
        <div className="container-mt flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow>Talento</Eyebrow>
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
