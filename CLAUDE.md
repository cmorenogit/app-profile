# app-profile

Portfolio personal con playground de ML demos. Deploy en Vercel.

## Stack

- Astro 6 + React 19 + TypeScript 5.9
- Tailwind CSS 4 (@tailwindcss/vite) + Lucide React (icons)
- @huggingface/transformers (WebGPU inference client-side)
- Groq SDK (chat API)
- Deploy: Vercel + Analytics + Sitemap
- Testing: Vitest + Playwright

## Arquitectura

```
src/
├── pages/              # Routing (/, /archive, /playground, /uses, /api/chat)
│   ├── index.astro     # Home
│   ├── archive.astro   # Tabla proyectos pasados
│   ├── playground.astro# ML demos interactivos
│   ├── uses.astro      # Tech stack
│   ├── 404.astro
│   └── api/chat.ts     # Groq endpoint (rate limit, injection detection)
├── layouts/
│   └── Layout.astro    # SEO + metadata + JSON-LD + ChatWidget
├── components/
│   ├── *.astro         # Server: About, Experience, Projects, Stats, Footer, Sidebar
│   ├── *.tsx           # Client: Navigation, SpotlightCursor, ChatWidget
│   └── playground/     # Demos de ML (React client-side)
│       ├── PlaygroundApp.tsx    # Container + pill nav
│       ├── DemoShell.tsx        # Wrapper común
│       ├── ImageDemo.tsx        # Clasificación de imágenes
│       ├── RAGDemo.tsx          # RAG Explorer
│       ├── SentimentDemo.tsx    # Análisis de sentimiento
│       ├── SummaryDemo.tsx      # Resumen de texto
│       ├── WhisperDemo.tsx      # Speech-to-text (con fallback iOS)
│       ├── useDevice.ts         # Detección de dispositivo
│       ├── useMobileDetect.ts   # Mobile/iOS detection
│       └── usePipelineManager.ts# Gestión de modelos HF
├── data/               # Contenido estático
│   ├── experience.ts, projects.ts, archive.ts, social.ts
│   └── prerecorded-results.ts  # Fallback Whisper iOS
├── types/index.ts      # Experience, Project, ArchiveProject, SocialLink
├── lib/
│   └── portfolio-context.ts    # Contexto para chat API
└── styles/
    └── global.css      # CSS variables, theming
```

## Patrones

- **Astro-first:** `.astro` para contenido estático, `.tsx` para interactividad
- **Data-driven:** Arrays tipados en `/data` → componentes renderizan con map()
- **Client islands:** `client:load` / `client:only="react"` para React en Astro
- **WebGPU:** Modelos HF corren client-side, con fallbacks para iOS Safari
- **Sin estado global:** No Redux/Context, datos estáticos

## Tema

- Dark único: navy (#0a192f) + accent cyan (#64ffda)
- Fonts: Geist Sans/Mono
- Responsive: mobile-first (sm:640, lg:1024)

## Tipos principales

```typescript
Experience { period, title, company, companyUrl, location, description, technologies }
Project { title, description, technologies, githubUrl, liveUrl, image }
ArchiveProject { year, title, madeAt, technologies, url }
SocialLink { name, url, icon: "github" | "linkedin" | "mail" }
```

## Comandos

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview build local
npm test         # Vitest
```

## Convenciones

- Componentes Astro: PascalCase.astro (server por defecto)
- Componentes React: PascalCase.tsx (client islands)
- Data files: camelCase, exportan arrays tipados
- Estilos: Tailwind inline, variables CSS en global.css
- Playground demos: cada demo es un .tsx independiente con DemoShell wrapper
