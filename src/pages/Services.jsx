import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { FaSearch, FaFileInvoiceDollar, FaWrench, FaCheckCircle } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import services from "../data/services";

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
