import React from "react";
import { withTranslation } from "react-i18next";
import { FaWifi, FaListOl, FaTicketAlt, FaPlug, FaWhatsapp, FaSyncAlt } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import WifiPackage from "../models/WifiPackage";
import { supabase } from "../lib/supabaseClient";

const INTRO_ICONS = [FaListOl, FaTicketAlt, FaPlug];
const VOUCHER_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function randomString(length, pool) {
  let result = "";
  for (let i = 0; i < length; i++) result += pool[Math.floor(Math.random() * pool.length)];
  return result;
}

class WifiZone extends BasePage {
  constructor(props) {
    super(props);
    this.state = { packages: [], loadingPackages: true, selectedIndex: null, voucher: null, generating: false, error: "" };
    this.selectPackage = this.selectPackage.bind(this);
    this.generateVoucher = this.generateVoucher.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadPackages();
  }

  async loadPackages() {
    const { data, error } = await supabase
      .from("wifi_packages")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) {
      this.setState({ loadingPackages: false, error: error.message });
      return;
    }
    this.setState({ packages: data.map((row) => new WifiPackage(row)), loadingPackages: false });
  }

  selectPackage(index) {
    this.setState({ selectedIndex: index, voucher: null, error: "" });
  }

  // Reserves a unique code as a real DB row before ever showing it, so the
  // same code can never be generated twice — retries a few times in the
  // astronomically unlikely event of a collision on the unique constraint.
  async generateVoucher() {
    const { selectedIndex, packages } = this.state;
    if (selectedIndex === null) return;
    const plan = packages[selectedIndex];

    this.setState({ generating: true, error: "" });

    for (let attempt = 0; attempt < 5; attempt++) {
      const idLabel = randomString(2, LETTERS) + "-" + randomString(4, VOUCHER_CHARS);
      const accessCode = randomString(4, VOUCHER_CHARS) + "-" + randomString(4, VOUCHER_CHARS);
      const code = `${idLabel}:${accessCode}`;

      const { error } = await supabase
        .from("wifi_vouchers")
        .insert({ package_id: plan.id, code, status: "pending" });

      if (!error) {
        this.setState({ generating: false, voucher: { id: idLabel, code: accessCode, plan } });
        return;
      }
      if (error.code !== "23505") {
        this.setState({ generating: false, error: error.message });
        return;
      }
      // 23505 = unique_violation — extremely rare code collision, retry.
    }

    this.setState({ generating: false, error: "Could not generate a voucher right now. Please try again." });
  }

  renderPage() {
    const { t } = this.props;
    const { packages, loadingPackages, selectedIndex, voucher, generating, error } = this.state;
    const introSteps = t("wifiZone.intro.steps", { returnObjects: true });

    const whatsappMessage = voucher
      ? encodeURIComponent(
          `Hi Innovatech, I'd like to activate a WiFi Zone voucher.\nVoucher ID: ${voucher.id}\nPlan: ${voucher.plan.dataAmount} ${voucher.plan.dataUnit} / ${voucher.plan.durationDays} days\nPrice: ${voucher.plan.price} FCFA`
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
            {loadingPackages ? (
              <p>Loading…</p>
            ) : (
              <div className="grid grid--4">
                {packages.map((pkg, index) => (
                  <Reveal key={pkg.id} delay={index * 0.08} className={`wifi-package ${selectedIndex === index ? "wifi-package--active" : ""}`}>
                    {pkg.isPopular && (
                      <span className="wifi-package-badge">{t("wifiZone.packages.mostPopular")}</span>
                    )}
                    <FaWifi className="wifi-package-icon" aria-hidden="true" />
                    <div className="wifi-package-data">{pkg.dataAmount} {t(`common.units.${pkg.dataUnit}`)}</div>
                    <div className="wifi-package-duration">
                      {t("wifiZone.packages.daysCount", { count: pkg.durationDays })}
                    </div>
                    <div className="wifi-package-price">
                      {pkg.formatPrice()}
                      {pkg.isOnSale && <span className="product-price-old"> {pkg.formatPrice(pkg.oldPrice)}</span>}
                    </div>
                    <button
                      className={`btn ${selectedIndex === index ? "btn--secondary" : "btn--ghost"} wifi-package-btn`}
                      onClick={() => this.selectPackage(index)}
                    >
                      {selectedIndex === index ? t("wifiZone.packages.selected") : t("wifiZone.packages.selectPlan")}
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="voucher-card">
              <h3>{t("wifiZone.generate.title")}</h3>
              <p>{t("wifiZone.generate.subtitle")}</p>

              {error && <p className="form-error">{error}</p>}

              {!voucher && (
                <button
                  className="btn btn--primary"
                  onClick={this.generateVoucher}
                  disabled={selectedIndex === null || generating}
                >
                  <FaTicketAlt aria-hidden="true" /> {generating ? "…" : t("wifiZone.generate.generateButton")}
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
                      <span className="voucher-value">{voucher.plan.dataAmount} {t(`common.units.${voucher.plan.dataUnit}`)}</span>
                    </div>
                    <div>
                      <span className="voucher-label">{t("wifiZone.generate.validFor")}</span>
                      <span className="voucher-value">{t("wifiZone.packages.daysCount", { count: voucher.plan.durationDays })}</span>
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
