import type { Project } from "@/types";

export const featuredProjects: Project[] = [
  {
    slug: "agentes-hub",
    title: "Agentes Hub",
    description:
      "Multi-agent system that automates PR code reviews with security-focused analysis. Supports Claude, OpenAI, and Gemini with 97.5% token savings through intelligent caching.",
    longDescription: `
      <p>A production <strong>multi-agent orchestration system</strong> that automates code review workflows. Each agent specializes in a specific analysis domain:</p>
      <ul>
        <li><strong>Security Agent</strong> — Detects vulnerabilities, injection risks, and OWASP top 10 issues</li>
        <li><strong>Performance Agent</strong> — Identifies bottlenecks, N+1 queries, and memory leaks</li>
        <li><strong>Quality Agent</strong> — Enforces code standards, DRY principles, and naming conventions</li>
        <li><strong>Architecture Agent</strong> — Reviews patterns, coupling, and separation of concerns</li>
      </ul>
      <p>The system uses <strong>intelligent caching</strong> to reduce API token consumption by <strong>97.5%</strong> while maintaining review quality. Agents execute in parallel with a conflict resolution layer that merges overlapping findings.</p>
      <p>Built as an internal tool at Apprecio, now handles <strong>100% of PR reviews</strong> across 13+ microservices for a 5-engineer team with zero false positive escalations in production.</p>
    `,
    features: [
      "97.5% token savings through intelligent caching",
      "Multi-model support: Claude, OpenAI, Gemini",
      "Security-focused code analysis pipeline",
      "Configurable review templates per repository",
      "Parallel agent execution with conflict resolution",
    ],
    technologies: ["TypeScript", "LangChain", "Claude API", "Node.js"],
    year: 2025,
    madeAt: "Personal",
    githubUrl: "https://github.com/cmorenogit/agentes-hub",
    liveUrl: null,
    image: null,
    status: "active",
  },
  {
    slug: "contextforge",
    title: "ContextForge",
    description:
      "MCP server in Rust for persistent semantic memory — AI coding assistants that remember decisions, understand codebases, and recover context across sessions.",
    longDescription: `
      <p>AI coding assistants forget everything between sessions. ContextForge fixes this with an <strong>MCP server</strong> that provides persistent semantic memory — hybrid search combining keyword matching and vector embeddings, automatic codebase analysis, and intelligent context recovery.</p>
      <ul>
        <li><strong>Hybrid search</strong> — FTS5 keywords + vector embeddings find context by meaning, not just words</li>
        <li><strong>Code intelligence</strong> — tree-sitter parses structure, exports, and dependencies across 50+ languages</li>
        <li><strong>Git-aware</strong> — extracts architectural decisions from conventional commits automatically</li>
        <li><strong>Zero config</strong> — single binary, brew install, works offline</li>
      </ul>
      <p>Built in <strong>Rust</strong> with libSQL for storage and local embeddings via candle — no external APIs required.</p>
    `,
    features: [
      "Hybrid semantic + keyword search (FTS5 + vector embeddings)",
      "Automatic codebase analysis with tree-sitter (50+ languages)",
      "Git commit parsing for architectural decision extraction",
      "MCP native — plugs into Claude Code, Cursor, Copilot",
      "Single Rust binary, ~4-8MB, zero external dependencies",
    ],
    technologies: ["Rust", "MCP Protocol", "libSQL", "Vector Search", "tree-sitter"],
    year: 2026,
    madeAt: "Personal",
    githubUrl: "https://github.com/cmorenogit/contextforge",
    liveUrl: null,
    image: "/images/contextforge.jpg",
    status: "wip",
  },
  {
    slug: "claude-statusline",
    title: "Claude Statusline",
    description:
      "Rich two-line statusline for Claude Code CLI. Shows context usage, API rate limits with visual bars, git branch, session duration, and lines changed. Published on npm, optimized with batched JSON parsing for <50ms render.",
    longDescription: `
      <p>A <strong>real-time statusline</strong> for Claude Code CLI that provides at-a-glance visibility into your coding session. Designed for developers who live in the terminal.</p>
      <p>What it shows:</p>
      <ul>
        <li><strong>Context window</strong> — Visual bar showing how much of Claude's context is consumed</li>
        <li><strong>API rate limits</strong> — Color-coded bars (green → yellow → red) for remaining requests</li>
        <li><strong>Git state</strong> — Current branch, lines added/removed, uncommitted changes</li>
        <li><strong>Session metrics</strong> — Duration, tool calls, and cost estimate</li>
      </ul>
      <p>Built with <strong>performance as a first-class concern</strong> — batched JSON parsing ensures renders complete in <strong>under 50ms</strong> even with complex git repositories. Published on npm as <code>@cmorenogit/claude-statusline</code>.</p>
    `,
    features: [
      "Real-time context window usage visualization",
      "API rate limit bars with color-coded thresholds",
      "Git branch, lines changed, and session duration",
      "Batched JSON parsing for <50ms render time",
      "Published on npm as @cmorenogit/claude-statusline",
    ],
    technologies: ["Bash", "Shell", "Node.js", "npm"],
    year: 2025,
    madeAt: "Personal",
    githubUrl: "https://github.com/cmorenogit/claude-statusline",
    liveUrl: "https://www.npmjs.com/package/@cmorenogit/claude-statusline",
    image: null,
    status: "active",
  },
  {
    slug: "apprecio-rewards",
    title: "Apprecio Rewards Platform",
    description:
      "Multi-tenant rewards platform serving 500K+ users across 6 LATAM countries. 13+ microservices, 25% performance improvement, and 40% faster delivery through AI-powered automation.",
    longDescription: `
      <p>Enterprise-grade <strong>multi-tenant rewards and recognition platform</strong> deployed across 6 Latin American countries. The backbone of employee engagement programs for major corporations in the region.</p>
      <p>Architecture highlights:</p>
      <ul>
        <li><strong>13+ microservices</strong> — Loyalty, gamification, rewards catalog, notifications, analytics</li>
        <li><strong>Multi-tenant</strong> — Per-country customization with shared core infrastructure</li>
        <li><strong>500K+ active users</strong> — Handling peak loads during reward campaigns</li>
        <li><strong>AI automation</strong> — Automated code reviews, testing, and deployment pipelines</li>
      </ul>
      <p>Led performance optimization that achieved <strong>25% improvement</strong> in API response times and <strong>40% faster feature delivery</strong> through AI-powered development workflows including automated PR reviews and intelligent test generation.</p>
    `,
    features: [
      "500K+ active users across 6 LATAM countries",
      "13+ microservices architecture",
      "25% performance improvement in response times",
      "40% faster feature delivery with AI automation",
      "Multi-tenant with per-country customization",
    ],
    technologies: ["TypeScript", "NestJS", "React", "PostgreSQL", "AWS"],
    year: 2024,
    madeAt: "Apprecio",
    githubUrl: null,
    liveUrl: null,
    image: null,
    status: "active",
  },
];
