import type { IconName } from "./types";

/* Soluciones, sectores y productos viven en sus propios archivos:
 * solutions.ts · sectors.ts · products.ts */

/* ------------------------------------------------------------------ */
/* 01 · Hero                                                            */
/* ------------------------------------------------------------------ */

/**
 * Video de fondo del hero (bucle de operaciones y tecnología).
 * Colocar el archivo en /public/media/ (MP4 H.264, sin audio, idealmente < 5 MB y 10–20 s) y una imagen
 * de respaldo (`poster`, JPG/WebP del primer cuadro). Mientras `src` esté vacío se muestra el fondo de marca.
 */
export const heroVideo: { src?: string; poster?: string } = {
  src: undefined, // p. ej. "/media/hero-operaciones.mp4"
  poster: undefined, // p. ej. "/media/hero-operaciones.jpg"
};

/** "Te ofrecemos": los tres pilares (antes la sección "El desafío"). */
export const heroPillars = ["Control de recursos", "Continuidad operativa", "Gestión especializada"];

/* ------------------------------------------------------------------ */
/* 04 · Capas de servicio y sustentabilidad                             */
/* ------------------------------------------------------------------ */

export const serviceLayers: { title: string; description: string; icon: IconName }[] = [
  { title: "Soporte", description: "Mesa de ayuda y atención técnica, en sitio y remota, durante todo el servicio.", icon: "life-buoy" },
  { title: "Instalaciones", description: "Instalación, configuración y puesta en marcha de los equipos en cada sede.", icon: "wrench" },
  { title: "Software de gestión", description: "Control de equipos, consumos y volúmenes, con reportes para tomar decisiones.", icon: "dashboard" },
  { title: "Compensación de carbono", description: "Opción de compensar la huella de carbono asociada al servicio.", icon: "leaf" },
  { title: "Captura de datos inteligente", description: "Digitalización con texto buscable e indexación para encontrar la información al instante.", icon: "scan" },
];

/**
 * Sustentabilidad. Fuentes: web actual (Inicio, sección "Partners") y documento "Arquitectura UX/UI"
 * ("Líderes en sustentabilidad, 3 años seguidos"). Insignias oficiales en /public/sustentabilidad/ (opcional)
 * y foto de selva en `background`.
 */
export const sustainability = {
  title: "Líderes en sustentabilidad",
  streak: "3 años consecutivos",
  text: "Alcanzamos el nivel 5 estrellas en HP Amplify Impact, la máxima distinción en sostenibilidad del programa de socios de HP, y HP nos reconoció como el canal más sustentable de Latinoamérica en 2024.",
  /** Reconocimientos destacados. `image` = ruta en /public (opcional). */
  badges: [
    { label: "HP Amplify Impact", detail: "Nivel 5 estrellas" },
    { label: "Canal más sustentable de Latinoamérica", detail: "HP · 2024" },
  ] as { label: string; detail: string; image?: string }[],
  /** Foto de fondo (selva). Sin foto se usa un degradé verde azulado. */
  background: undefined as string | undefined,
};
