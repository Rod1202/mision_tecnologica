/**
 * Marcas aliadas / partners — franja del Inicio. Futura colección `Partners` de Payload.
 *
 * - `logo`: ruta en /public (recomendado SVG o PNG con fondo transparente), p. ej. "/partners/hp.svg".
 *   Sin logo, se muestra el nombre de la marca como texto.
 * - `placeholder: true`: espacio reservado para una marca por confirmar. Solo se ve en desarrollo
 *   y pruebas; en producción no aparece. Reemplázalo por la marca real (nombre + logo).
 * - Usar logotipos de terceros solo con autorización de la marca o según su programa de partners.
 */

export type Partner = {
  name: string;
  logo?: string;
  url?: string;
  placeholder?: boolean;
};

export const partners: Partner[] = [
  { name: "HP" }, // Partner confirmado. Agregar logo: { name: "HP", logo: "/partners/hp.svg" }
  { name: "Marca aliada", placeholder: true },
  { name: "Marca aliada", placeholder: true },
  { name: "Marca aliada", placeholder: true },
  { name: "Marca aliada", placeholder: true },
];
