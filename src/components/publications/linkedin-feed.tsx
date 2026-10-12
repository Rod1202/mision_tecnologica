"use client";

import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const WIDGET_SRC = "https://widgets.sociablekit.com/linkedin-page-posts/widget.js";
const LOAD_TIMEOUT_MS = 12000;
/** Altura de seguridad si no se logra identificar la lista de publicaciones del widget. */
const FALLBACK_MAX_HEIGHT_PX = 1100;
/** Margen bajo la última publicación visible (sombra y borde de las tarjetas). */
const BOTTOM_GAP_PX = 16;

type Status = "loading" | "ready" | "error";

/**
 * Publicaciones de la página de LinkedIn mediante el widget de SociableKit (proveedor externo).
 * - Muestra como máximo `maxPosts` publicaciones (por defecto 3) y oculta el botón "cargar más".
 * - La altura se ajusta sola al final de la última publicación visible: se ven completas,
 *   sin dejar espacio sobrante. Se recalcula cuando cargan imágenes o cambia el ancho.
 * Recomendado: configurar también "número de publicaciones = 3" en el panel de SociableKit,
 * para que el límite no dependa solo del recorte en el navegador.
 */
export function LinkedInFeed({ maxPosts = 3, className }: { maxPosts?: number; className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [clipped, setClipped] = useState(false);

  useEffect(() => {
    const embed = embedRef.current;
    const frame = frameRef.current;
    if (!embed || !frame) return;

    /**
     * Identifica la lista de publicaciones: el contenedor más externo con 2+ hijos de la misma clase
     * que además tienen texto (descarta, por ejemplo, la galería de fotos dentro de una publicación).
     */
    const findPostList = (): HTMLElement | null => {
      const candidates = embed.querySelectorAll<HTMLElement>("*");
      for (const el of Array.from(candidates)) {
        const kids = Array.from(el.children) as HTMLElement[];
        if (kids.length < 2) continue;
        const firstClass = kids[0]?.classList[0];
        if (!firstClass || !kids.every((k) => k.classList.contains(firstClass))) continue;
        const withText = kids.filter((k) => (k.textContent ?? "").trim().length > 40).length;
        if (withText >= Math.min(2, kids.length)) return el; // el primero en orden de documento = el más externo
      }
      return null;
    };

    const update = () => {
      // Oculta "cargar más"
      embed.querySelectorAll<HTMLElement>("[class*='load-more'], [class*='loadmore'], [class*='load_more']").forEach((el) => {
        el.style.display = "none";
      });

      const list = findPostList();
      if (!list) {
        frame.style.maxHeight = `${FALLBACK_MAX_HEIGHT_PX}px`;
        setClipped(embed.scrollHeight > FALLBACK_MAX_HEIGHT_PX);
        return;
      }

      const posts = Array.from(list.children) as HTMLElement[];
      posts.forEach((post, i) => {
        post.style.display = i < maxPosts ? "" : "none";
      });

      // Altura exacta hasta el final de la publicación visible más baja
      const top = frame.getBoundingClientRect().top;
      const bottom = posts
        .slice(0, maxPosts)
        .reduce((max, post) => Math.max(max, post.getBoundingClientRect().bottom), top);
      frame.style.maxHeight = `${Math.ceil(bottom - top + BOTTOM_GAP_PX)}px`;
      setClipped(false);
    };

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    const mutation = new MutationObserver(() => {
      if (embed.childElementCount > 0) setStatus("ready");
      schedule();
    });
    mutation.observe(embed, { childList: true, subtree: true });

    // Las imágenes cambian la altura de las tarjetas sin mutar el DOM: se observa el tamaño.
    const resize = new ResizeObserver(schedule);
    resize.observe(embed);
    window.addEventListener("resize", schedule);

    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.defer = true;
    script.dataset.mtLinkedin = "true";
    script.onerror = () => setStatus("error");
    document.body.appendChild(script);

    const timeout = window.setTimeout(() => {
      setStatus((s) => (s === "loading" ? "error" : s));
    }, LOAD_TIMEOUT_MS);

    return () => {
      mutation.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      script.remove();
    };
  }, [maxPosts]);

  return (
    <div className={cn("relative", className)}>
      {status === "loading" ? <FeedSkeleton count={maxPosts} /> : null}
      {status === "error" ? <FeedFallback /> : null}

      <div ref={frameRef} className={cn("relative overflow-hidden", status !== "ready" && "h-0")}>
        <div
          ref={embedRef}
          className="sk-ww-linkedin-page-post"
          data-embed-id={siteConfig.integrations.sociableKitLinkedInEmbedId}
        />
        {clipped ? (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        ) : null}
      </div>
    </div>
  );
}

function FeedSkeleton({ count }: { count: number }) {
  return (
    <ul aria-label="Cargando publicaciones" className="grid gap-5 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="animate-pulse rounded-3xl border border-line bg-white p-5">
          <div className="aspect-[4/3] rounded-2xl bg-surface" />
          <div className="mt-5 h-4 w-3/4 rounded-full bg-surface" />
          <div className="mt-3 h-4 w-1/2 rounded-full bg-surface" />
        </li>
      ))}
    </ul>
  );
}

function FeedFallback() {
  return (
    <div className="rounded-3xl border border-line bg-surface p-8 text-center">
      <p className="font-semibold text-ink">No pudimos cargar las publicaciones en este momento.</p>
      <p className="mt-2 text-ink-soft">
        {siteConfig.social.linkedin ? (
          <>
            Puedes verlas directamente en{" "}
            <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue hover:underline">
              nuestra página de LinkedIn
            </a>
            .
          </>
        ) : (
          "Vuelve a intentarlo más tarde."
        )}
      </p>
    </div>
  );
}
