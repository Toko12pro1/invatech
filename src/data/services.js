import Service from "../models/Service";
import { FaMobileAlt, FaMicrochip, FaLaptopCode, FaStore } from "react-icons/fa";

const services = [
  new Service({
    id: "device-repair",
    icon: FaMobileAlt,
    title: "Phone & Gadget Repair",
    summary: "Screens, batteries, ports and software faults fixed fast — for phones, laptops, consoles and smart devices.",
    description:
      "From a cracked screen to a phone that won't charge, our technicians diagnose and repair smartphones, laptops, gaming consoles and smart-home devices. We use genuine and high-grade parts, and most common repairs are completed the same day.",
    image: "/images/service-device-repair.jpg",
    features: [
      "Screen & battery replacement",
      "Charging port & button repair",
      "Software faults & data recovery",
      "Console & accessory repair",
    ],
  }),
  new Service({
    id: "electronics-repair",
    icon: FaMicrochip,
    title: "Electronics & Hardware Repair",
    summary: "Hands-on circuit-level diagnostics and repair for TVs, appliances, and other electronic equipment.",
    description:
      "Our engineers go beyond the surface — tracing faults down to component and circuit level for televisions, home appliances, power units and other electronic equipment that others give up on.",
    image: "/images/service-electronics-repair.jpg",
    features: [
      "Circuit-level fault diagnosis",
      "TV & home appliance repair",
      "Power unit & board-level repair",
      "Preventive maintenance",
    ],
  }),
  new Service({
    id: "software-development",
    icon: FaLaptopCode,
    title: "App & Software Development",
    summary: "Custom software, mobile apps and web platforms — built and maintained by the team behind Skolar.",
    description:
      "We design, build and maintain software for businesses and institutions — from mobile apps to full web platforms. Skolar, our flagship school-management platform, was built and is maintained by this same engineering team.",
    image: "/images/service-app-development.jpg",
    features: [
      "Custom web & mobile apps",
      "Ongoing maintenance & support",
      "School & business management systems",
      "API integrations",
    ],
  }),
  new Service({
    id: "electronics-sales",
    icon: FaStore,
    title: "Sales of New & Fairly-Used Electronics",
    summary: "Verified, tested phones, laptops and gadgets — new and fairly-used — with warranty on every unit.",
    description:
      "Every device we sell — new or fairly-used — is tested and verified in-house before it reaches you, backed by a warranty and after-sales support from the same team that repairs it.",
    image: "/images/service-sales.jpg",
    features: [
      "Tested & verified devices",
      "New and fairly-used options",
      "Warranty on every unit",
      "Trade-in available",
    ],
  }),
];

export default services;
