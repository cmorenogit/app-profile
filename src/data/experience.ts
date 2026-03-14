import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    period: "2020 — Present",
    title: "Full Stack Engineer · AI",
    company: "Apprecio",
    companyUrl: "https://apprecio.com",
    location: "Santiago, Chile (Remote)",
    description:
      "Lead AI agent development and full-stack automation across a multi-tenant rewards platform serving 6 LATAM countries. Built code review agents with multi-LLM orchestration (Claude, GPT-4, Gemini), achieving 97.5% token cost reduction through intelligent caching. Drove 40% faster product delivery by automating QA workflows and PR analysis. Optimized microservice performance by 25% across 13+ services spanning Node.js, NestJS, GraphQL, and Angular.",
    technologies: [
      "TypeScript",
      "Node.js",
      "NestJS",
      "React",
      "PostgreSQL",
      "AWS",
      "LangChain",
      "Claude API",
    ],
  },
  {
    period: "2016 — 2020",
    title: "Full Stack Developer",
    company: "Ae Online Solutions",
    companyUrl: null,
    location: "Lima, Peru",
    description:
      "Led development and integration of a customer management system for discovering valuable business opportunities and data analysis. Built RESTful APIs with Node.js and PHP, integrated SQL and MongoDB databases, developed frontends with React and Vue.js.",
    technologies: [
      "JavaScript",
      "Node.js",
      "PHP",
      "Laravel",
      "React",
      "Vue.js",
      "MongoDB",
      "MySQL",
    ],
  },
  {
    period: "2016",
    title: "Full Stack Developer",
    company: "Publicidad y Sistemas OPER",
    companyUrl: null,
    location: "Lima, Peru",
    description:
      "Developed real-time reservation management system for web and mobile platforms. Built user interfaces with Angular and Ionic, backend services with Laravel and Node.js, real-time features with Socket.io.",
    technologies: [
      "Angular",
      "Ionic",
      "Laravel",
      "Node.js",
      "Socket.io",
      "JavaScript",
    ],
  },
];
