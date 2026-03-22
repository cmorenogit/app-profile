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
      <p>Built as an internal tool at Apprecio, now handles <strong>100% of PR reviews</strong> across 13+ microservices with zero false positive escalations in production.</p>
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
    slug: "prompt-hub",
    title: "Prompt Hub",
    description:
      "Centralized prompt management with versioning and performance tracking. Reduced prompt drift by 80% across teams and AI workflows.",
    longDescription: `
      <p>A centralized platform for <strong>managing, versioning, and tracking AI prompts</strong> across teams. Provides a structured workflow for prompt development with full audit trail.</p>
      <p>Key capabilities:</p>
      <ul>
        <li><strong>Version control</strong> — Full diff tracking between prompt versions with rollback support</li>
        <li><strong>A/B testing</strong> — Compare prompt variants with automated quality scoring</li>
        <li><strong>Performance metrics</strong> — Track token usage, response quality, and latency per version</li>
        <li><strong>Team collaboration</strong> — Approval workflows prevent untested prompts from reaching production</li>
      </ul>
      <p>Eliminated prompt drift issues that caused <strong>inconsistent AI outputs</strong> across different team members, achieving an <strong>80% reduction</strong> in prompt-related incidents.</p>
    `,
    features: [
      "Version control for prompts with diff tracking",
      "Performance metrics per prompt version",
      "Team collaboration with approval workflows",
      "80% reduction in prompt drift across teams",
    ],
    technologies: ["TypeScript", "Next.js", "PostgreSQL"],
    year: 2025,
    madeAt: "Personal",
    githubUrl: "https://github.com/cmorenogit/prompt-hub",
    liveUrl: null,
    image: null,
    status: "active",
  },
  {
    slug: "prism",
    title: "Prism",
    description:
      "CLI tool that orchestrates structured debates between Claude, OpenAI, and Gemini. Six analysis modes produce bias-reduced insights through multi-perspective synthesis.",
    longDescription: `
      <p>A CLI tool that enables <strong>structured multi-model debates</strong> for complex decision-making. By orchestrating conversations between different LLMs, Prism produces bias-reduced analysis through adversarial and collaborative reasoning.</p>
      <p>Six analysis modes:</p>
      <ul>
        <li><strong>Debate</strong> — Models argue opposing positions, moderator synthesizes</li>
        <li><strong>Consensus</strong> — Iterative rounds until models converge on agreement</li>
        <li><strong>Adversarial</strong> — Each model actively challenges others' assumptions</li>
        <li><strong>Brainstorm</strong> — Free-form ideation with cross-pollination between models</li>
        <li><strong>Critique</strong> — One model proposes, others systematically tear it apart</li>
        <li><strong>Synthesis</strong> — Models build on each other's outputs progressively</li>
      </ul>
      <p>Each mode produces structured output with <strong>confidence scores</strong> and reasoning chains, enabling transparent decision-making for complex technical and strategic questions.</p>
    `,
    features: [
      "Six analysis modes: debate, consensus, adversarial, brainstorm, critique, synthesis",
      "Cross-model bias reduction through multi-perspective synthesis",
      "Structured output with confidence scores",
      "Configurable debate rounds and model selection",
    ],
    technologies: ["TypeScript", "Shell", "Multiple LLM APIs"],
    year: 2025,
    madeAt: "Personal",
    githubUrl: "https://github.com/cmorenogit/prism",
    liveUrl: null,
    image: null,
    status: "active",
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
