# Misión Tecnológica — Web corporativa

Web corporativa de Misión Tecnológica: landing page + catálogo (sin pasarela de pago).
Documentos base: `01_proyecto_web_mision_tecnologica.md` y `03_storyline_inicio_mision_tecnologica.md`.

## Estado actual (ronda 2)

- Base del proyecto: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + componentes estilo shadcn/ui.
- Sistema de diseño según el Brandbook 2023, con el azul **#0066FF** como color principal, turquesa **#00CDC5** como acento y la tipografía **Urbanist** (Google Fonts, autoalojada con `@fontsource-variable/urbanist`).
- **Página de Inicio completa** con las 8 secciones del storyline.
- Cabecera fija, menú móvil accesible, pie de página y botón flotante de WhatsApp.
- Formulario de asesoría con validación en servidor (Server Action + Zod), protección anti-spam (honeypot) y límite de frecuencia. **Todavía no almacena ni envía** las solicitudes, y así se lo indica al usuario.
- Publicaciones de LinkedIn mediante el widget de SociableKit, con un máximo de 3 publicaciones y altura limitada.
- **Cabecera**: Soluciones · Sectores · Nosotros · Tienda + "Solicitar asesoría". El ícono de cotización solo aparece cuando hay equipos agregados.
- **Soluciones**: índice en `/soluciones` y una página propia por solución en `/soluciones/[slug]`, con contenido, preguntas frecuentes y datos estructurados `Service`, `FAQPage` y `BreadcrumbList`.
- **Sectores**: pestañas por sector con "cómo ayudamos" y los clientes. La pestaña activa queda en la URL (por ejemplo `/sectores#logistica`).
- **Nosotros**: partner de HP, certificaciones ISO 9001 e ISO/IEC 27001, estándares de calidad, cobertura nacional y liderazgo.
- **Tienda**: 3 multifuncionales HP de prueba con ficha propia (`/tienda/[slug]`), filtros por categoría, marca y precio, y orden por relevancia, precio y nombre. Los filtros se reflejan en la URL, por ejemplo `/tienda?marca=HP&max=6000&orden=precio-asc`. El carrito de cotización no tiene pagos: arma el mensaje de WhatsApp con los equipos y cantidades.
- **Trabaja con nosotros** (en el pie de página): convocatorias, detalle de cada una y postulación con CV en PDF de hasta 5 MB, validado en servidor. **Todavía no almacena** las postulaciones.
- Redirecciones 301 de las URL antiguas: `/impresion-empresarial` → `/soluciones/impresion-empresarial` y `/liderazgo` → `/nosotros` (en `next.config.ts`).
- SEO técnico: metadatos por página, canonical, Open Graph, migas de pan, `sitemap.xml` con todas las páginas finales, `robots.txt` y JSON-LD.

## Requisitos

- Node.js **20.9 o superior** (recomendado 22, ver `.nvmrc`)
- pnpm 10 (`corepack enable` o `npm i -g pnpm`)

## Puesta en marcha (desde la terminal del editor)

```bash
pnpm install
copy .env.example .env.local      # en PowerShell/CMD (en bash: cp .env.example .env.local)
pnpm dev                          # http://localhost:3000
```

Otros comandos:

```bash
pnpm build && pnpm start   # build de producción local
pnpm lint                  # ESLint
pnpm typecheck             # TypeScript
```

## Contenido pendiente de validación

Los clientes (`sectors.ts`), el hito 2026 (`home.ts`), los gerentes (`company.ts`) y los datos técnicos de las impresoras (`products.ts`) llevan `verified: false`. Las convocatorias de ejemplo (`jobs.ts`) llevan `example: true`. Todos estos archivos están en `src/lib/content/`.

| Entorno | ¿Se muestra lo no validado? |
| --- | --- |
| `pnpm dev` | Sí, siempre, con la etiqueta "Por validar" |
| Build (Netlify, VPS) | Solo si `SHOW_UNVERIFIED_CONTENT=true` |
| Producción | Debe quedar en `false`, y entonces se oculta |

Para publicar una referencia, cambia `verified` a `true` cuando exista la autorización. En la fase de CMS esto pasará a Payload.

En producción, por lo tanto: no se listan clientes, no aparece la sección de liderazgo, se oculta el hito 2026 y la bolsa de empleo muestra "Sin convocatorias activas" con el formulario de postulación espontánea. La tienda sí se muestra siempre, porque es un catálogo de demostración declarado como tal.

## Datos a completar

En `src/lib/site.ts`:

