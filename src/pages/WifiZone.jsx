import React from "react";
import { withTranslation } from "react-i18next";
import { FaWifi, FaListOl, FaTicketAlt, FaPlug, FaWhatsapp, FaSyncAlt } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

const INTRO_ICONS = [FaListOl, FaTicketAlt, FaPlug];
const VOUCHER_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

class Voucher {
  constructor(plan) {
    this.plan = plan;
    this.id = Voucher.randomString(2, true) + "-" + Voucher.randomString(4, false);
    this.code = Voucher.randomString(4, false) + "-" + Voucher.randomString(4, false);
  }

  static randomString(length, lettersOnly) {
    const pool = lettersOnly ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : VOUCHER_CHARS;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += pool[Math.floor(Math.random() * pool.length)];
    }
    return result;
  }
}

class WifiZone extends BasePage {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: null, voucher: null };
    this.selectPackage = this.selectPackage.bind(this);
    this.generateVoucher = this.generateVoucher.bind(this);
  }

  selectPackage(index) {
    this.setState({ selectedIndex: index, voucher: null });
  }

  generateVoucher() {
    const { selectedIndex } = this.state;
    if (selectedIndex === null) return;
    const packages = this.props.t("wifiZone.packages.items", { returnObjects: true });
    this.setState({ voucher: new Voucher(packages[selectedIndex]) });
  }

  renderPage() {
    const { t } = this.props;
    const { selectedIndex, voucher } = this.state;
    const introSteps = t("wifiZone.intro.steps", { returnObjects: true });
    const packages = t("wifiZone.packages.items", { returnObjects: true });
    const mostPopularIndex = 2;

    const whatsappMessage = voucher
      ? encodeURIComponent(
          `Hi Innovatech, I'd like to activate a WiFi Zone voucher.\nVoucher ID: ${voucher.id}\nPlan: ${voucher.plan.data} / ${voucher.plan.duration}\nPrice: ${voucher.plan.price} FCFA`
        )
      : "";

    return (
      <>
        <PageHero
          image="/images/about-workspace.jpg"
          eyebrow={t("wifiZone.hero.eyebrow")}
          title={t("wifiZone.hero.title")}
          subtitle={t("wifiZone.hero.subtitle")}
        />

        <section className="section">
          <div className="container">
            <SectionHeading eyebrow={t("wifiZone.intro.eyebrow")} title={t("wifiZone.intro.title")} />
            <div className="grid grid--3">
              {introSteps.map((step, index) => {
                const Icon = INTRO_ICONS[index];
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

        <section className="section section--alt">
          <div className="container">
            <SectionHeading
              eyebrow={t("wifiZone.packages.eyebrow")}
              title={t("wifiZone.packages.title")}
              subtitle={t("wifiZone.packages.subtitle")}
            />
            <div className="grid grid--4">
              {packages.map((pkg, index) => (
                <Reveal key={pkg.id} delay={index * 0.08} className={`wifi-package ${selectedIndex === index ? "wifi-package--active" : ""}`}>
                  {index === mostPopularIndex && (
                    <span className="wifi-package-badge">{t("wifiZone.packages.mostPopular")}</span>
                  )}
                  <FaWifi className="wifi-package-icon" aria-hidden="true" />
                  <div className="wifi-package-data">{pkg.data}</div>
                  <div className="wifi-package-duration">{pkg.duration}</div>
                  <div className="wifi-package-price">{new Intl.NumberFormat("en-US").format(pkg.price)} FCFA</div>
                  <button
                    className={`btn ${selectedIndex === index ? "btn--secondary" : "btn--ghost"} wifi-package-btn`}
                    onClick={() => this.selectPackage(index)}
                  >
                    {selectedIndex === index ? t("wifiZone.packages.selected") : t("wifiZone.packages.selectPlan")}
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="voucher-card">
              <h3>{t("wifiZone.generate.title")}</h3>
              <p>{t("wifiZone.generate.subtitle")}</p>

              {!voucher && (
                <button
                  className="btn btn--primary"
                  onClick={this.generateVoucher}
                  disabled={selectedIndex === null}
                >
                  <FaTicketAlt aria-hidden="true" /> {t("wifiZone.generate.generateButton")}
                </button>
              )}
              {selectedIndex === null && !voucher && (
                <p className="voucher-hint">{t("wifiZone.generate.chooseFirst")}</p>
              )}

              {voucher && (
                <div className="voucher-result">
                  <div className="voucher-result-grid">
                    <div>
                      <span className="voucher-label">{t("wifiZone.generate.voucherId")}</span>
                      <span className="voucher-value">{voucher.id}</span>
                    </div>
                    <div>
                      <span className="voucher-label">{t("wifiZone.generate.accessCode")}</span>
                      <span className="voucher-value">{voucher.code}</span>
                    </div>
                    <div>
                      <span className="voucher-label">{t("wifiZone.generate.plan")}</span>
                      <span className="voucher-value">{voucher.plan.data}</span>
                    </div>
                    <div>
                      <span className="voucher-label">{t("wifiZone.generate.validFor")}</span>
                      <span className="voucher-value">{voucher.plan.duration}</span>
                    </div>
                  </div>

                  <p className="voucher-pay-note">{t("wifiZone.generate.payNote")}</p>

                  <div className="form-actions">
                    <a
                      href={`https://wa.me/237651162373?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn--primary"
                    >
                      <FaWhatsapp aria-hidden="true" /> {t("wifiZone.generate.payWhatsApp")}
                    </a>
                    <button className="btn btn--ghost" onClick={this.generateVoucher}>
                      <FaSyncAlt aria-hidden="true" /> {t("wifiZone.generate.regenerate")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default withTranslation()(WifiZone);
