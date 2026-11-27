# Misión Tecnológica — Web corporativa

Web corporativa de Misión Tecnológica: landing page + catálogo (sin pasarela de pago).
Documentos base: `01_proyecto_web_mision_tecnologica.md`, `Buenas_practicas_para_web.docx` y `Arquitectura_UX_UI_Nueva_Web_-_Misión_Tecnológica.pdf` (estos dos reemplazan al storyline `03_...`).

## Estado actual (ronda 3: arquitectura UX/UI)

- Base: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + componentes estilo shadcn/ui. Marca según el Brandbook 2023: azul **#0052CC**, el #0066FF de marca oscurecido un paso (token `--color-brand-blue`, se cambia en un solo lugar en `globals.css`), turquesa **#00CDC5**, tipografía **Urbanist**. Para que la web no se vea saturada, el azul se reserva para el hero, los botones, las tarjetas de llamado a la acción y los acentos; los fondos alternan **blanco**, **gris claro** (`--color-surface` #ECEFF3) y **blanco humo** (`--color-smoke` #F6F7F9), incluido el pie de página.
- **Menú**: Inicio · Soluciones · Nosotros · Catálogo · Portal ISO + un solo botón, "Cotizar proyecto", que baja a "Encuentra tu solución". No hay página de contacto aparte: desde esa sección se elige cotizar (`/cotizador`) o pedir asesoría (`/asesoria`).
- **Inicio** (landing de conversión), con fondos alternados azul · blanco · gris:
  1. Hero con video de fondo (cuando exista, en `heroVideo` de `home.ts`; capa oscura al 65 %), los 3 pilares "Te ofrecemos" y un solo botón, "Conoce más", que baja a Soluciones para iniciar el recorrido.
  2. Marcas aliadas · 3. Soluciones · 4. **Encuentra tu solución** (dos perfiles que llevan a /cotizador y /asesoria) · 5. Capas de servicio + Sustentabilidad · 6. Sectores ("Contamos con experiencia en diferentes rubros") en pestañas con clientes · 7. LinkedIn · 8. Cierre (3 pasos + contacto; el botón lleva a Encuentra tu solución).
- **Encuentra tu solución** (`/#encuentra-tu-solucion`): sección del inicio con las dos tarjetas, que llevan a páginas propias: **`/cotizador`** ("Sé lo que necesito") y **`/asesoria`** ("Quiero que me asesoren"). El botón "Cotizar proyecto" del encabezado y el cierre del inicio llevan a esta sección; los botones con un servicio definido van directo a `/cotizador?servicio=…`. `/contacto` redirige a la sección.
  - "Sé lo que necesito": un recorrido en 3 pasos (servicios → dimensionamiento → datos) con el resumen al costado. Cómputo (equipos, perfil y modalidad), impresión (parque actual o estimado, volumen B/N y color, cantidad por formato A4/Oficio/A3, costo por página, por clic o venta + servicio), digitalización (plazo del servicio, volumen en páginas, files, tomos o cajas, tipo, lugar y después del escaneo) y audio y video (salas o headsets; sin contrato). El plazo del contrato aplica solo a cómputo e impresión. Sin "servicios adicionales" (lo define el área comercial). **Sin precios**. Incluye los equipos agregados desde el catálogo.
  - "Quiero que me asesoren": necesidad, sedes y usuarios, y fecha y hora para una reunión exploratoria (lunes a viernes).
  - Ambos exigen **correo corporativo** (se rechazan Gmail, Hotmail, Outlook y similares), **empresa**, **RUC** (11 dígitos con dígito verificador), **nombre y apellido**; teléfono opcional. Validación en servidor (Server Actions + Zod), honeypot y límite de frecuencia. **Todavía no almacenan ni envían** las solicitudes, y así se lo indican al usuario.
