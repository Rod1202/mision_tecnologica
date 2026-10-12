import type { Challenge, Milestone } from "./types";

/* Soluciones, sectores y productos viven en sus propios archivos:
 * solutions.ts · sectors.ts · products.ts */

/* ------------------------------------------------------------------ */
/* 02 · El desafío                                                     */
/* ------------------------------------------------------------------ */

export const challenges: Challenge[] = [
  {
    id: "control-de-recursos",
    title: "Control de recursos",
    description:
      "Conocer qué equipos y servicios tecnológicos tiene la empresa, dónde están y cómo se usan, para administrarlos con eficiencia.",
    icon: "gauge",
  },
  {
    id: "continuidad-operativa",
    title: "Continuidad operativa",
    description:
      "Reducir las fricciones del día a día para que las áreas sigan trabajando sin interrupciones por temas tecnológicos.",
    icon: "activity",
  },
  {
    id: "gestion-especializada",
    title: "Gestión especializada",
    description:
      "Acceder a conocimientos y servicios adecuados a cada necesidad, sin cargar al equipo interno con tareas fuera de su foco.",
    icon: "user-cog",
  },
];

/* ------------------------------------------------------------------ */
/* 04 · Impresión empresarial                                          */
/* ------------------------------------------------------------------ */

export const printingCapabilities: string[] = [
  "Evaluación de la necesidad de impresión de cada sede o área.",
  "Instalación, configuración y puesta en marcha de los equipos.",
  "Soporte técnico y mantenimiento durante la operación.",
  "Seguimiento del parque de impresión y de sus consumibles.",
];

/* ------------------------------------------------------------------ */
/* 06 · Innovación                                                     */
/* ------------------------------------------------------------------ */

export const featuredMilestone: Milestone = {
  id: "hp-nueva-generacion-2026",
  year: "2026",
  category: "Impresión empresarial",
  title: "Equipos HP LaserJet Enterprise de nueva generación, en producción",
  // Formulación prudente aprobada en el documento del proyecto, mientras se valida la afirmación de primacía.
  summary:
    "Misión Tecnológica cuenta con equipos de impresión láser HP de nueva generación desplegados en entornos de producción.",
  href: "/soluciones/impresion-empresarial",
  verified: false,
  note: "Confirmar país, fechas de lanzamiento y de puesta en producción, modelos, cantidades, evidencia y permisos del cliente.",
};
