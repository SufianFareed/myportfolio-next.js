import { siteConfig } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="section-inner footer__inner">
        <a href="#hero" className="footer__logo">
          <span className="tabbar__logo-bracket">&lt;</span>Sufian Fareed
          <span className="tabbar__logo-bracket">/&gt;</span>
        </a>

        <div className="footer__socials">
          <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
        </div>

        <p className="footer__copy">
          © {year} Sufian Fareed. Built with care, line by line.
        </p>
      </div>
    </footer>
  );
}
