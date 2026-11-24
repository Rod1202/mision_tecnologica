import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { solutionHref, solutions } from "@/lib/content/solutions";
import { cn } from "@/lib/utils";

/**
 * Vista maestro-detalle de Soluciones: servicios a la izquierda y el detalle a la derecha.
 * Cada solución conserva su propia URL (/soluciones/[slug]) para el SEO; el menú lateral enlaza entre ellas.
 * En móvil, el menú pasa a una fila de píldoras desplazable sobre el detalle.
 */
export function SolutionsShell({
  activeSlug,
  breadcrumbs,
  children,
}: {
  activeSlug?: string;
  breadcrumbs: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white pt-8 pb-16 sm:pb-20">
      <div className="container-mt">
        <Breadcrumbs tone="default" items={breadcrumbs} />

        {/* Móvil y tableta: píldoras */}
        <nav aria-label="Soluciones" className="mt-6 lg:hidden">
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <li>
              <Link
                href="/soluciones"
                aria-current={!activeSlug ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap ring-1 ring-inset",
                  !activeSlug ? "bg-brand-blue text-white ring-brand-blue" : "bg-white text-ink ring-line",
                )}
              >
                Todas
              </Link>
            </li>
            {solutions.map((s) => {
              const active = s.slug === activeSlug;
              return (
                <li key={s.slug}>
                  <Link
                    href={solutionHref(s.slug)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap ring-1 ring-inset",
                      active ? "bg-brand-blue text-white ring-brand-blue" : "bg-white text-ink ring-line",
                    )}
                  >
                    <Icon name={s.icon} className="size-4" />
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-12">
          {/* Escritorio: lista lateral */}
          <aside className="hidden lg:col-span-4 lg:block xl:col-span-3">
            <nav aria-label="Soluciones" className="sticky top-28">
              <p className="px-3 text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">Nuestras soluciones</p>
              <ul className="mt-4 space-y-1.5">
                {solutions.map((s) => {
                  const active = s.slug === activeSlug;
                  return (
                    <li key={s.slug}>
                      <Link
                        href={solutionHref(s.slug)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl p-3 transition-colors",
                          active ? "bg-brand-blue text-white shadow-[0_14px_30px_-16px_rgb(0_61_153/0.8)]" : "text-ink hover:bg-surface",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "inline-flex h-10 w-13 shrink-0 items-center justify-center rounded-full",
                            active ? "bg-white/15" : "bg-brand-blue-50 text-brand-blue",
                          )}
                        >
                          <Icon name={s.icon} className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1 font-semibold leading-snug">{s.title}</span>
                        <ChevronRight aria-hidden className={cn("size-4 shrink-0", active ? "text-white" : "text-ink-faint group-hover:text-brand-blue")} />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 rounded-3xl bg-surface p-5">
                <p className="font-bold text-ink">¿No sabes cuál elegir?</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">Cuéntanos tu operación y te recomendamos por dónde empezar.</p>
                <Link href="/asesoria" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline">
                  Solicitar asesoría
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
            </nav>
          </aside>

          <div className="min-w-0 lg:col-span-8 xl:col-span-9">{children}</div>
        </div>
      </div>
    </section>
  );
}
