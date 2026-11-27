import { ArrowDown } from "lucide-react";

import { IsoStrokes } from "@/components/brand/pills";
import { Button } from "@/components/ui/button";
import { heroPillars, heroVideo } from "@/lib/content/home";
import { cn } from "@/lib/utils";

/**
 * 01 · Hero: video de fondo (cuando exista), propuesta de valor, los 3 pilares y un solo botón,
 * "Conoce más", que baja a Soluciones para iniciar el recorrido (storyline) de la página.
 * Sin video: fondo azul de marca #0052CC con las franjas translúcidas del isotipo.
 */
export function Hero() {
  const hasVideo = !!heroVideo.src;

  return (
    <section aria-labelledby="hero-title" className={cn("relative isolate overflow-hidden text-white", hasVideo ? "bg-deep" : "bg-brand-blue")}>
      {hasVideo ? (
        <>
          {/* Con "reducir movimiento" el video no se reproduce: queda la imagen de respaldo. */}
          <video
            aria-hidden
            className="absolute inset-0 -z-20 size-full object-cover motion-reduce:hidden"
            src={heroVideo.src}
            poster={heroVideo.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          {heroVideo.poster ? (
            // eslint-disable-next-line @next/next/no-img-element -- respaldo decorativo del video
            <img aria-hidden alt="" src={heroVideo.poster} className="absolute inset-0 -z-30 size-full object-cover" />
          ) : null}
          {/* Capa oscura al 65 % para garantizar contraste AA del texto blanco */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-deep/65" />
        </>
      ) : (
        <IsoStrokes className="top-[-30%] right-[-45%] -z-10 h-[160%] w-[95%] opacity-[0.09] sm:right-[-20%] sm:w-[70%] lg:right-[-4%] lg:w-[46%]" />
      )}

      <div className="container-mt pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-28 lg:pb-28">
        <div className="max-w-3xl">
          <h1 id="hero-title" className="text-[2.5rem] leading-[1.04] font-extrabold tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            Tecnología que impulsa las operaciones de tu empresa.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            Soluciones de outsourcing tecnológico e impresión empresarial diseñadas para optimizar recursos, mejorar el
            servicio y acompañar el crecimiento de tu organización.
          </p>

          <div className="mt-9">
            <p className="text-sm font-bold tracking-[0.08em] text-white/80 uppercase">Te ofrecemos</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {heroPillars.map((p) => (
                <li key={p} className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 font-semibold ring-1 ring-white/25 ring-inset">
                  <span aria-hidden className="size-2 rounded-full bg-brand-teal" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Un solo llamado: invita a recorrer la página (storyline) en lugar de pedir una acción de entrada.
              Cotizar y contactar siguen disponibles en el encabezado y en "Encuentra tu solución". */}
          <Button asChild variant="inverse" size="lg" className="group mt-10">
            <a href="#soluciones">
              Conoce más
              <ArrowDown aria-hidden className="transition-transform group-hover:translate-y-0.5 motion-safe:animate-bounce" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
