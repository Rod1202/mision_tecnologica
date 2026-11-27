/**
 * Opciones y utilidades de "Quiero que me asesoren" que también usa el navegador.
 * Sin zod a propósito: importar el esquema desde un componente cliente sumaría ~90 KB (gzip) a la página.
 */

export const advisoryNeedOptions = [
  { value: "impresion", label: "Impresión" },
  { value: "computo", label: "Cómputo" },
  { value: "digitalizacion", label: "Digitalización" },
  { value: "audiovideo", label: "Audio y video" },
  { value: "no-se", label: "Aún no lo sé" },
] as const;
export type AdvisoryNeed = (typeof advisoryNeedOptions)[number]["value"];

/** Horarios de atención para la reunión exploratoria (lunes a viernes). */
export const meetingSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"] as const;

/** Fecha local de Lima (UTC−5, sin horario de verano) en formato AAAA-MM-DD. */
export function limaToday(now = new Date()) {
  return new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function isWeekday(iso: string) {
  const day = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return day !== 0 && day !== 6;
}
