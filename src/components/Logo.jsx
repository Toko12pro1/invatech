import React from "react";
import { Link } from "react-router-dom";

export default class Logo extends React.Component {
  render() {
    const { variant = "light", height = 40 } = this.props;

    if (variant === "dark") {
      return (
        <Link to="/" className="brand" aria-label="Innovatech Engineering Solutions — Home">
          <img src="/images/logo-icon.svg" alt="" width={height} height={height} className="brand-mark" />
          <span className="brand-text">
            <span className="brand-name brand-name--dark">Innovatech</span>
            <span className="brand-tagline">Engineering Solutions</span>
          </span>
        </Link>
      );
    }

    return (
      <Link to="/" className="brand" aria-label="Innovatech Engineering Solutions — Home">
        <img src="/images/logo-full.svg" alt="Innovatech Engineering Solutions" height={height} className="brand-lockup" />
      </Link>
    );
  }
}
