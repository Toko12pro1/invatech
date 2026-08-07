import React from "react";
import { Link } from "react-router-dom";
import BasePage from "../components/BasePage";
import Reveal from "../components/Reveal";

export default class NotFound extends BasePage {
  renderPage() {
    return (
      <section className="section not-found">
        <div className="container">
          <Reveal>
            <span className="eyebrow">404</span>
            <h1>This page took a wrong turn.</h1>
            <p>The page you're looking for doesn't exist, or may have moved.</p>
            <Link to="/" className="btn btn--primary">
              Back to Home
            </Link>
          </Reveal>
        </div>
      </section>
    );
  }
}
