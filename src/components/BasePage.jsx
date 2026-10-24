import React from "react";
import { motion } from "framer-motion";

// Shared page behaviour (scroll-to-top + fade-in transition) that every
// page class inherits instead of repeating the same lifecycle logic.
export default class BasePage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  renderPage() {
    throw new Error("renderPage() must be implemented by the subclass");
  }

  render() {
    return (
      <motion.main
        id="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {this.renderPage()}
      </motion.main>
    );
  }
}
