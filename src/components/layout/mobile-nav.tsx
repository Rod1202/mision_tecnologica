"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Mail, Menu, MessageCircle } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mainNav, siteConfig } from "@/lib/site";
import { useSamePageScroll } from "@/lib/use-same-page-scroll";
import { cn, whatsappLink } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // El panel bloquea el scroll mientras está abierto: se espera a que termine de cerrarse.
  const toTopIfSamePage = useSamePageScroll();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
          <Menu className="size-6!" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent closeLabel="Cerrar menú">
        <div className="flex h-16 items-center border-b border-line px-5">
          <Logo className="h-7" />
        </div>
        <SheetTitle className="sr-only">Menú principal</SheetTitle>
        <SheetDescription className="sr-only">Navegación del sitio de Misión Tecnológica</SheetDescription>

        <nav aria-label="Principal (móvil)" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {[{ label: "Inicio", href: "/" }, ...mainNav].map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        toTopIfSamePage(item.href, 300)(e);
                        setOpen(false); // cerrar siempre (si se canceló la navegación, Radix no lo cierra solo)
                      }}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-2xl px-4 text-lg font-semibold transition-colors",
                        active ? "bg-brand-blue-50 text-brand-blue" : "text-ink hover:bg-surface",
                      )}
                    >
                      {item.label}
                      <ArrowRight aria-hidden className={cn("size-4", active ? "opacity-100" : "opacity-30")} />
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-line p-5">
          <SheetClose asChild>
            <Button asChild size="lg" className="w-full">
              <Link href="/#contacto">Solicitar asesoría</Link>
            </Button>
          </SheetClose>
          <div className="flex flex-col gap-1 pt-1 text-sm text-ink-soft">
            <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex min-h-10 items-center gap-2 hover:text-brand-blue">
              <Mail aria-hidden className="size-4" />
              {siteConfig.contact.email}
            </a>
            <a
              href={whatsappLink(siteConfig.contact.whatsapp, siteConfig.contact.whatsappDefaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 hover:text-brand-blue"
            >
              <MessageCircle aria-hidden className="size-4" />
              WhatsApp {siteConfig.contact.whatsappDisplay}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
