import React from "react";
import { ArrowLeft } from "lucide-react";

function getTitleSize(title) {
  if (title.length <= 6) return "3.35rem";
  if (title.length <= 8) return "3rem";
  if (title.length <= 10) return "2.55rem";
  if (title.length <= 12) return "2.15rem";
  if (title.length <= 16) return "1.75rem";
  return "1.45rem";
}

export function ContentPanel({ actions = [], children, className = "", onBack, stats, title }) {
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-heading`;
  const headerClassName = onBack ? "content-header content-header-with-back" : "content-header content-header-no-back";

  return (
    <section className={`codex-content-panel ${className}`} aria-labelledby={headingId}>
      <div className={headerClassName}>
        {onBack ? (
          <div className="content-back-slot">
            <button className="content-back-button" onClick={onBack} type="button" aria-label="Back">
              <ArrowLeft size={26} strokeWidth={3} />
            </button>
          </div>
        ) : null}
        <div className="content-title-box" style={{ "--title-size": getTitleSize(title) }}>
          <h1 id={headingId}>{title}</h1>
        </div>
        <div className="content-actions" aria-label={`${title} actions`}>
          {actions.map((action) => (
            <div className="content-action-slot" key={action.label}>
              <button
                aria-expanded={action.expanded}
                className={`content-action-button ${action.className || ""}`.trim()}
                onClick={action.onClick}
                type="button"
              >
                {action.label}
              </button>
              {action.panel}
            </div>
          ))}
        </div>
        <dl className="content-stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {children}
    </section>
  );
}
