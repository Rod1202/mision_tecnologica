import Image from "next/image";
import { ImageIcon } from "lucide-react";

import type { Client } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * Espacio de logotipo de un cliente.
 * - Con `client.logo` (ruta en /public, p. ej. "/clients/caja-trujillo.svg"): muestra el logo.
 * - Sin logo: recuadro reservado con el nombre, listo para reemplazar cuando llegue el archivo.
 * Proporción fija 3:2 para que todos los logos convivan alineados.
 */
export function ClientLogo({ client, size = "md", className }: { client: Client; size?: "sm" | "md"; className?: string }) {
  const hasLogo = Boolean(client.logo);

  return (
    <figure className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden bg-white",
          size === "sm" ? "rounded-xl" : "rounded-2xl",
          hasLogo ? "border border-line" : "border border-dashed border-ink-faint/40 bg-surface",
        )}
      >
        {hasLogo ? (
          <Image
            src={client.logo!}
            alt={`Logotipo de ${client.name}`}
            fill
            sizes={size === "sm" ? "120px" : "200px"}
            className={cn("object-contain", size === "sm" ? "p-2.5" : "p-4")}
          />
        ) : (
          <ImageIcon aria-hidden className={cn("text-ink-faint/60", size === "sm" ? "size-5" : "size-7")} strokeWidth={1.5} />
        )}
      </div>
      <figcaption
        className={cn(
          "text-center leading-snug text-ink",
          hasLogo && "sr-only",
          size === "sm" ? "text-xs font-medium" : "text-sm font-semibold",
        )}
      >
        {client.name}
      </figcaption>
    </figure>
  );
}
