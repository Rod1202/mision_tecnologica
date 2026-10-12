"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { QuoteCartButton } from "@/components/catalog/quote-cart";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { useSamePageScroll } from "@/lib/use-same-page-scroll";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const toTopIfSamePage = useSamePageScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-white/80",
        scrolled ? "border-line shadow-[0_8px_24px_-18px_rgb(11_26_51/0.35)]" : "border-transparent",
      )}
    >
      <div className="container-mt flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link href="/" onClick={toTopIfSamePage("/")} aria-label="Misión Tecnológica, ir al inicio" className="shrink-0 rounded-lg">
          <Logo priority className="h-8 lg:h-9" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-2 xl:gap-4">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={toTopIfSamePage(item.href)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3 py-2 text-[0.95rem] font-semibold transition-colors xl:px-4",
                      active ? "text-brand-blue" : "text-ink hover:text-brand-blue",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-1 rounded-full bg-brand-gradient xl:inset-x-4" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <QuoteCartButton />
          <Button asChild size="sm" className="hidden sm:inline-flex lg:h-11 lg:px-6 lg:text-[0.95rem]">
            <Link href="/#contacto">Solicitar asesoría</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
