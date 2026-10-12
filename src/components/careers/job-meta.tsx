import { Briefcase, CalendarDays, Clock, MapPin } from "lucide-react";

import type { Job } from "@/lib/content/jobs";
import { cn } from "@/lib/utils";

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

/** Datos clave de una convocatoria: área, ubicación, modalidad, jornada y fecha. */
export function JobMeta({ job, tone = "default", showDate = true }: { job: Job; tone?: "default" | "inverse"; showDate?: boolean }) {
  const items = [
    { icon: Briefcase, text: job.area },
    { icon: MapPin, text: `${job.location} · ${job.modality}` },
    { icon: Clock, text: job.type },
    ...(showDate ? [{ icon: CalendarDays, text: `Publicado el ${formatDate(job.publishedAt)}` }] : []),
  ];
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2 text-sm", tone === "inverse" ? "text-white/85" : "text-ink-soft")}>
      {items.map(({ icon: Ico, text }) => (
        <li key={text} className="inline-flex items-center gap-2">
          <Ico aria-hidden className={cn("size-4", tone === "inverse" ? "text-brand-teal" : "text-brand-blue")} />
          {text}
        </li>
      ))}
    </ul>
  );
}
