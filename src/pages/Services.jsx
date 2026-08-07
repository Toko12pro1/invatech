import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaFileInvoiceDollar, FaWrench, FaCheckCircle } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import services from "../data/services";

const PROCESS = [
  { icon: FaSearch, title: "Diagnose", text: "We inspect your device or gather your project requirements in detail." },
  { icon: FaFileInvoiceDollar, title: "Quote", text: "You get a clear, itemised price before any work begins — no surprises." },
  { icon: FaWrench, title: "Build or Repair", text: "Our technicians and engineers get to work with the right parts and tools." },
  { icon: FaCheckCircle, title: "Deliver & Warranty", text: "You get it back tested, working, and backed by our warranty." },
];

export default class Services extends BasePage {
  renderPage() {
    return (
      <>
        <PageHero
          image="/images/hero-services.jpg"
          eyebrow="Our Services"
          title="Every Service Backed by Real Engineering"
          subtitle="Repair, sales and software — handled by the same team, to the same standard."
        />

        <section className="section">
          <div className="container">
            <div className="grid grid--2">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} detailed />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt">
          <div className="container">
            <SectionHeading eyebrow="Our Process" title="How We Work, Every Time" />
            <div className="grid grid--4">
              {PROCESS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.title} delay={index * 0.08} className="process-step">
                    <span className="process-step-number">{index + 1}</span>
                    <span className="feature-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container cta-banner-inner">
            <Reveal>
              <h2>Not sure which service you need?</h2>
              <p>Tell us what's going on — we'll point you in the right direction, free of charge.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/contact" className="btn btn--dark">
                Talk To Us
              </Link>
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}
