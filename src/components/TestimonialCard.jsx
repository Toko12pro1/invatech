import React from "react";
import { withTranslation } from "react-i18next";
import { FaQuoteLeft } from "react-icons/fa";
import Reveal from "./Reveal";

class TestimonialCard extends React.Component {
  render() {
    const { testimonial, index = 0, t } = this.props;

    return (
      <Reveal delay={index * 0.08} className="testimonial-card-wrap">
        <article className="testimonial-card">
          <FaQuoteLeft className="testimonial-quote-icon" aria-hidden="true" />
          <p className="testimonial-text">{t(`testimonialsData.${testimonial.id}.quote`)}</p>
          <div className="testimonial-author">
            <img src={testimonial.photo} alt={testimonial.name} loading="lazy" />
            <div>
              <strong>{testimonial.name}</strong>
              <span>{t(`testimonialsData.${testimonial.id}.role`)}</span>
            </div>
          </div>
        </article>
      </Reveal>
    );
  }
}

export default withTranslation()(TestimonialCard);
