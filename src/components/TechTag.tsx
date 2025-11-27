interface TechTagProps {
  tech: string;
}

export function TechTag({ tech }: TechTagProps) {
  return (
    <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
      {tech}
    </span>
  );
}
