import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

const LONG_PRESS_MS = 520;

function getTitleSize(title, { actionCount, hasBack }) {
  const isCompact = Boolean(hasBack || actionCount);
  const isCrowded = actionCount > 1;

  if (!isCompact) {
    if (title.length <= 6) return "3rem";
    if (title.length <= 8) return "2.3rem";
    if (title.length <= 10) return "1.8rem";
    if (title.length <= 12) return "1.55rem";
    if (title.length <= 16) return "1.28rem";
    return "1.08rem";
  }

  if (isCrowded) {
    if (title.length <= 6) return "1.75rem";
    if (title.length <= 8) return "1.5rem";
    if (title.length <= 10) return "1.3rem";
    if (title.length <= 12) return "1.05rem";
    if (title.length <= 16) return "0.84rem";
    return "0.66rem";
  }

  if (title.length <= 6) return "2rem";
  if (title.length <= 8) return "1.78rem";
  if (title.length <= 10) return "1.42rem";
  if (title.length <= 12) return "1.18rem";
  if (title.length <= 16) return "0.92rem";
  return "0.78rem";
}

export function ContentPanel({
  actions = [],
  children,
  className = "",
  defaultHeaderCollapsed = true,
  infoPanel,
  onActionPreview,
  onBack,
  onStatPreview,
  stats,
  title,
}) {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(defaultHeaderCollapsed);
  const longPressTimer = useRef(null);
  const suppressClick = useRef(false);
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-heading`;
  const actionCount = actions.length;
  const headerClassName = [
    "content-header",
    isHeaderCollapsed ? "is-collapsed" : "is-expanded",
    onBack ? "content-header-with-back" : "content-header-no-back",
    actionCount ? "content-header-has-actions" : "content-header-no-actions",
    actionCount > 1 ? "content-header-many-actions" : "",
    stats.length > 3 ? "content-header-many-stats" : "",
  ].filter(Boolean).join(" ");

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
  useEffect(() => setIsHeaderCollapsed(defaultHeaderCollapsed), [defaultHeaderCollapsed, title]);

  return (
    <section
      className={`codex-content-panel ${isHeaderCollapsed ? "is-header-collapsed" : "is-header-expanded"} ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <button
        aria-controls={`${headingId}-header`}
        aria-expanded={!isHeaderCollapsed}
        aria-label={isHeaderCollapsed ? "Show page header" : "Hide page header"}
        className="content-header-toggle"
        onClick={() => setIsHeaderCollapsed((current) => !current)}
        type="button"
      >
        <span aria-hidden="true" />
      </button>
      <div className={headerClassName} id={`${headingId}-header`}>
        <div
          className={`content-title-box ${onBack ? "has-back" : ""}`.trim()}
          style={{ "--title-size": getTitleSize(title, { actionCount, hasBack: Boolean(onBack) }) }}
        >
          {onBack ? (
            <button className="content-back-button" onClick={onBack} type="button" aria-label="Back">
              <ArrowLeft size={24} strokeWidth={3} />
            </button>
          ) : null}
          <h1 id={headingId}>{title}</h1>
        </div>
        <div
          className="content-actions"
          aria-label={`${title} actions`}
          style={{ gridTemplateColumns: `repeat(${Math.max(1, actionCount)}, minmax(0, 1fr))` }}
        >
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
                className={`${StatIcon ? "has-icon" : ""} ${stat.iconOnly ? "is-icon-only" : ""} ${isInteractive ? "is-interactive" : ""} ${stat.pressed ? "is-active" : ""}`.trim()}
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
                    <StatIcon size={stat.iconOnly ? 26 : 19} strokeWidth={2.8} />
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
      {infoPanel}
    </section>
  );
}
