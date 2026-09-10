import { skillGroups } from "@/data/skills";
import ScrollReveal from "./ScrollReveal";

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="section-inner">
        <ScrollReveal>
          <p className="section-eyebrow">{"// skills"}</p>
          <h2 className="section-title">Tools I reach for.</h2>
        </ScrollReveal>

        <ScrollReveal className="skills__groups">
          {skillGroups.map((group) => (
            <div className="skills__group" key={group.title}>
              <h3 className="skills__group-title">{group.title}</h3>
              <div className="skills__pills">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`pill ${group.highlight ? "pill--accent" : ""}`}
                  >
                    {skill}
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
