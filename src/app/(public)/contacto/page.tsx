import Link from "next/link";
import { ArrowRight, Calculator, Clock, Compass, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { PageIntro } from "@/components/layout/page-intro";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Contáctanos",
  description:
    "Escríbenos y un asesor de Misión Tecnológica te responderá. Teléfono 919 280 810, contacto@misiontecnologica.com, Av. Circunvalación Golf Los Incas 134, Santiago de Surco, Lima.",
  path: "/contacto",
});

const c = siteConfig.contact;

const channels = [
  { Icon: Phone, label: "Teléfono", value: c.phoneDisplay, href: `tel:${c.phone}` },
  { Icon: Mail, label: "Correo", value: c.email, href: `mailto:${c.email}` },
  { Icon: MessageCircle, label: "WhatsApp", value: c.whatsappDisplay, href: whatsappLink(c.whatsapp, c.whatsappDefaultMessage), external: true },
];

/** Contacto simple: el botón "Contáctanos" del encabezado y del cierre del inicio llegan aquí. */
export default function ContactoPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Contáctanos" }]}
        eyebrow="Contáctanos"
        title="Hablemos de tu operación."
        description="Déjanos tus datos y un mensaje breve. Un asesor te responderá por correo."
      />

      <section aria-label="Formulario de contacto" className="section-y bg-surface">
        <div className="container-mt grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-xl font-bold text-ink">Otros canales</h2>
              <ul className="mt-5 space-y-1">
                {channels.map(({ Icon, label, value, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex min-h-14 items-center gap-4 rounded-2xl px-2 transition-colors hover:bg-surface"
                    >
                      <span aria-hidden className="inline-flex h-10 w-13 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue">
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-ink-soft">{label}</span>
                        <span className="block font-semibold break-all text-ink group-hover:text-brand-blue">{value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-3 border-t border-line pt-5 text-ink-soft">
                <p className="flex gap-3">
                  <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-blue" />
                  {c.hours}
                </p>
                <address className="flex gap-3 not-italic">
                  <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-blue" />
                  <span>
                    {c.address.street}, {c.address.district}, {c.address.city}
                  </span>
                </address>
              </div>
            </div>

            <div className="rounded-3xl bg-brand-blue p-6 text-white sm:p-8">
              <h2 className="text-xl font-bold">¿Necesitas una propuesta?</h2>
              <p className="mt-2 text-white/90">Para cotizar o dimensionar un proyecto, usa Encuentra tu solución.</p>
              <ul className="mt-5 space-y-2">
                <li>
                  <Link href="/cotizador" className="inline-flex min-h-11 items-center gap-3 font-semibold hover:underline">
                    <Calculator aria-hidden className="size-5" />
                    Cotizar proyecto
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </li>
                <li>
                  <Link href="/asesoria" className="inline-flex min-h-11 items-center gap-3 font-semibold hover:underline">
                    <Compass aria-hidden className="size-5" />
                    Solicitar asesoría
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
