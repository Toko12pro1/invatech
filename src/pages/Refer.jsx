import React, { useEffect, useState } from "react";
import { FaArrowRight, FaGift, FaLink, FaShieldAlt, FaUserCircle, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { whatsappLink } from "../data/marketplace";
import { supabase } from "../lib/supabaseClient";

function buildReferralCode(name) {
  const cleanName = name.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 5) || "INNOVA";
  return `${cleanName}-${Math.floor(100 + Math.random() * 900)}`;
}

export default function Refer() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedCode = window.localStorage.getItem("innovatech-referral-code");
    if (savedCode) setCode(savedCode);
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) loadProfile(nextSession);
      else setProfile(null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function loadProfile(currentSession) {
    const { data } = await supabase.from("referral_profiles").select("referral_code, full_name").eq("id", currentSession.user.id).maybeSingle();
    if (data) {
      setProfile(data);
      setCode(data.referral_code);
    }
  }

  function generateCode(event) {
    event.preventDefault();
    const nextCode = buildReferralCode(name);
    setCode(nextCode);
    window.localStorage.setItem("innovatech-referral-code", nextCode);
    setCopied(false);
  }

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const shareMessage = code
    ? `Join me on Innovatech Marketplace. Use my referral code ${code} when you shop from a verified partner store.`
    : "Join me on Innovatech Marketplace and shop from verified partner stores.";

  return (
    <main>
      <PageHero
        image="/images/hero-home.jpg"
        eyebrow="Referral programme"
        title="Share trust. Earn your next advantage."
        subtitle="Invite someone to shop through our verified partner stores. They get a better buying experience, and you get rewarded when the referral is confirmed."
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Simple by design"
            title="A referral link people can actually use"
            subtitle="Generate your personal code, send it on WhatsApp and let us handle the verification step."
          />
          <div className="grid grid--3 referral-benefits">
            <Reveal className="feature-card feature-card--bordered">
              <span className="feature-icon"><FaLink /></span>
              <h3>Get your code</h3>
              <p>Create one memorable referral code for your friends, family or customers.</p>
            </Reveal>
            <Reveal className="feature-card feature-card--bordered" delay={0.08}>
              <span className="feature-icon"><FaWhatsapp /></span>
              <h3>Share on WhatsApp</h3>
              <p>Send a ready-made message with one tap, wherever your community is.</p>
            </Reveal>
            <Reveal className="feature-card feature-card--bordered" delay={0.16}>
              <span className="feature-icon"><FaGift /></span>
              <h3>Unlock a reward</h3>
              <p>Once the purchase is verified, we contact you about your referral benefit.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container split referral-builder">
          <Reveal className="split-content">
            <span className="eyebrow">Your referral hub</span>
            <h2>Turn your network into better buying decisions.</h2>
            <p>
              Your code is not just a discount trick. It helps friends find stores that are visible,
              reachable and connected to a team that can help verify a product before they pay.
            </p>
            <ul className="checklist">
              <li>Share products from the marketplace or any partner store</li>
              <li>Give people a direct Innovatech support channel</li>
              <li>Earn a reward after a confirmed purchase</li>
            </ul>
            <Link to="/shop" className="btn btn--secondary">Browse products <FaArrowRight /></Link>
          </Reveal>

          <Reveal className="referral-card" delay={0.1}>
            <span className="referral-card-icon"><FaGift /></span>
            <span className="eyebrow eyebrow--light">Create your code</span>
            <h3>Ready to share?</h3>
            <p>{session ? "Your account owns this code, so your referrals can be connected to you." : "Create a free account to keep your referral code connected to you and make rewards accountable."}</p>
            {session ? (
              <div className="referral-account-linked"><FaUserCircle /><span><strong>{profile?.full_name || "Account connected"}</strong><small>Persistent referral identity</small></span><Link to="/account" className="btn btn--ghost">Manage account</Link></div>
            ) : (
              <>
                <Link to="/account" className="btn btn--primary referral-account-cta"><FaUserCircle /> Create an account</Link>
                <div className="referral-or"><span>or try a temporary code</span></div>
                <form onSubmit={generateCode} className="partner-form">
                  <div className="form-row">
                    <label htmlFor="referral-name">Your name</label>
                    <input id="referral-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Emmanuel" required />
                  </div>
                  <button type="submit" className="btn btn--ghost">Generate temporary code</button>
                </form>
              </>
            )}
            {code && (
              <div className="referral-result">
                <span className="voucher-label">Your code</span>
                <strong>{code}</strong>
                <div className="referral-actions">
                  <button type="button" className="btn btn--ghost" onClick={copyCode}>{copied ? "Copied" : "Copy code"}</button>
                  <a className="btn btn--primary" href={whatsappLink(shareMessage)} target="_blank" rel="noreferrer"><FaWhatsapp /> Share</a>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container referral-note">
          <FaShieldAlt aria-hidden="true" />
          <div>
            <h3>We keep the reward process transparent.</h3>
            <p>Referral rewards are confirmed after Innovatech verifies the purchase with the partner store. No hidden steps, no anonymous checkout.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
