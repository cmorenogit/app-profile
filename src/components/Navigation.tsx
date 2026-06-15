import { useEffect, useState } from "react";

interface NavLabels {
  approach: string;
  work: string;
  built: string;
  experience: string;
  contact: string;
}

const defaultLabels: NavLabels = {
  approach: "Approach",
  work: "Work",
  built: "Built with AI",
  experience: "Experience",
  contact: "Contact",
};

// Section ids are language-independent — the scroll-spy never depends on labels.
const SECTION_IDS = ["approach", "work", "built", "experience", "contact"] as const;

export function Navigation({ labels = defaultLabels }: { labels?: NavLabels }) {
  const navItems = [
    { id: "approach", label: labels.approach },
    { id: "work", label: labels.work },
    { id: "built", label: labels.built },
    { id: "experience", label: labels.experience },
    { id: "contact", label: labels.contact },
  ];

  const [activeSection, setActiveSection] = useState("approach");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // La sección activa es la ÚLTIMA cuyo top ya cruzó el punto de
      // referencia (~35% del viewport). El offset es amplio a propósito:
      // las secciones finales (Experience, Contact) tienen poco "runway" de
      // scroll, así que con un offset chico nunca alcanzarían el top y no se
      // marcarían. Esto las marca de forma robusta sin importar su tamaño.
      const offset = Math.round(windowHeight * 0.35);
      let current: string = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }

      // En el fondo absoluto, la última sección (Contact) no tiene runway
      // para cruzar el offset — márcala explícitamente.
      if (scrollY + windowHeight >= documentHeight - 4) {
        current = SECTION_IDS[SECTION_IDS.length - 1];
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="hidden lg:block">
      <ul className="flex flex-col gap-4">
        {navItems.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => handleClick(id)}
              className={`group flex items-center gap-4 text-xs font-bold uppercase tracking-widest transition-all ${
                activeSection === id
                  ? "text-white"
                  : "text-slate hover:text-white"
              }`}
            >
              <span
                className={`h-px transition-all ${
                  activeSection === id
                    ? "w-16 bg-white"
                    : "w-8 bg-slate group-hover:w-16 group-hover:bg-white"
                }`}
              />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
