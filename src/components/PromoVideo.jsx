import React from "react";
import { withTranslation } from "react-i18next";
import { FaLaptopCode, FaWrench, FaMicrochip } from "react-icons/fa";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const LINE_ICONS = [FaLaptopCode, FaWrench, FaMicrochip];

class PromoVideo extends React.Component {
  render() {
    const { t } = this.props;
    const lines = t("home.promo.lines", { returnObjects: true });

    return (
      <section className="section promo-section">
        <div className="container">
          <SectionHeading
            eyebrow={t("home.promo.eyebrow")}
            title={t("home.promo.title")}
            subtitle={t("home.promo.subtitle")}
          />

          <Reveal className="promo-video-wrap">
            <video
              controls
              playsInline
              preload="none"
              poster="/images/promo-poster.jpg"
              aria-label="Innovatech Engineering Solutions company promo video"
            >
              <source src="/videos/innovatech-promo.webm" type="video/webm" />
              <source src="/videos/innovatech-promo.mp4" type="video/mp4" />
            </video>
          </Reveal>

          <div className="grid grid--3 promo-lines">
            {lines.map((text, index) => {
              const Icon = LINE_ICONS[index];
              return (
                <Reveal key={text} delay={index * 0.08} className="promo-line">
                  <span className="promo-line-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <p>{text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}

export default withTranslation()(PromoVideo);
