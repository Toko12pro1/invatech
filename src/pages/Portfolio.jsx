import React, { useEffect } from "react";
import { FaArrowRight, FaExternalLinkAlt, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { PORTFOLIO_PROJECTS, whatsappLink } from "../data/marketplace";

export default function Portfolio() {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <main>
      <PageHero
        image="/images/hero-services.jpg"
        eyebrow="Innovatech portfolio"
        title="Software and hardware built for real work"
        subtitle="Explore the platforms, prototypes and practical systems our team has designed, built and supported."
      />

      <section className="section">
        <div className="container">
          <div className="portfolio-intro">
            <div>
              <span className="eyebrow">Our work</span>
              <h2>From the first sketch to the product people use.</h2>
            </div>
            <p>We pair product thinking with hands-on engineering, so every project can move from an idea to something your team can actually rely on.</p>
          </div>
          <div className="portfolio-grid">
            {PORTFOLIO_PROJECTS.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.08} className={`portfolio-card portfolio-card--${index + 1}`}>
                <div className="portfolio-card-image">
                  <img src={project.image} alt="" loading="lazy" />
                  <span>{project.category}</span>
                </div>
                <div className="portfolio-card-body">
                  <div className="portfolio-tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="portfolio-card-footer">
                    <strong>{project.result}</strong>
                    {project.url.startsWith("http") ? (
                      <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><FaExternalLinkAlt /></a>
                    ) : (
                      <Link to={project.url} aria-label={`Discuss ${project.title}`}><FaArrowRight /></Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container split portfolio-offer">
          <Reveal className="split-content">
            <span className="eyebrow eyebrow--light">Have an idea?</span>
            <h2>We can take it from “what if?” to a working first version.</h2>
            <p>Tell us the problem, the people it affects and what success would look like. We will help you choose the right first step.</p>
            <div className="hero-actions">
              <a href={whatsappLink("Hi Innovatech, I have a software or hardware project idea to discuss.")} target="_blank" rel="noreferrer" className="btn btn--primary"><FaWhatsapp /> Start a conversation</a>
              <Link to="/services" className="btn btn--outline-light">See our services</Link>
            </div>
          </Reveal>
          <Reveal className="portfolio-offer-stat" delay={0.1}>
            <span className="portfolio-quote">“</span>
            <p>We build with the same care we bring to a device on the repair bench: understand the root problem, make it work, and stand behind it.</p>
            <span className="portfolio-quote-name">— Innovatech engineering team</span>
          </Reveal>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner-inner">
          <Reveal>
            <h2>Let’s build something useful.</h2>
            <p>Software, a connected device or a better way to run your business.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/contact" className="btn btn--dark">Tell us about it <FaArrowRight /></Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
