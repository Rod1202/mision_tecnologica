import type { Verification } from "./types";

/**
 * Información institucional (página Nosotros).
 * Fuentes: web actual (misiontecnologica.com: Inicio, Nosotros, Soluciones y Portal ISO), documento
 * "Arquitectura UX/UI" (lámina "Introducción MT") y datos confirmados por el equipo (ISO 9001 e ISO/IEC 27001).
 */

export const about = {
  intro:
    "Misión Tecnológica es una empresa peruana de soluciones TI, cómputo e impresión. Somos Partner Platinum de HP desde 2016 y acompañamos a las organizaciones con outsourcing de impresión, cómputo, digitalización e infraestructura tecnológica.",
  mission:
    "Ser el aliado tecnológico por excelencia, aportando valor a través de soluciones TI y experiencia, para que las organizaciones ganen eficiencia e innovación.",
  vision:
    "Ser pioneros a la vanguardia de la tecnología, liderando hacia un mundo innovador más conectado, eficiente y sostenible.",
  values: [
    { title: "Innovación", description: "Convertimos buenas ideas en soluciones que aportan valor a las organizaciones." },
    { title: "Excelencia", description: "Productos y servicios de alta calidad, del diseño al soporte, para superar las expectativas." },
    { title: "Colaboración", description: "Trabajo en equipo, diversidad de ideas, comunicación abierta y respeto mutuo." },
    { title: "Integridad", description: "Honestidad, transparencia y ética en los negocios y en las relaciones personales." },
    { title: "Sostenibilidad", description: "Responsabilidad con la sociedad y el ambiente, y apoyo a las comunidades donde operamos." },
  ],
  /** Cifras publicadas en la web actual. */
  stats: [
    { value: "+10", label: "años de experiencia" },
    { value: "+100", label: "clientes" },
  ],
};

/** Alianza con HP (web actual: Inicio, Nosotros y Soluciones). */
export const hpPartnership = {
  badge: "HP Platinum Partner",
  title: "Partner Platinum de HP",
  description:
    "Desde 2016 mantenemos la condición de Partner Platinum de HP Inc., la categoría más alta que HP otorga a sus canales. En poco tiempo nos convertimos en su principal canal de soluciones de impresión para el segmento corporativo.",
  meaning:
    "Somos el único canal monomarca de HP Inc. en el Perú para el segmento corporativo de outsourcing de impresión, y Centro de Servicio Autorizado HP (CAS): realizamos servicios autorizados por la marca sobre el parque de impresoras de nuestros clientes, con disponibilidad de repuestos, mayor rapidez y gestión de garantías.",
  points: [
    "Partner Platinum de HP Inc. desde 2016.",
    "Único canal monomarca de HP Inc. en el Perú para outsourcing de impresión corporativo.",
    "Centro de Servicio Autorizado HP (CAS).",
    "Partner del Año 2017 y partner con mayor crecimiento y cobertura en impresión administrada.",
  ],
};

/** Premios otorgados (web actual, página Nosotros: imágenes "Premios nacionales" e "internacionales"). */
export const awards: { group: "HP" | "Candefero"; title: string; detail?: string; year: string }[] = [
  { group: "HP", title: "Platinum Partner", detail: "HP Partner First", year: "2019" },
  { group: "HP", title: "Managed Print Services Partner", year: "FY20" },
  { group: "HP", title: "Managed Print Services Corporate Partner", detail: "HP Amplify Awards", year: "FY21" },
  { group: "HP", title: "Canal con mayor TCV en cMPS", detail: "HP Partner Awards", year: "FY23" },
  { group: "Candefero", title: "Innovation and Transformation Partner of the Year", year: "2016" },
  { group: "Candefero", title: "Infrastructure Growth Partner of the Year", detail: "LATAM", year: "2017" },
  { group: "Candefero", title: "Innovation and Transformation Partner of the Year", detail: "LATAM", year: "2019" },
];

export type Certification = {
  code: string;
  name: string;
  description: string;
  /** Alcance del certificado (completar con el texto exacto del certificado). */
  scope?: string;
};

