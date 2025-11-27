import { ExternalLink } from "lucide-react";
import { archiveProjects } from "@/data/archive";

export function ArchiveTable() {
  return (
    <table className="w-full border-collapse text-left">
      <thead className="sticky top-0 z-10 border-b border-navy-lightest bg-navy px-6 py-5">
        <tr>
          <th className="py-4 pr-8 text-sm font-semibold text-slate">Year</th>
          <th className="py-4 pr-8 text-sm font-semibold text-slate">
            Project
          </th>
          <th className="hidden py-4 pr-8 text-sm font-semibold text-slate lg:table-cell">
            Made at
          </th>
          <th className="hidden py-4 pr-8 text-sm font-semibold text-slate sm:table-cell">
            Built with
          </th>
          <th className="py-4 text-sm font-semibold text-slate">Link</th>
        </tr>
      </thead>
      <tbody>
        {archiveProjects.map((project, index) => (
          <tr
            key={index}
            className="border-b border-navy-lightest/50 transition-colors hover:bg-navy-light/50"
          >
            <td className="py-4 pr-8 font-mono text-sm text-slate">
              {project.year}
            </td>
            <td className="py-4 pr-8 font-medium text-white">
              {project.title}
            </td>
            <td className="hidden py-4 pr-8 text-sm text-slate lg:table-cell">
              {project.madeAt || "—"}
            </td>
            <td className="hidden py-4 pr-8 text-sm text-slate sm:table-cell">
              {project.technologies.join(" · ")}
            </td>
            <td className="py-4">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate transition-colors hover:text-accent"
                  aria-label={`View ${project.title}`}
                >
                  <ExternalLink size={18} />
                </a>
              ) : (
                <span className="text-navy-lightest">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
