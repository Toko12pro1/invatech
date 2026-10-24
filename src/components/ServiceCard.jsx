import React from "react";
import { withTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

class ServiceCard extends React.Component {
  render() {
    const { service, index = 0, detailed = false, t } = this.props;
    const Icon = service.icon;
    const features = t(service.translationKey("features"), { returnObjects: true });

    return (
      <Reveal delay={index * 0.08} className="service-card-wrap">
        <motion.article
          className={`service-card ${detailed ? "service-card--detailed" : ""}`}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="service-card-image">
            <img src={service.image} alt="" loading="lazy" />
            <span className="service-card-icon">
              <Icon aria-hidden="true" />
            </span>
          </div>
          <div className="service-card-body">
            <h3>{t(service.translationKey("title"))}</h3>
            <p>{t(service.translationKey("summary"))}</p>
            {detailed && Array.isArray(features) && (
              <ul className="service-card-features">
                {features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            )}
          </div>
        </motion.article>
      </Reveal>
    );
  }
}

export default withTranslation()(ServiceCard);
