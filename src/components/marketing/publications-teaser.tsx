import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { LinkedInFeed } from "@/components/publications/linkedin-feed";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

/** 07 · Conocimiento: publicaciones recientes de LinkedIn (máximo 3). */
export function PublicationsTeaser() {
  return (
    <section aria-labelledby="publicaciones-title" className="section-y bg-white">
      <div className="container-mt">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="publicaciones-title"
            eyebrow="Publicaciones"
            title="Ideas y novedades para tomar mejores decisiones."
            description="Lo último que compartimos en LinkedIn sobre tecnología, impresión empresarial y operaciones."
          />
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/publicaciones">
                Ver todas las publicaciones
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            {siteConfig.social.linkedin ? (
              <Button asChild variant="ghost">
                <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
                  Seguir en LinkedIn
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <LinkedInFeed className="mt-12" maxPosts={3} />
      </div>
    </section>
  );
}
