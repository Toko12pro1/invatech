import React from "react";
import Reveal from "./Reveal";

// Counts up to `value` once it scrolls into view. Implemented with class
// lifecycle methods + requestAnimationFrame rather than a hooks-based
// animation library, since motion values are React-hooks-only.
export default class StatCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: 0 };
    this.elementRef = React.createRef();
    this.observer = null;
    this.rafId = null;
    this.hasAnimated = false;
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.startTime = null;
            this.rafId = requestAnimationFrame(this.animate);
          }
        });
      },
      { threshold: 0.4 }
    );
    if (this.elementRef.current) this.observer.observe(this.elementRef.current);
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  animate(timestamp) {
    const { value, duration = 1600 } = this.props;
    if (!this.startTime) this.startTime = timestamp;
    const progress = Math.min((timestamp - this.startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    this.setState({ display: Math.round(eased * value) });
    if (progress < 1) {
      this.rafId = requestAnimationFrame(this.animate);
    }
  }

  render() {
    const { label, suffix = "+" } = this.props;

    return (
      <Reveal className="stat" as="div">
        <div ref={this.elementRef} className="stat-number">
          {this.state.display}
          <span>{suffix}</span>
        </div>
        <div className="stat-label">{label}</div>
      </Reveal>
    );
  }
}
