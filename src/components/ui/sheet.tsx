"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;

function SheetContent({
  className,
  children,
  closeLabel = "Cerrar",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & { closeLabel?: string }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]" />
      <SheetPrimitive.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-dvh w-[88vw] max-w-sm flex-col bg-white shadow-2xl outline-none",
          "data-[state=open]:animate-[sheet-in_280ms_cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-[sheet-out_200ms_ease-in]",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-surface focus-visible:outline-2 focus-visible:outline-brand-blue"
          aria-label={closeLabel}
        >
          <X className="size-5" aria-hidden />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
