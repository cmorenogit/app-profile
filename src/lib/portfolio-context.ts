import { experiences } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { archiveProjects } from "@/data/archive";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPortfolioContext(): string {
  const experienceText = experiences
    .map(
      (e) =>
        `${e.title} at ${e.company} (${e.period}, ${e.location}): ${e.description.slice(0, 120)}...`
    )
    .join("\n");

  const featuredTitles = new Set(featuredProjects.map((p) => p.title));

  const projectsText = featuredProjects
    .map(
      (p) =>
        `${p.title}: ${p.description} [${p.technologies.join(", ")}]`
    )
    .join("\n");

  const archiveText = archiveProjects
    .filter((p) => !featuredTitles.has(p.title))
    .map((p) => `${p.title} (${p.year}, ${p.madeAt || "Personal"})`)
    .join("; ");

  return `# Cesar Moreno — Full Stack · AI Engineer

## Availability
Open to opportunities: full-time, freelance, consulting. Remote preferred. Available now.

## Languages
Spanish (native), English (professional — daily use with international teams).

## Location & Timezone
Chile, UTC-3 (UTC-4 DST). US Eastern overlap 9am–1pm ET. Works with US, LATAM, European teams.

## Summary
Full Stack · AI Engineer, 13+ years. Builds AI developer tools and multi-agent systems in production — from orchestration platforms to semantic memory, TypeScript to Rust. Currently building ContextForge, an MCP server in Rust for persistent semantic memory for AI coding assistants.

## Leadership & Philosophy
Led 3-5 dev teams, mentors junior/mid engineers, cross-functional with product/design. Remote since 2020, async-first. Ships production-ready code from day one. TypeScript for product, Rust for systems, production-tested always.

## Expertise
AI: Multi-model LLM orchestration (Claude, OpenAI, Gemini), AI agents, MCP protocol, prompt engineering, 97.5% token cost reduction, RAG, semantic memory, vector embeddings.
Systems: Rust, MCP servers, libSQL, tree-sitter, semantic search (FTS5 + vector).
Backend: Node.js, NestJS, Express, GraphQL, 13+ microservices, PostgreSQL (RLS), MongoDB, multi-tenant (6 countries), real-time.
Frontend: React 18/19, Next.js, Astro, Tailwind, shadcn/ui.
DevOps: AWS, Vercel, Docker, GitHub Actions. Testing: Playwright, Vitest.

## Achievements
97.5% token cost reduction (intelligent caching), 40% faster delivery (AI automation), 25% microservice perf improvement, 500K+ users multi-tenant platform (6 countries), automated PR review (security), multi-AI debate system, MCP server in Rust (ContextForge — in development).

## Experience
${experienceText}

## Featured Projects
${projectsText}

## Other Projects
${archiveText}

## Contact
GitHub: github.com/cmorenogit | LinkedIn: linkedin.com/in/morenodev | Web: cesarmoreno.dev

## Q&A
Available? Yes, open to full-time/freelance/consulting, remote preferred.
English? Yes, Spanish native + English professional (daily international use).
Timezone? Chile UTC-3, overlaps US Eastern 9am-1pm ET.
Lead teams? Yes, led 3-5 devs, mentors engineers, cross-functional.
Freelance? Yes, available for freelance and consulting.`;
}
