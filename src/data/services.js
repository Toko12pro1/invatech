import Service from "../models/Service";
import { FaMobileAlt, FaMicrochip, FaLaptopCode, FaStore, FaDraftingCompass } from "react-icons/fa";

const services = [
  new Service({
    id: "device-repair",
    icon: FaMobileAlt,
    image: "/images/service-device-repair.jpg",
  }),
  new Service({
    id: "electronics-repair",
    icon: FaMicrochip,
    image: "/images/service-electronics-repair.jpg",
  }),
  new Service({
    id: "software-development",
    icon: FaLaptopCode,
    image: "/images/service-app-development.jpg",
  }),
  new Service({
    id: "electronics-sales",
    icon: FaStore,
    image: "/images/service-sales.jpg",
  }),
  new Service({
    id: "design-conception",
    icon: FaDraftingCompass,
    image: "/images/innovation-prototype.jpg",
  }),
];

export default services;
