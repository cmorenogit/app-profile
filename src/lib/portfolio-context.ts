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

## About
Engineer who builds systems that replace manual workflows with intelligent automation. Over 13 years of experience, from real-time reservation platforms to orchestrating multi-AI agent systems that review code, optimize tokens, and debate architectural decisions across Claude, GPT, and Gemini.

At Apprecio, leads automation initiatives across the product team — building AI agents that cut delivery time by 40% and optimizing microservice performance by 25%. Works across the full stack: React frontends, NestJS backends, PostgreSQL with row-level security, and Supabase for real-time multi-tenant platforms deployed across 6 LATAM countries.

Outside work, builds developer tools: Prism orchestrates structured debates between 3 AI models. Agentes Hub automates PR reviews with security-focused code analysis. Philosophy: software should think for you, not just execute instructions.

Stack: TypeScript-first, AI-native, production-tested.

## Key Metrics
- 13+ years of experience
- 6 LATAM countries served
- 40% faster product delivery
- 25% microservice performance improvement
- 97.5% token cost reduction in AI agents

## Experience
${experienceText}

## Featured Projects
${projectsText}

## All Projects
${archiveText}

## Technical Skills
TypeScript, Node.js, React, Next.js, NestJS, Express, PostgreSQL, MongoDB, MySQL, Supabase, AWS, Vercel, Claude API, OpenAI, Gemini, LangChain, GraphQL, Angular, Playwright, Tailwind CSS, Docker.

## Location
Based in LATAM, working remotely.

## Links
- GitHub: https://github.com/cmorenogit
- LinkedIn: https://linkedin.com/in/morenodev
- Website: https://cesarmoreno.dev`;
}
