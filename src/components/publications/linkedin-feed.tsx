"use client";

import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const WIDGET_SRC = "https://widgets.sociablekit.com/linkedin-page-posts/widget.js";
const LOAD_TIMEOUT_MS = 15000;
/** Altura de seguridad si no se logra identificar la lista de publicaciones del widget. */
const FALLBACK_MAX_HEIGHT_PX = 1100;
/** Margen bajo la última publicación visible (sombra y borde de las tarjetas). */
const BOTTOM_GAP_PX = 16;
/** El script del widget (~300 KB de terceros) se pide solo cuando la sección está a esta distancia de la pantalla. */
const LOAD_AHEAD_PX = 800;
/** Contenido mínimo para considerar que el widget ya dibujó algo más que su ícono de carga. */
const MIN_CONTENT_PX = 120;
/**
 * El widget crece mientras cargan sus imágenes. Se muestra recién cuando su altura no cambia durante este
 * tiempo (o al llegar al tope), para que la página no salte dos veces (primero corta y luego larga).
 */
const SETTLE_MS = 500;
const SETTLE_MAX_MS = 6000;
/** Si tras este tiempo no se reconocen publicaciones (el widget cambió), se muestra lo que haya con un tope de altura. */
const FALLBACK_AFTER_MS = 8000;

type Status = "idle" | "loading" | "ready" | "error";

/**
 * Publicaciones de la página de LinkedIn mediante el widget de SociableKit (proveedor externo).
 * - El script se carga recién cuando la sección se acerca a la pantalla (no compite con la carga inicial).
 * - El widget dibuja dentro de un shadow DOM: las publicaciones se buscan ahí.
 * - Muestra como máximo `maxPosts` publicaciones (por defecto 3) y oculta el botón "cargar más".
 * - El esqueleto se mantiene hasta que hay publicaciones, para que la página no salte.
 * - La altura se ajusta sola al final de la última publicación visible y se recalcula al cambiar el tamaño.
 * Recomendado: configurar también "número de publicaciones = 3" en el panel de SociableKit,
 * para que el límite no dependa solo del recorte en el navegador.
 */
