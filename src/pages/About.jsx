import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBullseye, FaEye, FaHandshake } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

const VALUES = [
  {
    icon: FaBullseye,
    title: "Our Mission",
    text: "To make reliable technology — repaired, sold, or built — accessible to every home, business and school in Cameroon.",
  },
  {
    icon: FaEye,
    title: "Our Vision",
    text: "To be the engineering company African institutions and individuals turn to first, for hardware and software alike.",
  },
  {
    icon: FaHandshake,
    title: "Our Promise",
    text: "Transparent pricing, honest diagnostics, and a warranty that means something — every single time.",
  },
];

export default class About extends BasePage {
  renderPage() {
    return (
      <>
        <PageHero
          image="/images/hero-about.jpg"
          eyebrow="About Us"
          title="The Engineering Team Behind the Repairs, Sales & Skolar"
          subtitle="Innovatech Engineering Solutions is a Cameroonian technology company built on hands-on skill and long-term trust."
        />

        <section className="section">
          <div className="container split">
            <Reveal className="split-content">
              <span className="eyebrow">Our Story</span>
              <h2>From Repair Bench to Software Platform</h2>
              <p>
                Innovatech Engineering Solutions started with a simple frustration: too many
                good devices were thrown away over fixable faults, and too few local companies
                could be trusted to fix them properly. We built a team of technicians who repair
                electronics the right way — down to component level when needed — and sell
                devices people can actually rely on.
              </p>
              <p>
                That same engineering discipline led us into software. Today, Innovatech is the
                parent company of <strong>Skolar</strong>, a school-management platform we
                designed, built and continue to maintain — proof that the same attention we give
                a soldering iron, we give a codebase.
              </p>
            </Reveal>
            <Reveal className="split-image" delay={0.1}>
              <img src="/images/about-story.jpg" alt="A laptop screen, representing the software side of Innovatech's work" />
            </Reveal>
          </div>
        </section>

        <section className="section section--alt">
          <div className="container">
            <SectionHeading eyebrow="What Drives Us" title="Mission, Vision & Promise" />
            <div className="grid grid--3">
              {VALUES.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Reveal key={value.title} delay={index * 0.1} className="feature-card feature-card--bordered">
                    <span className="feature-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container split split--reverse">
            <Reveal className="split-image">
              <img src="/images/about-workshop.jpg" alt="Hardware prototyping and circuit-level diagnostic work" />
            </Reveal>
            <Reveal className="split-content" delay={0.1}>
              <span className="eyebrow">How We Work</span>
              <h2>Real Diagnostics, Not Guesswork</h2>
              <p>
                Every device that comes to our bench is diagnosed at component level before we
                quote a price. It's the same rigor our software team applies to a client's
                codebase — understand the root cause first, then fix it properly.
              </p>
              <ul className="checklist">
                <li>Transparent, itemised quotes before any work begins</li>
                <li>Genuine and high-grade replacement parts</li>
                <li>Warranty on every repair and every device sold</li>
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="section section--alt">
          <div className="container split">
            <Reveal className="split-image">
              <img src="/images/about-team.jpg" alt="The Innovatech team collaborating in the office" />
            </Reveal>
            <Reveal className="split-content" delay={0.1}>
              <span className="eyebrow">Our Team</span>
              <h2>A Team of Technicians, Engineers & Builders</h2>
              <p>
                From repair technicians to full-stack developers, our team shares one standard:
                do it properly, explain it honestly, and stand behind the work. Many of us also
                build and maintain Skolar day-to-day — so the company that fixes your phone is
                the same one shipping software used by real schools.
              </p>
              <Link to="/contact" className="btn btn--secondary">
                Work With Us <FaArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container cta-banner-inner">
            <Reveal>
              <h2>Want to know more about what we do?</h2>
              <p>See our full range of services, or get in touch directly.</p>
            </Reveal>
            <Reveal delay={0.1} className="cta-banner-actions">
              <Link to="/services" className="btn btn--dark">
                Our Services
              </Link>
              <Link to="/contact" className="btn btn--outline-light">
                Contact Us
              </Link>
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}
