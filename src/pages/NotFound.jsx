import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import BasePage from "../components/BasePage";
import Reveal from "../components/Reveal";

class NotFound extends BasePage {
  renderPage() {
    const { t } = this.props;

    return (
      <section className="section not-found">
        <div className="container">
          <Reveal>
            <span className="eyebrow">{t("notFound.eyebrow")}</span>
            <h1>{t("notFound.title")}</h1>
            <p>{t("notFound.text")}</p>
            <Link to="/" className="btn btn--primary">
              {t("notFound.backHome")}
            </Link>
          </Reveal>
        </div>
      </section>
    );
  }
}

export default withTranslation()(NotFound);
