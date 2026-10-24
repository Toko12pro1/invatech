const REFERRAL_ATTRIBUTION_KEY = "innovatech-referral-attribution";
const LEGACY_REFERRAL_CODE_KEY = "innovatech-referral-code";
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function safeRead(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getStoredReferralAttribution() {
  const raw = safeRead(REFERRAL_ATTRIBUTION_KEY);
  if (!raw) return null;

  try {
    const value = JSON.parse(raw);
    const capturedAt = new Date(value.capturedAt || 0).getTime();
    if (!value.referralCode || !Number.isFinite(capturedAt) || Date.now() - capturedAt > ATTRIBUTION_TTL_MS) {
      window.localStorage.removeItem(REFERRAL_ATTRIBUTION_KEY);
      return null;
    }
    return {
      referralCode: String(value.referralCode).trim().toUpperCase(),
      productId: value.productId || null,
      capturedAt: value.capturedAt,
    };
  } catch {
    return null;
  }
}

export function rememberReferralAttribution(referralCode, productId = null) {
  const code = String(referralCode || "").trim().toUpperCase();
  if (!code || typeof window === "undefined") return null;

  const attribution = {
    referralCode: code,
    productId: productId || null,
    capturedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(REFERRAL_ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Referral attribution is helpful but should never block the product page.
  }
  return attribution;
}

export function getStoredReferralCode() {
  const attribution = getStoredReferralAttribution();
  if (attribution?.referralCode) return attribution.referralCode;
  return String(safeRead(LEGACY_REFERRAL_CODE_KEY) || "").trim().toUpperCase();
}

export function buildProductShareLink(productId, referralCode = getStoredReferralCode()) {
  const params = new URLSearchParams();
  if (productId) params.set("productId", productId);
  if (referralCode) params.set("ref", String(referralCode).trim().toUpperCase());
  const path = `/shop${params.toString() ? `?${params.toString()}` : ""}`;
  return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
}
