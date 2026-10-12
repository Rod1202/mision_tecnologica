import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";

import { JobMeta } from "@/components/careers/job-meta";
import { ApplicationForm } from "@/components/forms/application-form";
import { PageIntro } from "@/components/layout/page-intro";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PendingBadge } from "@/components/ui/pending-badge";
import { visibleJobs } from "@/lib/careers";
import { jobHref } from "@/lib/content/jobs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Trabaja con nosotros: bolsa de empleo",
  description:
    "Convocatorias activas en Misión Tecnológica. Postula en línea con tu CV y forma parte de un equipo de servicios tecnológicos e impresión empresarial.",
  path: "/trabaja-con-nosotros",
});

export default function TrabajaConNosotrosPage() {
  const openings = visibleJobs();

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Trabaja con nosotros" }]}
        eyebrow="Bolsa de empleo"
        title="Trabaja con nosotros."
        description="Buscamos personas que quieran crecer acompañando la operación tecnológica de empresas en todo el Perú."
      >
        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 font-semibold ring-1 ring-white/25 ring-inset">
          <Briefcase aria-hidden className="size-4 text-brand-teal" />
          {openings.length === 0
            ? "Sin convocatorias activas por ahora"
            : `${openings.length} ${openings.length === 1 ? "convocatoria activa" : "convocatorias activas"}`}
        </p>
      </PageIntro>

      <section aria-labelledby="convocatorias-title" className="section-y bg-surface">
        <div className="container-mt">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="convocatorias-title" eyebrow="Convocatorias" title="Puestos disponibles." />
            {openings.some((j) => j.example) ? (
              <PendingBadge label="Convocatorias de ejemplo" note="Reemplazar por las convocatorias reales en src/lib/content/jobs.ts" />
            ) : null}
          </div>

          {openings.length > 0 ? (
            <ul className="mt-10 grid gap-5">
              {openings.map((job) => (
                <li key={job.slug}>
                  <article className="group flex flex-col gap-6 rounded-[2rem] border border-line bg-white p-7 shadow-soft transition-shadow hover:shadow-lift sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-2">
                        <Badge>{job.area}</Badge>
                        <Badge variant="teal">{job.modality}</Badge>
                      </div>
                      <h3 className="mt-4 text-2xl font-bold text-ink">
                        <Link href={jobHref(job.slug)} className="hover:text-brand-blue">
                          {job.title}
                        </Link>
                      </h3>
                      <p className="mt-2 leading-relaxed text-ink-soft">{job.summary}</p>
                      <div className="mt-4">
                        <JobMeta job={job} />
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                      <Button asChild size="lg">
                        <Link href={`${jobHref(job.slug)}#postular`}>
                          Postular
                          <ArrowRight aria-hidden />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="lg">
                        <Link href={jobHref(job.slug)}>Ver detalle</Link>
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-dashed border-line bg-white p-10 text-center">
              <p className="text-lg font-semibold text-ink">Por ahora no tenemos convocatorias activas.</p>
              <p className="mt-2 text-ink-soft">Déjanos tu CV y te tendremos en cuenta para futuras oportunidades.</p>
            </div>
          )}
        </div>
      </section>

      <section id="postulacion-general" aria-labelledby="general-title" className="section-y scroll-mt-20 bg-white">
        <div className="container-mt grid grid-cols-1 [&>*]:min-w-0 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="general-title"
              eyebrow="Postulación espontánea"
              title="¿No encuentras tu puesto?"
              description="Envíanos tu CV y te consideraremos en los próximos procesos de selección."
            />
          </div>
          <div className="lg:col-span-7">
            <ApplicationForm job="general" />
          </div>
        </div>
      </section>
    </>
  );
}
