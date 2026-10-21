import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { FaSearch, FaFileInvoiceDollar, FaWrench, FaCheckCircle, FaShieldAlt, FaWhatsapp, FaClipboardCheck } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import services from "../data/services";
import { whatsappLink } from "../data/marketplace";

const PROCESS_ICONS = [FaSearch, FaFileInvoiceDollar, FaWrench, FaCheckCircle];

class Services extends BasePage {
  renderPage() {
    const { t } = this.props;
    const processSteps = t("services.process.steps", { returnObjects: true });

    return (
      <>
        <PageHero
          image="/images/hero-services.jpg"
          eyebrow={t("services.hero.eyebrow")}
          title={t("services.hero.title")}
          subtitle={t("services.hero.subtitle")}
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
            <SectionHeading eyebrow={t("services.process.eyebrow")} title={t("services.process.title")} />
            <div className="grid grid--4">
              {processSteps.map((step, index) => {
                const Icon = PROCESS_ICONS[index];
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

        <section className="section consultant-section">
          <div className="container split">
            <Reveal className="split-content">
              <span className="eyebrow">Innovatech consultant</span>
              <h2>Send a photo before you spend money.</h2>
              <p>
                Not sure if a product is worth the price, or if a repair can really be fixed? Send
                us a photo and the story. We analyse the situation, explain the realistic options
                and help you negotiate or choose the right repair path.
              </p>
              <ul className="checklist">
                <li>Product checks before you buy</li>
                <li>Repair diagnosis before you pay</li>
                <li>Clear next steps and honest expectations</li>
              </ul>
            </Reveal>
            <Reveal className="consultant-card" delay={0.1}>
              <span className="consultant-card-icon"><FaShieldAlt /></span>
              <h3>One clear conversation can save you money.</h3>
              <p>We do not promise what has not been tested. We tell you what we can verify, what needs inspection and what the next step should be.</p>
              <div className="consultant-card-actions">
                <Link to="/consult" className="btn btn--primary"><FaClipboardCheck /> Start an Innovatech Check</Link>
                <a href={whatsappLink("Hi Innovatech, I need help analysing a product or repair. I will send a photo and the details.")} target="_blank" rel="noreferrer" className="btn btn--outline-light"><FaWhatsapp /> Chat directly</a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container cta-banner-inner">
            <Reveal>
              <h2>{t("services.cta.title")}</h2>
              <p>{t("services.cta.subtitle")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/contact" className="btn btn--dark">
                {t("services.cta.talkToUs")}
              </Link>
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}

export default withTranslation()(Services);
