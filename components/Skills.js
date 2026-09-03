import { skillCategories } from "@/data/skills";
import ScrollReveal from "./ScrollReveal";

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="section-inner">
        <ScrollReveal>
          <p className="section-eyebrow">// 02 — skills.json</p>
          <h2 className="section-title">Tools I reach for.</h2>
        </ScrollReveal>

        <ScrollReveal className="skills__groups">
          {skillCategories.map((category) => (
            <div className="skills__group" key={category.title}>
              <h3 className="skills__group-title">{category.title}</h3>
              <div className="skills__pills">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={`pill ${skill.primary ? "pill--accent" : ""}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
