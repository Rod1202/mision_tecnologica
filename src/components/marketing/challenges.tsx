import { ArrowDown } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { SectionHeading } from "@/components/marketing/section-heading";
import { challenges } from "@/lib/content/home";

/** 02 · El desafío: lo que el cliente reconoce como propio. */
export function Challenges() {
  return (
    <section aria-labelledby="desafio-title" className="section-y bg-surface">
      <div className="container-mt">
        <SectionHeading
          id="desafio-title"
          eyebrow="El desafío"
          title="La tecnología debe facilitar el negocio, no complicarlo."
          description="Gestionar equipos, soporte y recursos tecnológicos exige coordinación, especialización y continuidad. Son tres frentes que toda organización necesita resolver."
        />

        <ol className="mt-14 grid gap-5 md:grid-cols-3 lg:gap-6">
          {challenges.map((item, index) => (
            <li
              key={item.id}
              className="group relative flex flex-col rounded-3xl border border-line bg-white p-7 shadow-soft transition-shadow hover:shadow-lift lg:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
                  <Icon name={item.icon} className="size-6" />
                </span>
                <span aria-hidden className="text-sm font-bold text-ink-faint tabular-nums">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-7 text-xl font-bold text-ink">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.description}</p>
              <span aria-hidden className="mt-auto block h-1 w-10 translate-y-4 rounded-full bg-brand-gradient opacity-0 transition-all duration-300 group-hover:w-16 group-hover:opacity-100" />
            </li>
          ))}
        </ol>

        <p className="mt-14 flex flex-col items-start gap-3 text-lg font-semibold text-ink sm:flex-row sm:items-center">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
            <ArrowDown aria-hidden className="size-5" />
          </span>
          Cada organización necesita una respuesta adaptada a su operación.
        </p>
      </div>
    </section>
  );
}
