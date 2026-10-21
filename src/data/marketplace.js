import Product from "../models/Product";

export const WHATSAPP_NUMBER = "237651162373";

export const PARTNER_STORES = [
  {
    id: "mobi-tech-centre",
    name: "MobiTech Centre",
    category: "Phones & accessories",
    location: "Melen, Yaoundé",
    responseTime: "Usually replies in 10 min",
    description: "Smartphones, chargers and reliable everyday accessories for work and school.",
    image: "/images/product-phone.jpg",
    accent: "orange",
  },
  {
    id: "nexa-gadgets",
    name: "Nexa Gadgets",
    category: "Audio & wearables",
    location: "Bastos, Yaoundé",
    responseTime: "Usually replies in 20 min",
    description: "Curated audio, smartwatches and connected gadgets, checked before listing.",
    image: "/images/product-smartwatch.jpg",
    accent: "yellow",
  },
  {
    id: "campoint",
    name: "CamPoint Studio",
    category: "Cameras & creative gear",
    location: "Akwa, Douala",
    responseTime: "Usually replies in 15 min",
    description: "Cameras and creator gear for people who want to make, document and share.",
    image: "/images/product-camera.jpg",
    accent: "navy",
  },
];

export const DEMO_PRODUCTS = [
  {
    id: "demo-phone",
    name_en: "Smartphone — 128GB",
    name_fr: "Smartphone — 128 Go",
    category: "Smartphones",
    price: 285000,
    old_price: null,
    condition: "New",
    badge: "Best Seller",
    image_url: "/images/product-phone.jpg",
    store_id: "mobi-tech-centre",
    negotiable: true,
    fast_deal: true,
    fast_deal_note: "Seller needs a quick sale",
    sort_order: 1,
    active: true,
  },
  {
    id: "demo-watch",
    name_en: "Smartwatch Series",
    name_fr: "Montre Connectée",
    category: "Wearables",
    price: 95000,
    old_price: 115000,
    condition: "New",
    badge: "On Sale",
    image_url: "/images/product-smartwatch.jpg",
    store_id: "nexa-gadgets",
    negotiable: false,
    fast_deal: false,
    sort_order: 2,
    active: true,
  },
  {
    id: "demo-speaker",
    name_en: "Smart Speaker Assistant",
    name_fr: "Enceinte Intelligente",
    category: "Audio",
    price: 45000,
    old_price: 60000,
    condition: "Fairly Used",
    badge: "On Sale",
    image_url: "/images/product-speaker.jpg",
    store_id: "nexa-gadgets",
    negotiable: true,
    fast_deal: true,
    fast_deal_note: "Limited-time price from the store",
    sort_order: 3,
    active: true,
  },
  {
    id: "demo-camera",
    name_en: "Instant Camera",
    name_fr: "Appareil Photo Instantané",
    category: "Cameras",
    price: 78000,
    old_price: null,
    condition: "Fairly Used",
    badge: "Popular",
    image_url: "/images/product-camera.jpg",
    store_id: "campoint",
    negotiable: true,
    fast_deal: false,
    sort_order: 4,
    active: true,
  },
];

export const PORTFOLIO_PROJECTS = [
  {
    title: "Skolar school platform",
    category: "Education technology",
    description: "A practical school-management platform that keeps administrators, teachers and families in sync.",
    image: "/images/innovation-lab.jpg",
    tags: ["Web platform", "Product design"],
    result: "Built and maintained in-house",
    url: "https://skolar.cm",
  },
  {
    title: "Connected inventory system",
    category: "Business software",
    description: "A clearer way for a growing business to track stock, orders and customer conversations.",
    image: "/images/about-workspace.jpg",
    tags: ["Dashboard", "Automation"],
    result: "Less manual follow-up",
    url: "/contact",
  },
  {
    title: "IoT proof of concept",
    category: "Hardware & IoT",
    description: "A sensor prototype that turns a real-world problem into useful data and a decision-ready view.",
    image: "/images/innovation-sensors.jpg",
    tags: ["IoT", "Prototype"],
    result: "From idea to working demo",
    url: "/contact",
  },
];

export function toMarketplaceProduct(row, index = 0) {
  const fallbackStore = PARTNER_STORES[index % PARTNER_STORES.length];
  const relatedStoreValue = row.stores || row.store;
  const relatedStore = Array.isArray(relatedStoreValue) ? relatedStoreValue[0] : relatedStoreValue;
  const store = PARTNER_STORES.find((item) => item.id === row.store_id) || relatedStore || fallbackStore;

  return new Product({
    ...row,
    store_id: row.store_id || store.id,
    store_name: row.store_name || store.name,
    store_location: row.store_location || store.location,
    verification_status: row.verification_status || "verified",
  });
}

export function getDemoProducts() {
  return DEMO_PRODUCTS.map(toMarketplaceProduct);
}

export function whatsappLink(message = "Hi Innovatech, I would like to know more.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
