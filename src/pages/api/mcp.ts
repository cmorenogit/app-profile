import type { APIRoute } from "astro";
import { experiences } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { archiveProjects } from "@/data/archive";

export const prerender = false;

const ABOUT = {
  name: "Cesar Moreno",
  title: "Full Stack Engineer · AI",
  tagline: "I build AI systems that think, act, and scale",
  location: "LATAM (remote)",
  summary:
    "Full Stack Engineer specializing in AI with 13+ years of production experience. Builds intelligent systems that automate complex workflows — from multi-model AI agent orchestration to scalable multi-tenant platforms.",
  highlights: [
    "40% faster product delivery through AI-powered workflow automation",
    "25% microservice performance improvement across 13+ services",
    "97.5% token cost reduction in AI agent systems through intelligent caching",
    "Multi-tenant platform serving 6 countries with full data isolation",
  ],
  links: {
    portfolio: "https://cesarmoreno.dev",
    github: "https://github.com/cmorenogit",
    linkedin: "https://linkedin.com/in/morenodev",
    playground: "https://cesarmoreno.dev/playground",
  },
};

const TECH_STACK = {
  languages: ["TypeScript", "JavaScript", "Node.js", "Deno", "PHP", "Shell/Bash"],
  frontend: ["React 18/19", "Astro", "Next.js", "Vue.js", "Angular", "Vite", "Tailwind CSS"],
  backend: ["NestJS", "Express", "Hono", "Laravel", "GraphQL (Apollo)"],
  databases: ["PostgreSQL", "Supabase", "MongoDB", "MySQL", "Redis"],
  ai_ml: ["Claude API", "OpenAI API", "Google Gemini API", "LangChain", "Transformers.js", "Groq"],
  cloud: ["AWS", "Vercel", "Supabase Cloud", "Docker", "GitHub Actions"],
  testing: ["Playwright", "Vitest", "Jest"],
  dev_tools: ["Claude Code", "Git", "ESLint", "MCP Servers"],
};

type ToolName = "get_about" | "get_experience" | "get_projects" | "get_tech_stack";

const toolHandlers: Record<ToolName, () => unknown> = {
  get_about: () => ABOUT,
  get_experience: () =>
    experiences.map((e) => ({
      period: e.period,
      title: e.title,
      company: e.company,
      location: e.location,
      description: e.description,
      technologies: e.technologies,
    })),
  get_projects: () => ({
    featured: featuredProjects.map((p) => ({
      title: p.title,
      description: p.description,
      technologies: p.technologies,
      github: p.githubUrl,
      live: p.liveUrl,
    })),
    archive: archiveProjects.map((p) => ({
      year: p.year,
      title: p.title,
      madeAt: p.madeAt,
      technologies: p.technologies,
    })),
  }),
  get_tech_stack: () => TECH_STACK,
};

const VALID_TOOLS = Object.keys(toolHandlers) as ToolName[];

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      name: "Cesar Moreno Portfolio MCP",
      version: "1.0.0",
      description: "Query Cesar Moreno's professional portfolio data",
      tools: VALID_TOOLS.map((name) => ({ name, description: getToolDescription(name) })),
    }),
    { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const body = await request.json();
    const toolName = body?.tool as string;

    if (!toolName || !VALID_TOOLS.includes(toolName as ToolName)) {
      return new Response(
        JSON.stringify({
          error: "Invalid tool",
          available_tools: VALID_TOOLS,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const result = toolHandlers[toolName as ToolName]();

    return new Response(
      JSON.stringify({ tool: toolName, result }),
      { headers: corsHeaders }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: corsHeaders }
    );
  }
};

export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

function getToolDescription(name: ToolName): string {
  const descriptions: Record<ToolName, string> = {
    get_about: "Get Cesar Moreno's professional bio, role, and background",
    get_experience: "Get Cesar Moreno's work experience timeline",
    get_projects: "Get featured and archived projects with descriptions and tech stack",
    get_tech_stack: "Get technology expertise organized by category",
  };
  return descriptions[name];
}
