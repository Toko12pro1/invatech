import React from "react";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa";

const WHATSAPP_NUMBER = "237600000000";
const CONTACT_EMAIL = "hello@innovatech.cm";

const INITIAL_STATE = {
  name: "",
  phone: "",
  service: "Phone & Gadget Repair",
  message: "",
  errors: {},
};

export default class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.handleChange = this.handleChange.bind(this);
    this.handleWhatsApp = this.handleWhatsApp.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  validate() {
    const errors = {};
    if (!this.state.name.trim()) errors.name = "Please enter your name";
    if (!this.state.phone.trim()) errors.phone = "Please enter a phone number or email";
    if (!this.state.message.trim()) errors.message = "Tell us a little about what you need";
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  buildMessage() {
    const { name, phone, service, message } = this.state;
    return (
      `Hello Innovatech, my name is ${name}.\n` +
      `Contact: ${phone}\n` +
      `Service: ${service}\n\n` +
      `${message}`
    );
  }

  handleWhatsApp(event) {
    event.preventDefault();
    if (!this.validate()) return;
    const text = encodeURIComponent(this.buildMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noreferrer");
  }

  handleEmail(event) {
    event.preventDefault();
    if (!this.validate()) return;
    const subject = encodeURIComponent(`Enquiry from ${this.state.name} — ${this.state.service}`);
    const body = encodeURIComponent(this.buildMessage());
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  render() {
    const { name, phone, service, message, errors } = this.state;

    return (
      <form className="contact-form" noValidate>
        <div className="form-row">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" type="text" value={name} onChange={this.handleChange} placeholder="Your name" />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="phone">Phone or Email</label>
          <input id="phone" name="phone" type="text" value={phone} onChange={this.handleChange} placeholder="+237 6XX XXX XXX" />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="service">What do you need?</label>
          <select id="service" name="service" value={service} onChange={this.handleChange}>
            <option>Phone & Gadget Repair</option>
            <option>Electronics & Hardware Repair</option>
            <option>App & Software Development</option>
            <option>Buying Electronics</option>
            <option>Something else</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="4" value={message} onChange={this.handleChange} placeholder="Tell us what you need help with..." />
          {errors.message && <span className="form-error">{errors.message}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" onClick={this.handleWhatsApp}>
            <FaPaperPlane aria-hidden="true" /> Send via WhatsApp
          </button>
          <button type="submit" className="btn btn--ghost" onClick={this.handleEmail}>
            <FaEnvelope aria-hidden="true" /> Send via Email
          </button>
        </div>
      </form>
    );
  }
}
