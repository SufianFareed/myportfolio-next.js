import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/site";

export default function ProjectCard({ project }) {
  const hasLiveUrl = Boolean(project.liveUrl);
  const hasGithubUrl = Boolean(project.githubUrl);

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
        {project.badge && (
          <span className="project-card__badge">{project.badge}</span>
        )}
      </div>
      <div className="project-card__body">
        <h3 className="project-card__title">
          {hasLiveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tags">
          {project.technologies.map((tech) => (
            <span className="tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>
        <div className="project-card__links">
          {hasLiveUrl && (
            <a
              href={project.liveUrl}
              className="mini-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </a>
          )}
          {hasGithubUrl && (
            <a
              href={project.githubUrl}
              className="mini-btn mini-btn--ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {!hasLiveUrl && (
            <a
              href={getWhatsAppUrl(
                `Hi Sufian, I saw your ${project.title} project and would like something similar.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mini-btn"
            >
              Need something similar?
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
