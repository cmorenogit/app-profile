"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/experience";
import { ExperienceItem } from "./ExperienceItem";

export function Experience() {
  return (
    <motion.section
      id="experience"
      className="py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-10 flex items-center text-2xl font-bold text-white dark:text-white">
        <span className="mr-2 font-mono text-xl text-accent">02.</span>
        Where I&apos;ve Worked
      </h2>
      <div className="group/list">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ExperienceItem experience={exp} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
