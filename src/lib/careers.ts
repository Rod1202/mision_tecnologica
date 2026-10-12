import { jobs } from "@/lib/content/jobs";
import { showUnverifiedContent } from "@/lib/site";

/** Convocatorias visibles: activas y, si son de ejemplo, solo en desarrollo/pruebas. */
export function visibleJobs() {
  const preview = showUnverifiedContent();
  return jobs
    .filter((j) => j.active && (!j.example || preview))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
