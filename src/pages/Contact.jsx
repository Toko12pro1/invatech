import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaClock } from "react-icons/fa";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import ContactForm from "../components/ContactForm";

export default class Contact extends BasePage {
  renderPage() {
    return (
      <>
        <PageHero
          image="/images/hero-contact.jpg"
          eyebrow="Contact Us"
          title="Let's Fix, Build or Find What You Need"
          subtitle="Reach out by form, WhatsApp, phone or email — whichever is easiest for you."
        />

        <section className="section">
          <div className="container split">
            <Reveal className="contact-info">
              <span className="eyebrow">Get In Touch</span>
              <h2>We Respond Fast on WhatsApp</h2>
              <p>
                For repairs, sales enquiries or software projects, WhatsApp is the quickest way
                to reach our team directly.
              </p>

              <ul className="contact-details">
                <li>
                  <span className="contact-icon"><FaMapMarkerAlt /></span>
                  <div>
                    <strong>Our Location</strong>
                    <span>Akwa, Douala, Cameroon</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon"><FaPhoneAlt /></span>
                  <div>
                    <strong>Phone</strong>
                    <span>+237 6XX XXX XXX</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon"><FaWhatsapp /></span>
                  <div>
                    <strong>WhatsApp</strong>
                    <span>+237 6XX XXX XXX</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon"><FaEnvelope /></span>
                  <div>
                    <strong>Email</strong>
                    <span>hello@innovatech.cm</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon"><FaClock /></span>
                  <div>
                    <strong>Working Hours</strong>
                    <span>Mon – Sat, 8:00 AM – 6:30 PM</span>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal className="contact-form-card" delay={0.1}>
              <h3>Send Us a Message</h3>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        <section className="section section--alt">
          <div className="container">
            <Reveal className="map-embed">
              <iframe
                title="Innovatech Engineering Solutions location in Douala, Cameroon"
                src="https://www.google.com/maps?q=Douala,Cameroon&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}
