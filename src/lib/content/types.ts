/**
 * Tipos compartidos de contenido. Replican la forma prevista de las colecciones de Payload CMS
 * para que la migración al CMS solo cambie el origen de los datos, no los componentes.
 */

/** Estado de validación de cualquier afirmación, referencia o dato comercial. */
export type Verification = {
  verified: boolean;
  /** Qué falta confirmar antes de publicar. */
  note?: string;
};

export type IconName =
  | "gauge"
  | "activity"
  | "user-cog"
  | "network"
  | "printer"
  | "rocket"
  | "life-buoy"
  | "graduation-cap"
  | "landmark"
  | "truck"
  | "shopping-bag"
  | "building";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
};

export type Client = {
  name: string;
  /** Logotipo autorizado (se usará cuando exista permiso de uso). */
  logo?: string;
} & Verification;

export type Milestone = {
  id: string;
  year: string;
  category: string;
  title: string;
  summary: string;
  href: string;
} & Verification;
