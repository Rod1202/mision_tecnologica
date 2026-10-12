import { Mail, MessageCircle } from "lucide-react";

import { Dash, IsoStrokes } from "@/components/brand/pills";
import { ContactForm } from "@/components/forms/contact-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionHeading } from "@/components/marketing/section-heading";
import { siteConfig } from "@/lib/site";
import { cn, whatsappLink } from "@/lib/utils";

const nextSteps = [
  { title: "Revisamos tu solicitud", text: "Un asesor analiza la necesidad que nos describes." },
  { title: "Te contactamos", text: "Coordinamos por correo o teléfono para conocer tu operación." },
  { title: "Definimos el siguiente paso", text: "Proponemos la solución que mejor se ajusta a tu empresa." },
];

/**
 * 08 · Conversión: formulario de asesoría.
 * - `variant="section"` (Inicio): cierre de la historia, con degradé de marca.
 * - `variant="page"` (/contacto): es toda la página, en un solo fondo continuo, con migas de pan y h1.
 */
export function ContactCta({ variant = "section" }: { variant?: "section" | "page" }) {
  const isPage = variant === "page";

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className={cn(
        "relative isolate scroll-mt-16 overflow-hidden text-white",
        isPage ? "bg-brand-blue pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-28" : "section-y bg-brand-gradient-deep",
      )}
    >
      {isPage ? (
        <IsoStrokes className="top-[-10%] right-[-45%] -z-10 h-[120%] w-[95%] opacity-[0.09] sm:right-[-20%] sm:w-[70%] lg:right-[-4%] lg:w-[42%]" />
      ) : (
        <>
          <IsoStrokes className="top-[-10%] left-[-8%] -z-10 h-[120%] w-[40%] opacity-[0.08]" />
          <Dash className="top-10 right-[12%] bg-white/80" />
        </>
      )}

      <div className="container-mt">
        {isPage ? <Breadcrumbs items={[{ label: "Contacto" }]} className="mb-8" /> : null}
      </div>

      <div className="container-mt grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {isPage ? (
            <SectionHeading
              as="h1"
              id="contacto-title"
              tone="inverse"
              eyebrow="Contacto"
              title="Conversemos sobre tu operación."
              description="Cuéntanos qué necesita tu organización y un asesor revisará tu solicitud para ayudarte a identificar el siguiente paso."
            />
          ) : (
            <SectionHeading
              id="contacto-title"
              tone="inverse"
              eyebrow="Hablemos de tu operación"
              title="¿Qué necesita mejorar tu empresa?"
              description="Cuéntanos qué necesita tu organización y te ayudaremos a identificar el siguiente paso."
            />
          )}

          <ol className="mt-10 space-y-5">
            {nextSteps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="inline-flex h-9 w-12 shrink-0 items-center justify-center rounded-full bg-white font-bold text-brand-blue tabular-nums">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold">{step.title}</p>
                  <p className="text-white/85">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/25 pt-8 text-white/90">
            <p className="text-sm font-bold tracking-[0.08em] text-white/75 uppercase">También puedes escribirnos</p>
            <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex min-h-10 items-center gap-3 font-semibold hover:underline">
              <Mail aria-hidden className="size-5" />
              {siteConfig.contact.email}
            </a>
            <a
              href={whatsappLink(siteConfig.contact.whatsapp, siteConfig.contact.whatsappDefaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-3 font-semibold hover:underline"
            >
              <MessageCircle aria-hidden className="size-5" />
              WhatsApp {siteConfig.contact.whatsappDisplay}
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
