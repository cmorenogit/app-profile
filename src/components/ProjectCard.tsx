import { ExternalLink, Github } from "lucide-react";
import { Project } from "@/types";
import { TechTag } from "./TechTag";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative flex flex-col rounded-lg bg-navy-light p-6 transition-all duration-250 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className="flex items-center gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate transition-colors hover:text-accent"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate transition-colors hover:text-accent"
              aria-label="Live Demo"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-accent">
        {project.title}
      </h3>
      <p className="mb-4 flex-grow text-sm text-slate-light">
        {project.description}
      </p>

      <div className="mt-auto flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs text-slate"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
