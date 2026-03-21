import { featuredProjects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectsSection() {
  return (
    <div className="group/list flex flex-col gap-4">
      {featuredProjects.map((project) => (
        <div key={project.slug} className="fade-in-item">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
