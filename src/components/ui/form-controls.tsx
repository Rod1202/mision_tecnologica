import * as React from "react";

import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-input bg-white px-4 text-base text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] outline-none focus-visible:border-brand-blue focus-visible:ring-4 focus-visible:ring-brand-blue/15 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/10 disabled:opacity-60";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input data-slot="input" className={cn(fieldBase, "h-12", className)} {...props} />;
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(fieldBase, "min-h-28 resize-y py-3", className)} {...props} />;
}

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(fieldBase, "h-12 appearance-none pr-11", className)}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-soft"
      >
        <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label data-slot="label" className={cn("text-sm font-semibold text-ink", className)} {...props} />;
}

/** Campo con etiqueta, ayuda opcional y mensaje de error enlazado (aria-describedby = `${id}-error`). */
function Field({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {hint ? <span className="text-xs text-ink-faint">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Input, Textarea, Select, Label, Field };
