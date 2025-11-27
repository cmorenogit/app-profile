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
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  image: string | null;
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
