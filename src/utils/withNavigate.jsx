import React from "react";
import { useNavigate } from "react-router-dom";

// Bridges react-router's hook-only useNavigate into class components,
// the same "inject a prop" pattern withTranslation() uses.
export default function withNavigate(Component) {
  return function WithNavigateWrapper(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}
