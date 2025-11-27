import { Github, Linkedin, Mail } from "lucide-react";
import { socialLinks } from "@/data/social";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export function SocialLinks() {
  return (
    <div className="flex items-center gap-6">
      {socialLinks.map((link) => {
        const Icon = iconMap[link.icon];
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate transition-colors duration-250 hover:text-accent"
            aria-label={link.name}
          >
            <Icon size={24} />
          </a>
        );
      })}
    </div>
  );
}
