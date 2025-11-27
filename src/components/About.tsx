"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <motion.section
      id="about"
      className="mb-24 scroll-mt-24 lg:mb-36 lg:scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4 text-slate-light">
        <p>
          I&apos;m a developer passionate about building intelligent systems
          that blend robust engineering with cutting-edge{" "}
          <span className="font-medium text-white">AI</span>. With over 13 years
          of experience, I specialize in creating{" "}
          <span className="font-medium text-white">autonomous agents</span>, smart
          workflows, and tools that optimize development processes.
        </p>
        <p>
          Currently, I&apos;m a Senior Full Stack Developer at{" "}
          <a
            href="https://apprecio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white hover:text-accent"
          >
            Apprecio
          </a>
          , where I develop automation solutions with AI agents as part of the
          product team. I work with{" "}
          <span className="font-medium text-white">LLMs</span> to create contextual workflows,
          orchestrating automated tasks and complex API integrations.
        </p>
        <p>
          In the past, I&apos;ve built high-performance platforms across
          multiple LATAM countries, led complex projects in multi-tenant
          ecosystems, and integrated systems including dashboards, loyalty
          programs, campaigns, analytics, and business workflows.
        </p>
        <p>
          My approach combines deep technical expertise in{" "}
          <span className="font-medium text-white">TypeScript</span>,
          microservices, and cloud architecture with a product mindset focused
          on delivering real impact.
        </p>
      </div>
    </motion.section>
  );
}
