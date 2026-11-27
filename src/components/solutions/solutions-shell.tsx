import Link from "next/link";
import { ArrowRight, MousePointerClick } from "lucide-react";

import { Icon } from "@/components/brand/icon";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { solutionHref, solutions } from "@/lib/content/solutions";
import { cn } from "@/lib/utils";

/**
 * Vista maestro-detalle de Soluciones: el menú de la izquierda elige qué solución se muestra a la derecha.
 * Cada solución conserva su propia URL (/soluciones/[slug]) para el SEO. Al cambiar de solución no se
 * vuelve al inicio de la página (scroll={false}): el detalle cambia junto al menú.
 * En móvil, el menú pasa a una fila de píldoras desplazable sobre el detalle.
 */
export function SolutionsShell({
  activeSlug,
  breadcrumbs,
  children,
}: {
  activeSlug: string;
  breadcrumbs: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface pt-8 pb-16 sm:pb-20">
      <div className="container-mt">
        <Breadcrumbs tone="default" items={breadcrumbs} />

        {/* Móvil y tableta: píldoras */}
        <nav aria-label="Elige una solución" className="mt-6 lg:hidden">
          <p className="text-sm font-bold tracking-[0.06em] text-brand-bright uppercase">Elige una solución</p>
          <ul className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {solutions.map((s) => {
              const active = s.slug === activeSlug;
              return (
                <li key={s.slug}>
                  <Link
                    href={solutionHref(s.slug)}
                    scroll={false}
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

        <div className="mt-6 grid items-start gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-8">
          {/* Escritorio: menú lateral */}
          <aside className="hidden lg:col-span-4 lg:block xl:col-span-3">
            <nav aria-label="Elige una solución" className="sticky top-28 rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-line">
              <p className="px-2 text-sm font-bold tracking-[0.06em] text-brand-bright uppercase">Elige una solución</p>
              <p className="mt-1 flex items-start gap-2 px-2 text-sm text-ink-soft">
                <MousePointerClick aria-hidden className="mt-0.5 size-4 shrink-0" />
                Su detalle se muestra a la derecha.
              </p>
              <ul className="mt-5 space-y-1.5">
                {solutions.map((s, i) => {
                  const active = s.slug === activeSlug;
                  return (
                    <li key={s.slug}>
                      <Link
                        href={solutionHref(s.slug)}
                        scroll={false}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-2xl p-3 transition-colors",
                          active ? "bg-brand-blue text-white shadow-[0_14px_30px_-16px_rgb(0_82_204/0.8)]" : "text-ink hover:bg-surface",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "inline-flex h-10 w-13 shrink-0 items-center justify-center rounded-full",
                            active ? "bg-white/15" : "bg-brand-blue-50 text-brand-bright",
                          )}
                        >
                          <Icon name={s.icon} className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block text-xs font-bold tabular-nums", active ? "text-white/80" : "text-ink-faint")}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="block leading-snug font-semibold">{s.title}</span>
                        </span>
                        <ArrowRight
                          aria-hidden
                          className={cn(
                            "size-4 shrink-0 transition-transform",
                            active ? "translate-x-1 text-white" : "text-ink-faint group-hover:translate-x-0.5 group-hover:text-brand-bright",
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 lg:col-span-8 xl:col-span-9">{children}</div>
        </div>
      </div>
    </section>
  );
}
