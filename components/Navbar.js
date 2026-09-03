"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "hero", label: "hero.tsx" },
  { id: "about", label: "about.tsx" },
  { id: "skills", label: "skills.json" },
  { id: "work", label: "work.tsx" },
  { id: "experience", label: "log.md" },
  { id: "services", label: "services.ts" },
  { id: "contact", label: "contact.tsx" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter(Boolean);

    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="tabbar" id="tabbar">
      <div className="tabbar__inner">
        <a href="#hero" className="tabbar__logo">
          <span className="tabbar__logo-bracket">&lt;</span>SF
          <span className="tabbar__logo-bracket">/&gt;</span>
        </a>

        <nav className="tabbar__tabs">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`tab ${activeId === item.id ? "is-active" : ""}`}
            >
              <span className="tab__dot"></span>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="tabbar__cta">
          Let&apos;s talk
        </a>

        <button
          type="button"
          className={`tabbar__burger ${isMenuOpen ? "is-open" : ""}`}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="mobile-menu__link"
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
