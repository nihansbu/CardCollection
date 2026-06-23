import React from "react";

export function InfoPanel({
  accent = "#24f2ff",
  badge,
  children,
  className = "",
  description,
  metrics = [],
  onClose,
  subtitle,
  title,
}) {
  if (!title) return null;

  return (
    <div
      className={`content-info-panel ${className}`.trim()}
      role="status"
      onPointerDown={(event) => event.stopPropagation()}
      style={{ "--info-panel-accent": accent }}
    >
      <div className="content-info-panel-head">
        <span className="content-info-panel-badge" aria-hidden="true">
          {badge}
        </span>
        <div className="content-info-panel-title">
          <strong>{title}</strong>
          {subtitle ? <small>{subtitle}</small> : null}
        </div>
        <button aria-label="Close info panel" onClick={onClose} type="button">
          x
        </button>
      </div>

      {metrics.length ? (
        <dl className="content-info-panel-metrics" style={{ "--info-panel-metric-count": metrics.length }}>
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {children ? <div className="content-info-panel-extra">{children}</div> : null}
      {description ? <p>{description}</p> : null}
    </div>
  );
}
