import React from "react";
import { NavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes, FaUserCircle, FaWhatsapp } from "react-icons/fa";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_LINKS = [
  { to: "/", key: "home", end: true },
  { to: "/shop", key: "shop" },
  { to: "/achievements", key: "achievements" },
  { to: "/services", key: "services" },
  { to: "/contact", key: "contact" },
];

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { menuOpen: false, scrolled: false };
    this.menuButtonRef = React.createRef();
    this.handleScroll = this.handleScroll.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleMobileKeyDown = this.handleMobileKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const scrolled = window.scrollY > 12;
    if (scrolled !== this.state.scrolled) this.setState({ scrolled });
  }

  toggleMenu() {
    this.setState((prev) => ({ menuOpen: !prev.menuOpen }));
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  handleMobileKeyDown(event) {
    if (event.key === "Escape") this.closeMenu();
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.menuOpen && !this.state.menuOpen) {
      window.requestAnimationFrame(() => this.menuButtonRef.current?.focus());
    }
  }

  render() {
    const { menuOpen, scrolled } = this.state;
    const { t } = this.props;

    return (
      <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar-inner container">
          <Logo />

          <nav className="navbar-links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={Boolean(link.end)}
                className={({ isActive }) => `navbar-link ${isActive ? "navbar-link--active" : ""}`}
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions">
            <LanguageSwitcher />
            <NavLink to="/account" className="btn btn--ghost navbar-account">
              <FaUserCircle aria-hidden="true" /> {t("nav.account", "Account")}
            </NavLink>
            <a
              href="https://wa.me/237651162373"
              target="_blank"
              rel="noreferrer"
              className="btn btn--ghost navbar-whatsapp"
            >
              <FaWhatsapp aria-hidden="true" /> {t("nav.whatsappUs")}
            </a>
            <NavLink to="/consult" className="btn btn--primary">
              {t("nav.consult")}
            </NavLink>
          </div>

          <button
            type="button"
            className="navbar-burger"
            ref={this.menuButtonRef}
            onClick={this.toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-navigation"
              className="navbar-mobile"
              onKeyDown={this.handleMobileKeyDown}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              aria-label="Mobile"
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={Boolean(link.end)}
                  onClick={this.closeMenu}
                  className={({ isActive }) => `navbar-mobile-link ${isActive ? "navbar-link--active" : ""}`}
                >
                  {t(`nav.${link.key}`)}
                </NavLink>
              ))}
              <NavLink
                to="/refer"
                onClick={this.closeMenu}
                className={({ isActive }) => `navbar-mobile-link ${isActive ? "navbar-link--active" : ""}`}
              >
                {t("nav.refer", "Refer & Earn")}
              </NavLink>
              <NavLink
                to="/account"
                onClick={this.closeMenu}
                className={({ isActive }) => `navbar-mobile-link ${isActive ? "navbar-link--active" : ""}`}
              >
                <FaUserCircle /> {t("nav.account", "Account")}
              </NavLink>
              <LanguageSwitcher className="lang-switch--mobile" />
              <NavLink to="/consult" onClick={this.closeMenu} className="btn btn--primary navbar-mobile-cta">
                {t("nav.consult")}
              </NavLink>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    );
  }
}

export default withTranslation()(Navbar);
