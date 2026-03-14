import type { Project } from "@/types";

export const featuredProjects: Project[] = [
  {
    title: "Agentes Hub",
    description:
      "Multi-agent system that automates PR code reviews with security-focused analysis. Supports Claude, GPT-4, and Gemini with 97.5% token savings through intelligent caching.",
    technologies: ["TypeScript", "LangChain", "Claude API", "Node.js"],
    githubUrl: "https://github.com/cmorenogit/agentes-hub",
    liveUrl: null,
    image: null,
  },
  {
    title: "Prompt Hub",
    description:
      "Centralized prompt management with versioning and performance tracking. Built to eliminate prompt drift across teams and AI workflows.",
    technologies: ["TypeScript", "Next.js", "PostgreSQL"],
    githubUrl: "https://github.com/cmorenogit/prompt-hub",
    liveUrl: null,
    image: null,
  },
  {
    title: "Prism",
    description:
      "CLI tool that orchestrates structured debates between Claude, GPT, and Gemini. Six analysis modes produce bias-reduced insights through multi-perspective synthesis.",
    technologies: ["TypeScript", "Shell", "Multiple LLM APIs"],
    githubUrl: "https://github.com/cmorenogit/prism",
    liveUrl: null,
    image: null,
  },
  {
    title: "Apprecio Rewards Platform",
    description:
      "Multi-tenant rewards platform serving 6 LATAM countries. Integrates loyalty programs, campaigns, and business analytics with real-time data processing.",
    technologies: ["TypeScript", "NestJS", "React", "PostgreSQL", "AWS"],
    githubUrl: null,
    liveUrl: null,
    image: null,
  },
];
