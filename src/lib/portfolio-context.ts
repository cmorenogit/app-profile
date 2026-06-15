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

  return `# Cesar Moreno — Principal Engineer · AI Systems & Product

## Positioning
Builds AI products with product judgment — not AI that just looks impressive. Most engineers can use AI; few know *which* product to build with it. He questions the requirement with real usage data, builds the scope that actually matters, and ships in weeks, not months. Signature: the right scope for each project's stage, designed to grow.

## Freelance availability (IMPORTANT — answer carefully)
He takes on a LIMITED number of freelance AI-product projects in parallel to his current Principal Engineer role — selective, hands-on engagements: AI features, AI products end to end, and work with agencies that need a real AI specialist. He is NOT looking for full-time employment and is NOT "open to work" — frame availability as selective freelance, never as job-seeking. Best fit: someone building something with AI, or who wants to. To start a conversation: hello@cesarmoreno.dev.

## Languages
Spanish (native), English (professional — daily use with international teams).

## Location & Timezone
Lima, Peru — UTC-5. Overlaps US Eastern business hours. Works remotely with US, LATAM and European teams and clients.

## Summary
Principal Engineer · AI Systems & Product, 13 years shipping production systems. Currently the technical reference for a multi-tenant rewards platform serving 500K+ users across 6 LATAM countries. Builds AI tooling (multi-agent code review, MCP servers, LLM orchestration) and ships client products end to end. His evolution: from writing software to building with product judgment, using AI to deliver in a fraction of the time.

## Leadership & Philosophy
Principal Engineer and cross-team technical reference (product, core, support). Led 5 engineers; integrates AI across the product cycle (from scope decision to delivery), sustaining ~40% faster delivery. Mentors engineers; remote/async since 2020. Ships production-ready, right-sized scope from day one.

## Expertise
AI (product-focused): turning AI into features that move the business — agents, LLM orchestration (Claude, OpenAI, Gemini), RAG, semantic memory, prompt engineering, 97.5% token cost reduction.
Systems: Rust, MCP servers, libSQL, tree-sitter, vector + FTS5 search.
Backend: Node.js, NestJS, GraphQL, 13+ microservices, PostgreSQL (RLS), MongoDB, multi-tenant, real-time.
Frontend: React 18/19, Next.js, Astro, Tailwind.
DevOps: AWS, Vercel, Docker, GitHub Actions. Testing: Playwright, Vitest.

## Selected client work
Ubero (uberoproducts.com): a custom mini-CMS so the client manages their own product catalog — zero maintenance cost to start, designed to scale. From design to production in a single week.
Also: unblocked a stalled SaaS B2B migration by analyzing real production usage — migrated most clients immediately instead of waiting months for a module only one client actually used.

## Achievements
97.5% token cost reduction (intelligent caching), ~40% faster delivery (AI automation), 25% microservice performance improvement, 500K+ users multi-tenant platform (6 LATAM countries), automated multi-agent PR review, MCP server in Rust (ContextForge).

## Experience
${experienceText}

## Featured Projects
${projectsText}

## Other Projects
${archiveText}

## Contact
Email: hello@cesarmoreno.dev | GitHub: github.com/cmorenogit | LinkedIn: linkedin.com/in/morenodev | Web: cesarmoreno.dev

## Q&A
Available? He takes on a limited number of freelance AI-product projects in parallel — selective and hands-on. Not seeking full-time employment.
What does he do? Builds AI products with product judgment, end to end — and ships fast.
English? Yes — Spanish native + English professional (daily international use).
Timezone? Lima, Peru (UTC-5), overlaps US Eastern business hours.
Lead teams? Yes — Principal Engineer and cross-team technical reference; led 5 engineers; mentors.
Freelance? Yes — selective AI-product projects in parallel to his current role. To start: hello@cesarmoreno.dev.`;
}
