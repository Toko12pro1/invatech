import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import Logo from "./Logo";
import services from "../data/services";

export default class Footer extends React.Component {
  render() {
    const year = new Date().getFullYear();

    return (
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-col footer-brand">
            <Logo variant="dark" />
            <p className="footer-about">
              Innovatech Engineering Solutions repairs, builds and sells the technology that keeps
              Cameroon connected — and is the parent company behind{" "}
              <strong>Skolar</strong>, our school-management platform.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Our Services</h4>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <Link to="/services">{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get In Touch</h4>
            <ul className="footer-contact">
              <li><FaMapMarkerAlt /> Douala, Cameroon</li>
              <li><FaPhoneAlt /> +237 6XX XXX XXX</li>
              <li><FaWhatsapp /> +237 6XX XXX XXX</li>
              <li><FaEnvelope /> hello@innovatech.cm</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom container">
          <p>&copy; {year} Innovatech Engineering Solutions. All rights reserved.</p>
          <p className="footer-bottom-sub">Proudly building technology in Cameroon 🇨🇲</p>
        </div>
      </footer>
    );
  }
}
