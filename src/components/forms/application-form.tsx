"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, FileUp, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form-controls";
import { submitApplication } from "@/lib/actions/apply";
import { cn } from "@/lib/utils";
import { CV_ACCEPT, type ApplicationField, type ApplicationState } from "@/lib/validation/application";

const initialState: ApplicationState = { status: "idle" };

/** Formulario de postulación. `job` = slug de la convocatoria o "general" (postulación espontánea). */
export function ApplicationForm({ job, jobTitle, className }: { job: string; jobTitle?: string; className?: string }) {
  const [state, formAction, pending] = useActionState(submitApplication, initialState);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className={cn("rounded-[2rem] border border-line bg-white p-7 shadow-soft sm:p-10", className)}>
        <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-teal-50 text-brand-teal-700">
            <CheckCircle2 aria-hidden className="size-7" />
          </span>
          <h3 className="mt-6 text-2xl font-bold text-ink">Postulación validada</h3>
          <p className="mt-3 leading-relaxed text-ink-soft">{state.message}</p>
        </div>
      </div>
    );
  }

  const err = (f: ApplicationField) => state.errors?.[f];
  const val = (f: ApplicationField) => state.values?.[f] ?? "";
  const describe = (f: ApplicationField) => (err(f) ? `${f}-error` : undefined);

  return (
    <form
      action={formAction}
      noValidate
      className={cn("relative rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8 lg:p-10", className)}
    >
      <h3 className="text-2xl font-bold text-ink">{jobTitle ? `Postular a: ${jobTitle}` : "Envíanos tu CV"}</h3>
      <p className="mt-2 text-ink-soft">Los campos marcados con * son obligatorios.</p>

      <div
        ref={statusRef}
        tabIndex={-1}
        role="alert"
        className={cn("outline-none", state.status === "error" && "mt-5 flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800")}
      >
        {state.status === "error" ? (
          <>
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
            {err("job") ?? state.message}
          </>
        ) : null}
      </div>

      <input type="hidden" name="job" value={job} />

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0">
        <Field id="name" label="Nombre y apellidos *" error={err("name")} className="sm:col-span-2">
          <Input id="name" name="name" autoComplete="name" defaultValue={val("name")} required aria-invalid={!!err("name")} aria-describedby={describe("name")} />
        </Field>
        <Field id="email" label="Correo electrónico *" error={err("email")}>
          <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" defaultValue={val("email")} required aria-invalid={!!err("email")} aria-describedby={describe("email")} />
        </Field>
        <Field id="phone" label="Teléfono *" error={err("phone")}>
          <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={val("phone")} required aria-invalid={!!err("phone")} aria-describedby={describe("phone")} />
        </Field>
        <Field id="linkedin" label="Perfil de LinkedIn" hint="Opcional" error={err("linkedin")} className="sm:col-span-2">
          <Input id="linkedin" name="linkedin" type="url" inputMode="url" placeholder="https://www.linkedin.com/in/tu-perfil" defaultValue={val("linkedin")} aria-invalid={!!err("linkedin")} aria-describedby={describe("linkedin")} />
        </Field>
        <Field id="cv" label="CV en PDF (máx. 5 MB) *" error={err("cv")} className="sm:col-span-2">
          <label
            htmlFor="cv"
            className={cn(
              "flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed bg-surface p-4 transition-colors hover:border-brand-blue focus-within:border-brand-blue",
              err("cv") ? "border-destructive" : "border-input",
            )}
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-blue ring-1 ring-line">
              <FileUp aria-hidden className="size-5" />
            </span>
            <input
              id="cv"
              name="cv"
              type="file"
              accept={CV_ACCEPT}
              required
              aria-invalid={!!err("cv")}
              aria-describedby={describe("cv")}
              className="w-full min-w-0 flex-1 text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-brand-blue file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-brand-blue-700"
            />
          </label>
        </Field>
        <Field id="message" label="Cuéntanos sobre ti" hint="Opcional" error={err("message")} className="sm:col-span-2">
          <Textarea id="message" name="message" rows={4} defaultValue={val("message")} aria-invalid={!!err("message")} aria-describedby={describe("message")} />
        </Field>
      </div>

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
            aria-describedby={describe("consent")}
            className="mt-0.5 size-5 shrink-0 rounded accent-brand-blue"
          />
          <span>
            Autorizo a Misión Tecnológica a tratar mis datos y mi CV para procesos de selección, según la{" "}
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
        {pending ? "Enviando…" : "Enviar postulación"}
      </Button>
    </form>
  );
}
