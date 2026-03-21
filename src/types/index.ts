export interface Experience {
  period: string;
  title: string;
  company: string;
  companyUrl: string | null;
  location: string;
  description: string;
  technologies: string[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string; // supports HTML for rich formatting
  features?: string[];
  technologies: string[];
  year: number;
  madeAt: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  image: string | null;
  screenshots?: string[];
  demoComponent?: string;
  status?: "active" | "archived" | "wip";
}

export interface ArchiveProject {
  year: number;
  title: string;
  slug?: string;
  description?: string;
  madeAt: string | null;
  technologies: string[];
  url: string | null;
}

export interface ArchiveProject {
  year: number;
  title: string;
  madeAt: string | null;
  technologies: string[];
  url: string | null;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: "github" | "linkedin" | "mail";
}
