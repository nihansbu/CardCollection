import React, { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";

const LONG_PRESS_MS = 520;

function getTitleSize(title) {
  if (title.length <= 6) return "3rem";
  if (title.length <= 8) return "2.3rem";
  if (title.length <= 10) return "1.35rem";
  if (title.length <= 12) return "1.28rem";
  if (title.length <= 16) return "1.28rem";
  return "1.08rem";
}

export function ContentPanel({
  actions = [],
  children,
  className = "",
  onActionPreview,
  onBack,
  onStatPreview,
  stats,
  title,
}) {
  const longPressTimer = useRef(null);
  const suppressClick = useRef(false);
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-heading`;
  const headerClassName = onBack ? "content-header content-header-with-back" : "content-header content-header-no-back";

  const clearLongPress = () => {
    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const startLongPress = (onPreview, item) => {
    if (!onPreview) return;

    clearLongPress();
    suppressClick.current = false;
    longPressTimer.current = window.setTimeout(() => {
      suppressClick.current = true;
      onPreview?.(item);
    }, LONG_PRESS_MS);
  };

  const handleActionClick = (action) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }

    action.onClick?.();
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
        <div className="content-title-box" style={{ "--title-size": getTitleSize(title) }}>
          {onBack ? (
            <button className="content-back-button" onClick={onBack} type="button" aria-label="Back">
              <ArrowLeft size={24} strokeWidth={3} />
            </button>
          ) : null}
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
                  onClick={() => handleActionClick(action)}
                  onPointerCancel={clearLongPress}
                  onPointerDown={() => startLongPress(onActionPreview, action)}
                  onPointerLeave={clearLongPress}
                  onPointerUp={clearLongPress}
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
                onPointerDown={() => startLongPress(onStatPreview, stat)}
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
        </dl>
      </div>
      <div className="content-body">{children}</div>
    </section>
  );
}
