"use client";

import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { ConsentField } from "@/components/forms/lead-fields";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { submitContact } from "@/lib/actions/contact";
import { cn } from "@/lib/utils";
import { contactTopicOptions, type ContactField, type ContactState } from "@/lib/validation/contact";

const initialState: ContactState = { status: "idle" };

/** Formulario de contacto simple: 5 datos y el mensaje. */
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
          <h2 className="mt-6 text-2xl font-bold">Mensaje validado</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{state.message}</p>
        </div>
      </div>
    );
  }

  const err = (f: ContactField) => state.errors?.[f];
  const val = (f: ContactField) => state.values?.[f] ?? "";
  const described = (f: ContactField) => (err(f) ? `c-${f}-error` : undefined);

  return (
    <form
      action={formAction}
      noValidate
      aria-describedby="contact-form-status"
      className={cn("relative rounded-3xl bg-white p-6 text-ink shadow-lift sm:p-8 lg:p-10", className)}
    >
      <h2 className="text-2xl font-bold">Escríbenos</h2>
      <p className="mt-2 text-ink-soft">Te respondemos por correo. Los campos con * son obligatorios.</p>

      <div
        id="contact-form-status"
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

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="c-firstName" label="Nombre *" error={err("firstName")}>
          <Input id="c-firstName" name="firstName" autoComplete="given-name" defaultValue={val("firstName")} required aria-invalid={!!err("firstName")} aria-describedby={described("firstName")} />
        </Field>
        <Field id="c-lastName" label="Apellido *" error={err("lastName")}>
          <Input id="c-lastName" name="lastName" autoComplete="family-name" defaultValue={val("lastName")} required aria-invalid={!!err("lastName")} aria-describedby={described("lastName")} />
        </Field>
        <Field id="c-company" label="Empresa *" error={err("company")}>
          <Input id="c-company" name="company" autoComplete="organization" defaultValue={val("company")} required aria-invalid={!!err("company")} aria-describedby={described("company")} />
        </Field>
        <Field id="c-email" label="Correo corporativo *" error={err("email")}>
          <Input
            id="c-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nombre@tuempresa.com"
            defaultValue={val("email")}
            required
            aria-invalid={!!err("email")}
            aria-describedby={described("email")}
          />
        </Field>
        <Field id="c-phone" label="Teléfono" hint="Opcional" error={err("phone")}>
          <Input id="c-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={val("phone")} aria-invalid={!!err("phone")} aria-describedby={described("phone")} />
        </Field>
        <Field id="c-topic" label="Tema" hint="Opcional" error={err("topic")}>
          <Select id="c-topic" name="topic" defaultValue={val("topic")} aria-invalid={!!err("topic")} aria-describedby={described("topic")}>
            <option value="">Elige un tema</option>
            {contactTopicOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field id="c-message" label="Mensaje *" error={err("message")} className="mt-5">
        <Textarea
          id="c-message"
          name="message"
          rows={4}
          placeholder="Cuéntanos brevemente qué necesitas."
          defaultValue={val("message")}
          required
          aria-invalid={!!err("message")}
          aria-describedby={described("message")}
        />
      </Field>

      {/* Honeypot anti-spam: oculto para personas y lectores de pantalla */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c-website">No completar este campo</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <ConsentField prefix="c" error={err("consent")} defaultChecked={val("consent") === "on"} />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="mt-8 w-full sm:w-auto">
        {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Send aria-hidden />}
        {pending ? "Enviando…" : "Enviar mensaje"}
      </Button>
    </form>
  );
}
