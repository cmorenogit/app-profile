import { experiences } from "@/data/experience";
import { ExperienceItem } from "./ExperienceItem";

export function Experience() {
  return (
    <section id="experience" className="py-24">
      <h2 className="mb-10 flex items-center text-2xl font-bold text-white">
        <span className="mr-2 font-mono text-xl text-accent">02.</span>
        Where I&apos;ve Worked
      </h2>
      <div className="group/list">
        {experiences.map((exp, index) => (
          <ExperienceItem key={index} experience={exp} />
        ))}
      </div>
    </section>
  );
}
