"use client";

import { Navigation } from "./Navigation";
import { SocialLinks } from "./SocialLinks";

export function Sidebar() {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          <a href="/">Cesar Moreno</a>
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-white sm:text-xl">
          Senior Full Stack Engineer
        </h2>
        <p className="mt-4 max-w-xs leading-relaxed text-slate-light">
          I build AI agents that automate complex workflows and create
          intelligent systems with TypeScript.
        </p>

        <div className="mt-16">
          <Navigation />
        </div>
      </div>

      <div className="mt-8 lg:mt-0">
        <SocialLinks />
      </div>
    </header>
  );
}
