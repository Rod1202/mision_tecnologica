import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Logotipo oficial. Versiones disponibles (PNG temporales hasta contar con SVG):
 * - color: degradé turquesa→azul con texto oscuro, para fondos claros.
 * - white: versión blanca rellena, para fondos de color de marca u oscuros.
 * Proporción fija 1041×240: no deformar, rotar ni recolorear (brandbook).
 *
 * `width`/`height` son el tamaño máximo en pantalla (h-9 ≈ 156 px de ancho), no el del archivo:
 * así Next sirve versiones de 256/384 px (1x/2x) en lugar de 1080/3840 px para un logo pequeño.
 */
export function Logo({
  variant = "color",
  className,
  priority = false,
}: {
  variant?: "color" | "white";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "white" ? "/brand/logo-mt-white.png" : "/brand/logo-mt-color.png"}
      alt="Misión Tecnológica"
      width={174}
      height={40}
      priority={priority}
      className={cn("h-9 w-auto", className)}
    />
  );
}
