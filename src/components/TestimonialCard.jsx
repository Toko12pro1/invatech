import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import Reveal from "./Reveal";

export default class TestimonialCard extends React.Component {
  render() {
    const { testimonial, index = 0 } = this.props;

    return (
      <Reveal delay={index * 0.08} className="testimonial-card-wrap">
        <article className="testimonial-card">
          <FaQuoteLeft className="testimonial-quote-icon" aria-hidden="true" />
          <p className="testimonial-text">{testimonial.quote}</p>
          <div className="testimonial-author">
            <img src={testimonial.photo} alt={testimonial.name} loading="lazy" />
            <div>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
            </div>
          </div>
        </article>
      </Reveal>
    );
  }
}
