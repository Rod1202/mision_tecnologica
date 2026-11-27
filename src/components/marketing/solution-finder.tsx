import Link from "next/link";
import { ArrowRight, Compass, Rocket } from "lucide-react";

import { IsoStrokes } from "@/components/brand/pills";
import { SectionHeading } from "@/components/marketing/section-heading";
import { quoteServices } from "@/lib/content/quote";

/**
 * 03 · Encuentra tu solución: segmentación por perfil.
 * - "Sé lo que necesito" → cotizador autoguiado (/cotizador).
 * - "Quiero que me asesoren" → flujo consultivo con reunión exploratoria (/asesoria).
 * Es el punto de entrada de todos los llamados a cotizar o contactar (encabezado, cierre del inicio).
 * Ambos exigen datos B2B (correo corporativo, empresa, RUC, nombre y apellido) para enviar.
 */
export function SolutionFinder() {
  return (
    <section
      id="encuentra-tu-solucion"
      aria-labelledby="encuentra-title"
      className="section-y relative isolate overflow-hidden bg-white"
    >
      <IsoStrokes tone="blue" className="top-[-20%] left-[-30%] -z-10 h-[140%] w-[80%] opacity-[0.04] lg:left-[-6%] lg:w-[38%]" />
      <div className="container-mt">
        <SectionHeading
          id="encuentra-title"
          eyebrow="Encuentra tu solución"
          title="Encuentra tu solución sin perder tiempo."
          highlight="sin perder tiempo."
          description="Cotiza directamente o recibe una recomendación inicial de un asesor."
        />

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:gap-6">
          <li>
            <Link
              href="/cotizador"
              className="group flex h-full flex-col rounded-[2rem] border border-line bg-smoke p-7 text-ink transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-brand-bright/40 hover:bg-white hover:shadow-lift sm:p-9"
            >
              <span aria-hidden className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-bright text-white">
                <Rocket className="size-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-7 text-2xl font-bold sm:text-3xl">Sé lo que necesito</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-soft">
                Elige la solución, indica cantidades, volúmenes y plazos, y genera tu solicitud de cotización.
              </p>
              <ul aria-label="Servicios que puedes cotizar" className="mt-6 flex flex-wrap gap-2">
                {quoteServices.map((s) => (
                  <li key={s.id} className="rounded-full bg-brand-blue-50 px-3 py-1 text-sm font-semibold text-brand-blue-800">
                    {s.title}
                  </li>
                ))}
              </ul>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-brand-bright">
                Cotizar directamente
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/asesoria"
              className="group flex h-full flex-col rounded-[2rem] border border-line bg-smoke p-7 text-ink transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-brand-bright/40 hover:bg-white hover:shadow-lift sm:p-9"
            >
              <span aria-hidden className="inline-flex h-12 w-16 items-center justify-center rounded-full bg-brand-teal-700 text-white">
                <Compass className="size-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-7 text-2xl font-bold sm:text-3xl">Quiero que me asesoren</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-soft">
                Cuéntanos tu necesidad, tus sedes y usuarios, y agenda una primera reunión exploratoria con un asesor.
              </p>
              <ol aria-label="Pasos" className="mt-6 flex flex-wrap gap-2">
                {["Necesidad", "Sedes y usuarios", "Reunión"].map((s, i) => (
                  <li key={s} className="rounded-full bg-brand-teal-50 px-3 py-1 text-sm font-semibold text-brand-teal-700">
                    {i + 1}. {s}
                  </li>
                ))}
              </ol>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-brand-bright">
                Iniciar diagnóstico
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        </ul>

        <p className="mt-8 text-sm text-ink-soft">
          Para enviar una solicitud te pediremos correo corporativo, empresa, RUC, nombre y apellido. El teléfono es opcional.
        </p>
      </div>
    </section>
  );
}
