import React from "react";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
import Reveal from "./Reveal";

export default class ProfileCard extends React.Component {
  render() {
    const { photo, name, role, bio, achievement, link, linkLabel = "See related work", index = 0 } = this.props;
    const isExternal = link?.startsWith("http");

    return (
      <Reveal delay={index * 0.08} className="profile-card-wrap">
        <article className="profile-card">
          <img src={photo} alt={name} loading="lazy" />
          <h3>{name}</h3>
          <span className="profile-role">{role}</span>
          <p>{bio}</p>
          {achievement && (
            <div className="profile-achievement">
              <strong>Contribution</strong>
              <span>{achievement}</span>
            </div>
          )}
          {link && (
            isExternal ? (
              <a className="profile-card-link" href={link} target="_blank" rel="noreferrer">
                {linkLabel} <FaExternalLinkAlt aria-hidden="true" />
              </a>
            ) : (
              <a className="profile-card-link" href={link}>
                {linkLabel} <FaArrowRight aria-hidden="true" />
              </a>
            )
          )}
        </article>
      </Reveal>
    );
  }
}
