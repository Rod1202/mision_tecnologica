import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { IsoStrokes } from "@/components/brand/pills";
import { Button } from "@/components/ui/button";

/**
 * 01 · Hero: propuesta de valor + dos CTA.
 * Fondo #0066FF con las franjas translúcidas inclinadas del isotipo (mismo recurso que la tarjeta de Outsourcing).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-brand-blue text-white">
      <IsoStrokes className="top-[-30%] right-[-45%] -z-10 h-[160%] w-[95%] opacity-[0.09] sm:right-[-20%] sm:w-[70%] lg:right-[-4%] lg:w-[46%]" />

      <div className="container-mt pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-28 lg:pb-32">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 ring-inset">
            <span aria-hidden className="size-2 rounded-full bg-brand-teal" />
            Outsourcing tecnológico · Impresión empresarial
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[2.5rem] leading-[1.04] font-extrabold tracking-[-0.03em] sm:text-6xl lg:text-7xl"
          >
            Tecnología que impulsa las operaciones de tu empresa.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            Soluciones de outsourcing tecnológico e impresión empresarial diseñadas para optimizar recursos, mejorar el
            servicio y acompañar el crecimiento de tu organización.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild variant="inverse" size="lg">
              <Link href="/#contacto">
                Solicitar asesoría
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline-inverse" size="lg">
              <Link href="/soluciones">Explorar soluciones</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
