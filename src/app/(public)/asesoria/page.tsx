import { AdvisoryForm } from "@/components/forms/advisory-form";
import { PageIntro } from "@/components/layout/page-intro";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Solicita asesoría: agenda una reunión exploratoria",
  description:
    "Cuéntanos tu necesidad de impresión, cómputo, digitalización o audio y video, cuántas sedes y usuarios tienes, y agenda una primera reunión con un asesor de Misión Tecnológica.",
  path: "/asesoria",
});

const steps = [
  { title: "Nos cuentas tu necesidad", text: "En qué área necesitas apoyo y el tamaño de tu operación." },
  { title: "Confirmamos la reunión", text: "Un asesor confirma la fecha por correo y prepara las preguntas clave." },
  { title: "Diagnóstico y propuesta", text: "Conversamos sobre tu operación y te recomendamos el siguiente paso." },
];

/** "Encuentra tu solución" · perfil "Quiero que me asesoren". */
export default function AsesoriaPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Encuentra tu solución", href: "/#encuentra-tu-solucion" }, { label: "Solicitar asesoría" }]}
        eyebrow="Quiero que me asesoren"
        title="Te ayudamos a encontrar la solución."
        description="Cuéntanos qué necesitas y en qué escala, y agenda una primera reunión exploratoria con un asesor. Sin compromiso."
      />

      <section aria-label="Solicitud de asesoría" className="section-y bg-surface">
        <div className="container-mt grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="order-2 lg:order-1 lg:col-span-4">
            <p className="text-sm font-bold tracking-[0.06em] text-brand-bright uppercase">Cómo funciona</p>
            <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Una conversación, sin compromiso.</h2>
            <ol className="mt-6 space-y-5">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-teal-700 font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{s.title}</p>
                    <p className="text-ink-soft">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="order-1 min-w-0 lg:order-2 lg:col-span-8">
            <AdvisoryForm />
          </div>
        </div>
      </section>
    </>
  );
}
