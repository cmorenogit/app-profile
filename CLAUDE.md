# app-profile

Portfolio personal estático inspirado en brittanychiang.com.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 + Framer Motion 12
- Deploy: Vercel + Analytics

## Arquitectura

```
src/
├── app/           # Routing (/, /archive)
│   ├── layout.tsx # SEO + metadata + JSON-LD
│   ├── page.tsx   # Home
│   └── archive/   # Tabla proyectos
├── components/    # UI (Client: Navigation, Sidebar, About, Experience, Projects, SpotlightCursor)
├── data/          # Contenido estático (experience.ts, projects.ts, archive.ts, social.ts)
├── types/         # Interfaces TypeScript
└── lib/           # Utilidades
```

## Patrones

- **Data-driven:** Arrays en `/data` → componentes renderizan con map()
- **Client components:** `"use client"` para interactividad (scroll, animaciones)
- **Server components:** Contenido estático (ArchiveTable, Footer, SocialLinks)
- **Sin estado global:** No Redux/Context, datos estáticos

## Tema

- Dark único: navy (#0a192f) + accent cyan (#64ffda)
- Fonts: Geist Sans/Mono
- Responsive: mobile-first (sm:640, lg:1024)

## Tipos principales

```typescript
Experience { title, company, date, description, tech }
Project { title, description, image, tech, links }
ArchiveProject { year, title, madeAt, builtWith, link }
SocialLink { name, url, icon }
```

## Comandos

```bash
npm run dev    # Desarrollo
npm run build  # Build producción
npm start      # Servidor producción
```

## Convenciones

- Componentes: PascalCase, un archivo por componente
- Data files: camelCase, exportan arrays tipados
- Estilos: Tailwind inline, variables CSS en globals.css
- Animaciones: Framer Motion con `whileInView`
