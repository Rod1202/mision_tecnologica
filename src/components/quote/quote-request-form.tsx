"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, MessageCircle, Send } from "lucide-react";

import { useQuote } from "@/components/quote/quote-provider";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form-controls";
import { submitQuote } from "@/lib/actions/quote";
import { quoteDirectChannel } from "@/lib/quote";
import { cn } from "@/lib/utils";
import type { QuoteField, QuoteRequestState } from "@/lib/validation/quote";

const initialState: QuoteRequestState = { status: "idle" };

export function QuoteRequestForm({ className }: { className?: string }) {
  const { quote } = useQuote();
  const [state, formAction, pending] = useActionState(submitQuote, initialState);
  const statusRef = useRef<HTMLDivElement>(null);
  const empty = quote.services.length === 0;
  const direct = quoteDirectChannel(quote);

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
          <h3 className="mt-6 text-2xl font-bold">Proyecto validado</h3>
          <p className="mt-3 leading-relaxed text-ink-soft">{state.message}</p>
          <Button
            asChild
            size="lg"
            className={cn("mt-8", direct.kind === "whatsapp" && "bg-[#1fa855] shadow-none hover:bg-[#178a45]")}
          >
            <a href={direct.href} {...(direct.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {direct.kind === "whatsapp" ? <MessageCircle aria-hidden /> : <Mail aria-hidden />}
              {direct.kind === "whatsapp" ? "Enviar el resumen por WhatsApp" : "Enviar el resumen por correo"}
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const err = (f: QuoteField) => state.errors?.[f];
  const val = (f: QuoteField) => state.values?.[f] ?? "";
  const described = (f: QuoteField) => (err(f) ? `q-${f}-error` : undefined);

  return (
    <form
      action={formAction}
      noValidate
      aria-describedby="quote-form-status"
      className={cn("relative rounded-3xl bg-white p-6 text-ink shadow-lift sm:p-8 lg:p-10", className)}
    >
      <h3 className="text-2xl font-bold">Tus datos</h3>
      <p className="mt-2 text-ink-soft">Los campos marcados con * son obligatorios.</p>

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

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="q-name" label="Nombre y apellidos *" error={err("name")} className="sm:col-span-2">
          <Input id="q-name" name="name" autoComplete="name" defaultValue={val("name")} required aria-invalid={!!err("name")} aria-describedby={described("name")} />
        </Field>
        <Field id="q-company" label="Empresa *" error={err("company")}>
          <Input id="q-company" name="company" autoComplete="organization" defaultValue={val("company")} required aria-invalid={!!err("company")} aria-describedby={described("company")} />
        </Field>
        <Field id="q-email" label="Correo corporativo *" error={err("email")}>
          <Input id="q-email" name="email" type="email" inputMode="email" autoComplete="email" defaultValue={val("email")} required aria-invalid={!!err("email")} aria-describedby={described("email")} />
        </Field>
        <Field id="q-phone" label="Teléfono" hint="Opcional" error={err("phone")} className="sm:col-span-2">
          <Input id="q-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={val("phone")} aria-invalid={!!err("phone")} aria-describedby={described("phone")} />
        </Field>
        <Field id="q-message" label="¿Algo más que debamos saber?" hint="Opcional" error={err("message")} className="sm:col-span-2">
          <Textarea id="q-message" name="message" rows={3} defaultValue={val("message")} aria-invalid={!!err("message")} aria-describedby={described("message")} />
        </Field>
      </div>

      {/* Honeypot anti-spam: oculto para personas y lectores de pantalla */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="q-website">No completar este campo</label>
        <input id="q-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            name="consent"
            defaultChecked={val("consent") === "on"}
            aria-invalid={!!err("consent")}
            aria-describedby={err("consent") ? "q-consent-error" : undefined}
            className="mt-0.5 size-5 shrink-0 rounded accent-brand-blue"
          />
          <span>
            Autorizo a Misión Tecnológica a usar mis datos para responder esta solicitud, según la{" "}
            <Link href="/privacidad" className="font-semibold text-brand-blue hover:underline">
              política de privacidad
            </Link>
            . *
          </span>
        </label>
        {err("consent") ? (
          <p id="q-consent-error" className="mt-2 text-sm font-medium text-destructive">
            {err("consent")}
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={pending || empty} className="w-full sm:w-auto">
          {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Send aria-hidden />}
          {pending ? "Enviando…" : "Enviar cotización"}
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
