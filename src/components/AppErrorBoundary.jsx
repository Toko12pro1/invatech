import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Innovatech page error", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main id="main-content" className="app-error-page">
        <div className="app-error-card">
          <span className="eyebrow">Innovatech</span>
          <h1>Something went wrong on this page.</h1>
          <p>Please refresh the page. If the problem continues, return home and contact us on WhatsApp.</p>
          <div className="form-actions">
            <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
              Refresh page
            </button>
            <a className="btn btn--secondary" href="/">Return home</a>
          </div>
        </div>
      </main>
    );
  }
}
