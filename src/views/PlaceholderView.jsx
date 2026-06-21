import React from "react";

export function PlaceholderView({ kicker, title, text }) {
  return (
    <section className="placeholder-view">
      <span>{kicker}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}