export const certifications: Certification[] = [
  {
    code: "ISO 9001",
    name: "Sistema de Gestión de la Calidad",
    description:
      "Norma internacional que establece los requisitos de un sistema de gestión de la calidad: procesos definidos, orientación al cliente y mejora continua.",
  },
  {
    code: "ISO/IEC 27001",
    name: "Sistema de Gestión de Seguridad de la Información",
    description:
      "Norma internacional para gestionar la seguridad de la información: confidencialidad, integridad y disponibilidad de los datos de la empresa y de sus clientes.",
  },
  {
    code: "ISO 37001",
    name: "Sistema de Gestión Antisoborno",
    description:
      "Norma internacional para prevenir, detectar y enfrentar el soborno, con controles de integridad y transparencia en todas las operaciones.",
  },
];

/** Estándares de trabajo que se desprenden de los sistemas de gestión certificados. */
export const qualityStandards: { title: string; description: string }[] = [
  {
    title: "Procesos documentados",
    description: "Cada servicio sigue procedimientos definidos, desde la implementación hasta el soporte.",
  },
  {
    title: "Orientación al cliente",
    description: "Medimos la satisfacción y atendemos los requerimientos con seguimiento hasta su cierre.",
  },
  {
    title: "Mejora continua",
    description: "Revisamos los resultados del servicio para corregir y mejorar de forma permanente.",
  },
  {
    title: "Seguridad de la información",
    description: "Protegemos la información de nuestros clientes con controles de confidencialidad y acceso.",
  },
  {
    title: "Trazabilidad",
    description: "Registramos las atenciones, entregas e inventarios para que todo pueda verificarse.",
  },
  {
    title: "Personal capacitado",
    description: "Nuestro equipo técnico se forma de manera continua en las soluciones que implementa.",
  },
];

/**
 * Presencia: sede principal en Lima (con cobertura en todo el Perú), filial en Bolivia y alianzas
 * estratégicas en la región. `countryId` = código ISO 3166-1 numérico del mapa (latam-map.ts).
 */
export type PresenceKind = "sede" | "filial" | "alianza";

export const presence = {
  title: "Presencia internacional",
  intro:
    "Nuestra sede principal está en Lima y atendemos a organizaciones en todo el Perú. Con una filial en Bolivia y alianzas estratégicas en la región, tenemos presencia en toda Latinoamérica.",
  locations: [
    { countryId: "604", country: "Perú", kind: "sede", detail: "Sede principal en Lima · cobertura nacional" },
    { countryId: "068", country: "Bolivia", kind: "filial", detail: "Filial" },
    { countryId: "484", country: "México", kind: "alianza", detail: "Alianza estratégica" },
    { countryId: "188", country: "Costa Rica", kind: "alianza", detail: "Alianza estratégica · cobertura en Centroamérica y el Caribe" },
    { countryId: "170", country: "Colombia", kind: "alianza", detail: "Alianza estratégica" },
    { countryId: "218", country: "Ecuador", kind: "alianza", detail: "Alianza estratégica" },
    { countryId: "152", country: "Chile", kind: "alianza", detail: "Alianza estratégica" },
  ] satisfies { countryId: string; country: string; kind: PresenceKind; detail: string }[],
};

export const presenceKinds: Record<PresenceKind, { label: string }> = {
  sede: { label: "Sede principal" },
  filial: { label: "Filial" },
  alianza: { label: "Alianzas estratégicas" },
};

export type Leader = {
  name: string;
  role: string;
  bio?: string;
  /** Fotografía aprobada (ruta en /public). */
  photo?: string;
} & Verification;

/**
 * Equipo directivo. COMPLETAR con nombres, cargos, fotografía y biografía aprobados.
 * Mientras `verified` sea false, la sección solo se ve en desarrollo/pruebas.
 */
export const leaders: Leader[] = [
  {
    name: "Nombre por confirmar",
    role: "Gerente General",
    verified: false,
    note: "Completar nombre, fotografía y biografía aprobada.",
  },
  {
    name: "Nombre por confirmar",
    role: "Gerente Comercial",
    verified: false,
    note: "Completar nombre, fotografía y biografía aprobada.",
  },
  {
    name: "Nombre por confirmar",
    role: "Gerente de Operaciones",
    verified: false,
    note: "Completar nombre, fotografía y biografía aprobada.",
  },
];
