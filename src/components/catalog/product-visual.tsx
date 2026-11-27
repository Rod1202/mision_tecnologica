import { Laptop, Printer, ReceiptText, Ruler, ScanBarcode, ScanLine, type LucideIcon } from "lucide-react";

import { IsoStrokes } from "@/components/brand/pills";
import type { ProductKind } from "@/lib/content/compare";
import { cn } from "@/lib/utils";

const glyphs: Partial<Record<ProductKind, LucideIcon>> = {
  laptop: Laptop,
  ticketera: ReceiptText,
  plotter: Ruler,
  lector: ScanBarcode,
  escaner: ScanLine,
};

/**
 * Visual de producto mientras no haya fotografías oficiales autorizadas:
 * fondo de marca con franjas del isotipo + ícono y código de modelo.
 */
export function ProductVisual({
  model,
  kind = "impresora",
  size = "md",
  className,
}: {
  model: string;
  kind?: ProductKind;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Glyph = glyphs[kind] ?? Printer;
  return (
    <div
      aria-hidden
      className={cn(
        "relative isolate flex aspect-square items-center justify-center overflow-hidden bg-brand-blue text-white",
        size === "sm" ? "rounded-2xl" : "rounded-3xl",
        className,
      )}
    >
      <IsoStrokes className="inset-y-[-15%] left-[20%] -z-10 w-[75%] opacity-[0.12]" />
      <div className="flex flex-col items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-white text-brand-bright shadow-[0_18px_36px_-16px_rgb(0_20_51/0.7)]",
            size === "sm" ? "size-10" : size === "lg" ? "size-28" : "size-20",
          )}
        >
          <Glyph className={size === "sm" ? "size-5" : size === "lg" ? "size-12" : "size-9"} strokeWidth={1.6} />
        </span>
        {size !== "sm" ? (
          <span className={cn("font-bold tracking-wide", size === "lg" ? "text-xl" : "text-base")}>{model}</span>
        ) : null}
      </div>
    </div>
  );
}
