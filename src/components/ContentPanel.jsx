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
          {actions.map((action) => {
            const ActionIcon = action.Icon;

            return (
              <div className="content-action-slot" key={action.label}>
                <button
                  aria-expanded={action.expanded}
                  aria-pressed={action.pressed}
                  className={`content-action-button ${action.className || ""}`.trim()}
                  onClick={action.onClick}
                  title={action.label}
                  type="button"
                >
                  {ActionIcon ? <ActionIcon size={17} strokeWidth={2.8} /> : null}
                  <span>{action.shortLabel || action.label}</span>
                </button>
                {action.panel}
              </div>
            );
          })}
        </div>
        <dl className="content-stats" style={{ "--stat-count": stats.length }}>
          {stats.map((stat) => {
            const StatIcon = stat.Icon;
            const isInteractive = Boolean(stat.onClick);

            return (
              <div
                aria-label={stat.ariaLabel || stat.label}
                aria-pressed={isInteractive ? Boolean(stat.pressed) : undefined}
                className={`${StatIcon ? "has-icon" : ""} ${isInteractive ? "is-interactive" : ""} ${stat.pressed ? "is-active" : ""}`.trim()}
                key={stat.label}
                onClick={stat.onClick}
                onKeyDown={(event) => {
                  if (!isInteractive) return;
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  stat.onClick();
                }}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
              >
                {StatIcon ? (
                  <span className="content-stat-icon" aria-hidden="true">
                    <StatIcon size={19} strokeWidth={2.8} />
                  </span>
                ) : null}
                <div className="content-stat-copy">
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
      <div className="content-body">{children}</div>
    </section>
  );
}
