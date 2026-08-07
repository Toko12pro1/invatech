import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaTools,
  FaMapMarkedAlt,
  FaWhatsapp,
} from "react-icons/fa";
import BasePage from "../components/BasePage";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import ProductCard from "../components/ProductCard";
import StatCounter from "../components/StatCounter";
import TestimonialCard from "../components/TestimonialCard";
import services from "../data/services";
import products from "../data/products";
import testimonials from "../data/testimonials";

const WHY_CHOOSE_US = [
  {
    icon: FaTools,
    title: "Skilled Engineers",
    text: "Every repair and build is handled by trained technicians and software engineers — not guesswork.",
  },
  {
    icon: FaShieldAlt,
    title: "Warranty You Can Trust",
    text: "New and fairly-used devices alike are tested and backed by a warranty.",
  },
  {
    icon: FaClock,
    title: "Fast Turnaround",
    text: "Most common repairs are completed same-day, so you're never without your device for long.",
  },
  {
    icon: FaMapMarkedAlt,
    title: "Rooted in Cameroon",
    text: "Built by and for Cameroon — we understand the local market, from spare parts to power realities.",
  },
];

export default class Home extends BasePage {
  renderPage() {
    return (
      <>
        <section className="hero" style={{ backgroundImage: "url(/images/hero-home.jpg)" }}>
          <div className="hero-overlay" />
          <div className="container hero-content">
            <motion.span
              className="eyebrow eyebrow--light"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Innovatech Engineering Solutions
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              We Repair, Build & Sell the Technology Cameroon Runs On
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Phone and electronics repair, verified device sales, and custom software
              development — all under one engineering team. Proud parent company of{" "}
              <strong>Skolar</strong>.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/services" className="btn btn--primary">
                Explore Our Services <FaArrowRight aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn btn--outline-light">
                Get a Free Quote
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="stats-bar">
          <div className="container stats-grid">
            <StatCounter value={8} label="Years of Experience" />
            <StatCounter value={4200} label="Devices Repaired" suffix="+" />
            <StatCounter value={3100} label="Happy Clients" suffix="+" />
            <StatCounter value={1} label="School Platform Built" suffix="" />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="What We Do"
              title="Complete Technology Services, Under One Roof"
              subtitle="From a cracked screen to a full software platform, our engineers handle it all."
            />
            <div className="grid grid--4">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
            <Reveal className="section-cta">
              <Link to="/services" className="btn btn--primary">
                View All Services <FaArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="section section--alt">
          <div className="container split">
            <Reveal className="split-image" as="div">
              <img src="/images/about-team.jpg" alt="The Innovatech engineering team at work" />
            </Reveal>
            <Reveal className="split-content" delay={0.1}>
              <span className="eyebrow">Who We Are</span>
              <h2>Engineering Solutions Since Day One</h2>
              <p>
                Innovatech Engineering Solutions is a Cameroonian technology company built around
                one idea: real engineering, applied practically. We repair the devices people
                depend on, sell electronics people can trust, and build the software that
                institutions run on — including <strong>Skolar</strong>, our own
                school-management platform used by schools across the region.
              </p>
              <ul className="checklist">
                <li>Certified, hands-on technicians</li>
                <li>In-house software engineering team</li>
                <li>Transparent pricing, real warranties</li>
              </ul>
              <Link to="/about" className="btn btn--secondary">
                More About Us <FaArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Shop"
              title="Featured Devices"
              subtitle="A sample of what's currently available — new and fairly-used, all verified."
            />
            <div className="grid grid--3">
              {products.slice(0, 3).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            <Reveal className="section-cta">
              <Link to="/shop" className="btn btn--primary">
                Visit the Shop <FaArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="section section--dark">
          <div className="container">
            <SectionHeading
              eyebrow="Why Choose Us"
              title="Built on Trust, Backed by Skill"
              center
            />
            <div className="grid grid--4">
              {WHY_CHOOSE_US.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 0.08} className="feature-card">
                    <span className="feature-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Testimonials" title="What Our Clients Say" />
            <div className="grid grid--3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container cta-banner-inner">
            <Reveal>
              <h2>Got a device that needs fixing, or a project to build?</h2>
              <p>Talk to us on WhatsApp and get a response in minutes.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href="https://wa.me/237600000000"
                target="_blank"
                rel="noreferrer"
                className="btn btn--dark"
              >
                <FaWhatsapp aria-hidden="true" /> Chat With Us Now
              </a>
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}