- **Datos de la web actual** (misiontecnologica.com): 4 líneas de negocio, canal monomarca y Centro de Servicio Autorizado HP, HP Amplify Impact 5 estrellas, misión, visión y valores, +10 años y +100 clientes, ISO 37001, teléfono, dirección, horario y redes sociales. Nivel HP según LinkedIn: **HP Power Services Partner**. Equipo directivo confirmado: José Guerra (Presidente Ejecutivo), Percy Guillen (Gerente General) y Humberto Northcode (Gerente de Operaciones).
- **Soluciones**: vista maestro-detalle. El menú "Elige una solución" muestra el detalle a la derecha (qué es, alcance del servicio, proceso y preguntas frecuentes) y al final los botones para cotizar o pedir asesoría. `/soluciones` abre la primera solución. Cada solución conserva su URL `/soluciones/[slug]` para el SEO.
- **Nosotros**: presencia en Latinoamérica con mapa (sede en Lima, filial en Bolivia, alianzas en México, Costa Rica, Colombia, Ecuador y Chile), misión, visión y valores, HP Power Services Partner, normas ISO, sustentabilidad, equipo directivo y bolsa de trabajo.
- **Catálogo** (`/catalogo`): portafolio **sin precios**. Impresión y digitalización con modelos HP y productos genéricos de demostración (ticketeras, plotters, lectores y escáneres; solo se ven en desarrollo/pruebas hasta tener los modelos). Cómputo (HP, ASUS, Lenovo) y Audio y video (Poly, HP) se presentan solo con sus marcas. El carrito de cotización continúa en el paso 3 de `/cotizador`.
- **Comparador y asesor de upgrade** (`/catalogo/comparar`): igual que antes, sin la fila de precio.
- **Portal ISO** (`/portal-iso`): misma estructura que la web actual (ISO/IEC 27001 e ISO 37001, documentos y Canal de Integridad).
- **Trabaja con nosotros**: convocatorias y postulación con CV en PDF (todavía no almacena).
- Redirecciones 301 en `next.config.ts`: `/tienda/*` → `/catalogo/*`, y las URL de la web actual (`/inicio-2`, `/contactanos`, `/hp-brand-showcase`, `/portal-iso-27001`, `/portal-iso-37001`).
- SEO técnico: metadatos por página, canonical, Open Graph, migas de pan, `sitemap.xml`, `robots.txt` y JSON-LD.

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

Los clientes (`sectors.ts`), los gerentes (`company.ts`) y los datos técnicos de impresoras nuevas (`products.ts`) llevan `verified: false`. Las convocatorias de ejemplo (`jobs.ts`) llevan `example: true`. Todos estos archivos están en `src/lib/content/`.

| Entorno | ¿Se muestra lo no validado? |
| --- | --- |
| `pnpm dev` | Sí, siempre, con la etiqueta "Por validar" |
| Build (Netlify, VPS) | Solo si `SHOW_UNVERIFIED_CONTENT=true` |
| Producción | Debe quedar en `false`, y entonces se oculta |

Para publicar una referencia, cambia `verified` a `true` cuando exista la autorización. En la fase de CMS esto pasará a Payload.

En producción, por lo tanto: no se listan clientes, no aparece la sección de liderazgo y la bolsa de empleo muestra "Sin convocatorias activas" con el formulario de postulación espontánea.

## Datos a completar

En `src/lib/site.ts`:

- `contact.whatsapp`: el número actual es **genérico** (`51999999999`): la web actual no publica WhatsApp. Si el teléfono 919 280 810 también es WhatsApp, usar `51919280810` y poner `whatsappIsPlaceholder` en `false`.
- `social`: LinkedIn, Facebook e Instagram, tomados de la web actual.

En `src/lib/content/`:

- `company.ts`: nombres, fotografías y biografías aprobadas de los gerentes, y el alcance exacto de cada certificado ISO.
- `jobs.ts`: reemplazar las 3 convocatorias de ejemplo por las reales, con `example: false`.
- `sectors.ts`: logos de clientes. Guarda el archivo en `public/clients/` (SVG o PNG con fondo transparente) y agrega `logo: "/clients/nombre.svg"` al cliente. Sin logo, se muestra un espacio reservado con el nombre.
- `partners.ts`: marcas aliadas de la franja del Inicio. HP está confirmado. Hay 4 espacios reservados (`placeholder: true`) que solo se ven en desarrollo y pruebas: reemplázalos por las marcas reales con su logo en `public/partners/`.
- `products.ts`: fichas del catálogo (sin precios). Para sumar laptops, audio y video u otras categorías, agrega productos con su `kind`, `category` y `brand`; la línea del catálogo sale de `lineOfKind` en `catalog.ts`.
- `home.ts`: video del hero (`heroVideo`: MP4 sin audio de menos de 5 MB + imagen `poster`, en `public/media/`) y sustentabilidad (nombre del reconocimiento, años, insignias en `public/sustentabilidad/` y foto de selva en `background`).
- `company.ts`: certificaciones. La web actual menciona ISO 37001 e ISO/IEC 27001 ("2 certificaciones ISO"); el equipo indicó ISO 9001 e ISO/IEC 27001. Hoy se muestran las tres: quitar la que no corresponda.
- `iso.ts`: **antes de cambiar el dominio**, descargar los PDF del Portal ISO (y la guía de Derechos ARCO enlazada en `site.ts`) a `public/documentos/` y cambiar los enlaces; hoy apuntan a la web actual. Confirmar el correo del canal de seguridad de la información (la web actual muestra `segurinfo@` pero enlaza a `canaldeintegridad@`).
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
│   │   ├── catalogo/ (+ [slug], comparar)   trabaja-con-nosotros/ (+ [slug])
│   │   ├── cotizador/   asesoria/   portal-iso/
│   │   ├── publicaciones/   privacidad/
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
