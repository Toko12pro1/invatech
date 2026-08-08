import React from "react";
import { Link } from "react-router-dom";
import { Trans, withTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import Logo from "./Logo";
import services from "../data/services";

class Footer extends React.Component {
  render() {
    const year = new Date().getFullYear();
    const { t } = this.props;

    return (
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-col footer-brand">
            <Logo variant="dark" />
            <p className="footer-about">
              <Trans i18nKey="footer.about" t={t}>
                Innovatech Engineering Solutions repairs, builds and sells the technology that keeps
                Cameroon connected — and is the parent company behind <strong>Skolar</strong>, our
                school-management platform.
              </Trans>
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t("footer.quickLinks")}</h4>
            <ul>
              <li><Link to="/">{t("nav.home")}</Link></li>
              <li><Link to="/about">{t("nav.about")}</Link></li>
              <li><Link to="/services">{t("nav.services")}</Link></li>
              <li><Link to="/shop">{t("nav.shop")}</Link></li>
              <li><Link to="/wifi-zone">{t("nav.wifiZone")}</Link></li>
              <li><Link to="/contact">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t("footer.ourServices")}</h4>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <Link to="/services">{t(service.translationKey("title"))}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t("footer.getInTouch")}</h4>
            <ul className="footer-contact">
              <li><FaMapMarkerAlt /> {t("contact.details.locationValue")}</li>
              <li><FaPhoneAlt /> +237 651 162 373</li>
              <li><FaWhatsapp /> +237 651 162 373</li>
              <li><FaEnvelope /> hello@innovatech.cm</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom container">
          <p>&copy; {year} Innovatech Engineering Solutions. {t("footer.rights")}</p>
          <p className="footer-bottom-sub">{t("footer.tagline")}</p>
        </div>
      </footer>
    );
  }
}

export default withTranslation()(Footer);
