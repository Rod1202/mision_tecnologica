import type { Verification } from "./types";

/**
 * Información institucional (página Nosotros).
 * Datos confirmados por el equipo: partner de HP, certificaciones ISO 9001 e ISO/IEC 27001
 * y cobertura a nivel nacional.
 */

export const about = {
  intro:
    "Misión Tecnológica es una empresa peruana de servicios tecnológicos. Acompañamos a las organizaciones con outsourcing tecnológico, soluciones de impresión empresarial e implementación de equipos, para que su operación funcione mejor cada día.",
};

export const hpPartnership = {
  title: "Partner de HP",
  description:
    "Somos partner de HP y trabajamos con HP como marca principal en impresión láser empresarial. Esto nos permite ofrecer equipos de la línea HP LaserJet Enterprise junto con su implementación, soporte y seguimiento.",
  points: [
    "Equipos HP LaserJet Enterprise para entornos corporativos.",
    "Implementación y soporte a cargo de nuestro equipo técnico.",
    "Acceso a la tecnología de impresión de nueva generación de HP.",
  ],
};

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

export const coverage = {
  title: "Cobertura a nivel nacional",
  description:
    "Atendemos a organizaciones con sedes en todo el Perú. Coordinamos implementaciones, soporte y reposición de consumibles en Lima y en regiones.",
  regions: [
    { name: "Costa", text: "Lima y ciudades de la costa." },
    { name: "Sierra", text: "Sedes y agencias en la sierra." },
    { name: "Selva", text: "Sedes y agencias en la selva." },
  ],
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
