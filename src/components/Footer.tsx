import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-6 py-16">
      <SocialLinks />
      <div className="text-center font-mono text-xs text-slate">
        <p>Built with Next.js & Tailwind CSS</p>
        <p className="mt-1">© 2025 Cesar Moreno</p>
      </div>
    </footer>
  );
}
