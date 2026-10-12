"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";

import { useQuoteCart } from "@/components/catalog/quote-cart";
import { Button } from "@/components/ui/button";

export function AddToQuoteButton({
  slug,
  name,
  size = "md",
  openCart = true,
  className,
}: {
  slug: string;
  name: string;
  size?: "md" | "lg";
  openCart?: boolean;
  className?: string;
}) {
  const { add, setOpen } = useQuoteCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(t);
  }, [added]);

  return (
    <Button
      type="button"
      size={size}
      className={className}
      aria-label={`Agregar ${name} a la cotización`}
      onClick={() => {
        add(slug);
        setAdded(true);
        if (openCart) setOpen(true);
      }}
    >
      {added ? <Check aria-hidden /> : <Plus aria-hidden />}
      {added ? "Agregado" : "Agregar a cotización"}
    </Button>
  );
}
