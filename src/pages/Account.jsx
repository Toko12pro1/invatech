import React, { useEffect, useState } from "react";
import { FaArrowRight, FaCheckCircle, FaCopy, FaGift, FaShieldAlt, FaSignOutAlt, FaUserCircle, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { supabase } from "../lib/supabaseClient";
import { whatsappLink } from "../data/marketplace";
import { STORE_OWNER_CATEGORIES } from "../data/catalog";

const LEGAL_VERSION = "2026-10-21";

function makeLocalCode() {
  return `INN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function Account() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ownerApplication, setOwnerApplication] = useState(null);
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    legalAccepted: false,
    accountType: "member",
    businessName: "",
    businessCategory: STORE_OWNER_CATEGORIES[0],
    businessLocation: "",
    businessDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [localCode, setLocalCode] = useState("");
  const [referralEvents, setReferralEvents] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      if (data.session) loadProfile(data.session);
      setLoading(false);
    }
    loadSession();
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) loadProfile(nextSession);
      else setProfile(null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(currentSession) {
    const userId = currentSession.user.id;
    const [{ data }, { data: events }, { data: application }] = await Promise.all([
      supabase.from("referral_profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("referral_events").select("id, referred_name, order_reference, status, reward_amount, created_at").eq("referrer_id", userId).order("created_at", { ascending: false }).limit(20),
      supabase.from("store_owner_applications").select("*").eq("user_id", userId).maybeSingle(),
    ]);
    setReferralEvents(events || []);
    setOwnerApplication(application || null);
    if (data) {
      setProfile(data);
      window.localStorage.setItem("innovatech-referral-code", data.referral_code);
      return;
    }
    const key = `innovatech-referral-code-${userId}`;
    const saved = window.localStorage.getItem(key) || makeLocalCode();
    window.localStorage.setItem(key, saved);
    window.localStorage.setItem("innovatech-referral-code", saved);
    setLocalCode(saved);
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitAuth(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    if (mode === "signup") {
      if (!form.legalAccepted) {
        setError("Please accept the Terms of Service and Privacy Notice to create an account.");
        setSubmitting(false);
        return;
      }
      if (form.accountType === "store_owner" && (!form.businessName.trim() || !form.businessLocation.trim() || !form.businessDescription.trim())) {
        setError("Add your store name, location and a short description of what you sell.");
        setSubmitting(false);
        return;
      }
      const { data, error: signupError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            phone: form.phone,
            account_type: form.accountType,
            business_name: form.businessName,
            business_category: form.businessCategory,
            business_location: form.businessLocation,
            business_whatsapp: form.phone,
            business_description: form.businessDescription,
            terms_version: LEGAL_VERSION,
            legal_accepted_at: new Date().toISOString(),
          },
        },
      });
      if (signupError) {
        setError(signupError.message);
      } else if (data.session) {
        setSession(data.session);
        await loadProfile(data.session);
        setMessage(form.accountType === "store_owner"
          ? "Your account is ready. Your store-owner application is waiting for Innovatech review."
          : "Your account is ready. Your referral code is now linked to you.");
      } else {
        setMessage(form.accountType === "store_owner"
          ? "Check your email to confirm your account. We will review your store application after confirmation."
          : "Check your email to confirm your account, then sign in to access your referral code.");
      }
    } else {
      const { data, error: signinError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (signinError) setError("We could not sign you in. Check your email and password.");
      else if (data.session) {
        setSession(data.session);
        await loadProfile(data.session);
        setMessage("Welcome back.");
      }
    }
    setSubmitting(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setOwnerApplication(null);
    setReferralEvents([]);
    setMessage("You have been signed out.");
  }

  async function copyCode() {
    const code = profile?.referral_code || localCode;
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
  }

  const code = profile?.referral_code || localCode;
  const name = profile?.full_name || session?.user?.user_metadata?.full_name || "Innovatech member";
  const referralLink = code ? `${window.location.origin}/consult?request=purchase_trace&ref=${encodeURIComponent(code)}` : `${window.location.origin}/consult?request=purchase_trace`;

  return (
    <main id="main-content">
      <PageHero
        image="/images/hero-home.jpg"
        eyebrow="Your Innovatech account"
        title="Keep your referrals and conversations accountable."
        subtitle="Create one simple account so your referral code belongs to you, your activity is easier to track and support can recognise you."
      />

      <section className="section">
        <div className="container">
          {loading ? <p>Loading account...</p> : session ? (
            <div className="account-dashboard">
              <Reveal className="account-main-card">
                <div className="account-welcome"><span className="account-avatar"><FaUserCircle /></span><div><span className="eyebrow">Member account</span><h2>Welcome, {name}</h2><p>Your account keeps your referral identity connected to your activity.</p></div></div>
                <div className="account-code-card">
                  <div><span className="voucher-label">Your referral code</span><strong>{code || "Preparing..."}</strong><small>Share this code when someone shops through Innovatech.</small></div>
                  <div className="account-code-actions"><button className="btn btn--ghost" onClick={copyCode}><FaCopy /> {copied ? "Copied" : "Copy"}</button><a className="btn btn--primary" href={whatsappLink(`Shop directly with a partner store and keep the purchase traceable. Use my Innovatech referral code ${code}: ${referralLink}`)} target="_blank" rel="noreferrer"><FaWhatsapp /> Share</a></div>
                </div>
                {message && <p className="seller-message seller-message--success"><FaCheckCircle /> {message}</p>}
                <div className="account-detail-list"><div><span>Email</span><strong>{session.user.email}</strong></div><div><span>Phone</span><strong>{profile?.phone || session.user.user_metadata?.phone || "Add it when you contact us"}</strong></div></div>
                {ownerApplication && <div className="owner-application-card">
                  <div>
                    <span className="eyebrow">Store-owner application</span>
                    <h3>{ownerApplication.business_name}</h3>
                    <p>{ownerApplication.category} · {ownerApplication.location}</p>
                  </div>
                  <span className={`admin-status admin-status--${ownerApplication.status}`}>{ownerApplication.status}</span>
                  {ownerApplication.status === "approved" && <Link to="/admin/seller" className="btn btn--primary">Open seller workspace <FaArrowRight /></Link>}
                  {ownerApplication.status === "pending" && <small>Innovatech will review your store before publishing listings.</small>}
                  {ownerApplication.status === "rejected" && <small>{ownerApplication.review_note || "Please contact Innovatech if you want to update the application."}</small>}
                </div>}
                {referralEvents.length > 0 && <div className="account-referral-history"><div className="account-referral-history-head"><h3>Referral activity</h3><span>Latest 20</span></div><div className="account-referral-history-list">{referralEvents.map((event) => <div className="account-referral-event" key={event.id}><div><strong>{event.referred_name || "Referral"}</strong><small>{event.order_reference || "Purchase reference pending"}</small></div><div><span className={`admin-status admin-status--${event.status}`}>{event.status}</span><strong>{Number(event.reward_amount || 0).toLocaleString()} FCFA</strong></div></div>)}</div></div>}
              </Reveal>
              <Reveal className="account-side-card" delay={0.1}>
                <span className="feature-icon"><FaGift /></span><h3>How accountability works</h3><ol><li>Your code identifies your referral.</li><li>We confirm the purchase with the partner store.</li><li>Your reward is recorded and we contact you.</li></ol><Link to="/refer" className="btn btn--secondary">Open referral hub <FaArrowRight /></Link><button className="account-signout" onClick={signOut}><FaSignOutAlt /> Sign out</button>
              </Reveal>
            </div>
          ) : (
            <div className="account-auth-layout">
              <Reveal className="account-auth-card">
                <div className="account-auth-tabs"><button className={mode === "signup" ? "account-auth-tab--active" : ""} onClick={() => setMode("signup")}>Create account</button><button className={mode === "signin" ? "account-auth-tab--active" : ""} onClick={() => setMode("signin")}>Sign in</button></div>
                <h2>{mode === "signup" ? form.accountType === "store_owner" ? "Create your store-owner account" : "Create your referral account" : "Welcome back"}</h2>
                <p>{mode === "signup" ? form.accountType === "store_owner" ? "Apply to join the Innovatech marketplace. Your store is reviewed before it goes live." : "Only a few details. Your referral code will stay connected to you." : "Sign in to see your code and referral activity."}</p>
                <form onSubmit={submitAuth} className="account-auth-form">
                  {mode === "signup" && <>
                    <div className="account-type-picker" aria-label="Account type">
                      <button type="button" className={form.accountType === "member" ? "account-type-card account-type-card--active" : "account-type-card"} onClick={() => setForm((current) => ({ ...current, accountType: "member" }))}><strong>Referral member</strong><span>Share products and track rewards.</span></button>
                      <button type="button" className={form.accountType === "store_owner" ? "account-type-card account-type-card--active" : "account-type-card"} onClick={() => setForm((current) => ({ ...current, accountType: "store_owner" }))}><strong>Store owner</strong><span>Apply to list and manage your products.</span></button>
                    </div>
                    <div className="form-row"><label htmlFor="account-full-name">Your full name</label><input id="account-full-name" name="fullName" autoComplete="name" value={form.fullName} onChange={updateField} required /></div><div className="form-row"><label htmlFor="account-phone">Phone / WhatsApp</label><input id="account-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={updateField} placeholder="+237 ..." required /></div>
                    {form.accountType === "store_owner" && <>
                      <div className="form-row"><label htmlFor="account-business-name">Store name</label><input id="account-business-name" name="businessName" value={form.businessName} onChange={updateField} placeholder="e.g. MobiTech Centre" required /></div>
                      <div className="form-row"><label htmlFor="account-business-category">Main category</label><select id="account-business-category" name="businessCategory" value={form.businessCategory} onChange={updateField}>{STORE_OWNER_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>
                      <div className="form-row"><label htmlFor="account-business-location">Store location</label><input id="account-business-location" name="businessLocation" value={form.businessLocation} onChange={updateField} placeholder="e.g. Melen, Yaoundé" required /></div>
                      <div className="form-row"><label htmlFor="account-business-description">What do you sell?</label><textarea id="account-business-description" name="businessDescription" value={form.businessDescription} onChange={updateField} rows="3" placeholder="Tell us about your products, brands or services." required /></div>
                    </>}
                  </>}
                  <div className="form-row"><label htmlFor="account-email">Email</label><input id="account-email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} required /></div>
                  <div className="form-row"><label htmlFor="account-password">Password</label><input id="account-password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength="6" value={form.password} onChange={updateField} required /></div>
                  {mode === "signup" && <label className="legal-consent-check"><input name="legalAccepted" type="checkbox" checked={form.legalAccepted} onChange={(event) => setForm((current) => ({ ...current, legalAccepted: event.target.checked }))} required /><span>I agree to the <Link to="/terms">Terms of Service</Link> and acknowledge the <Link to="/privacy">Privacy Notice</Link>.</span></label>}
                  {error && <p className="form-error">{error}</p>}{message && <p className="seller-message seller-message--success"><FaCheckCircle /> {message}</p>}
                  <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}</button>
                </form>
              </Reveal>
              <Reveal className="account-explainer" delay={0.1}><span className="feature-icon"><FaShieldAlt /></span><h2>Useful, not complicated.</h2><p>Your account is for accountability—not for filling out long forms. It helps us connect referrals, store conversations and rewards to the right person.</p><ul className="checklist"><li>One persistent referral code</li><li>Phone/WhatsApp contact for support</li><li>Clear record when a purchase is confirmed</li></ul></Reveal>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
