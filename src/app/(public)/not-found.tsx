import Link from "next/link";

import { IsoStrokes } from "@/components/brand/pills";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-blue text-white">
      <IsoStrokes className="top-[-20%] right-[-10%] -z-10 h-[140%] w-[45%] opacity-[0.08]" />
      <div className="container-mt py-24 sm:py-32">
        <p className="text-sm font-bold tracking-[0.08em] text-white/75 uppercase">Error 404</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-extrabold sm:text-6xl">No encontramos esta página.</h1>
        <p className="mt-6 max-w-xl text-lg text-white/85">Puede que la dirección haya cambiado o que la página ya no exista.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="inverse" size="lg">
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline-inverse" size="lg">
            <Link href="/#contacto">Solicitar asesoría</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
