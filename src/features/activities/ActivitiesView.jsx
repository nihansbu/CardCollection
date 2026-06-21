import React, { useState } from "react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import {
  ACTIVITY_HEATMAP_DAYS,
  ACTIVITY_LOG_LIMIT,
  activitySortOptions,
  activityTypes,
} from "./activityData.js";
import {
  formatDayKey,
  formatRap,
  getActivityReward,
  getActivityStats,
  getActivityType,
  getGroupedActivityLog,
  getSortedActivities,
} from "./activityUtils.js";

function ActivityCard({ activity, onComplete }) {
  const reward = getActivityReward(activity);

  return (
    <button className="activity-card" onClick={() => onComplete(activity)} style={{ "--activity-color": activity.color }} type="button">
      <div className="activity-sigil" aria-hidden="true">
        {activity.title.slice(0, 2).toUpperCase()}
      </div>
      <div className="activity-card-copy">
        <span>{getActivityType(activity)} - {activity.unit}</span>
        <strong>{activity.title}</strong>
        <small>
          +{formatRap(reward)} RAP / {activity.defaultQuantity} {activity.unit}
        </small>
      </div>
      <p>{activity.description}</p>
    </button>
  );
}

export function ActivitiesPanel({ activities, activityLog, onCompleteActivity, onOpenCreate, onOpenLog, onOpenStats, rap }) {
  const [sortKey, setSortKey] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortedActivities = getSortedActivities(activities, sortKey);
  const activeSortLabel = activitySortOptions.find((option) => option.value === sortKey)?.label || "Default";

  return (
    <ContentPanel
      actions={[
        {
          expanded: isSortOpen,
          label: "Sorts",
          onClick: () => setIsSortOpen((isOpen) => !isOpen),
          panel: isSortOpen ? (
            <div className="activity-sort-menu" role="menu">
              <span>Sort By - {activeSortLabel}</span>
              {activitySortOptions.map((option) => (
                <button
                  className={option.value === sortKey ? "is-active" : ""}
                  key={option.value}
                  onClick={() => {
                    setSortKey(option.value);
                    setIsSortOpen(false);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null,
        },
        { label: "Activity Log", onClick: onOpenLog },
        { label: "Stats", onClick: onOpenStats },
      ]}
      className="activities-panel"
      stats={[
        { label: "RAP Balance", value: formatRap(rap) },
        { label: "Activities", value: activities.length },
        { label: "Logged", value: activityLog.length },
      ]}
      title="Activities"
    >
      <div className="activity-board">
        <button className="activity-card activity-system-card" onClick={onOpenCreate} type="button">
          <div className="activity-sigil" aria-hidden="true">+</div>
          <div className="activity-card-copy">
            <span>Custom</span>
            <strong>Create Activity</strong>
            <small>Define unit, quantity, and RAP</small>
          </div>
          <p>Create a new real-life activity that can award RAP when clicked.</p>
        </button>

        {sortedActivities.map((activity) => (
          <ActivityCard activity={activity} key={activity.id} onComplete={onCompleteActivity} />
        ))}
      </div>
    </ContentPanel>
  );
}

export function ActivityCreatePanel({ onBack, onCreate }) {
  const [form, setForm] = useState({
    defaultQuantity: "10",
    description: "",
    rapPerUnit: "10",
    title: "",
    type: "Mind",
    unit: "minutes",
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const unit = form.unit.trim();
    const defaultQuantity = Math.max(1, Number(form.defaultQuantity) || 1);
    const rapPerUnit = Math.max(0, Number(form.rapPerUnit) || 0);

    if (!title || !unit) return;

    onCreate({
      color: "#24f2ff",
      defaultQuantity,
      description: form.description.trim() || `Track ${title.toLowerCase()} as a custom real-life activity.`,
      id: `custom-${Date.now()}`,
      rapPerUnit,
      title,
      type: form.type,
      unit,
    });
  };

  return (
    <ContentPanel
      className="activity-create-panel"
      onBack={onBack}
      stats={[
        { label: "Type", value: form.type },
        { label: "Reward", value: "RAP" },
        { label: "Status", value: "Draft" },
      ]}
      title="Create Activity"
    >
      <form className="activity-form" onSubmit={submit}>
        <label>
          <span>Title</span>
          <input onChange={(event) => updateField("title", event.target.value)} placeholder="Reading" value={form.title} />
        </label>
        <label>
          <span>Description</span>
          <textarea onChange={(event) => updateField("description", event.target.value)} placeholder="Short note about what counts for this activity." value={form.description} />
        </label>
        <label>
          <span>Unit</span>
          <input onChange={(event) => updateField("unit", event.target.value)} placeholder="minutes, pages, steps..." value={form.unit} />
        </label>
        <label>
          <span>Type</span>
          <select onChange={(event) => updateField("type", event.target.value)} value={form.type}>
            {activityTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Default Quantity</span>
          <input min="1" onChange={(event) => updateField("defaultQuantity", event.target.value)} type="number" value={form.defaultQuantity} />
        </label>
        <label>
          <span>RAP Per Unit</span>
          <input min="0" onChange={(event) => updateField("rapPerUnit", event.target.value)} type="number" value={form.rapPerUnit} />
        </label>
        <button className="activity-submit-button" type="submit">Save Activity</button>
      </form>
    </ContentPanel>
  );
}

export function ActivityLogPanel({ activityLog, onBack, rap }) {
  const groupedLog = getGroupedActivityLog(activityLog);

  return (
    <ContentPanel
      className="activity-log-panel"
      onBack={onBack}
      stats={[
        { label: "RAP Balance", value: formatRap(rap) },
        { label: "Showing", value: groupedLog.length },
        { label: "Limit", value: ACTIVITY_LOG_LIMIT },
      ]}
      title="Activity Log"
    >
      <div className="activity-log-table" role="table" aria-label="Activity Log">
        <div className="activity-log-row activity-log-head" role="row">
          <span role="columnheader">Activity</span>
          <span role="columnheader">Last Logged</span>
          <span role="columnheader">Total Quantity</span>
          <span role="columnheader">RAP</span>
          <span role="columnheader">Entries</span>
        </div>
        {groupedLog.length ? groupedLog.map((entry) => (
          <div className="activity-log-row" key={`${entry.activityId}-${entry.unit}`} role="row">
            <span role="cell">{entry.title}</span>
            <span role="cell">{new Date(entry.lastTimestamp).toLocaleString("de-DE")}</span>
            <span role="cell">{entry.quantity} {entry.unit}</span>
            <span role="cell">+{formatRap(entry.rapEarned)}</span>
            <span role="cell">{entry.count}</span>
          </div>
        )) : (
          <div className="activity-log-empty">No activities logged yet.</div>
        )}
      </div>
    </ContentPanel>
  );
}

export function ActivityStatsPanel({ activities, activityLog, onBack, rap }) {
  const [selectedActivityId, setSelectedActivityId] = useState("all");
  const selectedActivity = activities.find((activity) => activity.id === selectedActivityId);
  const stats = getActivityStats(activityLog, selectedActivityId);
  const selectedLabel = selectedActivity?.title || "All Activities";
  const streakText = stats.longestStreak.length
    ? `${stats.longestStreak.length} days`
    : "0 days";
  const streakRange = stats.longestStreak.length
    ? `${formatDayKey(stats.longestStreak.start)} - ${formatDayKey(stats.longestStreak.end)}`
    : "No streak yet";

  return (
    <ContentPanel
      className="activity-stats-panel"
      onBack={onBack}
      stats={[
        { label: "RAP Balance", value: formatRap(rap) },
        { label: "Selection", value: selectedActivity ? selectedActivity.title : "All" },
        { label: "Entries", value: stats.entries },
      ]}
      title="Activity Stats"
    >
      <div className="activity-stats-shell">
        <div className="activity-stat-picker" aria-label="Activity stat selection">
          <button className={selectedActivityId === "all" ? "is-active" : ""} onClick={() => setSelectedActivityId("all")} type="button">
            All Activities
          </button>
          {activities.map((activity) => (
            <button
              className={selectedActivityId === activity.id ? "is-active" : ""}
              key={activity.id}
              onClick={() => setSelectedActivityId(activity.id)}
              type="button"
            >
              {activity.title}
            </button>
          ))}
        </div>

        <section className="activity-stat-summary" aria-label={`${selectedLabel} statistics`}>
          <div>
            <span>Total RAP</span>
            <strong>{formatRap(stats.rap)}</strong>
          </div>
          <div>
            <span>Logged Quantity</span>
            <strong>{stats.quantity}</strong>
          </div>
          <div>
            <span>Active Days</span>
            <strong>{stats.activeDays}</strong>
          </div>
          <div>
            <span>Longest Streak</span>
            <strong>{streakText}</strong>
            <small>{streakRange}</small>
          </div>
        </section>

        <section className="activity-heatmap-panel" aria-label={`${selectedLabel} heatmap`}>
          <div className="activity-heatmap-head">
            <div>
              <span>Rolling Heatmap</span>
              <strong>{selectedLabel}</strong>
            </div>
            <small>Last {ACTIVITY_HEATMAP_DAYS} days</small>
          </div>
          <div className="activity-heatmap-grid">
            {stats.heatmapDays.map((day) => (
              <span
                aria-label={`${formatDayKey(day.key)}: ${day.entries} entries, ${formatRap(day.rap)} RAP`}
                className={`heatmap-cell heatmap-level-${day.intensity}`}
                key={day.key}
                title={`${formatDayKey(day.key)} - ${day.entries} entries - ${formatRap(day.rap)} RAP`}
              />
            ))}
          </div>
          <div className="activity-heatmap-legend" aria-hidden="true">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <i className={`heatmap-cell heatmap-level-${level}`} key={level} />
            ))}
            <span>More</span>
          </div>
        </section>
      </div>
    </ContentPanel>
  );
}
