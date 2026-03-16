import type { APIRoute } from "astro";
import { experiences } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { archiveProjects } from "@/data/archive";

export const prerender = false;

// --- MCP Server Info ---
const SERVER_INFO = {
  name: "cesarmoreno-portfolio",
  version: "1.0.0",
};

const PROTOCOL_VERSION = "2024-11-05";

// --- Tool Definitions (MCP spec format) ---
const TOOLS = [
  {
    name: "get_about",
    description: "Get Cesar Moreno's professional bio, role, highlights, and contact links",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "get_experience",
    description: "Get Cesar Moreno's work experience timeline with roles, companies, and technologies",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "get_projects",
    description: "Get featured and archived projects with descriptions, tech stack, and links",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "get_tech_stack",
    description: "Get technology expertise organized by category (languages, frontend, backend, AI, cloud, etc.)",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
];

// --- Tool Handlers ---
function handleToolCall(name: string): string {
  switch (name) {
    case "get_about":
      return JSON.stringify({
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
      });

    case "get_experience":
      return JSON.stringify(
        experiences.map((e) => ({
          period: e.period,
          title: e.title,
          company: e.company,
          location: e.location,
          description: e.description,
          technologies: e.technologies,
        }))
      );

    case "get_projects":
      return JSON.stringify({
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
      });

    case "get_tech_stack":
      return JSON.stringify({
        languages: ["TypeScript", "JavaScript", "Node.js", "Deno", "PHP", "Shell/Bash"],
        frontend: ["React 18/19", "Astro", "Next.js", "Vue.js", "Angular", "Vite", "Tailwind CSS"],
        backend: ["NestJS", "Express", "Hono", "Laravel", "GraphQL (Apollo)"],
        databases: ["PostgreSQL", "Supabase", "MongoDB", "MySQL", "Redis"],
        ai_ml: ["Claude API", "OpenAI API", "Google Gemini API", "LangChain", "Transformers.js", "Groq"],
        cloud: ["AWS", "Vercel", "Supabase Cloud", "Docker", "GitHub Actions"],
        testing: ["Playwright", "Vitest", "Jest"],
        dev_tools: ["Claude Code", "Git", "ESLint", "MCP Servers"],
      });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// --- JSON-RPC helpers ---
function jsonRpcResponse(id: number | string, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id: number | string | null, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

// --- MCP method router ---
function handleMethod(method: string, params: Record<string, unknown> | undefined, id: number | string) {
  switch (method) {
    case "initialize":
      return jsonRpcResponse(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {},
        },
        serverInfo: SERVER_INFO,
      });

    case "notifications/initialized":
      return null; // notification, no response

    case "ping":
      return jsonRpcResponse(id, {});

    case "tools/list":
      return jsonRpcResponse(id, { tools: TOOLS });

    case "tools/call": {
      const toolName = params?.name as string;
      if (!toolName || !TOOLS.some((t) => t.name === toolName)) {
        return jsonRpcError(id, -32602, `Unknown tool: ${toolName}`);
      }
      try {
        const text = handleToolCall(toolName);
        return jsonRpcResponse(id, {
          content: [{ type: "text", text }],
        });
      } catch (err) {
        return jsonRpcError(id, -32603, `Tool execution failed: ${(err as Error).message}`);
      }
    }

    default:
      return jsonRpcError(id, -32601, `Method not found: ${method}`);
  }
}

// --- CORS headers ---
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id",
};

// --- HTTP handlers ---

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Handle batched requests
    if (Array.isArray(body)) {
      const responses = body
        .map((msg: { method: string; params?: Record<string, unknown>; id?: number | string }) =>
          handleMethod(msg.method, msg.params, msg.id ?? 0)
        )
        .filter(Boolean);

      if (responses.length === 0) {
        return new Response(null, { status: 202, headers: CORS_HEADERS });
      }

      return new Response(JSON.stringify(responses), {
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Single message
    const { method, params, id } = body;

    // Notifications have no id — accept without response
    if (id === undefined || id === null) {
      handleMethod(method, params, 0);
      return new Response(null, { status: 202, headers: CORS_HEADERS });
    }

    const response = handleMethod(method, params, id);

    if (!response) {
      return new Response(null, { status: 202, headers: CORS_HEADERS });
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch {
    return new Response(
      JSON.stringify(jsonRpcError(null, -32700, "Parse error")),
      { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }
};

export const GET: APIRoute = () => {
  // Stateless server — no SSE stream support needed for portfolio
  return new Response(null, { status: 405, headers: CORS_HEADERS });
};

export const DELETE: APIRoute = () => {
  // No session management needed
  return new Response(null, { status: 405, headers: CORS_HEADERS });
};

export const OPTIONS: APIRoute = () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
