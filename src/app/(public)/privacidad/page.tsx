import { ComingSoon, PageIntro } from "@/components/layout/page-intro";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de privacidad",
  description: "Cómo tratamos los datos personales que nos compartes.",
  path: "/privacidad",
  draft: true,
});

export default function Page() {
  return (
    <>
      <PageIntro eyebrow="Legal" title="Política de privacidad" description="Cómo tratamos los datos personales que nos compartes." />
      <ComingSoon text="La política de privacidad está en revisión. Si tienes dudas sobre el uso de tus datos, escríbenos a contacto@misiontecnologica.com." />
    </>
  );
}