export function LinkedInFeed({ maxPosts = 3, className }: { maxPosts?: number; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [clipped, setClipped] = useState(false);

  // 1) Esperar a que la sección se acerque a la pantalla.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || status !== "idle") return;
    if (!("IntersectionObserver" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- navegadores sin IntersectionObserver: cargar de inmediato
      setStatus("loading");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setStatus("loading");
        }
      },
      { rootMargin: `${LOAD_AHEAD_PX}px 0px` },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [status]);

  // 2) Cargar el widget y ajustar lo que muestra.
  const started = status !== "idle";
  useEffect(() => {
    if (!started) return;
    const embed = embedRef.current;
    const frame = frameRef.current;
    if (!embed || !frame) return;

    /** El widget dibuja dentro de un shadow DOM; versiones anteriores lo hacían en el propio contenedor. */
    const scope = (): ParentNode => embed.shadowRoot ?? embed;
    let postList: HTMLElement | null = null;

    /**
     * Publicaciones del widget. La versión actual de SociableKit marca cada una como `.sk-post-item`
     * (dentro de `.sk-masonry`); si cambia, se usa la heurística: el contenedor más externo con 2+ hijos
     * de la misma clase que además tienen texto (descarta la galería de fotos de una publicación).
     * La lista se reutiliza mientras siga en el documento (evita recorrer todo el widget en cada cambio).
     */
    const findPosts = (): HTMLElement[] | null => {
      const tagged = Array.from(scope().querySelectorAll<HTMLElement>(".sk-post-item"));
      if (tagged.length) return tagged;
      if (!postList?.isConnected) {
        postList = null;
        for (const el of Array.from(scope().querySelectorAll<HTMLElement>("*"))) {
          const kids = Array.from(el.children) as HTMLElement[];
          if (kids.length < 2) continue;
          const firstClass = kids[0]?.classList[0];
          if (!firstClass || !kids.every((k) => k.classList.contains(firstClass))) continue;
          const withText = kids.filter((k) => (k.textContent ?? "").trim().length > 40).length;
          if (withText >= Math.min(2, kids.length)) {
            postList = el; // el primero en orden de documento = el más externo
            break;
          }
        }
      }
      return postList ? (Array.from(postList.children) as HTMLElement[]) : null;
    };

    // Espera a que la altura se estabilice antes de reemplazar el esqueleto.
    const loadStart = performance.now();
    let lastHeight = -1;
    let lastChange = 0;
    let firstContent = 0;
    let settleTimer = 0;
    const markReadyWhenStable = (height: number) => {
      const now = performance.now();
      if (!firstContent) firstContent = now;
      if (height !== lastHeight) {
        lastHeight = height;
        lastChange = now;
      }
      if (now - lastChange >= SETTLE_MS || now - firstContent >= SETTLE_MAX_MS) {
        setStatus("ready");
        return;
      }
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(schedule, SETTLE_MS);
    };

    const update = () => {
      // Oculta "cargar más"
      scope()
        .querySelectorAll<HTMLElement>("[class*='load-more'], [class*='loadmore'], [class*='load_more']")
        .forEach((el) => {
          el.style.display = "none";
        });

      const posts = findPosts();
      if (!posts) {
        // Sin publicaciones reconocibles todavía (al principio el widget solo dibuja el encabezado de la página).
        // Pasado un tiempo prudente se muestra lo que haya, con un tope de altura.
        if (embed.scrollHeight < MIN_CONTENT_PX) return;
        if (performance.now() - loadStart < FALLBACK_AFTER_MS) {
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(schedule, SETTLE_MS);
          return;
        }
        frame.style.maxHeight = `${FALLBACK_MAX_HEIGHT_PX}px`;
        setClipped(embed.scrollHeight > FALLBACK_MAX_HEIGHT_PX);
        markReadyWhenStable(Math.min(embed.scrollHeight, FALLBACK_MAX_HEIGHT_PX));
        return;
      }

      posts.forEach((post, i) => {
        post.style.display = i < maxPosts ? "" : "none";
      });

      // Altura exacta hasta el final de la publicación visible más baja
      const top = embed.getBoundingClientRect().top;
      const bottom = posts
        .slice(0, maxPosts)
        .reduce((max, post) => Math.max(max, post.getBoundingClientRect().bottom), top);
      if (bottom - top < MIN_CONTENT_PX) return;
      const height = Math.ceil(bottom - top + BOTTOM_GAP_PX);
      frame.style.maxHeight = `${height}px`;
      setClipped(false);
      markReadyWhenStable(height);
    };

    let raf = 0;
    function schedule() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }

    // Cambios dentro del widget: el shadow DOM aparece después de que corre el script.
    const mutation = new MutationObserver(schedule);
    mutation.observe(embed, { childList: true, subtree: true });
    let observingShadow = false;
    const watchShadow = () => {
      if (observingShadow || !embed.shadowRoot) return;
      observingShadow = true;
      mutation.observe(embed.shadowRoot, { childList: true, subtree: true });
    };

    // Las imágenes cambian la altura de las tarjetas sin mutar el DOM: se observa el tamaño.
    const resize = new ResizeObserver(() => {
      watchShadow();
      schedule();
    });
    resize.observe(embed);
    window.addEventListener("resize", schedule);

    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
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
      window.clearTimeout(settleTimer);
      script.remove();
    };
  }, [started, maxPosts]);

  const ready = status === "ready";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {status === "idle" || status === "loading" ? <FeedSkeleton count={maxPosts} /> : null}
      {status === "error" ? <FeedFallback /> : null}

      {started ? (
        // Mientras carga, el widget se dibuja fuera de la vista (sin ocupar espacio) para poder medirlo.
        <div
          ref={frameRef}
          aria-hidden={!ready}
          className={cn("relative overflow-hidden", !ready && "pointer-events-none absolute inset-x-0 top-0 opacity-0")}
        >
          <div ref={embedRef} className="sk-ww-linkedin-page-post" data-embed-id={siteConfig.integrations.sociableKitLinkedInEmbedId} />
          {clipped ? (
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Misma forma que el widget (encabezado de la página + tarjetas de ~600 px), para que la página no salte al cargar. */
function FeedSkeleton({ count }: { count: number }) {
  return (
    <div aria-label="Cargando publicaciones" role="status" className="animate-pulse pt-6">
      <div className="flex h-[185px] items-start gap-4 px-6">
        <div className="size-16 shrink-0 rounded-full bg-surface" />
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-5 w-1/3 rounded-full bg-surface" />
          <div className="h-4 w-1/2 rounded-full bg-surface" />
          <div className="h-4 w-2/5 rounded-full bg-surface" />
        </div>
      </div>
      <ul className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="h-[600px] rounded-3xl border border-line bg-white p-5">
            <div className="h-11 w-2/3 rounded-full bg-surface" />
            <div className="mt-6 h-4 w-full rounded-full bg-surface" />
            <div className="mt-3 h-4 w-5/6 rounded-full bg-surface" />
            <div className="mt-3 h-4 w-3/4 rounded-full bg-surface" />
            <div className="mt-6 aspect-[4/3] rounded-2xl bg-surface" />
          </li>
        ))}
      </ul>
    </div>
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
            <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-bright hover:underline">
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
