import type { ArchiveProject } from "@/types";
import { featuredProjects } from "./projects";

const archiveOnlyProjects: ArchiveProject[] = [
  {
    year: 2025,
    title: "Prism",
    description:
      "CLI tool for structured multi-model debates between Claude, OpenAI, and Gemini with six analysis modes.",
    madeAt: "Personal",
    technologies: ["TypeScript", "Shell", "Multiple LLM APIs"],
    url: "https://github.com/cmorenogit/prism",
  },
  {
    year: 2025,
    title: "Prompt Hub",
    description:
      "Centralized prompt management with versioning and performance tracking for AI workflows.",
    madeAt: "Personal",
    technologies: ["TypeScript", "Next.js", "PostgreSQL"],
    url: "https://github.com/cmorenogit/prompt-hub",
  },
  {
    year: 2024,
    title: "AI Code Analysis Agent",
    description:
      "Internal tool for automated code quality analysis using LLMs. Detects anti-patterns, security risks, and suggests refactoring opportunities.",
    madeAt: "Apprecio",
    technologies: ["TypeScript", "LangChain", "Claude"],
    url: null,
  },
  {
    year: 2023,
    title: "Campaign Visualization System",
    description:
      "Real-time dashboard for visualizing rewards campaign performance across multiple countries with interactive charts and drill-down analytics.",
    madeAt: "Apprecio",
    technologies: ["React", "D3.js", "PostgreSQL"],
    url: null,
  },
  {
    year: 2023,
    title: "Multi-tenant Engagement Tracker",
    description:
      "Backend service for tracking employee engagement metrics across tenants with configurable KPIs and automated reporting.",
    madeAt: "Apprecio",
    technologies: ["NestJS", "PostgreSQL", "Redis"],
    url: null,
  },
  {
    year: 2022,
    title: "Gift Card Redemption System",
    description:
      "End-to-end gift card management with catalog, redemption flow, and payment integration via Stripe.",
    madeAt: "Apprecio",
    technologies: ["Node.js", "React", "Stripe"],
    url: null,
  },
  {
    year: 2021,
    title: "Loyalty Module",
    description:
      "Core loyalty engine handling points accrual, tiers, and redemption rules for the multi-tenant rewards platform.",
    madeAt: "Apprecio",
    technologies: ["TypeScript", "NestJS", "PostgreSQL"],
    url: null,
  },
  {
    year: 2020,
    title: "Customer Management System",
    description:
      "CRM platform for managing B2B client relationships, contracts, and service level tracking.",
    madeAt: "Ae Online Solutions",
    technologies: ["Node.js", "React", "MongoDB"],
    url: null,
  },
  {
    year: 2019,
    title: "Business Intelligence Dashboard",
    description:
      "Interactive BI dashboard with custom visualizations, automated data pipelines, and scheduled reporting.",
    madeAt: "Ae Online Solutions",
    technologies: ["Vue.js", "D3.js", "Python"],
    url: null,
  },
  {
    year: 2018,
    title: "RESTful API Platform",
    description:
      "Centralized API gateway with authentication, rate limiting, and documentation generation.",
    madeAt: "Ae Online Solutions",
    technologies: ["Node.js", "Express", "MySQL"],
    url: null,
  },
  {
    year: 2016,
    title: "Real-time Reservation System",
    description:
      "Mobile-first reservation platform with real-time availability updates via WebSocket connections.",
    madeAt: "OPER",
    technologies: ["Angular", "Ionic", "Socket.io"],
    url: null,
  },
];

// Featured projects auto-converted to archive format (single source of truth)
const featuredAsArchive: ArchiveProject[] = featuredProjects.map((p) => ({
  year: p.year,
  title: p.title,
  slug: p.slug,
  description: p.description,
  madeAt: p.madeAt,
  technologies: p.technologies,
  url: p.githubUrl || p.liveUrl,
}));

// Merge and sort by year (newest first)
export const archiveProjects: ArchiveProject[] = [
  ...featuredAsArchive,
  ...archiveOnlyProjects,
].sort((a, b) => b.year - a.year);
