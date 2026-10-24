import React from "react";
import { Link } from "react-router-dom";
import { Trans, withTranslation } from "react-i18next";
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
import PromoVideo from "../components/PromoVideo";
import services from "../data/services";
import testimonials from "../data/testimonials";
import { supabase } from "../lib/supabaseClient";
import { getDemoProducts, toMarketplaceProduct } from "../data/marketplace";

const WHY_CHOOSE_US_ICONS = [FaTools, FaShieldAlt, FaClock, FaMapMarkedAlt];

class Home extends BasePage {
  constructor(props) {
    super(props);
    this.state = { products: [] };
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadFeaturedProducts();
  }

  async loadFeaturedProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, stores(name, location)")
      .eq("active", true)
      .order("sort_order")
      .limit(3);
    if (error || !data?.length) {
      this.setState({ products: getDemoProducts().slice(0, 3) });
      return;
    }
    this.setState({ products: data.map(toMarketplaceProduct) });
  }

  renderPage() {
    const { t } = this.props;
    const whyChooseUsItems = t("home.whyChooseUs.items", { returnObjects: true });
    const whoWeAreBullets = t("home.whoWeAre.bullets", { returnObjects: true });

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
              {t("home.hero.eyebrow")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t("home.hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Trans i18nKey="home.hero.subtitle" t={t}>
                Phone and electronics repair, verified device sales, and custom software
                development — all under one engineering team. Proud parent company of
                <strong>Skolar</strong>.
              </Trans>
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/services" className="btn btn--primary">
                {t("home.hero.exploreServices")} <FaArrowRight aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn btn--outline-light">
                {t("home.hero.getFreeQuote")}
              </Link>
            </motion.div>
          </div>
        </section>

        <PromoVideo />

        <section className="stats-bar">
          <div className="container stats-grid">
            <StatCounter value={1} label={t("home.stats.years")} />
            <StatCounter value={50} label={t("home.stats.devicesRepaired")} suffix="+" />
            <StatCounter value={50} label={t("home.stats.happyClients")} suffix="+" />
            <StatCounter value={1} label={t("home.stats.schoolPlatform")} suffix="" />
          </div>
        </section>

        <section className="section section--cream marketplace-intro">
          <div className="container">
            <div className="marketplace-intro-header">
              <div>
                <span className="eyebrow">More than a shop</span>
                <h2>Buy with a local team on your side.</h2>
              </div>
              <Link to="/stores" className="btn btn--secondary">
                See partner stores <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid--3 marketplace-benefits">
              <Reveal className="marketplace-benefit-card">
                <span className="feature-icon"><FaShieldAlt aria-hidden="true" /></span>
                <span className="eyebrow">01 · Verified</span>
                <h3>Know who you are buying from</h3>
                <p>We show the partner store behind each listing, so your purchase has a real name and a real contact.</p>
              </Reveal>
              <Reveal className="marketplace-benefit-card" delay={0.08}>
                <span className="feature-icon"><FaTools aria-hidden="true" /></span>
                <span className="eyebrow">02 · Tested</span>
                <h3>We check before you commit</h3>
                <p>Our team helps verify the product and test it where possible, giving you a clearer decision.</p>
              </Reveal>
              <Reveal className="marketplace-benefit-card" delay={0.16}>
                <span className="feature-icon"><FaWhatsapp aria-hidden="true" /></span>
                <span className="eyebrow">03 · Connected</span>
                <h3>Continue the conversation on WhatsApp</h3>
                <p>Ask questions, request a discount, buy from the store or place an order with our help.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow={t("home.whatWeDo.eyebrow")}
              title={t("home.whatWeDo.title")}
              subtitle={t("home.whatWeDo.subtitle")}
            />
            <div className="grid grid--4">
              {services.slice(0, 4).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
            <Reveal className="section-cta">
              <Link to="/services" className="btn btn--primary">
                {t("home.whatWeDo.viewAllServices")} <FaArrowRight aria-hidden="true" />
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
              <span className="eyebrow">{t("home.whoWeAre.eyebrow")}</span>
              <h2>{t("home.whoWeAre.title")}</h2>
              <p>
                <Trans i18nKey="home.whoWeAre.paragraph" t={t}>
                  Innovatech Engineering Solutions is a Cameroonian technology company built around
                  one idea: real engineering, applied practically. We repair the devices people
                  depend on, sell electronics people can trust, and build the software that
                  institutions run on — including <strong>Skolar</strong>, our own
                  school-management platform used by schools across the region.
                </Trans>
              </p>
              <ul className="checklist">
                {whoWeAreBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <Link to="/about" className="btn btn--secondary">
                {t("home.whoWeAre.moreAboutUs")} <FaArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow={t("home.shop.eyebrow")}
              title={t("home.shop.title")}
              subtitle={t("home.shop.subtitle")}
            />
            <div className="grid grid--3">
              {this.state.products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            <Reveal className="section-cta">
              <Link to="/shop" className="btn btn--primary">
                {t("home.shop.visitShop")} <FaArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="section section--dark">
          <div className="container split">
            <Reveal className="split-image">
              <img src="/images/why-choose-us.jpg" alt="Members of the Innovatech team" />
            </Reveal>
            <div className="split-content">
              <span className="eyebrow">{t("home.whyChooseUs.eyebrow")}</span>
              <h2>{t("home.whyChooseUs.title")}</h2>
              <div className="grid grid--2 why-choose-grid">
                {whyChooseUsItems.map((item, index) => {
                  const Icon = WHY_CHOOSE_US_ICONS[index];
                  return (
                    <Reveal key={item.title} delay={index * 0.08} className="feature-card feature-card--compact">
                      <span className="feature-icon feature-icon--sm">
                        <Icon aria-hidden="true" />
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading eyebrow={t("home.testimonials.eyebrow")} title={t("home.testimonials.title")} />
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
              <h2>{t("home.cta.title")}</h2>
              <p>{t("home.cta.subtitle")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href="https://wa.me/237651162373"
                target="_blank"
                rel="noreferrer"
                className="btn btn--dark"
              >
                <FaWhatsapp aria-hidden="true" /> {t("home.cta.chatNow")}
              </a>
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}

export default withTranslation()(Home);
