import { Info } from "lucide-react";

/** Aviso del catálogo: portafolio sin precios ni compras en línea; todo termina en una cotización. */
export function DemoNotice() {
  return (
    <p className="flex items-start gap-3 rounded-2xl border border-brand-bright/20 bg-brand-blue-50 px-5 py-4 text-sm leading-relaxed text-brand-blue-800">
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>
        <strong>Portafolio sin precios.</strong> No hay compras en línea: agrega los equipos a tu cotización y un asesor te enviará la
        propuesta con modelos, condiciones y plazos.
      </span>
    </p>
  );
}
