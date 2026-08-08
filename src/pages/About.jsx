import React from "react";
import { Link } from "react-router-dom";
import { Trans, withTranslation } from "react-i18next";
import { FaArrowRight, FaBullseye, FaEye, FaHandshake } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ProfileCard from "../components/ProfileCard";

const VALUE_ICONS = [FaBullseye, FaEye, FaHandshake];
const VALUE_KEYS = ["mission", "vision", "promise"];
const PROFILE_PHOTOS = [
  "/images/profile-founder.jpg",
  "/images/profile-engineer.jpg",
  "/images/profile-technician.jpg",
  "/images/profile-relations.jpg",
];

class About extends BasePage {
  renderPage() {
    const { t } = this.props;
    const howWeWorkBullets = t("about.howWeWork.bullets", { returnObjects: true });
    const profileMembers = t("about.profiles.members", { returnObjects: true });

    return (
      <>
        <PageHero
          image="/images/hero-about.jpg"
          eyebrow={t("about.hero.eyebrow")}
          title={t("about.hero.title")}
          subtitle={t("about.hero.subtitle")}
        />

        <section className="section">
          <div className="container split">
            <Reveal className="split-content">
              <span className="eyebrow">{t("about.story.eyebrow")}</span>
              <h2>{t("about.story.title")}</h2>
              <p>{t("about.story.p1")}</p>
              <p>
                <Trans i18nKey="about.story.p2" t={t}>
                  That same engineering discipline led us into software. Today, Innovatech is the
                  parent company of <strong>Skolar</strong>, a school-management platform we
                  designed, built and continue to maintain — proof that the same attention we give
                  a soldering iron, we give a codebase.
                </Trans>
              </p>
            </Reveal>
            <Reveal className="split-image" delay={0.1}>
              <img src="/images/about-story.jpg" alt="A laptop screen, representing the software side of Innovatech's work" />
            </Reveal>
          </div>
        </section>

        <section className="section section--alt">
          <div className="container">
            <SectionHeading eyebrow={t("about.values.eyebrow")} title={t("about.values.title")} />
            <div className="grid grid--3">
              {VALUE_KEYS.map((key, index) => {
                const Icon = VALUE_ICONS[index];
                return (
                  <Reveal key={key} delay={index * 0.1} className="feature-card feature-card--bordered">
                    <span className="feature-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{t(`about.values.${key}.title`)}</h3>
                    <p>{t(`about.values.${key}.text`)}</p>
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
              <span className="eyebrow">{t("about.howWeWork.eyebrow")}</span>
              <h2>{t("about.howWeWork.title")}</h2>
              <p>{t("about.howWeWork.p1")}</p>
              <ul className="checklist">
                {howWeWorkBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
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
              <span className="eyebrow">{t("about.team.eyebrow")}</span>
              <h2>{t("about.team.title")}</h2>
              <p>{t("about.team.p1")}</p>
              <Link to="/contact" className="btn btn--secondary">
                {t("about.team.workWithUs")} <FaArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow={t("about.profiles.eyebrow")}
              title={t("about.profiles.title")}
              subtitle={t("about.profiles.subtitle")}
            />
            <div className="grid grid--4">
              {profileMembers.map((member, index) => (
                <ProfileCard
                  key={member.name}
                  index={index}
                  photo={PROFILE_PHOTOS[index]}
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt">
          <div className="container split">
            <Reveal className="split-content">
              <span className="eyebrow">{t("about.innovationHub.eyebrow")}</span>
              <h2>{t("about.innovationHub.title")}</h2>
              <p>{t("about.innovationHub.p1")}</p>
              <p>{t("about.innovationHub.p2")}</p>
              <Link to="/services" className="btn btn--secondary">
                {t("about.innovationHub.cta")} <FaArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
            <Reveal className="innovation-gallery" delay={0.1}>
              <img src="/images/innovation-raspberrypi.jpg" alt="Raspberry Pi board used in IoT prototyping" />
              <img src="/images/innovation-sensors.jpg" alt="IoT sensor modules" />
              <img src="/images/innovation-prototype.jpg" alt="A working IoT prototype on a breadboard" />
              <img src="/images/innovation-lab.jpg" alt="Innovation hub workbench with electronics components" />
            </Reveal>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container cta-banner-inner">
            <Reveal>
              <h2>{t("about.cta.title")}</h2>
              <p>{t("about.cta.subtitle")}</p>
            </Reveal>
            <Reveal delay={0.1} className="cta-banner-actions">
              <Link to="/services" className="btn btn--dark">
                {t("about.cta.ourServices")}
              </Link>
              <Link to="/contact" className="btn btn--outline-light">
                {t("about.cta.contactUs")}
              </Link>
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}

export default withTranslation()(About);
