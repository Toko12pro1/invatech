const PIXEL_ID = String(import.meta.env.VITE_META_PIXEL_ID || "").trim();
const CONSENT_KEY = "innovatech-analytics-consent";

export function isMetaPixelConfigured() {
  return Boolean(PIXEL_ID);
}

export function initMetaPixel() {
  if (!PIXEL_ID || typeof window === "undefined") return false;
  if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return false;
  if (window.__innovatechMetaPixelInitialized) return true;

  const fbq = (...args) => {
    if (window.fbq) window.fbq(...args);
  };
  window.fbq = window.fbq || function metaPixelQueue() {
    window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
  };
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = "2.0";
  window.fbq.queue = [];

  if (!document.querySelector('script[data-innovatech-meta-pixel="true"]')) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.innovatechMetaPixel = "true";
    document.head.appendChild(script);
  }

  fbq("init", PIXEL_ID);
  window.__innovatechMetaPixelInitialized = true;
  return true;
}

export function trackMetaEvent(eventName, parameters = {}) {
  if (!PIXEL_ID || typeof window === "undefined") return;
  if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;
  initMetaPixel();
  if (window.fbq) window.fbq("track", eventName, parameters);
}
