"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { featuredProjects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  return (
    <motion.section
      id="projects"
      className="py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-10 flex items-center text-2xl font-bold text-white dark:text-white">
        <span className="mr-2 font-mono text-xl text-accent">03.</span>
        Featured Projects
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/archive"
          className="inline-block font-mono text-sm text-accent transition-colors hover:underline"
        >
          View Full Project Archive →
        </Link>
      </div>
    </motion.section>
  );
}
