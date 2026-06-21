import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

const LONG_PRESS_MS = 520;

function getTitleSize(title) {
  if (title.length <= 6) return "3.35rem";
  if (title.length <= 8) return "3rem";
  if (title.length <= 10) return "2.55rem";
  if (title.length <= 12) return "1.85rem";
  if (title.length <= 16) return "1.75rem";
  return "1.45rem";
}

export function ContentPanel({ actions = [], children, className = "", onBack, stats, title }) {
  const [previewStatLabel, setPreviewStatLabel] = useState(null);
  const longPressTimer = useRef(null);
  const suppressClick = useRef(false);
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-heading`;
  const headerClassName = onBack ? "content-header content-header-with-back" : "content-header content-header-no-back";
  const previewStat = previewStatLabel ? stats.find((stat) => stat.label === previewStatLabel) : null;

  const clearLongPress = () => {
    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const startStatLongPress = (stat) => {
    clearLongPress();
    suppressClick.current = false;
    longPressTimer.current = window.setTimeout(() => {
      suppressClick.current = true;
      setPreviewStatLabel(stat.label);
    }, LONG_PRESS_MS);
  };

  const handleStatClick = (stat) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }

    stat.onClick?.();
  };

  useEffect(() => () => window.clearTimeout(longPressTimer.current), []);

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
                onClick={() => handleStatClick(stat)}
                onKeyDown={(event) => {
                  if (!isInteractive) return;
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  stat.onClick?.();
                }}
                onPointerCancel={clearLongPress}
                onPointerDown={() => startStatLongPress(stat)}
                onPointerLeave={clearLongPress}
                onPointerUp={clearLongPress}
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
          {previewStat ? (
            <div className="content-stat-quicklook" role="status">
              <div>
                <strong>{previewStat.label}</strong>
                <button aria-label="Close stat preview" onClick={() => setPreviewStatLabel(null)} type="button">
                  x
                </button>
              </div>
              <dl>
                <div>
                  <dt>Value</dt>
                  <dd>{previewStat.value}</dd>
                </div>
              </dl>
              <p>{previewStat.description || `${previewStat.label}: ${previewStat.value}`}</p>
            </div>
          ) : null}
        </dl>
      </div>
      <div className="content-body">{children}</div>
    </section>
  );
}
