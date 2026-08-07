import React from "react";
import { FaLaptopCode, FaWrench, FaMicrochip } from "react-icons/fa";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const SERVICE_LINES = [
  {
    icon: FaLaptopCode,
    text: "We build the software — school platforms, business apps, websites",
  },
  {
    icon: FaWrench,
    text: "We fix what breaks — phones, laptops, electronics",
  },
  {
    icon: FaMicrochip,
    text: "We supply the hardware — sourced, tested, guaranteed",
  },
];

export default class PromoVideo extends React.Component {
  render() {
    return (
      <section className="section promo-section">
        <div className="container">
          <SectionHeading
            eyebrow="See Us In Action"
            title="Innovatech, In Under Two Minutes"
            subtitle="Tap play when you're ready — the video only loads once you press it, so it won't eat into your data."
          />

          <Reveal className="promo-video-wrap">
            <video
              controls
              playsInline
              preload="none"
              poster="/images/promo-poster.jpg"
              aria-label="Innovatech Engineering Solutions company promo video"
            >
              {/* Only a .webm was supplied — add an .mp4 <source> above this line once one exists, for Safari/iOS fallback */}
              <source src="/videos/innovatech-promo.webm" type="video/webm" />
            </video>
          </Reveal>

          <div className="grid grid--3 promo-lines">
            {SERVICE_LINES.map((line, index) => {
              const Icon = line.icon;
              return (
                <Reveal key={line.text} delay={index * 0.08} className="promo-line">
                  <span className="promo-line-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <p>{line.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}
