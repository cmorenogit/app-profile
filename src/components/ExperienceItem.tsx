import { Experience } from "@/types";
import { TechTag } from "./TechTag";

interface ExperienceItemProps {
  experience: Experience;
}

export function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <div className="group relative grid gap-4 pb-8 transition-all sm:grid-cols-8 sm:gap-8 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition-all lg:block lg:group-hover:bg-navy-light/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)]" />

      <header className="z-10 text-xs font-semibold uppercase tracking-wide text-slate sm:col-span-2">
        {experience.period}
      </header>

      <div className="z-10 sm:col-span-6">
        <h3 className="font-medium leading-snug text-white">
          <span>{experience.title}</span>
          <span className="mx-2 text-slate">·</span>
          {experience.companyUrl ? (
            <a
              href={experience.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {experience.company}
            </a>
          ) : (
            <span className="text-accent">{experience.company}</span>
          )}
        </h3>
        <p className="mt-1 text-sm text-slate">{experience.location}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-light">
          {experience.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <TechTag key={tech} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}
