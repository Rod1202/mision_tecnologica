import { headers } from "next/headers";

/**
 * Protección básica de formularios: límite de frecuencia por IP (en memoria) y honeypot.
 * En memoria basta para desarrollo; en Netlify (serverless) y en el VPS se reemplazará por un
 * límite persistente (base de datos o proxy inverso).
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export async function isRateLimited(scope: string) {
  const h = await headers();
  const ip = h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

/** Campo invisible para personas: si llega lleno, es un bot. */
export function isHoneypotFilled(formData: FormData) {
  return String(formData.get("website") ?? "").trim() !== "";
}
