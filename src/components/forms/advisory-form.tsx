"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, CalendarCheck, Check, Loader2, Plus } from "lucide-react";

import { ConsentField, LeadFields } from "@/components/forms/lead-fields";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { submitAdvisory } from "@/lib/actions/advisory";
import { cn } from "@/lib/utils";
import type { AdvisoryField, AdvisoryState } from "@/lib/validation/advisory";
import { advisoryNeedOptions, limaToday, meetingSlots } from "@/lib/validation/advisory-options";

const initialState: AdvisoryState = { status: "idle" };

/** Día siguiente (AAAA-MM-DD), para el mínimo del selector de fecha. */
function tomorrow() {
  const d = new Date(`${limaToday()}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** "Quiero que me asesoren": necesidad, escala y reunión exploratoria + datos B2B. */
export function AdvisoryForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(submitAdvisory, initialState);
  const statusRef = useRef<HTMLDivElement>(null);
  // La fecha mínima se calcula en el navegador (la página es estática).
  const [minDate, setMinDate] = useState<string>();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depende del reloj del visitante
    setMinDate(tomorrow());
  }, []);

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className={cn("rounded-3xl bg-white p-7 text-ink shadow-lift sm:p-10", className)}>
        <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-teal-50 text-brand-teal-700">
            <CalendarCheck aria-hidden className="size-7" />
          </span>
          <h2 className="mt-6 text-2xl font-bold">Solicitud validada</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{state.message}</p>
        </div>
      </div>
    );
  }

  const err = (f: AdvisoryField) => state.errors?.[f];
  const val = (f: Exclude<AdvisoryField, "needs">) => state.values?.[f] ?? "";
  const described = (f: AdvisoryField) => (err(f) ? `a-${f}-error` : undefined);
  const selectedNeeds = state.values?.needs ?? [];

  return (
    <form
      action={formAction}
      noValidate
      aria-describedby="advisory-form-status"
      className={cn("relative rounded-3xl bg-white p-6 text-ink shadow-lift sm:p-8 lg:p-10", className)}
    >
      <div
        id="advisory-form-status"
        ref={statusRef}
        tabIndex={-1}
        role="alert"
        className={cn("outline-none", state.status === "error" && "mb-6 flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800")}
      >
        {state.status === "error" ? (
          <>
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
            {state.message}
          </>
        ) : null}
      </div>

      {/* 1 · Necesidad */}
      <fieldset aria-describedby={described("needs")}>
        <legend className="flex items-center gap-3 text-xl font-bold">
          <StepNumber n={1} />
          ¿Cuál es tu necesidad? *
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {advisoryNeedOptions.map((o) => (
            <label
              key={o.value}
              className={cn(
                "group inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pr-4 pl-1.5 text-sm font-semibold text-ink-soft transition-[border-color,background-color,color] duration-200 hover:border-brand-bright/40 hover:text-ink",
                "has-[input:checked]:border-brand-bright has-[input:checked]:bg-brand-blue-50 has-[input:checked]:text-brand-blue-800",
                "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-bright",
              )}
            >
              <input type="checkbox" name="needs" value={o.value} defaultChecked={selectedNeeds.includes(o.value)} className="peer sr-only" />
              <span
                aria-hidden
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-ink-faint transition-colors peer-checked:bg-brand-blue peer-checked:text-white"
              >
                <Plus className="size-3.5 group-has-[input:checked]:hidden" strokeWidth={2.5} />
                <Check className="hidden size-3.5 group-has-[input:checked]:block" strokeWidth={3} />
              </span>
              {o.label}
            </label>
          ))}
        </div>
        {err("needs") ? (
          <p id="a-needs-error" className="mt-2 text-sm font-medium text-destructive">
            {err("needs")}
          </p>
        ) : null}
      </fieldset>

      {/* 2 · Escala */}
      <fieldset className="mt-10">
        <legend className="flex items-center gap-3 text-xl font-bold">
          <StepNumber n={2} />
          Sedes y usuarios
        </legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id="a-sites" label="Número de sedes *" error={err("sites")}>
            <Input id="a-sites" name="sites" type="number" inputMode="numeric" min={1} max={500} defaultValue={val("sites") || "1"} required aria-invalid={!!err("sites")} aria-describedby={described("sites")} />
          </Field>
          <Field id="a-users" label="Cantidad de usuarios *" hint="Aproximada" error={err("users")}>
            <Input id="a-users" name="users" type="number" inputMode="numeric" min={1} defaultValue={val("users")} required aria-invalid={!!err("users")} aria-describedby={described("users")} />
          </Field>
        </div>
      </fieldset>

      {/* 3 · Agenda */}
      <fieldset className="mt-10">
        <legend className="flex items-center gap-3 text-xl font-bold">
          <StepNumber n={3} />
          Primera reunión exploratoria
        </legend>
        <p className="mt-2 text-sm text-ink-soft">Propón una fecha y hora (lunes a viernes, hora de Lima). Un asesor la confirmará por correo.</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id="a-date" label="Fecha *" error={err("date")}>
            <Input id="a-date" name="date" type="date" min={minDate} defaultValue={val("date")} required aria-invalid={!!err("date")} aria-describedby={described("date")} />
          </Field>
          <Field id="a-time" label="Hora *" error={err("time")}>
            <Select id="a-time" name="time" defaultValue={val("time")} required aria-invalid={!!err("time")} aria-describedby={described("time")}>
              <option value="" disabled>
                Elige un horario
              </option>
              {meetingSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field id="a-message" label="¿Algo que debamos saber antes de la reunión?" hint="Opcional" error={err("message")} className="mt-5">
          <Textarea id="a-message" name="message" rows={3} defaultValue={val("message")} aria-invalid={!!err("message")} aria-describedby={described("message")} />
        </Field>
      </fieldset>

      {/* 4 · Datos B2B */}
      <fieldset className="mt-10">
        <legend className="flex items-center gap-3 text-xl font-bold">
          <StepNumber n={4} />
          Datos de tu empresa
        </legend>
        <div className="mt-4">
          <LeadFields prefix="a" errors={state.errors} values={state.values} />
        </div>
      </fieldset>

      <div className="mt-6">
        <ConsentField prefix="a" error={err("consent")} defaultChecked={state.values?.consent === "on"} />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="mt-8 w-full sm:w-auto">
        {pending ? <Loader2 aria-hidden className="animate-spin" /> : <CalendarCheck aria-hidden />}
        {pending ? "Enviando…" : "Solicitar reunión"}
      </Button>
    </form>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span aria-hidden className="inline-flex h-8 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white tabular-nums">
      {n}
    </span>
  );
}
