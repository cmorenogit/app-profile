import { useState } from "react";
import type { Project } from "@/types";
import { ExternalLink, Github, ChevronDown } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      role="link"
      tabIndex={0}
      className="group relative cursor-pointer rounded-xl border border-transparent p-4 transition-all duration-300 lg:hover:!opacity-100 lg:group-hover/list:opacity-50 lg:hover:bg-navy-light/50 lg:hover:border-accent/8 lg:hover:shadow-[0_0_20px_rgba(100,255,218,0.03)]"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        window.location.href = `/projects/${project.slug}`;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !(e.target as HTMLElement).closest("a, button")) {
          window.location.href = `/projects/${project.slug}`;
        }
      }}
    >
      <div>
        <h3 className="flex items-center gap-2 font-medium leading-snug text-slate-lightest">
          <a
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-base font-medium leading-tight text-white group-hover:text-accent transition-colors"
          >
            {project.title}
            <span className="inline-block h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">→</span>
          </a>
          {project.status === "wip" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/8 border border-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-[pulse-dot_2s_ease-in-out_infinite]" />
              WIP
            </span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto p-1 rounded text-slate hover:text-accent transition-colors"
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </h3>
        <p className="mt-2 text-sm leading-normal text-slate-light">
          {project.description}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies used">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {tech}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          expanded ? "mt-4 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-accent/8 pt-4">
          {project.features && project.features.length > 0 && (
            <ul className="mb-4 space-y-1.5">
              {project.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-light"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/15 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/15 hover:border-accent/30 transition-all"
              >
                <Github size={14} />
                Source Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/15 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/15 hover:border-accent/30 transition-all"
              >
                <ExternalLink size={14} />
                Live
              </a>
            )}
            <a
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/15 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/15 hover:border-accent/30 transition-all"
            >
              View Full Project
              <span className="hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