- `contact.whatsapp`: el número actual es **genérico** (`51999999999`). Hay que reemplazarlo por el oficial y poner `whatsappIsPlaceholder` en `false`.
- `social.linkedin`: la URL de la página de empresa. Mientras esté vacía, no se muestran enlaces a LinkedIn.

En `src/lib/content/`:

- `company.ts`: nombres, fotografías y biografías aprobadas de los gerentes, y el alcance exacto de cada certificado ISO.
- `jobs.ts`: reemplazar las 3 convocatorias de ejemplo por las reales, con `example: false`.
- `sectors.ts`: logos de clientes. Guarda el archivo en `public/clients/` (SVG o PNG con fondo transparente) y agrega `logo: "/clients/nombre.svg"` al cliente. Sin logo, se muestra un espacio reservado con el nombre.
- `partners.ts`: marcas aliadas de la franja del Inicio. HP está confirmado. Hay 4 espacios reservados (`placeholder: true`) que solo se ven en desarrollo y pruebas: reemplázalos por las marcas reales con su logo en `public/partners/`.
- `products.ts`: ficha técnica oficial de HP de cada modelo (`specs`). Los precios (`price`) son **de demostración** y se muestran rotulados así. Reemplázalos por precios referenciales reales con `priceIsDemo: false`, o elimínalos para mostrar "A cotizar".
- `solutions.ts`: confirmar con el área comercial el alcance de cada servicio.

En el panel de **SociableKit**, configura también el número de publicaciones en 3. El componente ya recorta a 3, pero así el límite no depende solo del navegador.

## Estructura

```text
src/
├── app/
│   ├── (public)/            # sitio público (root layout propio; Payload irá en (payload)/)
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Inicio
│   │   ├── globals.css      # tokens de marca (Tailwind v4 @theme)
│   │   ├── soluciones/ (+ [slug])   sectores/   nosotros/
│   │   ├── tienda/ (+ [slug])       trabaja-con-nosotros/ (+ [slug])
│   │   ├── publicaciones/   contacto/   privacidad/
│   │   └── icon.png, apple-icon.png, opengraph-image.jpg
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/            # button, sheet, form-controls, badge (estilo shadcn/ui)
│   ├── brand/         # logo, píldoras/trazos del isotipo, iconos
│   ├── layout/        # cabecera, menú móvil, pie, WhatsApp, cabecera de páginas
│   ├── marketing/     # secciones del Inicio y bloques reutilizables
│   ├── sectors/       # pestañas de sectores
│   ├── catalog/       # tarjetas, visual de producto, carrito de cotización
│   ├── careers/       # datos de convocatorias
│   ├── seo/           # JSON-LD
│   ├── publications/  # widget de LinkedIn
│   └── forms/         # formularios de asesoría y postulación
└── lib/
    ├── site.ts        # configuración (futuro SiteSettings de Payload)
    ├── content/       # solutions, sectors, company, products, jobs, home (forma de las colecciones de Payload)
    ├── actions/       # Server Actions
    ├── validation/    # esquemas Zod
    └── seo.ts
public/
└── brand/             # logos PNG (temporales hasta tener SVG)
```

## Recursos de marca

- `logo-mt-color.png` y `isotipo-color.png`: originales entregados.
- `logo-mt-white.png`: versión blanca **rellena**, generada desde la silueta del logo a color sin alterar su forma. La versión blanca entregada era solo contorno.
- El sitio no usa fotografías: el hero lleva las franjas translúcidas inclinadas del isotipo (`IsoStrokes` en `src/components/brand/pills.tsx`), igual que la tarjeta de Outsourcing. La imagen Open Graph usa el mismo recurso.
- Cuando estén los SVG, basta con reemplazar las rutas en `src/components/brand/logo.tsx`.

## Próximas fases

1. **Payload CMS + Supabase**: integrar Payload 3 (compatible con Next ≥ 16.3.3) con `@payloadcms/db-postgres` sobre el proyecto Supabase `bbnkqkjznrpcaddesvtq`, crear las colecciones (Pages, Solutions, Sectors, Clients, Executives, Products, Jobs, Applications, Publications, Media, Leads, SiteSettings) y los roles, y migrar el contenido de `src/lib/content`.
2. Guardar los leads y las postulaciones en Payload, con los CV en almacenamiento privado, y enviar notificación por correo.
3. Fotografías de producto autorizadas y fichas técnicas oficiales.
4. Páginas restantes con contenido final (publicaciones, privacidad).
5. Despliegue de prueba en Netlify y, después, migración al VPS (Docker).
