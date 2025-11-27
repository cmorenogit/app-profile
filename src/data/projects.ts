import { Project } from "@/types";

export const featuredProjects: Project[] = [
  {
    title: "agentes-hub",
    description:
      "Hub of AI agents for task automation. Includes agents for code analysis, PR review, and development process optimization.",
    technologies: ["TypeScript", "LangChain", "Claude API", "Node.js"],
    githubUrl: "https://github.com/cmorenogit/agentes-hub",
    liveUrl: null,
    image: null,
  },
  {
    title: "prompt-hub",
    description:
      "Collection and management system for optimized prompts. Organized by use case with versioning and performance tracking.",
    technologies: ["TypeScript", "Next.js", "PostgreSQL"],
    githubUrl: "https://github.com/cmorenogit/prompt-hub",
    liveUrl: null,
    image: null,
  },
  {
    title: "prism",
    description:
      "Multi-AI model debate system. Leverages Claude, GPT, and Gemini to generate improved analyses through structured debates.",
    technologies: ["TypeScript", "Shell", "Multiple LLM APIs"],
    githubUrl: "https://github.com/cmorenogit/prism",
    liveUrl: null,
    image: null,
  },
  {
    title: "Apprecio Rewards Platform",
    description:
      "Unified rewards platform integrating loyalty, campaigns, analytics, and business workflows. Deployed across multiple LATAM countries.",
    technologies: ["TypeScript", "NestJS", "React", "PostgreSQL", "AWS"],
    githubUrl: null,
    liveUrl: null,
    image: null,
  },
];
