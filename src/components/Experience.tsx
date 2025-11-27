"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/experience";
import { ExperienceItem } from "./ExperienceItem";

export function Experience() {
  return (
    <motion.section
      id="experience"
      className="mb-24 scroll-mt-24 lg:mb-36 lg:scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
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
