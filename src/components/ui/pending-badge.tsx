import { Badge } from "@/components/ui/badge";

/**
 * Marca visible solo en desarrollo/pruebas para contenido aún no validado.
 * El contenido no verificado nunca se renderiza en producción (ver `showUnverifiedContent`).
 */
export function PendingBadge({ note, label = "Por validar" }: { note?: string; label?: string }) {
  return (
    <Badge variant="pending" title={note}>
      <span aria-hidden className="size-1.5 rounded-full bg-amber-500" />
      {label}
    </Badge>
  );
}
