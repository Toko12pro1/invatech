import React from "react";
import Reveal from "./Reveal";

export default class SectionHeading extends React.Component {
  render() {
    const { eyebrow, title, subtitle, center = true } = this.props;

    return (
      <Reveal className={`section-heading ${center ? "section-heading--center" : ""}`}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </Reveal>
    );
  }
}
