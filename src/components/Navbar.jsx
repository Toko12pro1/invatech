import React from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes, FaWhatsapp } from "react-icons/fa";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { menuOpen: false, scrolled: false };
    this.handleScroll = this.handleScroll.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
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

  render() {
    const { menuOpen, scrolled } = this.state;

    return (
      <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar-inner container">
          <Logo />

          <nav className="navbar-links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => `navbar-link ${isActive ? "navbar-link--active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions">
            <a
              href="https://wa.me/237600000000"
              target="_blank"
              rel="noreferrer"
              className="btn btn--ghost navbar-whatsapp"
            >
              <FaWhatsapp aria-hidden="true" /> WhatsApp Us
            </a>
            <NavLink to="/contact" className="btn btn--primary">
              Get a Quote
            </NavLink>
          </div>

          <button
            className="navbar-burger"
            onClick={this.toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="navbar-mobile"
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
                  end={link.to === "/"}
                  onClick={this.closeMenu}
                  className={({ isActive }) => `navbar-mobile-link ${isActive ? "navbar-link--active" : ""}`}
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/contact" onClick={this.closeMenu} className="btn btn--primary navbar-mobile-cta">
                Get a Quote
              </NavLink>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    );
  }
}
