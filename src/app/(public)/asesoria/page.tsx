import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";

import { AdvisoryForm } from "@/components/forms/advisory-form";
import { PageIntro } from "@/components/layout/page-intro";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

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
      >
        <Link href="/cotizador" className="mt-6 inline-flex items-center gap-2 font-semibold text-white underline-offset-4 hover:underline">
          ¿Ya sabes lo que necesitas? Cotiza tu proyecto
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </PageIntro>

      <section aria-label="Solicitud de asesoría" className="section-y bg-surface">
        <div className="container-mt grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 lg:order-1 lg:col-span-4">
            <h2 className="text-2xl font-bold text-ink">Cómo funciona</h2>
            <ol className="mt-6 space-y-5">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="inline-flex h-9 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{s.title}</p>
                    <p className="text-ink-soft">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-col gap-1 border-t border-line pt-8 text-ink-soft">
              <p className="text-sm font-bold tracking-[0.08em] uppercase">También puedes llamarnos o escribirnos</p>
              <p className="text-sm">{siteConfig.contact.hours}</p>
              <a href={`tel:${siteConfig.contact.phone}`} className="inline-flex min-h-10 items-center gap-3 font-semibold text-ink hover:text-brand-blue">
                <Phone aria-hidden className="size-5 text-brand-blue" />
                {siteConfig.contact.phoneDisplay}
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex min-h-10 items-center gap-3 font-semibold text-ink hover:text-brand-blue">
                <Mail aria-hidden className="size-5 text-brand-blue" />
                {siteConfig.contact.email}
              </a>
              <a
                href={whatsappLink(siteConfig.contact.whatsapp, siteConfig.contact.whatsappDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-3 font-semibold text-ink hover:text-brand-blue"
              >
                <MessageCircle aria-hidden className="size-5 text-brand-blue" />
                WhatsApp {siteConfig.contact.whatsappDisplay}
              </a>
            </div>
          </div>

          <div className="order-1 min-w-0 lg:order-2 lg:col-span-8">
            <AdvisoryForm />
          </div>
        </div>
      </section>
    </>
  );
}
