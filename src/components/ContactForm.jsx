import React from "react";
import { withTranslation } from "react-i18next";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa";

const WHATSAPP_NUMBER = "237651162373";
const CONTACT_EMAIL = "hello@innovatech.cm";

const INITIAL_STATE = {
  name: "",
  phone: "",
  serviceIndex: 0,
  message: "",
  errors: {},
};

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.handleChange = this.handleChange.bind(this);
    this.handleWhatsApp = this.handleWhatsApp.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: name === "serviceIndex" ? Number(value) : value });
  }

  validate() {
    const { t } = this.props;
    const errors = {};
    if (!this.state.name.trim()) errors.name = t("contact.form.errors.name");
    if (!this.state.phone.trim()) errors.phone = t("contact.form.errors.phone");
    if (!this.state.message.trim()) errors.message = t("contact.form.errors.message");
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  buildMessage(serviceLabel) {
    const { name, phone, message } = this.state;
    return (
      `Hello Innovatech, my name is ${name}.\n` +
      `Contact: ${phone}\n` +
      `Service: ${serviceLabel}\n\n` +
      `${message}`
    );
  }

  handleWhatsApp(event) {
    event.preventDefault();
    if (!this.validate()) return;
    const options = this.props.t("contact.form.serviceOptions", { returnObjects: true });
    const text = encodeURIComponent(this.buildMessage(options[this.state.serviceIndex]));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noreferrer");
  }

  handleEmail(event) {
    event.preventDefault();
    if (!this.validate()) return;
    const options = this.props.t("contact.form.serviceOptions", { returnObjects: true });
    const serviceLabel = options[this.state.serviceIndex];
    const subject = encodeURIComponent(`Enquiry from ${this.state.name} — ${serviceLabel}`);
    const body = encodeURIComponent(this.buildMessage(serviceLabel));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  render() {
    const { name, phone, serviceIndex, message, errors } = this.state;
    const { t } = this.props;
    const serviceOptions = t("contact.form.serviceOptions", { returnObjects: true });

    return (
      <form className="contact-form" noValidate>
        <div className="form-row">
          <label htmlFor="name">{t("contact.form.name")}</label>
          <input id="name" name="name" type="text" value={name} onChange={this.handleChange} placeholder={t("contact.form.namePlaceholder")} />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="phone">{t("contact.form.phone")}</label>
          <input id="phone" name="phone" type="text" value={phone} onChange={this.handleChange} placeholder={t("contact.form.phonePlaceholder")} />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="service">{t("contact.form.service")}</label>
          <select id="service" name="serviceIndex" value={serviceIndex} onChange={this.handleChange}>
            {serviceOptions.map((option, index) => (
              <option key={option} value={index}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="message">{t("contact.form.message")}</label>
          <textarea id="message" name="message" rows="4" value={message} onChange={this.handleChange} placeholder={t("contact.form.messagePlaceholder")} />
          {errors.message && <span className="form-error">{errors.message}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" onClick={this.handleWhatsApp}>
            <FaPaperPlane aria-hidden="true" /> {t("common.sendWhatsApp")}
          </button>
          <button type="submit" className="btn btn--ghost" onClick={this.handleEmail}>
            <FaEnvelope aria-hidden="true" /> {t("common.sendEmail")}
          </button>
        </div>
      </form>
    );
  }
}

export default withTranslation()(ContactForm);
