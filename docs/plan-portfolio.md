# 🎯 Plan Completo: Portfolio de Cesar Moreno
## Senior Full Stack Engineer | AI Agents & Automation

**Documento de especificaciones para desarrollo**
**Versión 1.0 | Noviembre 2025**

---

## 📋 TABLA DE CONTENIDOS

1. [Contexto del Proyecto](#1-contexto-del-proyecto)
2. [Información del Propietario](#2-información-del-propietario)
3. [Análisis de Referencia: Brittany Chiang](#3-análisis-de-referencia-brittany-chiang)
4. [Arquitectura General](#4-arquitectura-general)
5. [Fase 1: MVP](#5-fase-1-mvp)
6. [Fase 2: Polish & SEO](#6-fase-2-polish--seo)
7. [Fase 3: AI Agent Demo](#7-fase-3-ai-agent-demo)
8. [Fase 4: Blog & Contenido](#8-fase-4-blog--contenido)
9. [Contenido Específico](#9-contenido-específico)
10. [Checklist de Validación](#10-checklist-de-validación)



## 1. CONTEXTO DEL PROYECTO

### 1.1 Objetivo
Crear un portafolio personal profesional para Cesar Moreno que:
- Posicione su expertise en AI Agents y Automatización
- Refleje su experiencia de 13+ años como Full Stack Developer
- Siga el estilo minimalista de Brittany Chiang (v5 - 2024)
- Incluya un diferenciador único: AI Agent Demo interactivo

### 1.2 Público Objetivo
- Recruiters técnicos y no técnicos
- Hiring managers de empresas tech
- CTOs y líderes técnicos
- Empresas buscando expertise en IA/automatización
- Comunidad tech LATAM y global

### 1.3 Resultado Esperado
Un sitio single-page con página de archive, desplegado en Vercel, con dominio personalizado, que demuestre competencia técnica y diferenciación en el mercado.

---

## 2. INFORMACIÓN DEL PROPIETARIO

### 2.1 Datos Personales
```
Nombre completo: Cesar Antonio Aaron Moreno Gomez
Nombre para mostrar: Cesar Moreno
Ubicación: Lima, Perú
Email: morenodev@gmail.com
Teléfono: +51 961434991
```

### 2.2 Links Profesionales
```
LinkedIn: https://linkedin.com/in/morenodev
GitHub: https://github.com/cmorenogit
Portfolio actual: https://app-profile-morenodev.vercel.app
```

### 2.3 Propuesta de Valor
```
Senior Full Stack Engineer con más de 13 años construyendo plataformas 
de alto rendimiento, especializado en arquitecturas modernas con 
JavaScript/TypeScript, microservicios y soluciones cloud.

Actualmente enfocado en automatización con IA: desarrollo agentes 
autónomos, flujos inteligentes y herramientas que optimizan procesos 
de desarrollo y calidad de código.
```

### 2.4 Tagline Principal
```
Opción 1: "I build AI agents that automate complex workflows"
Opción 2: "Senior Full Stack Engineer specializing in AI Agents & Automation"
Opción 3: "Building intelligent systems with TypeScript and AI"
```

### 2.5 Bio Completa (para About Section)
```
I'm a developer passionate about building intelligent systems that 
blend robust engineering with cutting-edge AI. With over 13 years 
of experience, I specialize in creating autonomous agents, smart 
workflows, and tools that optimize development processes.

Currently, I'm a Senior Full Stack Developer at Apprecio, where I 
develop automation solutions with AI agents as part of the product 
team. I work with LLMs to create contextual workflows, orchestrating 
automated tasks and complex API integrations.

In the past, I've built high-performance platforms across multiple 
LATAM countries, led complex projects in multi-tenant ecosystems, 
and integrated systems including dashboards, loyalty programs, 
campaigns, analytics, and business workflows.

My approach combines deep technical expertise in TypeScript, 
microservices, and cloud architecture with a product mindset focused 
on delivering real impact.
```

---

## 3. ANÁLISIS DE REFERENCIA: BRITTANY CHIANG

### 3.1 Sitio Actual (v5 - 2024)
**URL:** https://brittanychiang.com

### 3.2 Estructura de Página Principal
```
LAYOUT: Single-page, scroll vertical
NAVBAR: No tiene navbar tradicional, solo scroll natural
SECCIONES:
  1. Header (nombre + tagline mínimo, sin hero elaborado)
  2. About (bio de 3-4 párrafos)
  3. Experience (timeline vertical con trabajos)
  4. Projects (4 proyectos featured como cards)
  5. Footer (links a redes sociales)
```

### 3.3 Página /archive
```
URL: https://brittanychiang.com/archive
CONTENIDO: Tabla completa de todos los proyectos
COLUMNAS:
  - Year (año del proyecto)
  - Project (nombre, clickeable)
  - Made at (empresa/contexto)
  - Built with (tech stack como tags)
  - Link (ícono externo)
ORDENAMIENTO: Por año descendente (más reciente primero)
TOTAL: 40+ proyectos listados
```

### 3.4 Comportamiento de Proyectos
```
- En Homepage: 4 proyectos featured como cards con descripción
- Link "View Full Project Archive" lleva a /archive
- Click en proyecto: Abre link externo (GitHub, sitio live, artículo)
- NO hay páginas individuales de detalle de proyecto
- Todo es link externo
```

### 3.5 Paleta de Colores (v4 documentada)
```css
/* Navy backgrounds */
--navy: #0a192f;
--light-navy: #112240;
--lightest-navy: #233554;

/* Text colors */
--slate: #8892b0;
--light-slate: #a8b2d1;
--lightest-slate: #ccd6f6;
--white: #e6f1ff;

/* Accent */
--green: #64ffda; /* Teal/Cyan accent */
```

### 3.6 Tipografía
```
Font principal: SF Mono, Fira Code, monospace (para código/accent)
Font secundaria: Calibre, Inter, San Francisco, sans-serif (para texto)
```

### 3.7 Efectos e Interacciones
```
1. SPOTLIGHT CURSOR (v5):
   - Efecto de luz que sigue el mouse
   - Área circular de highlight sutil
   - Solo visible en desktop

2. HOVER EFFECTS:
   - Links cambian a color accent (teal)
   - Cards de proyecto tienen lift sutil
   - Underline animado en links

3. SCROLL:
   - Scroll natural sin snap
   - Sin animaciones de entrada elaboradas
   - Contenido visible inmediatamente

4. TRANSITIONS:
   - Todas las transiciones: 0.25s ease
   - Suaves, no llamativas
```

### 3.8 Responsive Behavior
```
DESKTOP (>1024px):
  - Layout lado a lado donde aplica
  - Spotlight cursor activo
  - Grid de 2 columnas para projects

TABLET (768px - 1024px):
  - Layout stack vertical
  - Spotlight cursor desactivado
  - Grid de 1 columna

MOBILE (<768px):
  - Todo en columna única
  - Menú hamburguesa (si hay navbar)
  - Touch-friendly spacing
```

---

## 4. ARQUITECTURA GENERAL

### 4.1 Tech Stack
```
FRAMEWORK: Next.js 15 (App Router)
LANGUAGE: TypeScript (strict mode)
STYLING: Tailwind CSS v4
ANIMATIONS: Framer Motion (Fase 2)
FONTS: Inter o Geist (via next/font)
ICONS: Lucide React
DEPLOYMENT: Vercel
VERSION CONTROL: GitHub
```

### 4.2 Estructura de Carpetas
```
portfolio-cesar-moreno/
├── public/
│   ├── images/
│   │   ├── projects/
│   │   │   ├── agentes-hub.png
│   │   │   ├── prompt-hub.png
│   │   │   ├── prism.png
│   │   │   └── apprecio-platform.png
│   │   └── og-image.png (1200x630)
│   ├── CV_Cesar_Moreno_2025.pdf
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── archive/
│   │   │   └── page.tsx
│   │   ├── api/ (Fase 3)
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Footer.tsx
│   │   ├── SpotlightCursor.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ExperienceItem.tsx
│   │   ├── TechTag.tsx
│   │   ├── SocialLinks.tsx
│   │   ├── ArchiveTable.tsx
│   │   ├── ThemeToggle.tsx (Fase 2)
│   │   └── AIChat.tsx (Fase 3)
│   │
│   ├── data/
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   └── social.ts
│   │
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   └── claude.ts (Fase 3)
│   │
│   └── types/
│       └── index.ts
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── .env.local
├── .env.example
├── package.json
└── README.md
```

### 4.3 Variables de Entorno
```env
# .env.example

# Site
NEXT_PUBLIC_SITE_URL=https://cesarmoreno.dev

# Analytics (Fase 2)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# AI Chat (Fase 3)
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

---

## 5. FASE 1: MVP

### 5.1 Objetivo de Fase 1
Crear un sitio funcional, minimalista y profesional siguiendo el estilo de Brittany Chiang, desplegado en Vercel.

### 5.2 Duración Estimada
1-2 semanas

### 5.3 Páginas a Crear

#### 5.3.1 Página Principal (/)
```
SECCIONES EN ORDEN:

1. HEADER
   - Nombre: "Cesar Moreno"
   - Tagline: "I build AI agents that automate complex workflows"
   - Subtítulo: "Senior Full Stack Engineer specializing in AI Agents, 
     TypeScript, and Microservices. Currently at Apprecio."
   - Botón: "Download CV" (descarga PDF)
   - NO incluir: Hero image, múltiples CTAs, animaciones de entrada

2. ABOUT
   - Título de sección: "About" (estilo sutil, no h2 grande)
   - Contenido: Bio completa (ver sección 2.5)
   - NO incluir: Foto personal, skills como badges separados
   - Skills mencionados naturalmente en el texto

3. EXPERIENCE
   - Título: "Experience"
   - Formato: Timeline vertical
   - Cada item incluye:
     * Período (ej: "2020 — Present")
     * Título del puesto
     * Empresa (con link si aplica)
     * Descripción (2-3 líneas)
     * Tech tags al final
   - Orden: Más reciente primero
   - Ver sección 9.1 para contenido específico

4. PROJECTS
   - Título: "Featured Projects"
   - Cantidad: 4 proyectos máximo
   - Formato: Cards en grid 2x2 (desktop), 1 columna (mobile)
   - Cada card incluye:
     * Nombre del proyecto
     * Descripción (2-3 líneas)
     * Tech tags
     * Links: GitHub, Live Demo (si aplica)
   - Al final: Link "View Full Project Archive" → /archive
   - Ver sección 9.2 para contenido específico

5. FOOTER
   - Links sociales: GitHub, LinkedIn, Email
   - Texto: "Built with Next.js & Tailwind CSS"
   - Año: "© 2025 Cesar Moreno"
   - NO incluir: Newsletter signup, contact form
```

#### 5.3.2 Página Archive (/archive)
```
ESTRUCTURA:

1. HEADER
   - Título: "All Projects"
   - Subtítulo: "A comprehensive list of projects I've worked on"
   - Link: "← Back to home"

2. TABLA
   - Columnas:
     * Year (ancho fijo, ~80px)
     * Project (nombre, el más ancho)
     * Made at (empresa/contexto)
     * Built with (tech tags)
     * Link (ícono externo, ancho fijo ~50px)
   
   - Comportamiento:
     * Ordenado por año descendente por defecto
     * Hover en fila: highlight sutil
     * Click en Project o Link: abre URL externa en nueva pestaña
     * Tech tags: inline, separados por espacios
   
   - Responsive:
     * Desktop: tabla completa
     * Mobile: ocultar columna "Made at", reducir tamaño
   
   - Ver sección 9.3 para lista completa de proyectos
```

### 5.4 Componentes Fase 1

#### 5.4.1 SpotlightCursor
```
DESCRIPCIÓN:
Efecto de luz circular que sigue el cursor del mouse, 
similar al de brittanychiang.com v5

COMPORTAMIENTO:
- Solo activo en desktop (>1024px)
- Radio del spotlight: ~400-600px
- Opacidad: muy sutil (0.05-0.1)
- Color: usar accent color (teal/cyan)
- Gradient radial desde el cursor hacia afuera
- Transición suave al mover mouse
- Desactivar en mobile/tablet

IMPLEMENTACIÓN SUGERIDA:
- Usar CSS con pointer-events: none
- Posición fixed siguiendo mouse
- onMouseMove event listener
- Gradient: radial-gradient desde transparente al centro
```

#### 5.4.2 Header
```
PROPS: ninguna (datos hardcodeados o de constants)

ESTRUCTURA:
<header>
  <h1>Cesar Moreno</h1>
  <p class="tagline">I build AI agents that automate complex workflows</p>
  <p class="subtitle">Senior Full Stack Engineer at Apprecio...</p>
  <a href="/CV.pdf" download>Download CV</a>
</header>

ESTILOS:
- Nombre: text-5xl, font-bold, color white
- Tagline: text-xl, color accent (teal)
- Subtitle: text-base, color slate
- Botón CV: border accent, hover fill accent
- Spacing: mucho padding vertical (py-24 o más)
```

#### 5.4.3 About
```
PROPS: ninguna

ESTRUCTURA:
<section id="about">
  <h2>About</h2>
  <div class="content">
    <p>párrafo 1</p>
    <p>párrafo 2</p>
    <p>párrafo 3</p>
    <p>párrafo 4</p>
  </div>
</section>

ESTILOS:
- Título h2: text-sm, uppercase, tracking-widest, color slate
- Párrafos: text-lg, color light-slate, line-height relajado
- Links en texto: color accent, underline on hover
- Separación entre párrafos: mb-4
```

#### 5.4.4 Experience
```
PROPS: experiences: Experience[]

INTERFACE Experience:
{
  period: string;        // "2020 — Present"
  title: string;         // "Senior Full Stack Developer"
  company: string;       // "Apprecio"
  companyUrl?: string;   // "https://apprecio.com"
  location: string;      // "Santiago, Chile (Remote)"
  description: string;   // "Desarrollo soluciones..."
  technologies: string[]; // ["TypeScript", "Node.js", ...]
}

ESTRUCTURA:
<section id="experience">
  <h2>Experience</h2>
  <div class="timeline">
    {experiences.map(exp => <ExperienceItem {...exp} />)}
  </div>
</section>

ESTILOS ExperienceItem:
- Period: text-sm, color slate, ancho fijo izquierda
- Title + Company: en línea, title bold, company con link
- Description: color light-slate
- Tech tags: inline, text-sm, color accent
- Hover en item: highlight sutil del fondo
- Layout: grid con period a la izquierda, resto a la derecha
```

#### 5.4.5 Projects
```
PROPS: projects: Project[]

INTERFACE Project:
{
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

ESTRUCTURA:
<section id="projects">
  <h2>Featured Projects</h2>
  <div class="grid">
    {projects.map(proj => <ProjectCard {...proj} />)}
  </div>
  <a href="/archive">View Full Project Archive →</a>
</section>

ESTILOS ProjectCard:
- Container: bg-light-navy, rounded-lg, padding
- Title: text-xl, font-semibold, color white
- Description: text-base, color slate
- Tech tags: inline, text-sm
- Links: iconos GitHub y External Link
- Hover: translateY(-4px), shadow increase
- Transición: 0.25s ease
```

#### 5.4.6 Footer
```
ESTRUCTURA:
<footer>
  <div class="social-links">
    <a href="github">GitHub icon</a>
    <a href="linkedin">LinkedIn icon</a>
    <a href="mailto:">Email icon</a>
  </div>
  <p>Built with Next.js & Tailwind CSS</p>
  <p>© 2025 Cesar Moreno</p>
</footer>

ESTILOS:
- Centrado
- Iconos: 24px, color slate, hover accent
- Texto: text-sm, color slate
- Padding generoso arriba
```

#### 5.4.7 ArchiveTable
```
PROPS: projects: ArchiveProject[]

INTERFACE ArchiveProject:
{
  year: number;
  title: string;
  madeAt?: string;
  technologies: string[];
  url?: string;
}

ESTRUCTURA:
<table>
  <thead>
    <tr>
      <th>Year</th>
      <th>Project</th>
      <th>Made at</th>
      <th>Built with</th>
      <th>Link</th>
    </tr>
  </thead>
  <tbody>
    {projects.map(proj => (
      <tr>
        <td>{year}</td>
        <td>{title}</td>
        <td>{madeAt}</td>
        <td>{technologies.join(' · ')}</td>
        <td><ExternalLinkIcon /></td>
      </tr>
    ))}
  </tbody>
</table>

ESTILOS:
- Table: width 100%, border-collapse
- Headers: text-left, text-sm, color slate, border-bottom
- Cells: padding vertical, border-bottom subtle
- Row hover: bg-lightest-navy
- Year: font-mono
- Project title: color white, font-medium
- Made at: color slate
- Technologies: color slate, text-sm
- Link icon: color slate, hover accent
```

### 5.5 Design Tokens Fase 1

```css
/* tailwind.config.ts - extend colors */

colors: {
  navy: {
    DEFAULT: '#0a192f',
    light: '#112240',
    lightest: '#233554',
  },
  slate: {
    DEFAULT: '#8892b0',
    light: '#a8b2d1',
    lightest: '#ccd6f6',
  },
  white: '#e6f1ff',
  accent: {
    DEFAULT: '#64ffda', /* Teal */
    hover: '#57e2c2',
  },
}

/* Font sizes */
fontSize: {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
}

/* Spacing */
spacing: {
  section: '6rem', /* Espacio entre secciones */
}

/* Transitions */
transitionDuration: {
  DEFAULT: '250ms',
}

/* Border radius */
borderRadius: {
  DEFAULT: '4px',
  lg: '8px',
}
```

### 5.6 Layout y Contenedor
```
MAX WIDTH: 1200px
PADDING HORIZONTAL: 
  - Desktop: 6rem (96px)
  - Tablet: 3rem (48px)
  - Mobile: 1.5rem (24px)

ESPACIADO ENTRE SECCIONES: 6rem (96px)

ESTRUCTURA GENERAL:
<body class="bg-navy text-slate-light">
  <SpotlightCursor />
  <main class="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24">
    <Header />
    <About />
    <Experience />
    <Projects />
    <Footer />
  </main>
</body>
```

### 5.7 Entregables Fase 1
```
✅ Repositorio GitHub configurado
✅ Proyecto Next.js 15 con TypeScript
✅ Tailwind CSS configurado con design tokens
✅ Página principal con todas las secciones
✅ Página /archive con tabla funcional
✅ Spotlight cursor effect
✅ Responsive (mobile, tablet, desktop)
✅ CV descargable (PDF)
✅ Desplegado en Vercel (URL temporal)
✅ README documentado
```

---

## 6. FASE 2: POLISH & SEO

### 6.1 Objetivo de Fase 2
Pulir el MVP con animaciones sutiles, agregar SEO completo, configurar dominio propio y analytics.

### 6.2 Duración Estimada
1-2 semanas

### 6.3 Features a Agregar

#### 6.3.1 Animaciones con Framer Motion
```
INSTALACIÓN:
npm install framer-motion

ANIMACIONES A IMPLEMENTAR:

1. Fade-in on scroll (secciones):
   - Cada sección aparece con fade + slide up sutil
   - Trigger: cuando elemento entra al viewport
   - Duration: 0.5s
   - Delay: stagger de 0.1s entre elementos hijos

2. Hover effects mejorados:
   - Project cards: scale(1.02) + shadow
   - Links: underline animado
   - Experience items: background highlight

3. Page transitions (opcional):
   - Fade entre páginas
   - Duration: 0.3s

CÓDIGO EJEMPLO:
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

<motion.section
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
  variants={fadeInUp}
>
```

#### 6.3.2 Dark/Light Mode Toggle
```
INSTALACIÓN:
npm install next-themes

IMPLEMENTACIÓN:
- Default: dark mode
- Toggle button en header o footer
- Persistencia en localStorage
- Transición suave entre modos (0.3s)

COLORES LIGHT MODE:
- Background: #f8fafc (slate-50)
- Text: #1e293b (slate-800)
- Accent: #0ea5e9 (cyan-500, ajustado para contraste)
- Cards: #ffffff con sombra sutil

COMPONENTE ThemeToggle:
- Icono luna (dark) / sol (light)
- Tamaño: 20px
- Ubicación: header, alineado a la derecha
```

#### 6.3.3 SEO Completo
```
META TAGS (layout.tsx):

<title>Cesar Moreno | Senior Full Stack Engineer | AI Agents</title>
<meta name="description" content="Senior Full Stack Engineer with 13+ years of experience. Specializing in AI Agents, TypeScript, microservices, and automation. Currently at Apprecio." />
<meta name="keywords" content="Full Stack Developer, AI Agents, TypeScript, Node.js, React, Microservices, LLM, Automation" />
<meta name="author" content="Cesar Moreno" />

OPEN GRAPH:
<meta property="og:type" content="website" />
<meta property="og:url" content="https://cesarmoreno.dev" />
<meta property="og:title" content="Cesar Moreno | Senior Full Stack Engineer" />
<meta property="og:description" content="Building AI agents that automate complex workflows" />
<meta property="og:image" content="https://cesarmoreno.dev/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

TWITTER CARD:
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Cesar Moreno | Senior Full Stack Engineer" />
<meta name="twitter:description" content="Building AI agents that automate complex workflows" />
<meta name="twitter:image" content="https://cesarmoreno.dev/og-image.png" />

CANONICAL:
<link rel="canonical" href="https://cesarmoreno.dev" />

FAVICON:
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

#### 6.3.4 Archivos SEO Adicionales
```
/public/robots.txt:
User-agent: *
Allow: /
Sitemap: https://cesarmoreno.dev/sitemap.xml

/public/sitemap.xml (o generado dinámicamente):
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cesarmoreno.dev</loc>
    <lastmod>2025-11-26</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cesarmoreno.dev/archive</loc>
    <lastmod>2025-11-26</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

#### 6.3.5 Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Cesar Moreno",
  "jobTitle": "Senior Full Stack Engineer",
  "url": "https://cesarmoreno.dev",
  "sameAs": [
    "https://linkedin.com/in/morenodev",
    "https://github.com/cmorenogit"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Apprecio"
  },
  "knowsAbout": [
    "TypeScript",
    "JavaScript",
    "AI Agents",
    "Microservices",
    "Node.js",
    "React"
  ]
}
```

#### 6.3.6 Analytics
```
VERCEL ANALYTICS:
npm install @vercel/analytics

En layout.tsx:
import { Analytics } from '@vercel/analytics/react';
<Analytics />

GOOGLE ANALYTICS 4 (opcional):
- Crear property en GA4
- Agregar NEXT_PUBLIC_GA_ID en .env
- Implementar con next/script
```

#### 6.3.7 Dominio Propio
```
OPCIONES DE DOMINIO:
- cesarmoreno.dev (recomendado)
- morenodev.com
- cesarmoreno.io

CONFIGURACIÓN EN VERCEL:
1. Settings → Domains
2. Agregar dominio
3. Configurar DNS en registrar:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
   
   - Type: A
   - Name: @
   - Value: 76.76.21.21

4. Esperar propagación (hasta 48h)
5. SSL automático por Vercel
```

### 6.4 Entregables Fase 2
```
✅ Animaciones Framer Motion implementadas
✅ Dark/Light mode toggle funcionando
✅ Meta tags SEO completos
✅ Open Graph image (1200x630)
✅ robots.txt y sitemap.xml
✅ JSON-LD structured data
✅ Vercel Analytics activo
✅ Dominio propio configurado y funcionando
✅ Lighthouse score > 90 en todas las categorías
```

---

## 7. FASE 3: AI AGENT DEMO

### 7.1 Objetivo de Fase 3
Agregar un diferenciador único: un chat interactivo donde visitantes pueden preguntarle a un agente de IA sobre Cesar, su experiencia y proyectos.

### 7.2 Duración Estimada
1-2 semanas

### 7.3 Ubicación en el Sitio
```
OPCIÓN A (Recomendada): Nueva sección en homepage
- Después de Projects, antes de Footer
- Título: "Ask My AI Agent"
- Descripción: "Curious about my work? Ask my AI assistant anything about my experience, projects, or technical skills."

OPCIÓN B: Floating chat button
- Botón fijo en esquina inferior derecha
- Click abre modal de chat
- Más discreto pero menos visible
```

### 7.4 Especificaciones Técnicas

#### 7.4.1 API Route
```
UBICACIÓN: /src/app/api/chat/route.ts

MÉTODO: POST

REQUEST BODY:
{
  "message": "string", // Pregunta del usuario
  "history": [         // Historial de conversación
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}

RESPONSE:
{
  "response": "string", // Respuesta del agente
  "error": null | "string"
}

RATE LIMITING:
- Máximo 10 requests por minuto por IP
- Implementar con upstash/ratelimit o similar
```

#### 7.4.2 Integración Claude API
```
SDK: @anthropic-ai/sdk

MODELO: claude-3-haiku-20240307 (rápido y económico)

SYSTEM PROMPT:
"You are an AI assistant representing Cesar Moreno, a Senior Full Stack 
Engineer with 13+ years of experience. You help visitors learn about 
Cesar's professional background, skills, and projects.

KEY INFORMATION ABOUT CESAR:
- Current role: Senior Full Stack Developer at Apprecio (since 2020)
- Location: Lima, Peru (works remotely)
- Specialization: AI Agents, TypeScript, Microservices, LLMs
- Experience: 13+ years in software development
- Notable achievements:
  * 40% improvement in product delivery
  * 25% performance optimization in microservices
  * Built unified rewards platform for multiple LATAM countries
  * Develops autonomous AI agents for code analysis and automation

PROJECTS:
- agentes-hub: AI agents for task automation
- prompt-hub: Optimized prompts collection
- prism: Multi-AI model debate system

TECH STACK:
- Languages: TypeScript, JavaScript, Python
- Frontend: React, Next.js, Vue.js
- Backend: Node.js, NestJS, Express
- AI/ML: LangChain, LangGraph, Claude, OpenAI
- Cloud: AWS, Google Cloud, Docker
- Databases: PostgreSQL, MongoDB, Redis

GUIDELINES:
- Be friendly, professional, and concise
- Answer questions about Cesar's work accurately
- For personal questions, politely redirect to professional topics
- If unsure, say so honestly
- Encourage visitors to connect on LinkedIn for detailed discussions
- Keep responses under 150 words unless more detail is needed"

MAX_TOKENS: 300
TEMPERATURE: 0.7
```

#### 7.4.3 Componente AIChat
```
ESTRUCTURA:
<section id="ai-chat">
  <h2>Ask My AI Agent</h2>
  <p>Curious about my work?...</p>
  
  <div class="chat-container">
    <div class="messages">
      {messages.map(msg => <ChatMessage {...msg} />)}
    </div>
    
    <form onSubmit={handleSend}>
      <input 
        type="text" 
        placeholder="Ask me anything about Cesar's experience..."
        value={input}
        onChange={setInput}
      />
      <button type="submit">Send</button>
    </form>
  </div>
</section>

ESTADOS:
- messages: Message[] (historial)
- input: string (input actual)
- isLoading: boolean (esperando respuesta)
- error: string | null

COMPORTAMIENTO:
- Enter o click en Send envía mensaje
- Mostrar loading indicator mientras espera
- Auto-scroll al nuevo mensaje
- Limpiar input después de enviar
- Mostrar error si falla
- Máximo 10 mensajes en historial (para no exceder contexto)

ESTILOS:
- Container: bg-light-navy, rounded-lg, max-width 600px
- Messages area: max-height 400px, overflow-y scroll
- User messages: alineados derecha, bg-accent con opacity
- Assistant messages: alineados izquierda, bg-lightest-navy
- Input: full width, bg-navy, border accent
- Button: bg-accent, hover darker
```

#### 7.4.4 Preguntas Sugeridas
```
Mostrar como chips clickeables sobre el input:

- "What's Cesar's experience with AI?"
- "Tell me about his current role"
- "What tech stack does he use?"
- "What projects has he worked on?"
```

### 7.5 Consideraciones de Costo
```
CLAUDE HAIKU PRICING (Nov 2025):
- Input: $0.25 / 1M tokens
- Output: $1.25 / 1M tokens

ESTIMACIÓN MENSUAL:
- System prompt: ~500 tokens
- Average query: ~50 tokens
- Average response: ~150 tokens
- Per conversation (5 exchanges): ~1,500 tokens

Si 100 visitantes/mes, 3 preguntas cada uno:
- ~45,000 tokens/mes
- Costo: ~$0.06/mes

MUY ECONÓMICO - No necesitas Pinecone ni vector DB
```

### 7.6 Entregables Fase 3
```
✅ API route /api/chat funcionando
✅ Integración Claude API
✅ Componente AIChat responsive
✅ Rate limiting implementado
✅ Error handling
✅ Loading states
✅ Preguntas sugeridas
✅ Diseño consistente con el resto del sitio
```

---

## 8. FASE 4: BLOG & CONTENIDO

### 8.1 Objetivo de Fase 4
Agregar un blog para posicionamiento como experto en AI/automatización.

### 8.2 Duración Estimada
Ongoing (setup inicial: 1 semana)

### 8.3 Implementación

#### 8.3.1 Estructura
```
/src/app/blog/
├── page.tsx (lista de posts)
└── [slug]/
    └── page.tsx (post individual)

/content/blog/
├── mcp-protocol-explained.mdx
├── building-ai-agents-with-langchain.mdx
└── from-fullstack-to-ai-engineer.mdx
```

#### 8.3.2 Tech Stack Blog
```
CONTENT: MDX (Markdown + JSX)
LIBRARY: @next/mdx o contentlayer
SYNTAX HIGHLIGHTING: shiki o prism-react-renderer
```

#### 8.3.3 Diseño Página Blog
```
/blog (lista):
- Grid de cards con posts
- Cada card: título, fecha, descripción, tags
- Ordenado por fecha descendente

/blog/[slug] (post):
- Título grande
- Fecha y tiempo de lectura
- Tags
- Contenido MDX renderizado
- Links prev/next post
```

### 8.4 Ideas de Posts Iniciales
```
1. "MCP: El USB-C de los LLMs"
   - Ya tienes el contenido del post de LinkedIn
   - Expandir con ejemplos de código

2. "Construyendo Agentes de IA con LangChain y TypeScript"
   - Tutorial técnico
   - Basado en tu experiencia real

3. "De Full Stack a AI Engineer: Mi Transición"
   - Post personal/reflexivo
   - Atrae a devs en situación similar
```

### 8.5 Entregables Fase 4
```
✅ Estructura de blog con MDX
✅ Página de lista de posts
✅ Páginas individuales de posts
✅ Syntax highlighting para código
✅ 2-3 posts iniciales publicados
✅ RSS feed (/feed.xml)
✅ SEO para cada post
```

---

## 9. CONTENIDO ESPECÍFICO

### 9.1 Experience Data
```typescript
// src/data/experience.ts

export const experiences = [
  {
    period: "2020 — Present",
    title: "Senior Full Stack Developer",
    company: "Apprecio",
    companyUrl: "https://apprecio.com",
    location: "Santiago, Chile (Remote)",
    description: 
      "Develop automation solutions with AI agents as part of the product team. " +
      "Work with LLMs to create contextual workflows, orchestrating automated tasks " +
      "and complex API integrations. Achieved 40% improvement in product delivery " +
      "and 25% performance optimization across microservices.",
    technologies: [
      "TypeScript",
      "Node.js",
      "NestJS",
      "React",
      "PostgreSQL",
      "AWS",
      "LangChain",
      "Claude API"
    ]
  },
  {
    period: "2016 — 2020",
    title: "Full Stack Developer",
    company: "Ae Online Solutions",
    companyUrl: null,
    location: "Lima, Peru",
    description:
      "Led development and integration of a customer management system for discovering " +
      "valuable business opportunities and data analysis. Built RESTful APIs with Node.js " +
      "and PHP, integrated SQL and MongoDB databases, developed frontends with React and Vue.js.",
    technologies: [
      "JavaScript",
      "Node.js",
      "PHP",
      "Laravel",
      "React",
      "Vue.js",
      "MongoDB",
      "MySQL"
    ]
  },
  {
    period: "2016",
    title: "Full Stack Developer",
    company: "Publicidad y Sistemas OPER",
    companyUrl: null,
    location: "Lima, Peru",
    description:
      "Developed real-time reservation management system for web and mobile platforms. " +
      "Built user interfaces with Angular and Ionic, backend services with Laravel and Node.js, " +
      "real-time features with Socket.io.",
    technologies: [
      "Angular",
      "Ionic",
      "Laravel",
      "Node.js",
      "Socket.io",
      "JavaScript"
    ]
  }
];
```

### 9.2 Featured Projects Data
```typescript
// src/data/projects.ts

export const featuredProjects = [
  {
    title: "agentes-hub",
    description:
      "Hub of AI agents for task automation. Includes agents for code analysis, " +
      "PR review, and development process optimization.",
    technologies: ["TypeScript", "LangChain", "Claude API", "Node.js"],
    githubUrl: "https://github.com/cmorenogit/agentes-hub",
    liveUrl: null,
    image: "/images/projects/agentes-hub.png"
  },
  {
    title: "prompt-hub",
    description:
      "Collection and management system for optimized prompts. Organized by use case " +
      "with versioning and performance tracking.",
    technologies: ["TypeScript", "Next.js", "PostgreSQL"],
    githubUrl: "https://github.com/cmorenogit/prompt-hub",
    liveUrl: null,
    image: "/images/projects/prompt-hub.png"
  },
  {
    title: "prism",
    description:
      "Multi-AI model debate system. Leverages Claude, GPT, and Gemini to generate " +
      "improved analyses through structured debates.",
    technologies: ["TypeScript", "Shell", "Multiple LLM APIs"],
    githubUrl: "https://github.com/cmorenogit/prism",
    liveUrl: null,
    image: "/images/projects/prism.png"
  },
  {
    title: "Apprecio Rewards Platform",
    description:
      "Unified rewards platform integrating loyalty, campaigns, analytics, and " +
      "business workflows. Deployed across multiple LATAM countries.",
    technologies: ["TypeScript", "NestJS", "React", "PostgreSQL", "AWS"],
    githubUrl: null,
    liveUrl: null, // Producto interno
    image: "/images/projects/apprecio-platform.png"
  }
];
```

### 9.3 Archive Projects Data
```typescript
// src/data/archive.ts

export const archiveProjects = [
  {
    year: 2025,
    title: "agentes-hub",
    madeAt: "Personal",
    technologies: ["TypeScript", "LangChain", "Claude API"],
    url: "https://github.com/cmorenogit/agentes-hub"
  },
  {
    year: 2025,
    title: "prompt-hub",
    madeAt: "Personal",
    technologies: ["TypeScript", "Next.js"],
    url: "https://github.com/cmorenogit/prompt-hub"
  },
  {
    year: 2025,
    title: "prism",
    madeAt: "Personal",
    technologies: ["TypeScript", "Shell", "LLM APIs"],
    url: "https://github.com/cmorenogit/prism"
  },
  {
    year: 2024,
    title: "Unified Rewards Platform",
    madeAt: "Apprecio",
    technologies: ["TypeScript", "NestJS", "React", "AWS"],
    url: null
  },
  {
    year: 2024,
    title: "AI Code Analysis Agent",
    madeAt: "Apprecio",
    technologies: ["TypeScript", "LangChain", "Claude"],
    url: null
  },
  {
    year: 2023,
    title: "Campaign Visualization System",
    madeAt: "Apprecio",
    technologies: ["React", "D3.js", "PostgreSQL"],
    url: null
  },
  {
    year: 2023,
    title: "Multi-tenant Engagement Tracker",
    madeAt: "Apprecio",
    technologies: ["NestJS", "PostgreSQL", "Redis"],
    url: null
  },
  {
    year: 2022,
    title: "Gift Card Redemption System",
    madeAt: "Apprecio",
    technologies: ["Node.js", "React", "Stripe"],
    url: null
  },
  {
    year: 2021,
    title: "Loyalty Module",
    madeAt: "Apprecio",
    technologies: ["TypeScript", "NestJS", "PostgreSQL"],
    url: null
  },
  {
    year: 2020,
    title: "Customer Management System",
    madeAt: "Ae Online Solutions",
    technologies: ["Node.js", "React", "MongoDB"],
    url: null
  },
  {
    year: 2019,
    title: "Business Intelligence Dashboard",
    madeAt: "Ae Online Solutions",
    technologies: ["Vue.js", "D3.js", "Python"],
    url: null
  },
  {
    year: 2018,
    title: "RESTful API Platform",
    madeAt: "Ae Online Solutions",
    technologies: ["Node.js", "Express", "MySQL"],
    url: null
  },
  {
    year: 2016,
    title: "Real-time Reservation System",
    madeAt: "OPER",
    technologies: ["Angular", "Ionic", "Socket.io"],
    url: null
  }
];
```

### 9.4 Social Links Data
```typescript
// src/data/social.ts

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/cmorenogit",
    icon: "github" // Lucide icon name
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/morenodev",
    icon: "linkedin"
  },
  {
    name: "Email",
    url: "mailto:morenodev@gmail.com",
    icon: "mail"
  }
];
```

---

## 10. CHECKLIST DE VALIDACIÓN

### 10.1 Pre-Launch Checklist

#### Fase 1 - MVP
```
SETUP TÉCNICO:
□ Repositorio GitHub creado (público)
□ Next.js 15 + TypeScript configurado
□ Tailwind CSS con design tokens
□ Estructura de carpetas correcta
□ .env.example creado

COMPONENTES:
□ Header con nombre, tagline, CV download
□ About con bio completa
□ Experience timeline (3 trabajos)
□ Projects grid (4 proyectos)
□ Footer con links sociales
□ SpotlightCursor funcionando
□ ArchiveTable en /archive

CONTENIDO:
□ Bio revisada y sin errores
□ Experience data completa
□ Projects data completa
□ Archive data completa
□ CV PDF actualizado
□ Links verificados (ningún 404)

DISEÑO:
□ Paleta de colores aplicada
□ Tipografía consistente
□ Espaciado correcto entre secciones
□ Hover effects funcionando

RESPONSIVE:
□ Desktop (1200px+) ✓
□ Tablet (768-1024px) ✓
□ Mobile (<768px) ✓

DEPLOY:
□ Vercel conectado a GitHub
□ Build sin errores
□ URL temporal funcionando
```

#### Fase 2 - Polish
```
ANIMACIONES:
□ Framer Motion instalado
□ Fade-in on scroll en secciones
□ Hover effects mejorados
□ Transiciones suaves

DARK/LIGHT MODE:
□ next-themes configurado
□ Toggle visible y funcional
□ Colores light mode correctos
□ Persiste en localStorage

SEO:
□ Meta tags en todas las páginas
□ Open Graph configurado
□ OG image (1200x630) creada
□ robots.txt
□ sitemap.xml
□ JSON-LD structured data

PERFORMANCE:
□ Lighthouse Performance > 90
□ Lighthouse Accessibility > 90
□ Lighthouse Best Practices > 90
□ Lighthouse SEO > 90

DOMINIO:
□ Dominio comprado
□ DNS configurado
□ SSL activo
□ Redirects www → apex

ANALYTICS:
□ Vercel Analytics activo
□ (Opcional) GA4 configurado
```

#### Fase 3 - AI Agent
```
API:
□ /api/chat route creada
□ Claude API integrada
□ System prompt optimizado
□ Rate limiting implementado
□ Error handling completo

COMPONENTE:
□ AIChat responsive
□ Messages rendering correcto
□ Loading states
□ Error states
□ Suggested questions

UX:
□ Auto-scroll a nuevos mensajes
□ Input clear después de enviar
□ Disabled durante loading
□ Límite de historial (10 msgs)

TESTING:
□ Responde preguntas sobre experiencia
□ Responde preguntas sobre proyectos
□ Responde preguntas sobre tech stack
□ Maneja preguntas fuera de contexto
□ No revela información sensible
```

#### Fase 4 - Blog
```
SETUP:
□ MDX configurado
□ Páginas de blog funcionando
□ Syntax highlighting

CONTENIDO:
□ Al menos 2-3 posts publicados
□ Posts sin errores gramaticales
□ Código en posts funcional

SEO:
□ Meta tags por post
□ RSS feed generado
```

---

## NOTAS FINALES

### Prioridades
1. **Fase 1 es crítica** - Sin esto no hay sitio
2. **Fase 2 es importante** - Profesionaliza el resultado
3. **Fase 3 es diferenciadora** - Te distingue de otros portfolios
4. **Fase 4 es opcional** - Solo si vas a escribir activamente

### Tiempos Realistas
- Fase 1: 1-2 semanas
- Fase 2: 1-2 semanas
- Fase 3: 1-2 semanas
- Fase 4: 1 semana setup + ongoing

### Recursos Necesarios
- Dominio: ~$12/año
- Vercel: Gratis (hobby tier)
- Claude API: ~$5/mes máximo
- Total: <$20/mes

---

**Documento creado: Noviembre 2025**
**Para: Cesar Moreno**
**Uso: Desarrollo con agente de IA**
