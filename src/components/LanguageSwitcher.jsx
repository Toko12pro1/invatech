import React from "react";
import { withTranslation } from "react-i18next";

class LanguageSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.setLang = this.setLang.bind(this);
  }

  setLang(lang) {
    if (lang === this.props.i18n.resolvedLanguage) return;
    const scrollY = window.scrollY;
    this.props.i18n.changeLanguage(lang);
    window.requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
  }

  render() {
    const current = this.props.i18n.resolvedLanguage || this.props.i18n.language;
    const { className = "" } = this.props;

    return (
      <div className={`lang-switch ${className}`} role="group" aria-label="Language">
        <button
          type="button"
          className={`lang-switch-btn ${current === "en" ? "lang-switch-btn--active" : ""}`}
          onClick={() => this.setLang("en")}
          aria-pressed={current === "en"}
        >
          EN
        </button>
        <span className="lang-switch-divider">|</span>
        <button
          type="button"
          className={`lang-switch-btn ${current === "fr" ? "lang-switch-btn--active" : ""}`}
          onClick={() => this.setLang("fr")}
          aria-pressed={current === "fr"}
        >
          FR
        </button>
      </div>
    );
  }
}

export default withTranslation()(LanguageSwitcher);
