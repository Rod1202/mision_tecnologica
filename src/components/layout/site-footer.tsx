import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { IsoStrokes } from "@/components/brand/pills";
import { footerNav, siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-smoke text-ink">
      <IsoStrokes tone="blue" className="-right-24 -bottom-40 h-[28rem] w-[22rem] opacity-[0.05] sm:-right-10" />

      <div className="container-mt relative py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Misión Tecnológica, ir al inicio" className="inline-block rounded-lg">
              <Logo className="h-9" />
            </Link>
            <p className="mt-6 max-w-sm leading-relaxed text-ink-soft">{siteConfig.description}</p>

            <ul className="mt-8 space-y-2 text-ink">
              <li>
                <a href={`tel:${siteConfig.contact.phone}`} className="inline-flex min-h-10 items-center gap-3 hover:text-brand-bright hover:underline">
                  <Phone aria-hidden className="size-4 text-brand-bright" />
                  {siteConfig.contact.phoneDisplay}
                  <span className="text-sm text-ink-soft">· {siteConfig.contact.hours}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex min-h-10 items-center gap-3 hover:text-brand-bright hover:underline">
                  <Mail aria-hidden className="size-4 text-brand-bright" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(siteConfig.contact.whatsapp, siteConfig.contact.whatsappDefaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-3 hover:text-brand-bright hover:underline"
                >
                  <MessageCircle aria-hidden className="size-4 text-brand-bright" />
                  WhatsApp {siteConfig.contact.whatsappDisplay}
                </a>
              </li>
              <li className="flex gap-3 py-2">
                <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-brand-bright" />
                <address className="not-italic leading-relaxed">
                  {siteConfig.contact.address.street}, {siteConfig.contact.address.district}, {siteConfig.contact.address.city}
                </address>
              </li>
            </ul>

            <ul aria-label="Redes sociales" className="mt-6 flex gap-2">
              {socialLinks.map(({ label, href, Glyph }) =>
                href ? (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex size-11 items-center justify-center rounded-full bg-white text-brand-bright ring-1 ring-line ring-inset transition-colors hover:bg-brand-blue hover:text-white hover:ring-brand-blue"
                    >
                      <Glyph />
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-sm font-bold tracking-[0.08em] text-brand-bright uppercase">{group.title}</h2>
                <ul className="mt-4 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center text-ink hover:text-brand-bright hover:underline"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link href={item.href} className="inline-flex min-h-10 items-center text-ink hover:text-brand-bright hover:underline">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Misión Tecnológica. Todos los derechos reservados.</p>
          <p>Perú</p>
        </div>
      </div>
    </footer>
  );
}

const socialLinks = [
  { label: "LinkedIn", href: siteConfig.social.linkedin, Glyph: LinkedInGlyph },
  { label: "Facebook", href: siteConfig.social.facebook, Glyph: FacebookGlyph },
  { label: "Instagram", href: siteConfig.social.instagram, Glyph: InstagramGlyph },
];

function FacebookGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" className="fill-current stroke-none" />
    </svg>
  );
}

function LinkedInGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
