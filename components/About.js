import { siteConfig } from "@/lib/site";
import ScrollReveal from "./ScrollReveal";

export default function About() {
  return (
    <section className="about" id="about">
      <div className="section-inner about__grid">
        <ScrollReveal>
          <p className="section-eyebrow">{"// about"}</p>
          <h2 className="section-title">
            Building websites that hold up in production.
          </h2>
        </ScrollReveal>

        <ScrollReveal className="about__content">
          <p>
            I&apos;m a full-stack web developer based in Pakistan with{" "}
            {siteConfig.yearsExperience} years of experience, working with
            clients here and internationally. My focus sits in three areas:
            WordPress development, Shopify development, and Next.js or
            custom web development, whichever fits the project best.
          </p>
          <p>
            I also work with React, Node.js, Nest.js, Angular.js, PHP, and
            other CMS platforms when a project calls for it, but WordPress,
            Shopify, and Next.js are where most of my recent work has been.
            I handle projects end to end, from the first conversation about
            requirements through build, testing, and launch.
          </p>
          <p>
            Alongside client work, I document builds and workflows for
            other developers on YouTube and social media, because explaining
            something clearly is a good way to understand it better yourself.
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
                Pakistan — working with clients locally and internationally
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
