"use client";

import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { ConsentField, LeadFields } from "@/components/forms/lead-fields";
import { useQuoteCart } from "@/components/catalog/quote-cart";
import { useQuote } from "@/components/quote/quote-provider";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/form-controls";
import { submitQuote } from "@/lib/actions/quote";
import { cn } from "@/lib/utils";
import type { QuoteRequestState } from "@/lib/validation/quote";

const initialState: QuoteRequestState = { status: "idle" };

export function QuoteRequestForm({ className }: { className?: string }) {
  const { quote } = useQuote();
  const { lines } = useQuoteCart();
  const [state, formAction, pending] = useActionState(submitQuote, initialState);
  const statusRef = useRef<HTMLDivElement>(null);
  const empty = quote.services.length === 0 && lines.length === 0;

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className={cn("rounded-3xl bg-white p-7 text-ink shadow-lift sm:p-10", className)}>
        <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-teal-50 text-brand-teal-700">
            <CheckCircle2 aria-hidden className="size-7" />
          </span>
          <h3 className="mt-6 text-2xl font-bold">Solicitud validada</h3>
          <p className="mt-3 leading-relaxed text-ink-soft">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      aria-describedby="quote-form-status"
      className={cn("relative rounded-3xl bg-white p-6 text-ink shadow-lift sm:p-8 lg:p-10", className)}
    >
      <h3 className="text-2xl font-bold">Tus datos</h3>
      <p className="mt-2 text-ink-soft">Para enviarte la cotización necesitamos los datos de tu empresa. Los campos con * son obligatorios.</p>

      <div
        id="quote-form-status"
        ref={statusRef}
        tabIndex={-1}
        role="alert"
        className={cn("outline-none", state.status === "error" && "mt-5 flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800")}
      >
        {state.status === "error" ? (
          <>
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
            {state.message}
          </>
        ) : null}
      </div>

      <input type="hidden" name="quote" value={JSON.stringify(quote)} />
      <input type="hidden" name="items" value={JSON.stringify(lines)} />

      <div className="mt-6">
        <LeadFields prefix="q" errors={state.errors} values={state.values} />
      </div>

      <Field id="q-message" label="¿Algo más que debamos saber?" hint="Opcional" error={state.errors?.message} className="mt-5">
        <Textarea
          id="q-message"
          name="message"
          rows={3}
          defaultValue={state.values?.message ?? ""}
          aria-invalid={!!state.errors?.message}
          aria-describedby={state.errors?.message ? "q-message-error" : undefined}
        />
      </Field>

      <div className="mt-6">
        <ConsentField prefix="q" error={state.errors?.consent} defaultChecked={state.values?.consent === "on"} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={pending || empty} className="w-full sm:w-auto">
          {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Send aria-hidden />}
          {pending ? "Enviando…" : "Solicitar cotización"}
        </Button>
        {empty ? (
          <p className="text-sm text-ink-soft">
            Primero{" "}
            <a href="#servicios" className="font-semibold text-brand-blue hover:underline">
              elige al menos un servicio
            </a>
            .
          </p>
        ) : null}
      </div>
    </form>
  );
}
