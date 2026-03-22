import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    period: "2020 — Present",
    title: "Full Stack Engineer · AI",
    company: "Apprecio",
    companyUrl: "https://apprecio.com",
    location: "Santiago, Chile (Remote)",
    description:
      "Lead a cross-functional team of 5 engineers, driving AI agent development and full-stack automation across a multi-tenant rewards platform serving 500K+ users in 6 LATAM countries. Built code review agents with multi-LLM orchestration (Claude, OpenAI, Gemini), achieving 97.5% token cost reduction through intelligent caching. Mentor junior and mid-level developers on AI-native workflows. Drove 40% faster product delivery by automating QA workflows and PR analysis. Optimized microservice performance by 25% across 13+ services handling peak loads during reward campaigns.",
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
    title: "Senior Full Stack Developer",
    company: "Ae Online Solutions",
    companyUrl: null,
    location: "Lima, Peru",
    description:
      "Led a team of 3 developers building and integrating a customer management system for discovering valuable business opportunities and data analysis. Scaled the platform to handle 10K+ daily transactions with high availability. Built RESTful APIs with Node.js and PHP, integrated SQL and MongoDB databases, developed frontends with React and Vue.js.",
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
