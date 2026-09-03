"use client";

import { useMemo, useState } from "react";
import { projects, projectCategories } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="work" id="work">
      <div className="section-inner">
        <div>
          <p className="section-eyebrow">// 03 — work.tsx</p>
          <h2 className="section-title">Selected work.</h2>
        </div>

        <div className="work__filters" role="tablist" aria-label="Filter projects by technology">
          {projectCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.id}
              className={`filter-btn ${
                activeCategory === category.id ? "is-active" : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="work__grid">
            {filteredProjects.map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
          </div>
        ) : (
          <p className="work__empty">
            No projects in this category yet — check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
