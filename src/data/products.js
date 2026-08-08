import Product from "../models/Product";

const products = [
  new Product({
    id: "smartphone-1",
    category: "Smartphones",
    price: 285000,
    image: "/images/product-phone.jpg",
    condition: "New",
    badge: "Best Seller",
  }),
  new Product({
    id: "smartwatch-1",
    category: "Wearables",
    price: 95000,
    oldPrice: 115000,
    image: "/images/product-smartwatch.jpg",
    condition: "New",
    badge: "On Sale",
  }),
  new Product({
    id: "smart-speaker-1",
    category: "Audio",
    price: 45000,
    oldPrice: 60000,
    image: "/images/product-speaker.jpg",
    condition: "Fairly Used",
    badge: "On Sale",
  }),
  new Product({
    id: "studio-speaker-1",
    category: "Audio",
    price: 65000,
    image: "/images/product-speaker2.jpg",
    condition: "New",
  }),
  new Product({
    id: "instant-camera-1",
    category: "Cameras",
    price: 78000,
    image: "/images/product-camera.jpg",
    condition: "Fairly Used",
    badge: "Popular",
  }),
  new Product({
    id: "gaming-bundle-1",
    category: "Gaming",
    price: 40000,
    image: "/images/service-device-repair.jpg",
    condition: "Fairly Used",
  }),
];

export default products;
