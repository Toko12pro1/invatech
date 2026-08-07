import React from "react";
import { motion } from "framer-motion";

export default class PageHero extends React.Component {
  render() {
    const { image, eyebrow, title, subtitle } = this.props;

    return (
      <section className="page-hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {eyebrow && <span className="eyebrow eyebrow--light">{eyebrow}</span>}
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </motion.div>
        </div>
      </section>
    );
  }
}
