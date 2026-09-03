import ScrollReveal from "./ScrollReveal";

export default function About() {
  return (
    <section className="about" id="about">
      <div className="section-inner about__grid">
        <ScrollReveal>
          <p className="section-eyebrow">{"// 01 — about"}</p>
          <h2 className="section-title">
            Building products that hold up in production.
          </h2>
        </ScrollReveal>

        <ScrollReveal className="about__content">
          <p>
            I&apos;m a full-stack web developer based in Pakistan, working
            with clients across the region to turn ideas into real, working
            products. My core focus sits in three areas: WordPress
            development, Shopify development, and modern Next.js / custom
            web development — whichever fits the project best.
          </p>
          <p>
            Alongside that, I work with React.js, Node.js, Nest.js,
            Angular.js, WooCommerce, Elementor, and PHP when a project calls
            for it. Recent work has ranged from education platforms and
            service-business websites to a full classifieds marketplace app
            with Android, iOS, and admin panel components.
          </p>
          <p>
            I also document a lot of this in public — breaking down builds
            and workflows for other developers on YouTube and social media,
            because the best way to get better at something is to explain it
            clearly.
          </p>

          <div className="about__whoami">
            <div className="terminal__bar terminal__bar--mini">
              <span className="terminal__dot terminal__dot--red"></span>
              <span className="terminal__dot terminal__dot--yellow"></span>
              <span className="terminal__dot terminal__dot--green"></span>
              <span className="terminal__title">~/about</span>
            </div>
            <div className="whoami__body">
              <p>
                <span className="prompt">$</span> whoami
              </p>
              <p className="whoami__out">
                WordPress &amp; Shopify developer · Next.js / custom web apps
              </p>
              <p>
                <span className="prompt">$</span> location
              </p>
              <p className="whoami__out">
                Pakistan — working with local &amp; regional clients
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
