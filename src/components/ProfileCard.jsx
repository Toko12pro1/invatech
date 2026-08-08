import React from "react";
import Reveal from "./Reveal";

export default class ProfileCard extends React.Component {
  render() {
    const { photo, name, role, bio, index = 0 } = this.props;

    return (
      <Reveal delay={index * 0.08} className="profile-card-wrap">
        <article className="profile-card">
          <img src={photo} alt={name} loading="lazy" />
          <h3>{name}</h3>
          <span className="profile-role">{role}</span>
          <p>{bio}</p>
        </article>
      </Reveal>
    );
  }
}
