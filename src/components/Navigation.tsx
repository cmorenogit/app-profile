"use client";

import { useEffect, useState } from "react";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Si estamos al final de la página, seleccionar "projects"
      if (scrollY + windowHeight >= documentHeight - 100) {
        setActiveSection("projects");
        return;
      }

      // Si estamos cerca del top, seleccionar "about"
      if (scrollY < 100) {
        setActiveSection("about");
        return;
      }

      // Encontrar la sección activa basándose en qué sección está más visible
      const sections = navItems.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return { id, visible: 0 };
        const rect = el.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(windowHeight, rect.bottom);
        const visible = Math.max(0, visibleBottom - visibleTop);
        return { id, visible };
      });

      const mostVisible = sections.reduce((prev, curr) =>
        curr.visible > prev.visible ? curr : prev
      );

      if (mostVisible.visible > 0) {
        setActiveSection(mostVisible.id);
      }
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
