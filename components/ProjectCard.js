import Image from "next/image";

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card__image">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          width={800}
          height={450}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tags">
          {project.technologies.map((tech) => (
            <span className="tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>
        <div className="project-card__links">
          <a
            href={project.liveUrl || "#"}
            className="mini-btn"
            target={project.liveUrl ? "_blank" : undefined}
            rel={project.liveUrl ? "noopener noreferrer" : undefined}
          >
            Live Demo
          </a>
          <a
            href={project.githubUrl || "#"}
            className="mini-btn mini-btn--ghost"
            target={project.githubUrl ? "_blank" : undefined}
            rel={project.githubUrl ? "noopener noreferrer" : undefined}
          >
            GitHub
          </a>
        </div>
      </div>
    </article>
  );
}
