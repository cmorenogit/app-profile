"use client";

import { FileDown } from "lucide-react";

export function Header() {
  return (
    <header className="flex min-h-screen flex-col justify-center py-24">
      <p className="mb-4 font-mono text-accent">Hi, my name is</p>
      <h1 className="text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
        Cesar Moreno.
      </h1>
      <h2 className="mt-4 text-3xl font-bold text-slate sm:text-4xl lg:text-5xl">
        I build things for the web.
      </h2>
      <p className="mt-6 max-w-xl text-lg text-slate-light">
        Senior Full Stack Engineer specializing in AI Agents & Automation.
        Currently at{" "}
        <a
          href="https://apprecio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Apprecio
        </a>
        , building intelligent systems with TypeScript and modern cloud
        architectures.
      </p>
      <div className="mt-12">
        <button
          className="group inline-flex items-center gap-2 rounded border border-accent px-6 py-3 font-mono text-sm text-accent transition-all duration-250 hover:bg-accent/10"
          onClick={() => alert("CV coming soon!")}
        >
          <FileDown size={18} />
          Download CV
        </button>
      </div>
    </header>
  );
}
