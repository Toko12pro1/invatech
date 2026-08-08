import React from "react";
import { withTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaClock } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import ContactForm from "../components/ContactForm";

class Contact extends BasePage {
  renderPage() {
    const { t } = this.props;

    return (
      <>
        <PageHero
          image="/images/hero-contact.jpg"
          eyebrow={t("contact.hero.eyebrow")}
          title={t("contact.hero.title")}
          subtitle={t("contact.hero.subtitle")}
        />

        <section className="section">
          <div className="container split">
            <Reveal className="contact-info">
              <span className="eyebrow">{t("contact.getInTouch.eyebrow")}</span>
              <h2>{t("contact.getInTouch.title")}</h2>
              <p>{t("contact.getInTouch.p1")}</p>

              <ul className="contact-details">
                <li>
                  <span className="contact-icon"><FaMapMarkerAlt /></span>
                  <div>
                    <strong>{t("contact.details.location")}</strong>
                    <span>{t("contact.details.locationValue")}</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon"><FaPhoneAlt /></span>
                  <div>
                    <strong>{t("contact.details.phone")}</strong>
                    <span>+237 651 162 373</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon"><FaWhatsapp /></span>
                  <div>
                    <strong>{t("contact.details.whatsapp")}</strong>
                    <span>+237 651 162 373</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon"><FaEnvelope /></span>
                  <div>
                    <strong>{t("contact.details.email")}</strong>
                    <span>hello@innovatech.cm</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon"><FaClock /></span>
                  <div>
                    <strong>{t("contact.details.hours")}</strong>
                    <span>{t("contact.details.hoursValue")}</span>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal className="contact-form-card" delay={0.1}>
              <h3>{t("contact.form.title")}</h3>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        <section className="section section--alt">
          <div className="container">
            <Reveal className="map-embed">
              <iframe
                title="Innovatech Engineering Solutions location in Melen, Yaounde, Cameroon"
                src="https://www.google.com/maps?q=Melen,Yaounde,Cameroon&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}

export default withTranslation()(Contact);
