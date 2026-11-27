import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";

import { Dash, IsoStrokes } from "@/components/brand/pills";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

const nextSteps = [
  { title: "Revisamos tu solicitud", text: "Un asesor analiza la necesidad que nos describes." },
  { title: "Te contactamos", text: "Coordinamos por correo o teléfono para conocer tu operación." },
  { title: "Definimos el siguiente paso", text: "Proponemos la solución que mejor se ajusta a tu empresa." },
];

/**
 * 07 · Cierre: flujo de trabajo y datos de contacto en formato horizontal.
 * "Contáctanos" lleva al formulario simple (/contacto); para cotizar está "Encuentra tu solución".
 */
export function ContactCta() {
  return (
    // Tarjeta azul sobre fondo gris: así el cierre no se funde con el pie de página (también azul).
    <section id="contacto" aria-labelledby="contacto-title" className="section-y bg-white">
      <div className="container-mt">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand-gradient-deep px-6 py-12 text-white shadow-lift sm:px-10 lg:px-14 lg:py-16">
          <IsoStrokes className="top-[-10%] left-[-8%] -z-10 h-[120%] w-[40%] opacity-[0.08]" />
          <Dash className="top-10 right-[8%] bg-white/80" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="contacto-title"
              tone="inverse"
              eyebrow="Hablemos de tu operación"
              title="¿Qué necesita mejorar tu empresa?"
            highlight="mejorar"
              description="Cuéntanos qué necesita tu organización y te ayudaremos a identificar el siguiente paso."
            />
            <Button asChild variant="inverse" size="lg" className="self-start lg:self-auto">
              <Link href="/#encuentra-tu-solucion">
                Encuentra tu solución
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-6">
            {nextSteps.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-3xl bg-white/10 p-6 ring-1 ring-white/20 ring-inset">
                <span className="inline-flex h-9 w-12 shrink-0 items-center justify-center rounded-full bg-white font-bold text-brand-bright tabular-nums">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold">{step.title}</p>
                  <p className="mt-1 text-white/90">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-x-10 gap-y-2 border-t border-white/25 pt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <p className="text-sm font-bold tracking-[0.08em] text-white/80 uppercase">También puedes llamarnos o escribirnos</p>
            <a href={`tel:${siteConfig.contact.phone}`} className="inline-flex min-h-10 items-center gap-3 font-semibold hover:underline">
              <Phone aria-hidden className="size-5" />
              {siteConfig.contact.phoneDisplay}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex min-h-10 items-center gap-3 font-semibold hover:underline"
            >
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
            <p className="w-full text-sm text-white/80">
              {siteConfig.contact.hours} · {siteConfig.contact.address.street}, {siteConfig.contact.address.district}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
