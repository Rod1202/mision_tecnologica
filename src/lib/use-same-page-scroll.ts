"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Al hacer clic en un enlace que apunta a la página actual (logo o ítem del menú),
 * Next.js no navega; este hook hace que la página vuelva a la parte superior.
 * - Usa el `scroll-behavior` del CSS (suave, o inmediato con "reducir movimiento").
 * - En el Inicio, limpia anclas como #contacto de la URL.
 * - `delayMs` permite esperar a que se cierre un panel (el menú móvil bloquea el scroll mientras está abierto).
 */
export function useSamePageScroll() {
  const pathname = usePathname();

  return useCallback(
    (href: string, delayMs = 0) =>
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        const target = href.split("#")[0] || "/";
        if (target !== pathname) return; // otra página: navegación normal

        // Respetar Ctrl/Cmd/Shift + clic (abrir en otra pestaña)
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

        event.preventDefault();
        const scroll = () => {
          if (pathname === "/" && window.location.hash) {
            window.history.replaceState(window.history.state, "", "/");
          }
          window.scrollTo({ top: 0 });
        };
        if (delayMs > 0) window.setTimeout(scroll, delayMs);
        else scroll();
      },
    [pathname],
  );
}
