import React from "react";
import { FaArrowRight, FaCheckCircle, FaClipboardCheck, FaHandshake, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import BasePage from "../components/BasePage";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import StoreCard from "../components/StoreCard";
import { PARTNER_STORES, whatsappLink } from "../data/marketplace";
import { supabase } from "../lib/supabaseClient";

class PartnerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", phone: "", location: "", products: "", productName: "", price: "", submitted: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, phone, location, products, productName, price } = this.state;
    const message = `Hi Innovatech, I would like to list my store and a product on your marketplace.\n\nStore: ${name}\nPhone: ${phone}\nLocation: ${location}\nProduct to review: ${productName}\nExpected price: ${price} FCFA\nOther products: ${products}`;
    this.setState({ submitted: true });
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  render() {
    const { name, phone, location, products, productName, price, submitted } = this.state;
    if (submitted) {
      return (
        <div className="partner-form-success">
          <FaCheckCircle aria-hidden="true" />
          <h3>We have your details.</h3>
          <p>Your WhatsApp message is ready. Our team will review your store and follow up with the next steps.</p>
          <button className="btn btn--ghost" onClick={() => this.setState({ submitted: false })}>Submit another store</button>
        </div>
      );
    }

    return (
      <form onSubmit={this.handleSubmit} className="partner-form">
        <div className="form-row">
          <label htmlFor="partner-name">Store name</label>
          <input id="partner-name" name="name" value={name} onChange={this.handleChange} placeholder="e.g. MobiTech Centre" required />
        </div>
        <div className="form-row">
          <label htmlFor="partner-phone">WhatsApp number</label>
          <input id="partner-phone" name="phone" value={phone} onChange={this.handleChange} placeholder="e.g. +237 ..." required />
        </div>
        <div className="form-row">
          <label htmlFor="partner-location">City / location</label>
          <input id="partner-location" name="location" value={location} onChange={this.handleChange} placeholder="e.g. Yaoundé" required />
        </div>
        <div className="form-row">
          <label htmlFor="partner-product-name">Product to list first</label>
          <input id="partner-product-name" name="productName" value={productName} onChange={this.handleChange} placeholder="e.g. iPhone 13 128GB" required />
        </div>
        <div className="form-row">
          <label htmlFor="partner-price">Expected price (FCFA)</label>
          <input id="partner-price" name="price" type="number" min="0" value={price} onChange={this.handleChange} placeholder="e.g. 250000" required />
        </div>
        <div className="form-row">
          <label htmlFor="partner-products">Other products you sell</label>
          <textarea id="partner-products" name="products" value={products} onChange={this.handleChange} rows="3" placeholder="Phones, laptops, accessories..." />
        </div>
        <button type="submit" className="btn btn--primary"><FaWhatsapp /> Submit product for review</button>
      </form>
    );
  }
}

export default class Stores extends BasePage {
  constructor(props) {
    super(props);
    this.state = { stores: PARTNER_STORES };
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadStores();
  }

  async loadStores() {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("active", true)
      .eq("verified", true)
      .order("name");
    if (error || !data?.length) return;

    this.setState({
      stores: data.map((store, index) => ({
        ...store,
        image: store.image_url || PARTNER_STORES[index % PARTNER_STORES.length].image,
        responseTime: store.response_time || "Usually replies on WhatsApp",
      })),
    });
  }

  renderPage() {
    const { stores } = this.state;
    return (
      <>
        <PageHero
          image="/images/hero-shop.jpg"
          eyebrow="Innovatech marketplace"
          title="Meet the stores we are connected to"
          subtitle="Discover products from real local stores, with Innovatech helping you verify the listing, ask the right questions and buy with more confidence."
        />

        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Verified network"
              title="A marketplace with a human layer"
              subtitle="Every store on this page has a relationship with our team. We keep the process simple: see the store, see the product, then talk."
            />
            <div className="grid grid--3">
              {stores.map((store, index) => <StoreCard key={store.id} store={store} index={index} />)}
            </div>
          </div>
        </section>

        <section className="section section--dark">
          <div className="container">
            <SectionHeading
              eyebrow="How it works"
              title="Your purchase has a safety net"
              subtitle="We do not replace the store. We make the connection clearer and the decision safer."
            />
            <div className="grid grid--3 marketplace-process">
              <Reveal className="process-step process-step--dark">
                <span className="feature-icon"><FaHandshake /></span>
                <h3>1. Connect</h3>
                <p>Choose a product or store and start the conversation on WhatsApp.</p>
              </Reveal>
              <Reveal className="process-step process-step--dark" delay={0.08}>
                <span className="feature-icon"><FaClipboardCheck /></span>
                <h3>2. Verify</h3>
                <p>We confirm availability and help test or inspect the product where possible.</p>
              </Reveal>
              <Reveal className="process-step process-step--dark" delay={0.16}>
                <span className="feature-icon"><FaShieldAlt /></span>
                <h3>3. Buy confidently</h3>
                <p>Buy from the store, request a reduction or place the order with our support.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section section--alt">
          <div className="container split partner-section">
            <Reveal className="split-content">
              <span className="eyebrow">For store owners</span>
              <h2>Put your products in front of people who are ready to buy.</h2>
              <p>
                Join a trusted network that gives your products more visibility, a direct WhatsApp
                conversation and a verification layer your customers can understand.
              </p>
              <ul className="checklist">
                <li>Show your store name, location and specialty</li>
                <li>Receive interested buyers directly on WhatsApp</li>
                <li>Let Innovatech help with product checks and trust</li>
              </ul>
              <Link to="/refer" className="btn btn--secondary">Invite a customer too <FaArrowRight /></Link>
            </Reveal>
            <Reveal className="contact-form-card partner-form-card" delay={0.1}>
              <h3>List a product with us</h3>
              <p>Send your store and first product details over WhatsApp. We will review, verify and publish approved listings.</p>
              <PartnerForm />
              <p className="seller-access-note">Already approved as a partner? <Link to="/admin/seller">Open your seller workspace</Link></p>
            </Reveal>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container cta-banner-inner">
            <Reveal>
              <h2>Can’t find what you need?</h2>
              <p>Tell us what you are looking for and we will ask our network.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <a className="btn btn--dark" href={whatsappLink("Hi Innovatech, please help me find a product through your partner stores.")} target="_blank" rel="noreferrer">
                <FaWhatsapp /> Ask the network
              </a>
            </Reveal>
          </div>
        </section>
      </>
    );
  }
}
