import { experiences } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { archiveProjects } from "@/data/archive";

export function getPortfolioContext(): string {
  const experienceText = experiences
    .map(
      (e) =>
        `${e.title} at ${e.company} (${e.period}, ${e.location}): ${e.description} Technologies: ${e.technologies.join(", ")}.`
    )
    .join("\n\n");

  const projectsText = featuredProjects
    .map(
      (p) =>
        `${p.title}: ${p.description} Technologies: ${p.technologies.join(", ")}.${p.githubUrl ? ` GitHub: ${p.githubUrl}` : ""}`
    )
    .join("\n\n");

  const archiveText = archiveProjects
    .map(
      (p) =>
        `${p.title} (${p.year}, ${p.madeAt || "Personal"}): ${p.technologies.join(", ")}.`
    )
    .join("\n");

  return `# Cesar Moreno — Full Stack Engineer · AI

## Professional Summary
Full Stack Engineer specializing in AI with 13+ years of production experience. Builds intelligent systems that automate complex workflows — from multi-model AI agent orchestration to scalable multi-tenant platforms. TypeScript-first, AI-native approach with a track record of shipping to production across multiple countries.

## Core Expertise Areas

### AI & Intelligent Systems
- Multi-model LLM orchestration: designs systems that coordinate Claude, GPT-4, and Gemini for different tasks
- AI Agent architecture: implements Think→Act→Observe loops for autonomous code review, analysis, and decision-making
- Prompt engineering: systematic approach to prompt design with versioning, performance tracking, and drift prevention
- Token optimization: achieved 97.5% cost reduction through intelligent caching and change detection
- RAG systems: embeddings, vector search, and context-augmented generation
- Multi-perspective AI: built debate systems where multiple AI models challenge each other to reduce bias

### Backend Engineering
- API design: RESTful and GraphQL APIs with Node.js, NestJS, Express
- Microservices: designed, maintained, and optimized 13+ independent services
- Database architecture: PostgreSQL with Row-Level Security (RLS), MongoDB, MySQL
- Multi-tenant systems: platform architecture serving multiple countries with data isolation
- Real-time systems: WebSocket, Supabase Realtime, Socket.io for live updates
- Performance optimization: 25% improvement across microservice fleet through profiling and architectural changes
- Queue systems and event-driven architecture

### Frontend Engineering
- React ecosystem: React 18/19, Next.js 14-16, Vite, server components
- Component libraries: shadcn/ui, Radix UI for accessible, consistent UI systems
- State management: data-driven architecture, no unnecessary global state
- Responsive design: mobile-first approach with Tailwind CSS
- Animation and interaction: Framer Motion, CSS animations, IntersectionObserver patterns
- SSR/SSG: server-side rendering, static site generation, hybrid rendering strategies

### DevOps & Infrastructure
- Cloud platforms: AWS (Lambda, S3, CloudFront), Vercel, Supabase Cloud
- CI/CD: GitHub Actions pipelines for automated testing and deployment
- Containerization: Docker for development and deployment consistency
- Monitoring: Sentry for error tracking, Vercel Analytics for performance
- Edge computing: Vercel Edge Functions, serverless architecture

### Testing & Quality
- E2E testing: Playwright test suites organized by feature modules
- Unit testing: Vitest, Jest for component and logic testing
- Automated code review: AI agents that detect XSS, auth bypass, IDOR, CORS issues
- SQL review: automated migration analysis for multi-tenancy and security compliance

### Development Methodology
- TypeScript strict mode in all new projects
- Conventional commits and structured PR workflows
- Spec-Driven Development (SDD) for complex features
- Data-driven architecture: typed arrays, no unnecessary abstractions
- Code review automation with multi-LLM analysis

## Technical Skills by Category

### Languages & Runtimes
TypeScript (primary), JavaScript, Node.js, Deno, PHP, Shell/Bash

### Frontend Frameworks
React 18/19, Next.js 14-16, Vue.js, Angular, Astro, Vite

### Backend Frameworks
NestJS, Express, Hono, Laravel, GraphQL (Apollo)

### Databases
PostgreSQL, Supabase, MongoDB, MySQL, Redis

### AI & ML Tools
Claude API (Anthropic), OpenAI API, Google Gemini API, LangChain, Transformers.js, Groq

### Cloud & Deploy
AWS, Vercel, Supabase Cloud, Docker, GitHub Actions

### UI Libraries
Tailwind CSS, shadcn/ui, Radix UI, Framer Motion, D3.js

### Testing
Playwright, Vitest, Jest

### Developer Tools
Claude Code, Git, ESLint, Husky, MCP Servers

## Key Achievements (Quantified)
- 40% faster product delivery through AI-powered workflow automation
- 25% microservice performance improvement across 13+ services
- 97.5% token cost reduction in AI agent systems through intelligent caching
- Multi-tenant platform serving 6 countries with full data isolation
- Automated PR code review system detecting security vulnerabilities (XSS, IDOR, auth bypass)
- Multi-AI debate system producing bias-reduced analysis through 6-phase structured process

## Experience
${experienceText}

## Featured Projects (Open Source)
${projectsText}

## Project Portfolio
${archiveText}

## Architecture Patterns Used
- Microservices with independent deployment
- Event-driven architecture with message queues
- Multi-tenant with Row-Level Security (RLS)
- Islands architecture (Astro) for optimal JS delivery
- Think→Act→Observe loops for AI agents
- Factory pattern for multi-LLM provider abstraction
- Data-driven rendering with typed static arrays

## Professional Interests
- AI agent systems and autonomous workflows
- Developer tooling and productivity
- Multi-model AI orchestration and bias reduction
- Open source developer tools
- Full-stack product development

## Contact & Links
- GitHub: https://github.com/cmorenogit
- LinkedIn: https://linkedin.com/in/morenodev
- Website: https://cesarmoreno.dev
- Location: LATAM (remote)`;
}
