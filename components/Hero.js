import ScrollReveal from "./ScrollReveal";
import TypedStatus from "./TypedStatus";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="section-inner hero__grid">
        <ScrollReveal className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__ping"></span>Available for freelance
            work
          </p>
          <h1 className="hero__title">
            Hi, I&apos;m <span className="grad-text">Sufian Fareed</span>
          </h1>
          <p className="hero__subtitle">
            WordPress, Shopify &amp; Next.js Developer
          </p>
          <p className="hero__lede">
            I design and build fast, reliable websites and web apps — custom
            WordPress and Elementor builds, Shopify storefronts, and modern
            Next.js applications — with the right tool picked for what the
            project actually needs.
          </p>
          <div className="hero__actions">
            <a href="#work" className="btn btn--primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn--ghost">
              Let&apos;s Work Together
            </a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">6+</span>
              <span className="hero__stat-label">shipped products</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">3</span>
              <span className="hero__stat-label">core specialties</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">PK</span>
              <span className="hero__stat-label">based, remote-friendly</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="hero__visual">
          <div className="terminal">
            <div className="terminal__bar">
              <span className="terminal__dot terminal__dot--red"></span>
              <span className="terminal__dot terminal__dot--yellow"></span>
              <span className="terminal__dot terminal__dot--green"></span>
              <span className="terminal__title">developer.ts</span>
            </div>
            <div className="terminal__body">
              <pre>
                <code>
                  <span className="tk-key">const</span>{" "}
                  <span className="tk-var">developer</span> = {"{"}
                  {"\n"}  <span className="tk-prop">name</span>:{" "}
                  <span className="tk-str">&quot;Sufian Fareed&quot;</span>,
                  {"\n"}  <span className="tk-prop">focus</span>: [
                  <span className="tk-str">&quot;WordPress&quot;</span>,{" "}
                  <span className="tk-str">&quot;Shopify&quot;</span>,{" "}
                  <span className="tk-str">&quot;Next.js&quot;</span>],
                  {"\n"}  <span className="tk-prop">basedIn</span>:{" "}
                  <span className="tk-str">&quot;Pakistan&quot;</span>,
                  {"\n"}  <span className="tk-prop">status</span>:{" "}
                  <TypedStatus />
                  {"\n"}
                  {"}"};
                </code>
              </pre>
            </div>
          </div>
          <div className="orbit-badge orbit-badge--1">🧩 WordPress</div>
          <div className="orbit-badge orbit-badge--2">🛍️ Shopify</div>
          <div className="orbit-badge orbit-badge--3">▲ Next.js</div>
        </ScrollReveal>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to About">
        <span></span>
      </a>
    </section>
  );
}
