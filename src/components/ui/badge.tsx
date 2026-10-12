import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        brand: "bg-brand-blue-50 text-brand-blue-800",
        teal: "bg-brand-teal-50 text-brand-teal-700",
        onBlue: "bg-white/15 text-white ring-1 ring-white/25 ring-inset",
      },
    },
    defaultVariants: { variant: "brand" },
  },
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
