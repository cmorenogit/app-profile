export function Footer() {
  return (
    <footer className="pb-16 pt-8 text-sm text-slate">
      <p>
        Built with{" "}
        <a
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-light hover:text-accent"
        >
          Next.js
        </a>{" "}
        and{" "}
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-light hover:text-accent"
        >
          Tailwind CSS
        </a>
        , deployed with{" "}
        <a
          href="https://vercel.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-light hover:text-accent"
        >
          Vercel
        </a>
        .
      </p>
    </footer>
  );
}
