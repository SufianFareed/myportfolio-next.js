"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { id: "hero", label: "Home", href: "/#hero" },
  { id: "about", label: "About", href: "/#about" },
  { id: "skills", label: "Skills", href: "/#skills" },
  { id: "work", label: "Work", href: "/#work" },
  { id: "experience", label: "Experience", href: "/#experience" },
  { id: "services", label: "Services", href: "/#services" },
  { id: "process", label: "Process", href: "/#process" },
  { id: "blog", label: "Blog", href: "/blog", route: true },
  { id: "tools", label: "Tools", href: "/tools", route: true },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeId, setActiveId] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const sections = NAV_ITEMS.filter((item) => !item.route)
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  const isItemActive = (item) => {
    if (item.route) return pathname === item.href || pathname.startsWith(`${item.href}/`);
    return isHome && activeId === item.id;
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Close the mobile menu on navigation, on Escape, and when the screen
  // grows past the mobile breakpoint.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setIsMenuOpen(false);
    const onResize = () => window.innerWidth > 1080 && setIsMenuOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [isMenuOpen]);

  return (
    <header className="tabbar" id="tabbar">
      <div className="tabbar__inner">
        <Link href="/#hero" className="tabbar__logo">
          <span className="tabbar__logo-bracket">&lt;</span>SF
          <span className="tabbar__logo-bracket">/&gt;</span>
        </Link>

        <nav className="tabbar__tabs">
          {NAV_ITEMS.map((item) => (
            <Link key={item.id} href={item.href} className={`tab ${isItemActive(item) ? "is-active" : ""}`}>
              <span className="tab__dot"></span>
              {item.label}
            </Link>
          ))}
        </nav>

        <ThemeToggle />
        <Link href="/#contact" className="tabbar__cta">Let&apos;s talk</Link>

        <button
          type="button"
          className={`tabbar__burger ${isMenuOpen ? "is-open" : ""}`}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <nav id="mobile-menu" className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`} aria-label="Mobile">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`mobile-menu__link ${isItemActive(item) ? "is-active" : ""}`}
            onClick={closeMenu}
            tabIndex={isMenuOpen ? 0 : -1}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/#contact" className="mobile-menu__cta" onClick={closeMenu} tabIndex={isMenuOpen ? 0 : -1}>
          Let&apos;s talk
        </Link>
      </nav>
    </header>
  );
}
