import { PageIntro } from "@/components/layout/page-intro";
import { LinkedInFeed } from "@/components/publications/linkedin-feed";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Publicaciones",
  description: "Publicaciones de Misión Tecnológica en LinkedIn sobre tecnología, impresión empresarial y operaciones.",
  path: "/publicaciones",
  draft: true,
});

export default function PublicacionesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Publicaciones"
        title="Ideas y novedades para tomar mejores decisiones."
        description="Lo que compartimos en LinkedIn. Próximamente también artículos propios gestionados desde el CMS."
      />
      <section className="section-y bg-white">
        <div className="container-mt">
          <LinkedInFeed maxPosts={3} />
        </div>
      </section>
    </>
  );
}
