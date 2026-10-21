import React from "react";
import { motion } from "framer-motion";

// Wraps children in a scroll-triggered fade/slide-up animation.
// Centralising the transition here keeps every page's markup declarative
// instead of re-writing the same motion props everywhere.
export default class Reveal extends React.Component {
  render() {
    const { children, delay = 0, y = 28, className = "", as = "div", id } = this.props;
    const MotionTag = motion[as] || motion.div;

    return (
      <MotionTag
        className={className}
        id={id}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      >
        {children}
      </MotionTag>
    );
  }
}
