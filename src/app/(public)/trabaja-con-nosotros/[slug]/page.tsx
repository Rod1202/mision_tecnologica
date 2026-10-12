import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { JobMeta } from "@/components/careers/job-meta";
import { ApplicationForm } from "@/components/forms/application-form";
import { PageIntro } from "@/components/layout/page-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { PendingBadge } from "@/components/ui/pending-badge";
import { visibleJobs } from "@/lib/careers";
import { jobHref } from "@/lib/content/jobs";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return visibleJobs().map((j) => ({ slug: j.slug }));
}

const findJob = (slug: string) => visibleJobs().find((j) => j.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = findJob(slug);
  if (!job) return {};
  const title = `${job.title} | Trabaja con nosotros`;
  return {
    title,
    description: job.summary,
    alternates: { canonical: jobHref(job.slug) },
    openGraph: { title, description: job.summary, url: jobHref(job.slug) },
    ...(job.example ? { robots: { index: false, follow: true } } : {}),
  };
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
              <Check aria-hidden className="size-3.5" strokeWidth={3} />
            </span>
            <span className="leading-relaxed text-ink">{i}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = findJob(slug);
  if (!job) notFound();

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" }, { label: job.title }]}
        eyebrow={`Convocatoria · ${job.area}`}
        title={job.title}
        description={job.summary}
      >
        <div className="mt-8">
          <JobMeta job={job} tone="inverse" />
        </div>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="inverse" size="lg">
            <a href="#postular">
              Postular ahora
              <ArrowRight aria-hidden />
            </a>
          </Button>
        </div>
      </PageIntro>

      <section className="section-y bg-white">
        <div className="container-mt grid grid-cols-1 [&>*]:min-w-0 gap-14 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-5">
            {job.example ? <PendingBadge label="Convocatoria de ejemplo" note="Reemplazar por una convocatoria real." /> : null}
            <List title="Responsabilidades" items={job.responsibilities} />
            <List title="Requisitos" items={job.requirements} />
            {job.niceToHave?.length ? <List title="Deseable" items={job.niceToHave} /> : null}
            <Link href="/trabaja-con-nosotros" className="inline-flex items-center gap-2 font-semibold text-brand-blue hover:underline">
              <ArrowLeft aria-hidden className="size-4" />
              Ver todas las convocatorias
            </Link>
          </div>

          <div id="postular" className="scroll-mt-24 lg:col-span-7">
            <ApplicationForm job={job.slug} jobTitle={job.title} />
          </div>
        </div>
      </section>

      {!job.example ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: [job.summary, ...job.responsibilities, ...job.requirements].join(" "),
            datePosted: job.publishedAt,
            employmentType: job.type === "Tiempo completo" ? "FULL_TIME" : job.type === "Medio tiempo" ? "PART_TIME" : "INTERN",
            hiringOrganization: { "@type": "Organization", name: siteConfig.name, sameAs: siteConfig.url },
            jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "PE" } },
          }}
        />
      ) : null}
    </>
  );
}
