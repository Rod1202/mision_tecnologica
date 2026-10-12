"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2, AlertCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { submitContact } from "@/lib/actions/contact";
import { cn } from "@/lib/utils";
import { needOptions, type ContactField, type ContactState } from "@/lib/validation/contact";

const initialState: ContactState = { status: "idle" };

export function ContactForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const statusRef = useRef<HTMLDivElement>(null);

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

  const err = (f: ContactField) => state.errors?.[f];
  const val = (f: ContactField) => state.values?.[f] ?? "";

  return (
    <form
      action={formAction}
      noValidate
      aria-describedby="form-status"
      className={cn("relative rounded-3xl bg-white p-6 text-ink shadow-lift sm:p-8 lg:p-10", className)}
    >
      <h3 className="text-2xl font-bold">Solicitar asesoría</h3>
      <p className="mt-2 text-ink-soft">Los campos marcados con * son obligatorios.</p>

      <div
        id="form-status"
        ref={statusRef}
        tabIndex={-1}
        role="alert"
        className={cn(
          "outline-none",
          state.status === "error" && "mt-5 flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800",
        )}
      >
        {state.status === "error" ? (
          <>
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
            {state.message}
          </>
        ) : null}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Nombre y apellidos *" error={err("name")} className="sm:col-span-2">
          <Input id="name" name="name" autoComplete="name" defaultValue={val("name")} required aria-invalid={!!err("name")} aria-describedby={err("name") ? "name-error" : undefined} />
        </Field>
        <Field id="company" label="Empresa *" error={err("company")}>
          <Input id="company" name="company" autoComplete="organization" defaultValue={val("company")} required aria-invalid={!!err("company")} aria-describedby={err("company") ? "company-error" : undefined} />
        </Field>
        <Field id="email" label="Correo corporativo *" error={err("email")}>
          <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" defaultValue={val("email")} required aria-invalid={!!err("email")} aria-describedby={err("email") ? "email-error" : undefined} />
        </Field>
        <Field id="phone" label="Teléfono" hint="Opcional" error={err("phone")}>
          <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={val("phone")} aria-invalid={!!err("phone")} aria-describedby={err("phone") ? "phone-error" : undefined} />
        </Field>
        <Field id="need" label="Tipo de necesidad *" error={err("need")}>
          <Select id="need" name="need" defaultValue={val("need")} required aria-invalid={!!err("need")} aria-describedby={err("need") ? "need-error" : undefined}>
            <option value="" disabled>
              Selecciona una opción
            </option>
            {needOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="message" label="¿Qué necesita tu empresa? *" error={err("message")} className="sm:col-span-2">
          <Textarea id="message" name="message" rows={4} defaultValue={val("message")} required aria-invalid={!!err("message")} aria-describedby={err("message") ? "message-error" : undefined} />
        </Field>
      </div>

      {/* Honeypot anti-spam: oculto para personas y lectores de pantalla */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">No completar este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            name="consent"
            defaultChecked={val("consent") === "on"}
            aria-invalid={!!err("consent")}
            aria-describedby={err("consent") ? "consent-error" : undefined}
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
          <p id="consent-error" className="mt-2 text-sm font-medium text-destructive">
            {err("consent")}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" disabled={pending} className="mt-8 w-full sm:w-auto">
        {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Send aria-hidden />}
        {pending ? "Enviando…" : "Enviar solicitud"}
      </Button>
    </form>
  );
}
