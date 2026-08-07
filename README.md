# brota-digital

Sitio web de **Brota Digital** — agencia mexicana de marketing digital, desarrollo
web y sistemas de automatización.

Next.js 16 (App Router, SSG) · TypeScript · Tailwind v4 · pnpm

## Desarrollo

```bash
pnpm install
pnpm dev      # http://localhost:3400
```

Copiar `.env.example` a `.env.local` y cargar los valores. El endpoint del
formulario es fail-closed: sin las variables responde 503.

## Documentación

- `BLUEPRINT.md` — arquitectura, sistema visual, SEO, seguridad y orden de construcción
- `CLAUDE.md` — reglas del proyecto
