import { SectionHeading } from "@/components/marketing/section-heading";
import { processSteps } from "@/lib/content/solutions";

/** Cómo trabajamos: 4 etapas comunes a todas las soluciones. */
export function ProcessSteps({ className }: { className?: string }) {
  return (
    <section aria-labelledby="proceso-title" className={className ?? "section-y bg-surface"}>
      <div className="container-mt">
        <SectionHeading id="proceso-title" eyebrow="Cómo trabajamos" title="Un proceso claro, de principio a fin." />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((step, i) => (
            <li key={step.title} className="relative rounded-3xl border border-line bg-white p-7 shadow-soft">
              <span className="inline-flex h-10 w-14 items-center justify-center rounded-full bg-brand-gradient font-bold text-white tabular-nums">
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl font-bold text-ink">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
