import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const CardWrapper = project.liveUrl ? "a" : "div";
  const wrapperProps = project.liveUrl
    ? {
        href: project.liveUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
    >
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-navy-light/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />

      <div className="z-10 sm:order-2 sm:col-span-6">
        <h3 className="font-medium leading-snug text-slate-lightest">
          <span className="inline-flex items-baseline text-base font-medium leading-tight text-white group-hover:text-accent focus-visible:text-accent">
            {project.title}
            {project.liveUrl && (
              <ExternalLink className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1" />
            )}
          </span>
        </h3>
        <p className="mt-2 text-sm leading-normal text-slate-light">
          {project.description}
        </p>
        <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
          {project.technologies.map((tech) => (
            <li key={tech} className="mr-1.5 mt-2">
              <div className="flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium leading-5 text-accent">
                {tech}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="z-10 flex items-center justify-center sm:order-1 sm:col-span-2">
        <Image
          src={project.image || "/images/placeholder-project.svg"}
          alt={project.title}
          width={120}
          height={90}
          className="rounded border-2 border-navy-lightest/10 transition group-hover:border-navy-lightest/30"
        />
      </div>
    </CardWrapper>
  );
}
