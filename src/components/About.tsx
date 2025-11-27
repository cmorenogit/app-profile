"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <motion.section
      id="about"
      className="py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-10 flex items-center text-2xl font-bold text-white dark:text-white">
        <span className="mr-2 font-mono text-xl text-accent">01.</span>
        About Me
      </h2>
      <div className="max-w-2xl space-y-4 text-slate-light">
        <p>
          I&apos;m a developer passionate about building intelligent systems
          that blend robust engineering with cutting-edge AI. With over 13 years
          of experience, I specialize in creating autonomous agents, smart
          workflows, and tools that optimize development processes.
        </p>
        <p>
          Currently, I&apos;m a Senior Full Stack Developer at{" "}
          <a
            href="https://apprecio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Apprecio
          </a>
          , where I develop automation solutions with AI agents as part of the
          product team. I work with LLMs to create contextual workflows,
          orchestrating automated tasks and complex API integrations.
        </p>
        <p>
          In the past, I&apos;ve built high-performance platforms across
          multiple LATAM countries, led complex projects in multi-tenant
          ecosystems, and integrated systems including dashboards, loyalty
          programs, campaigns, analytics, and business workflows.
        </p>
        <p>
          My approach combines deep technical expertise in TypeScript,
          microservices, and cloud architecture with a product mindset focused
          on delivering real impact.
        </p>
      </div>
    </motion.section>
  );
}
