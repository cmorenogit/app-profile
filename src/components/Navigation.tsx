import { useEffect, useState } from "react";

const navItems = [
  { id: "approach", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "built", label: "Built with AI" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Navigation() {
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
      let current = navItems[0].id;
      for (const { id } of navItems) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }

      // En el fondo absoluto, la última sección (Contact) no tiene runway
      // para cruzar el offset — márcala explícitamente.
      if (scrollY + windowHeight >= documentHeight - 4) {
        current = navItems[navItems.length - 1].id;
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
