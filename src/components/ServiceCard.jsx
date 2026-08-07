import React from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default class ServiceCard extends React.Component {
  render() {
    const { service, index = 0, detailed = false } = this.props;
    const Icon = service.icon;

    return (
      <Reveal delay={index * 0.08} className="service-card-wrap">
        <motion.article
          className={`service-card ${detailed ? "service-card--detailed" : ""}`}
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="service-card-image">
            <img src={service.image} alt="" loading="lazy" />
            <span className="service-card-icon">
              <Icon aria-hidden="true" />
            </span>
          </div>
          <div className="service-card-body">
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
            {detailed && (
              <ul className="service-card-features">
                {service.features.map((feature) => (
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
