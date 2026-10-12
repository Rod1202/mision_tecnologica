import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

/** Acceso flotante a WhatsApp. Canal complementario: no compite con el CTA principal de asesoría. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(siteConfig.contact.whatsapp, siteConfig.contact.whatsappDefaultMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp (se abre en una nueva pestaña)"
      className="fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:right-6 sm:bottom-6"
    >
      <svg aria-hidden viewBox="0 0 32 32" className="size-7 fill-current">
        <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.76c-2.03 0-4.02-.55-5.75-1.58l-.41-.25-3.96 1.04 1.06-3.86-.27-.4a10.73 10.73 0 0 1-1.65-5.71c0-5.94 4.84-10.77 10.8-10.77 5.94 0 10.77 4.83 10.77 10.77 0 5.94-4.84 10.76-10.6 10.76Zm5.9-8.06c-.32-.16-1.91-.94-2.2-1.05-.3-.1-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.37.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.72-.55h-.62c-.21 0-.56.08-.86.4-.29.32-1.12 1.1-1.12 2.68 0 1.58 1.15 3.1 1.31 3.32.16.21 2.26 3.45 5.48 4.84.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.91-.78 2.18-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}
