import { SpotlightCursor } from "@/components/SpotlightCursor";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SpotlightCursor />
      <main className="mx-auto max-w-4xl px-6 md:px-12 lg:px-24">
        <Header />
        <About />
        <Experience />
        <Projects />
        <Footer />
      </main>
    </>
  );
}
