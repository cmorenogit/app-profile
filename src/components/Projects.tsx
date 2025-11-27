import Link from "next/link";
import { featuredProjects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  return (
    <section id="projects" className="py-24">
      <h2 className="mb-10 flex items-center text-2xl font-bold text-white">
        <span className="mr-2 font-mono text-xl text-accent">03.</span>
        Featured Projects
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={index} project={project} />
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
    </section>
  );
}
