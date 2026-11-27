import Link from "next/link";

import { Field, Input } from "@/components/ui/form-controls";
import type { LeadField } from "@/lib/validation/lead";

/**
 * Datos B2B obligatorios (correo corporativo, empresa, RUC, nombre y apellido; teléfono opcional),
 * compartidos por el cotizador y la solicitud de asesoría. Incluye el honeypot y el consentimiento.
 */
export function LeadFields({
  prefix,
  errors,
  values,
}: {
  /** Prefijo de los id (evita choques si hay dos formularios en la página). */
  prefix: string;
  errors?: Partial<Record<LeadField, string>>;
  values?: Partial<Record<LeadField, string>>;
}) {
  const id = (f: LeadField) => `${prefix}-${f}`;
  const err = (f: LeadField) => errors?.[f];
  const val = (f: LeadField) => values?.[f] ?? "";
  const described = (f: LeadField) => (err(f) ? `${id(f)}-error` : undefined);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("firstName")} label="Nombre *" error={err("firstName")}>
          <Input
            id={id("firstName")}
            name="firstName"
            autoComplete="given-name"
            defaultValue={val("firstName")}
            required
            aria-invalid={!!err("firstName")}
            aria-describedby={described("firstName")}
          />
        </Field>
        <Field id={id("lastName")} label="Apellido *" error={err("lastName")}>
          <Input
            id={id("lastName")}
            name="lastName"
            autoComplete="family-name"
            defaultValue={val("lastName")}
            required
            aria-invalid={!!err("lastName")}
            aria-describedby={described("lastName")}
          />
        </Field>
        <Field id={id("company")} label="Empresa *" error={err("company")}>
          <Input
            id={id("company")}
            name="company"
            autoComplete="organization"
            defaultValue={val("company")}
            required
            aria-invalid={!!err("company")}
            aria-describedby={described("company")}
          />
        </Field>
        <Field id={id("ruc")} label="RUC *" hint="11 dígitos" error={err("ruc")}>
          <Input
            id={id("ruc")}
            name="ruc"
            inputMode="numeric"
            autoComplete="off"
            maxLength={13}
            pattern="[0-9 -]*"
            defaultValue={val("ruc")}
            required
            aria-invalid={!!err("ruc")}
            aria-describedby={described("ruc")}
          />
        </Field>
        <Field id={id("email")} label="Correo corporativo *" error={err("email")}>
          <Input
            id={id("email")}
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
        <Field id={id("phone")} label="Teléfono" hint="Opcional" error={err("phone")}>
          <Input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={val("phone")}
            aria-invalid={!!err("phone")}
            aria-describedby={described("phone")}
          />
        </Field>
      </div>

      {/* Honeypot anti-spam: oculto para personas y lectores de pantalla */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${prefix}-website`}>No completar este campo</label>
        <input id={`${prefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
    </>
  );
}

export function ConsentField({
  prefix,
  error,
  defaultChecked,
}: {
  prefix: string;
  error?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
        <input
          type="checkbox"
          name="consent"
          defaultChecked={defaultChecked}
          aria-invalid={!!error}
          aria-describedby={error ? `${prefix}-consent-error` : undefined}
          className="mt-0.5 size-5 shrink-0 rounded accent-brand-bright"
        />
        <span>
          Autorizo a Misión Tecnológica a usar mis datos para responder esta solicitud, según la{" "}
          <Link href="/privacidad" className="font-semibold text-brand-bright hover:underline">
            política de privacidad
          </Link>
          . *
        </span>
      </label>
      {error ? (
        <p id={`${prefix}-consent-error`} className="mt-2 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
