import { ContactCta } from "@/components/marketing/contact-cta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto",
  description:
    "Solicita una asesoría a Misión Tecnológica: outsourcing tecnológico, impresión empresarial, implementación o soporte.",
  path: "/contacto",
});

/** Página de contacto: una sola sección con fondo continuo (cabecera + formulario). */
export default function ContactoPage() {
  return <ContactCta variant="page" />;
}
