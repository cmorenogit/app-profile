import type { Lang } from '@/i18n/utils';

/**
 * Bilingual data for the /uses page.
 *
 * Category titles and item descriptions are translated; product/tool `name`
 * values are proper nouns and stay as-is in both languages. The page picks the
 * list by lang from the URL — same approach as the rest of the site's content.
 */

export interface UsesItem {
  name: string;
  description: string;
}

export interface UsesCategory {
  title: string;
  items: UsesItem[];
}

const en: UsesCategory[] = [
  {
    title: 'AI & LLMs',
    items: [
      { name: 'Claude Code', description: 'Primary AI coding assistant — CLI-first workflow with MCP servers, custom skills, and persistent memory via Engram' },
      { name: 'Claude API (Anthropic)', description: 'Multi-agent orchestration, automated PR code reviews, RAG systems. 97.5% token cost reduction through intelligent caching' },
      { name: 'OpenAI API (GPT-4)', description: 'Multi-perspective analysis in multi-model orchestration and cross-model validation' },
      { name: 'Google Gemini API', description: 'Third perspective in multi-model orchestration pipelines' },
      { name: 'LangChain / LangGraph', description: 'Agent frameworks for Think→Act→Observe loops and autonomous workflows' },
      { name: 'Transformers.js', description: 'In-browser AI models via WASM/WebGPU — sentiment, summarization, image classification. Zero API cost' },
      { name: 'Groq', description: 'Ultra-fast LLM inference for real-time chat endpoints' },
      { name: 'Ollama', description: 'Local LLM runtime for offline development and testing' },
    ],
  },
  {
    title: 'Languages & Runtimes',
    items: [
      { name: 'TypeScript 5.9', description: 'Primary language — strict mode in all new projects' },
      { name: 'Node.js 22', description: 'Backend runtime powering 13+ production microservices' },
      { name: 'Deno 2.7', description: 'Edge functions and Supabase runtime' },
      { name: 'Python 3.14', description: 'ML tooling, scripting, and data processing' },
      { name: 'Shell / Bash', description: 'CLI tools, automation scripts, claude-statusline (<50ms render)' },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'Astro 6', description: 'Current framework — islands architecture, minimal JS, static-first' },
      { name: 'React 19', description: 'Interactive components as Astro islands, server components' },
      { name: 'Tailwind CSS 4', description: 'Utility-first styling with Vite plugin integration' },
      { name: 'Framer Motion 12', description: 'Scroll animations, micro-interactions, whileInView patterns' },
      { name: 'Next.js 16', description: 'App Router for complex React applications' },
      { name: 'Vue.js', description: 'Legacy dashboards and business intelligence apps' },
      { name: 'Angular 17 SSR', description: 'Server-rendered enterprise applications (Engagement platform)' },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'NestJS', description: 'Enterprise Node.js framework — multi-tenant services across 6 LATAM countries' },
      { name: 'Express', description: 'Lightweight APIs and standalone microservices' },
      { name: 'GraphQL (Apollo)', description: 'Complex data graphs for multi-tenant platforms' },
      { name: 'Supabase', description: 'Managed PostgreSQL + Auth + Realtime + Edge Functions' },
    ],
  },
  {
    title: 'Databases',
    items: [
      { name: 'PostgreSQL', description: 'Primary DB with Row-Level Security for multi-tenant data isolation' },
      { name: 'MongoDB', description: 'Document store for legacy services and flexible schemas' },
      { name: 'MySQL', description: 'Relational database for high-transaction systems' },
      { name: 'Redis', description: 'Caching layer, rate limiting, and session management' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    items: [
      { name: 'Vercel', description: 'Primary deployment — preview deploys, analytics, edge functions, WAF' },
      { name: 'AWS', description: 'Lambda, S3, CloudFront for production infrastructure' },
      { name: 'Google Cloud', description: 'Cloud services and API integrations' },
      { name: 'OrbStack', description: 'Fast Docker alternative for containerized development on macOS' },
      { name: 'GitHub Actions', description: 'CI/CD pipelines for automated testing and multi-environment deploy' },
    ],
  },
  {
    title: 'Testing & Quality',
    items: [
      { name: 'Playwright', description: 'E2E testing organized by feature modules across multiple browsers' },
      { name: 'Vitest', description: 'Unit and integration testing with TypeScript-first config' },
      { name: 'AI Code Review', description: 'Custom multi-LLM agents detecting XSS, IDOR, auth bypass, CORS issues' },
    ],
  },
  {
    title: 'Terminal & Editor',
    items: [
      { name: 'Ghostty', description: 'GPU-accelerated terminal — DankMono Nerd Font, Vesper theme, split panes' },
      { name: 'Zed', description: 'Primary editor — fast, Rust-based, with custom themes and keymaps' },
      { name: 'Neovim', description: 'Terminal editing with custom config for quick edits' },
      { name: 'tmux', description: 'Terminal multiplexer for persistent sessions and agent workflows' },
      { name: 'Zsh + Zim', description: 'Shell framework with async autosuggestions and syntax highlighting' },
    ],
  },
  {
    title: 'CLI Productivity',
    items: [
      { name: 'lazygit', description: 'Terminal UI for git — visual staging, rebasing, and conflict resolution' },
      { name: 'delta', description: 'Syntax-highlighted diffs with side-by-side mode' },
      { name: 'fzf', description: 'Fuzzy finder for files, history, and branch switching' },
      { name: 'ripgrep (rg)', description: 'Ultra-fast code search across large codebases' },
      { name: 'fd', description: 'Modern find replacement with sensible defaults' },
      { name: 'eza', description: 'Modern ls with git integration and tree view' },
      { name: 'bat', description: 'cat with syntax highlighting and git diff integration' },
      { name: 'hyperfine', description: 'CLI benchmarking for performance testing scripts and tools' },
    ],
  },
  {
    title: 'Workflow & Methodology',
    items: [
      { name: 'Spec-Driven Development (SDD)', description: 'Structured methodology: explore → propose → spec → design → tasks → apply → verify' },
      { name: 'bd (beads)', description: 'Issue tracking system — all work tracked via bd, not external tools' },
      { name: 'Engram', description: 'Persistent AI memory across sessions — decisions, patterns, architecture' },
      { name: 'MCP Servers', description: 'Custom Model Context Protocol integrations for JIRA, Google Workspace, Playwright' },
      { name: 'Conventional Commits', description: 'Structured git history: feat:, fix:, refactor:, docs:, chore:' },
    ],
  },
  {
    title: 'Apps & Utilities',
    items: [
      { name: 'Raycast', description: 'Command palette replacing Spotlight — snippets, window management, scripts' },
      { name: 'Bruno', description: 'Open-source API client — Postman alternative with git-friendly collections' },
      { name: 'Fork', description: 'Visual Git client for complex merge/rebase operations' },
      { name: 'Obsidian', description: 'Knowledge base with MCP integration for Claude Code' },
      { name: 'MongoDB Compass', description: 'Visual database explorer for MongoDB debugging' },
    ],
  },
];

const es: UsesCategory[] = [
  {
    title: 'IA y LLMs',
    items: [
      { name: 'Claude Code', description: 'Asistente de IA principal para programar — flujo CLI-first con servidores MCP, skills personalizadas y memoria persistente vía Engram' },
      { name: 'Claude API (Anthropic)', description: 'Orquestación multiagente, revisiones de código automatizadas en PRs, sistemas RAG. 97.5% menos costo en tokens gracias a caching inteligente' },
      { name: 'OpenAI API (GPT-4)', description: 'Análisis multiperspectiva en orquestación multimodelo y validación cruzada entre modelos' },
      { name: 'Google Gemini API', description: 'Tercera perspectiva en pipelines de orquestación multimodelo' },
      { name: 'LangChain / LangGraph', description: 'Frameworks de agentes para loops Think→Act→Observe y flujos autónomos' },
      { name: 'Transformers.js', description: 'Modelos de IA en el navegador vía WASM/WebGPU — sentimiento, resúmenes, clasificación de imágenes. Costo de API cero' },
      { name: 'Groq', description: 'Inferencia de LLM ultrarrápida para endpoints de chat en tiempo real' },
      { name: 'Ollama', description: 'Runtime de LLM local para desarrollo y pruebas sin conexión' },
    ],
  },
  {
    title: 'Lenguajes y runtimes',
    items: [
      { name: 'TypeScript 5.9', description: 'Lenguaje principal — modo strict en todos los proyectos nuevos' },
      { name: 'Node.js 22', description: 'Runtime de backend que impulsa más de 13 microservicios en producción' },
      { name: 'Deno 2.7', description: 'Edge functions y runtime de Supabase' },
      { name: 'Python 3.14', description: 'Herramientas de ML, scripting y procesamiento de datos' },
      { name: 'Shell / Bash', description: 'Herramientas CLI, scripts de automatización, claude-statusline (render en <50ms)' },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'Astro 6', description: 'Framework actual — arquitectura de islas, JS mínimo, static-first' },
      { name: 'React 19', description: 'Componentes interactivos como islas de Astro, server components' },
      { name: 'Tailwind CSS 4', description: 'Estilos utility-first con integración del plugin de Vite' },
      { name: 'Framer Motion 12', description: 'Animaciones al hacer scroll, microinteracciones, patrones whileInView' },
      { name: 'Next.js 16', description: 'App Router para aplicaciones React complejas' },
      { name: 'Vue.js', description: 'Dashboards heredados y apps de business intelligence' },
      { name: 'Angular 17 SSR', description: 'Aplicaciones empresariales renderizadas en el servidor (plataforma Engagement)' },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'NestJS', description: 'Framework empresarial de Node.js — servicios multi-tenant en 6 países de LATAM' },
      { name: 'Express', description: 'APIs ligeras y microservicios independientes' },
      { name: 'GraphQL (Apollo)', description: 'Grafos de datos complejos para plataformas multi-tenant' },
      { name: 'Supabase', description: 'PostgreSQL administrado + Auth + Realtime + Edge Functions' },
    ],
  },
  {
    title: 'Bases de datos',
    items: [
      { name: 'PostgreSQL', description: 'Base de datos principal con Row-Level Security para aislar datos multi-tenant' },
      { name: 'MongoDB', description: 'Almacén de documentos para servicios heredados y esquemas flexibles' },
      { name: 'MySQL', description: 'Base de datos relacional para sistemas de alta transaccionalidad' },
      { name: 'Redis', description: 'Capa de caché, rate limiting y manejo de sesiones' },
    ],
  },
  {
    title: 'Cloud y DevOps',
    items: [
      { name: 'Vercel', description: 'Despliegue principal — preview deploys, analytics, edge functions, WAF' },
      { name: 'AWS', description: 'Lambda, S3, CloudFront para la infraestructura de producción' },
      { name: 'Google Cloud', description: 'Servicios en la nube e integraciones de API' },
      { name: 'OrbStack', description: 'Alternativa rápida a Docker para desarrollo en contenedores en macOS' },
      { name: 'GitHub Actions', description: 'Pipelines de CI/CD para pruebas automatizadas y despliegue multiambiente' },
    ],
  },
  {
    title: 'Pruebas y calidad',
    items: [
      { name: 'Playwright', description: 'Pruebas E2E organizadas por módulos de funcionalidad en varios navegadores' },
      { name: 'Vitest', description: 'Pruebas unitarias y de integración con configuración TypeScript-first' },
      { name: 'AI Code Review', description: 'Agentes multi-LLM personalizados que detectan XSS, IDOR, bypass de auth y problemas de CORS' },
    ],
  },
  {
    title: 'Terminal y editor',
    items: [
      { name: 'Ghostty', description: 'Terminal acelerada por GPU — DankMono Nerd Font, tema Vesper, paneles divididos' },
      { name: 'Zed', description: 'Editor principal — rápido, basado en Rust, con temas y atajos personalizados' },
      { name: 'Neovim', description: 'Edición en terminal con configuración personalizada para ediciones rápidas' },
      { name: 'tmux', description: 'Multiplexor de terminal para sesiones persistentes y flujos con agentes' },
      { name: 'Zsh + Zim', description: 'Framework de shell con autosugerencias asíncronas y resaltado de sintaxis' },
    ],
  },
  {
    title: 'Productividad en CLI',
    items: [
      { name: 'lazygit', description: 'Interfaz de terminal para git — staging visual, rebase y resolución de conflictos' },
      { name: 'delta', description: 'Diffs con resaltado de sintaxis y modo lado a lado' },
      { name: 'fzf', description: 'Buscador fuzzy para archivos, historial y cambio de ramas' },
      { name: 'ripgrep (rg)', description: 'Búsqueda de código ultrarrápida en bases de código grandes' },
      { name: 'fd', description: 'Reemplazo moderno de find con valores por defecto sensatos' },
      { name: 'eza', description: 'ls moderno con integración de git y vista de árbol' },
      { name: 'bat', description: 'cat con resaltado de sintaxis e integración de git diff' },
      { name: 'hyperfine', description: 'Benchmarking en CLI para probar el rendimiento de scripts y herramientas' },
    ],
  },
  {
    title: 'Flujo y metodología',
    items: [
      { name: 'Spec-Driven Development (SDD)', description: 'Metodología estructurada: explore → propose → spec → design → tasks → apply → verify' },
      { name: 'bd (beads)', description: 'Sistema de issue tracking — todo el trabajo se registra con bd, no con herramientas externas' },
      { name: 'Engram', description: 'Memoria de IA persistente entre sesiones — decisiones, patrones, arquitectura' },
      { name: 'MCP Servers', description: 'Integraciones personalizadas de Model Context Protocol para JIRA, Google Workspace y Playwright' },
      { name: 'Conventional Commits', description: 'Historial de git estructurado: feat:, fix:, refactor:, docs:, chore:' },
    ],
  },
  {
    title: 'Apps y utilidades',
    items: [
      { name: 'Raycast', description: 'Paleta de comandos que reemplaza a Spotlight — snippets, gestión de ventanas, scripts' },
      { name: 'Bruno', description: 'Cliente de API open-source — alternativa a Postman con colecciones amigables con git' },
      { name: 'Fork', description: 'Cliente Git visual para operaciones complejas de merge/rebase' },
      { name: 'Obsidian', description: 'Base de conocimiento con integración MCP para Claude Code' },
      { name: 'MongoDB Compass', description: 'Explorador visual de bases de datos para depurar MongoDB' },
    ],
  },
];

export const usesCategories: Record<Lang, UsesCategory[]> = { en, es };
