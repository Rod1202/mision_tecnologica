import { Info } from "lucide-react";

/** Aviso obligatorio en la fase 1: el catálogo es de demostración. */
export function DemoNotice() {
  return (
    <p className="flex items-start gap-3 rounded-2xl border border-brand-blue/20 bg-brand-blue-50 px-5 py-4 text-sm leading-relaxed text-brand-blue-800">
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>
        <strong>Catálogo de demostración.</strong> Los precios son referenciales de prueba, no hay stock en línea y no se realizan
        compras: agrega los equipos a tu cotización y te responderemos por WhatsApp.
      </span>
    </p>
  );
}
