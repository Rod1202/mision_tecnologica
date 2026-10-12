import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { IsoStrokes } from "@/components/brand/pills";
import { footerNav, siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-deep text-white">
      <IsoStrokes className="-right-24 -bottom-40 h-[28rem] w-[22rem] opacity-[0.04] sm:-right-10" />

      <div className="container-mt relative py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Misión Tecnológica, ir al inicio" className="inline-block rounded-lg">
              <Logo variant="white" className="h-9" />
            </Link>
            <p className="mt-6 max-w-sm leading-relaxed text-white/75">{siteConfig.description}</p>

            <ul className="mt-8 space-y-2 text-white/85">
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex min-h-10 items-center gap-3 hover:text-white hover:underline">
                  <Mail aria-hidden className="size-4 text-brand-teal" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(siteConfig.contact.whatsapp, siteConfig.contact.whatsappDefaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-3 hover:text-white hover:underline"
                >
                  <MessageCircle aria-hidden className="size-4 text-brand-teal" />
                  WhatsApp {siteConfig.contact.whatsappDisplay}
                </a>
              </li>
              {siteConfig.social.linkedin ? (
                <li>
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-3 hover:text-white hover:underline"
                  >
                    <LinkedInGlyph />
                    LinkedIn
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-sm font-bold tracking-[0.08em] text-white/60 uppercase">{group.title}</h2>
                <ul className="mt-4 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="inline-flex min-h-10 items-center text-white/85 hover:text-white hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Misión Tecnológica. Todos los derechos reservados.</p>
          <p>Perú</p>
        </div>
      </div>
    </footer>
  );
}

function LinkedInGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-brand-teal">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
