import React, { useEffect, useRef, useState } from "react";
import { ArrowUpDown, BarChart3, ScrollText } from "lucide-react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import { InfoPanel } from "../../components/InfoPanel.jsx";
import { uiIcons } from "../../components/UiIcon.jsx";
import {
  DEED_HEATMAP_DAYS,
  DEED_LOG_LIMIT,
  deedSortOptions,
  deedTypes,
} from "./deedData.js";
import {
  calculateDeedReward,
  clampDeedQuantity,
  formatDeedQuantity,
  formatDayKey,
  formatInteger,
  formatRap,
  getDeedDashboardSummary,
  getDeedGoalPercent,
  getDeedGoalProgress,
  getDeedGoalSummary,
  getDeedMastery,
  getDeedPresets,
  getDeedStats,
  getDeedTotals,
  getDeedType,
  getGroupedDeedLog,
  getSortedDeeds,
} from "./deedUtils.js";

const LONG_PRESS_MS = 520;
const GOAL_PERIODS = [
  { label: "Dailies", period: "daily" },
  { label: "Weeklies", period: "weekly" },
  { label: "Monthlies", period: "monthly" },
];

function DeedInfoPanel({ deed, deedLog, onClose, onLogDeed }) {
  const [quantity, setQuantity] = useState(deed?.defaultQuantity || 1);

  useEffect(() => {
    setQuantity(deed?.defaultQuantity || 1);
  }, [deed?.defaultQuantity, deed?.id]);

  if (!deed) return null;

  const clampedQuantity = clampDeedQuantity(deed, quantity);
  const reward = calculateDeedReward(deed, deedLog, clampedQuantity);
  const mastery = getDeedMastery(deed, deedLog);
  const totals = getDeedTotals(deed, deedLog);
  const presets = getDeedPresets(deed);
  const goals = ["daily", "weekly", "monthly"]
    .map((period) => getDeedGoalProgress(deed, deedLog, period))
    .filter((goal) => goal.target > 0);
  const updateQuantity = (nextQuantity) => {
    setQuantity(clampDeedQuantity(deed, nextQuantity));
  };
  const logQuantity = () => {
    onLogDeed(deed, clampedQuantity);
    onClose();
  };

  return (
    <InfoPanel
      accent={deed.color}
      badge={deed.title.slice(0, 2).toUpperCase()}
      className="content-info-panel--deed"
      description={deed.description}
      metrics={[
        { label: "Level", value: mastery.level },
        { label: "Total Logs", value: totals.logs },
        { label: "Reward", value: `+${formatRap(reward.rapEarned)}` },
      ]}
      onClose={onClose}
      subtitle={`${getDeedType(deed)} Deed`}
      title={deed.title}
    >
      <div className="deed-info-extra">
        <div className="deed-amount-picker" aria-label={`${deed.title} amount picker`}>
          <button onClick={() => updateQuantity(clampedQuantity - deed.defaultQuantity)} type="button">-</button>
          <label>
            <span>Amount</span>
            <input
              inputMode="numeric"
              min="1"
              onChange={(event) => updateQuantity(event.target.value)}
              type="number"
              value={clampedQuantity}
            />
          </label>
          <button onClick={() => updateQuantity(clampedQuantity + deed.defaultQuantity)} type="button">+</button>
        </div>
        <div className="deed-preset-row">
          {presets.map((preset) => (
            <button className={preset === clampedQuantity ? "is-active" : ""} key={preset} onClick={() => updateQuantity(preset)} type="button">
              {formatInteger(preset)}
            </button>
          ))}
        </div>
        <button className="deed-info-log-button" onClick={logQuantity} type="button">
          Log Deed
        </button>
        <div className="deed-reward-preview">
          <span>{formatDeedQuantity(clampedQuantity, deed.unit)}</span>
          <strong>+{formatRap(reward.rapEarned)} RAP</strong>
          {reward.goalBonusRap > 0 ? <small>Bonus +{formatRap(reward.goalBonusRap)}</small> : null}
          {reward.isSoftCapped ? <small>Softcap active</small> : null}
        </div>
        {goals.length ? (
          <div className="deed-goal-list">
            {goals.map((goal) => (
              <div key={goal.period}>
                <span>{goal.period}</span>
                <strong>{formatInteger(goal.progress)} / {formatInteger(goal.target)}</strong>
                <i style={{ "--deed-goal-progress": `${Math.min(100, (goal.progress / goal.target) * 100)}%` }} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </InfoPanel>
  );
}

function DeedGoalStrip({ isActive, label, onClick, summary }) {
  return (
    <button
      aria-pressed={isActive}
      className={isActive ? "deed-goal-strip is-active" : "deed-goal-strip"}
      onClick={onClick}
      type="button"
    >
      <span className="deed-goal-strip-fill" style={{ "--deed-goal-strip-progress": `${summary.progress}%` }} aria-hidden="true" />
      <span className="deed-goal-strip-label">{label}</span>
      <span className="deed-goal-strip-segments" aria-hidden="true">
        {summary.goals.map(({ deed, goal }) => (
          <i
            key={deed.id}
            style={{
              "--deed-color": deed.color,
              "--deed-segment-progress": `${Math.min(100, (goal.progress / Math.max(1, goal.target)) * 100)}%`,
            }}
          />
        ))}
      </span>
      <strong>{summary.completed}/{summary.total}</strong>
    </button>
  );
}

function DeedCard({ deed, deedLog, onComplete, onPreview }) {
  const longPressTimer = useRef(null);
  const suppressClick = useRef(false);
  const reward = calculateDeedReward(deed, deedLog, deed.defaultQuantity);
  const mastery = getDeedMastery(deed, deedLog);
  const totals = getDeedTotals(deed, deedLog);
  const dailyGoal = getDeedGoalProgress(deed, deedLog, "daily");
  const dailyPercent = getDeedGoalPercent(deed, deedLog, "daily");
  const cardProgress = dailyPercent ?? mastery.progress;
  const isDailyDone = dailyGoal.target > 0 && dailyGoal.progress >= dailyGoal.target;
  const cardClassName = [
    "deed-card",
    isDailyDone ? "is-daily-complete" : "",
    dailyGoal.target > 0 ? "has-daily-goal" : "has-mastery-progress",
  ].filter(Boolean).join(" ");

  const clearLongPress = () => {
    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const startLongPress = () => {
    clearLongPress();
    suppressClick.current = false;
    longPressTimer.current = window.setTimeout(() => {
      suppressClick.current = true;
      onPreview(deed);
    }, LONG_PRESS_MS);
  };

  const handleClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }

    onComplete(deed, deed.defaultQuantity);
  };

  useEffect(() => () => window.clearTimeout(longPressTimer.current), []);

  return (
    <button
      className={cardClassName}
      onClick={handleClick}
      onContextMenu={(event) => event.preventDefault()}
      onPointerCancel={clearLongPress}
      onPointerDown={startLongPress}
      onPointerLeave={clearLongPress}
      onPointerUp={clearLongPress}
      style={{ "--deed-color": deed.color }}
      type="button"
      aria-label={`${deed.title}. ${getDeedType(deed)}. ${deed.defaultQuantity} ${deed.unit}. Rewards ${formatRap(reward.rapEarned)} RAP. Long press for details.`}
    >
      <span className="deed-card-progress" style={{ "--deed-progress": `${cardProgress}%` }} aria-hidden="true" />
      <div className="deed-sigil" aria-hidden="true">
        {deed.title.slice(0, 2).toUpperCase()}
      </div>
      <div className="deed-card-copy">
        <strong>{deed.title}</strong>
        <span>{getDeedType(deed)}</span>
      </div>
      <div className="deed-card-reward" aria-hidden="true">
        <strong>Lv {mastery.level}</strong>
        <small>
          +{formatRap(reward.rapEarned)} RAP
        </small>
        <em>{dailyGoal.target > 0 ? `${Math.floor((dailyGoal.progress / dailyGoal.target) * 100)}% daily` : `${totals.logs} logs`}</em>
      </div>
    </button>
  );
}

export function DeedsPanel({ deeds, deedLog, onCompleteDeed, onOpenCreate, onOpenLog, onOpenStats, rap }) {
  const [sortKey, setSortKey] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [previewDeedId, setPreviewDeedId] = useState(null);
  const [goalFilter, setGoalFilter] = useState(null);
  const sortedDeeds = getSortedDeeds(deeds, sortKey);
  const activeSortLabel = deedSortOptions.find((option) => option.value === sortKey)?.label || "Default";
  const previewDeed = previewDeedId ? deeds.find((deed) => deed.id === previewDeedId) : null;
  const summary = getDeedDashboardSummary(deeds, deedLog);
  const goalSummaries = GOAL_PERIODS.map((entry) => ({
    ...entry,
    summary: getDeedGoalSummary(deeds, deedLog, entry.period),
  }));
  const visibleDeeds = goalFilter
    ? sortedDeeds.filter((deed) => getDeedGoalProgress(deed, deedLog, goalFilter).target > 0)
    : sortedDeeds;

  return (
    <ContentPanel
      actions={[
        {
          Icon: ArrowUpDown,
          expanded: isSortOpen,
          label: "Sorts",
          shortLabel: "Sort",
          onClick: () => setIsSortOpen((isOpen) => !isOpen),
          panel: isSortOpen ? (
            <div className="deed-sort-menu" role="menu">
              <span>Sort By - {activeSortLabel}</span>
              {deedSortOptions.map((option) => (
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
        { Icon: ScrollText, label: "Deed Log", shortLabel: "Log", onClick: onOpenLog },
        { Icon: BarChart3, label: "Stats", onClick: onOpenStats },
      ]}
      className="deeds-panel"
      infoPanel={<DeedInfoPanel deed={previewDeed} deedLog={deedLog} onClose={() => setPreviewDeedId(null)} onLogDeed={onCompleteDeed} />}
      stats={[
        { Icon: uiIcons.rap, iconOnly: true, label: "RAP Balance", value: formatRap(rap) },
        { Icon: uiIcons.currentXp, iconOnly: true, label: "Today RAP", value: formatRap(summary.todayRap) },
        { Icon: uiIcons.deeds, iconOnly: true, label: "Logged Today", value: summary.loggedToday },
        { Icon: uiIcons.stats, iconOnly: true, label: "Longest Streak", value: summary.longestStreak },
      ]}
      title="Deeds"
    >
      <div className="deed-board" onPointerDown={() => setPreviewDeedId(null)}>
        <div className="deed-goal-strip-list" aria-label="Deed goal progress">
          {goalSummaries.map(({ label, period, summary: goalSummary }) => (
            <DeedGoalStrip
              isActive={goalFilter === period}
              key={period}
              label={label}
              onClick={(event) => {
                event.stopPropagation();
                setGoalFilter((current) => current === period ? null : period);
              }}
              summary={goalSummary}
            />
          ))}
        </div>

        <div className="deed-grid">
          {!goalFilter ? (
            <button className="deed-card deed-system-card" onClick={onOpenCreate} type="button">
              <div className="deed-sigil" aria-hidden="true">+</div>
              <div className="deed-card-copy">
                <strong>Create</strong>
                <span>Custom</span>
              </div>
              <div className="deed-card-reward" aria-hidden="true">
                <small>New</small>
              </div>
            </button>
          ) : null}

          {visibleDeeds.map((deed) => (
            <DeedCard
              deed={deed}
              deedLog={deedLog}
              key={deed.id}
              onComplete={onCompleteDeed}
              onPreview={(previewDeedEntry) => setPreviewDeedId(previewDeedEntry.id)}
            />
          ))}
        </div>
      </div>
    </ContentPanel>
  );
}

export function DeedCreatePanel({ onBack, onCreate }) {
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
      description: form.description.trim() || `Track ${title.toLowerCase()} as a custom real-life deed.`,
      id: `custom-${Date.now()}`,
      rapPerUnit,
      title,
      type: form.type,
      unit,
    });
  };

  return (
    <ContentPanel
      className="deed-create-panel"
      onBack={onBack}
      stats={[
        { label: "Type", value: form.type },
        { label: "Reward", value: "RAP" },
        { label: "Status", value: "Draft" },
      ]}
      title="Create Deed"
    >
      <form className="deed-form" onSubmit={submit}>
        <label>
          <span>Title</span>
          <input onChange={(event) => updateField("title", event.target.value)} placeholder="Reading" value={form.title} />
        </label>
        <label>
          <span>Description</span>
          <textarea onChange={(event) => updateField("description", event.target.value)} placeholder="Short note about what counts for this deed." value={form.description} />
        </label>
        <label>
          <span>Unit</span>
          <input onChange={(event) => updateField("unit", event.target.value)} placeholder="minutes, pages, steps..." value={form.unit} />
        </label>
        <label>
          <span>Type</span>
          <select onChange={(event) => updateField("type", event.target.value)} value={form.type}>
            {deedTypes.map((type) => (
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
        <button className="deed-submit-button" type="submit">Save Deed</button>
      </form>
    </ContentPanel>
  );
}

export function DeedLogPanel({ deedLog, onBack, rap }) {
  const groupedLog = getGroupedDeedLog(deedLog);

  return (
    <ContentPanel
      className="deed-log-panel"
      onBack={onBack}
      stats={[
        { label: "RAP Balance", value: formatRap(rap) },
        { label: "Showing", value: groupedLog.length },
        { label: "Limit", value: DEED_LOG_LIMIT },
      ]}
      title="Deed Log"
    >
      <div className="deed-log-table" role="table" aria-label="Deed Log">
        <div className="deed-log-row deed-log-head" role="row">
          <span role="columnheader">Deed</span>
          <span role="columnheader">Last Logged</span>
          <span role="columnheader">Total Quantity</span>
          <span role="columnheader">RAP</span>
          <span role="columnheader">Entries</span>
        </div>
        {groupedLog.length ? groupedLog.map((entry) => (
          <div className="deed-log-row" key={`${entry.deedId}-${entry.unit}`} role="row">
            <span role="cell">{entry.title}</span>
            <span role="cell">{new Date(entry.lastTimestamp).toLocaleString("de-DE")}</span>
            <span role="cell">{entry.quantity} {entry.unit}</span>
            <span role="cell">+{formatRap(entry.rapEarned)}</span>
            <span role="cell">{entry.count}</span>
          </div>
        )) : (
          <div className="deed-log-empty">No deeds logged yet.</div>
        )}
      </div>
    </ContentPanel>
  );
}

export function DeedStatsPanel({ deeds, deedLog, onBack, rap }) {
  const [selectedDeedId, setSelectedDeedId] = useState("all");
  const selectedDeed = deeds.find((deed) => deed.id === selectedDeedId);
  const stats = getDeedStats(deedLog, selectedDeedId);
  const selectedLabel = selectedDeed?.title || "All Deeds";
  const streakText = stats.longestStreak.length
    ? `${stats.longestStreak.length} days`
    : "0 days";
  const streakRange = stats.longestStreak.length
    ? `${formatDayKey(stats.longestStreak.start)} - ${formatDayKey(stats.longestStreak.end)}`
    : "No streak yet";

  return (
    <ContentPanel
      className="deed-stats-panel"
      onBack={onBack}
      stats={[
        { label: "RAP Balance", value: formatRap(rap) },
        { label: "Selection", value: selectedDeed ? selectedDeed.title : "All" },
        { label: "Entries", value: stats.entries },
      ]}
      title="Deed Stats"
    >
      <div className="deed-stats-shell">
        <div className="deed-stat-picker" aria-label="Deed stat selection">
          <button className={selectedDeedId === "all" ? "is-active" : ""} onClick={() => setSelectedDeedId("all")} type="button">
            All Deeds
          </button>
          {deeds.map((deed) => (
            <button
              className={selectedDeedId === deed.id ? "is-active" : ""}
              key={deed.id}
              onClick={() => setSelectedDeedId(deed.id)}
              type="button"
            >
              {deed.title}
            </button>
          ))}
        </div>

        <section className="deed-stat-summary" aria-label={`${selectedLabel} statistics`}>
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

        <section className="deed-heatmap-panel" aria-label={`${selectedLabel} heatmap`}>
          <div className="deed-heatmap-head">
            <div>
              <span>Rolling Heatmap</span>
              <strong>{selectedLabel}</strong>
            </div>
            <small>Last {DEED_HEATMAP_DAYS} days</small>
          </div>
          <div className="deed-heatmap-grid">
            {stats.heatmapDays.map((day) => (
              <span
                aria-label={`${formatDayKey(day.key)}: ${day.entries} entries, ${formatRap(day.rap)} RAP`}
                className={`heatmap-cell heatmap-level-${day.intensity}`}
                key={day.key}
                title={`${formatDayKey(day.key)} - ${day.entries} entries - ${formatRap(day.rap)} RAP`}
              />
            ))}
          </div>
          <div className="deed-heatmap-legend" aria-hidden="true">
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
