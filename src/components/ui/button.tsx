import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Botones en forma de píldora, coherentes con el isotipo de la marca. */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1.1em]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-blue text-white shadow-[0_8px_20px_-8px_rgb(0_102_255/0.6)] hover:bg-brand-blue-700 focus-visible:outline-brand-blue",
        inverse:
          "bg-white text-brand-blue shadow-[0_8px_24px_-10px_rgb(1_26_71/0.45)] hover:bg-brand-blue-50 focus-visible:outline-white",
        outline:
          "border border-brand-blue/30 bg-white text-brand-blue hover:border-brand-blue hover:bg-brand-blue-50 focus-visible:outline-brand-blue",
        "outline-inverse":
          "border border-white/50 text-white hover:border-white hover:bg-white/10 focus-visible:outline-white",
        ghost: "text-ink hover:bg-surface focus-visible:outline-brand-blue",
        link: "rounded-none px-0 text-brand-blue underline-offset-4 hover:underline focus-visible:outline-brand-blue",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[0.95rem]",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
