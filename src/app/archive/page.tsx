import Link from "next/link";
import type { Metadata } from "next";
import { SpotlightCursor } from "@/components/SpotlightCursor";
import { ArchiveTable } from "@/components/ArchiveTable";

export const metadata: Metadata = {
  title: "Archive | Cesar Moreno",
  description: "A comprehensive list of projects I've worked on.",
};

export default function ArchivePage() {
  return (
    <>
      <SpotlightCursor />
      <main className="mx-auto max-w-5xl px-6 py-24 md:px-12 lg:px-24">
        <Link
          href="/"
          className="mb-4 inline-block font-mono text-sm text-accent transition-colors hover:underline"
        >
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          All Projects
        </h1>
        <p className="mt-4 text-lg text-slate-light">
          A comprehensive list of projects I&apos;ve worked on
        </p>

        <div className="mt-12 overflow-x-auto">
          <ArchiveTable />
        </div>
      </main>
    </>
  );
}
