# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Decisores B2B en Perú (Lima y provincias): jefes de TI, de compras, de administración y de operaciones de empresas medianas y grandes, a menudo con varias sedes.
- También pymes con pocas sedes y pocos equipos, que necesitan una propuesta clara sin conocer la jerga del outsourcing.
- Trabajo que vienen a hacer: entender qué ofrece Misión Tecnológica, dimensionar una necesidad (equipos, volumen, sedes) y pedir una propuesta o asesoría.

## Product Purpose

Web corporativa de Misión Tecnológica: presenta el outsourcing tecnológico y la impresión empresarial, y convierte visitas en solicitudes de asesoría o cotización. El éxito es una solicitud bien dimensionada que un asesor pueda responder sin volver a preguntar lo básico.

## Positioning

Partner de HP en impresión láser empresarial, con certificaciones ISO 9001 e ISO/IEC 27001 y cobertura nacional; un solo proveedor responsable de los equipos y del servicio.

## Operating Context

- Contacto comercial por formulario (validado en servidor, aún sin almacenamiento) y por WhatsApp con mensaje prellenado.
- El catálogo es un portafolio sin precios (impresión y digitalización, cómputo, audio y video): sin pagos ni stock; los equipos elegidos viajan con la solicitud del cotizador.
- Encuentra tu solución: "Sé lo que necesito" (`/cotizador`: cómputo, impresión, digitalización y audio y video, sin montos) y "Quiero que me asesoren" (`/asesoria`: necesidad, escala y reunión exploratoria). Ambos exigen correo corporativo, empresa, RUC, nombre y apellido.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, componentes estilo shadcn/ui. Payload CMS en una fase posterior: el contenido vive en `src/lib/content/` con la forma de las futuras colecciones.
- Modalidades a cotizar (típicas del sector, confirmadas por el usuario como punto de partida y editables): cómputo en alquiler/outsourcing o compra; impresión en outsourcing por página, alquiler o compra; digitalización en sitio o en instalaciones de MT, con OCR e indexación.
- La digitalización todavía no tiene página de solución propia.

## Brand Commitments

- Brandbook 2023: azul #0052CC (el #0066FF oscurecido un paso) reservado para hero, botones, llamados a la acción y acentos; fondos en blanco, gris claro (#ECEFF3) y blanco humo (#F6F7F9) para no saturar; turquesa #00CDC5 de acento, tipografía Urbanist, formas de soporte siempre redondeadas (píldoras derivadas del isotipo).
- Tuteo, español de Perú, tono sobrio y claro.

## Evidence on Hand

- Logos en `public/brand/`. Clientes, gerentes, hito 2026 y fichas HP pendientes de validación (`verified: false`).
- La web no muestra precios ni estimaciones: la propuesta económica la prepara un asesor. No inventar clientes, cifras ni testimonios.

## Product Principles

1. Nunca presentar un dato comercial no validado como real: se rotula o se oculta.
2. Pedir lo mínimo para que un asesor pueda responder con una propuesta concreta.
3. Cada paso termina en una acción clara (asesoría, cotización, WhatsApp).
4. Funciona igual de bien en móvil que en escritorio.

## Accessibility & Inclusion

WCAG 2.2 AA: contraste AA (turquesa oscurecido para texto pequeño), foco visible, navegación por teclado, respeto de "reducir movimiento".
