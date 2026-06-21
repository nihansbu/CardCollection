import {
  ACTIVITY_HEATMAP_DAYS,
  ACTIVITY_LOG_LIMIT,
  DAY_MS,
  defaultActivities,
} from "./activityData.js";
export { readJson, writeJson } from "../../storage/jsonStorage.js";

export function formatRap(value) {
  const number = Math.floor(Number(value) || 0);

  if (number < 1000) {
    return new Intl.NumberFormat("de-DE").format(number);
  }

  if (number < 1000000) {
    const compactValue = number / 1000;
    const maximumFractionDigits = compactValue < 10 && number % 1000 !== 0 ? 1 : 0;
    return `${new Intl.NumberFormat("de-DE", { maximumFractionDigits }).format(compactValue)}k`;
  }

  const compactValue = number / 1000000;
  const maximumFractionDigits = compactValue < 10 && number % 1000000 !== 0 ? 1 : 0;
  return `${new Intl.NumberFormat("de-DE", { maximumFractionDigits }).format(compactValue)}m`;
}

export function formatInteger(value) {
  return new Intl.NumberFormat("de-DE").format(Math.round(Number(value) || 0));
}

export function getActivityReward(activity) {
  return Number(activity.defaultQuantity) * Number(activity.rapPerUnit);
}

export function normalizeActivity(activity) {
  const defaultMatch = defaultActivities.find((defaultActivity) => defaultActivity.id === activity.id);

  return {
    ...activity,
    type: activity.type || defaultMatch?.type || "General",
  };
}

export function normalizeActivities(activities) {
  return activities.map(normalizeActivity);
}

export function getActivityType(activity) {
  return activity.type || "General";
}

export function getSortedActivities(activities, sortKey) {
  const sortedActivities = [...activities];

  if (sortKey === "name") {
    return sortedActivities.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortKey === "rap") {
    return sortedActivities.sort((a, b) => getActivityReward(b) - getActivityReward(a));
  }

  if (sortKey === "type") {
    return sortedActivities.sort((a, b) => getActivityType(a).localeCompare(getActivityType(b)) || a.title.localeCompare(b.title));
  }

  if (sortKey === "unit") {
    return sortedActivities.sort((a, b) => a.unit.localeCompare(b.unit) || a.title.localeCompare(b.title));
  }

  return sortedActivities;
}

export function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDayKey(date) {
  const day = startOfLocalDay(date);
  const year = day.getFullYear();
  const month = String(day.getMonth() + 1).padStart(2, "0");
  const dateNumber = String(day.getDate()).padStart(2, "0");

  return `${year}-${month}-${dateNumber}`;
}

export function formatDayKey(dayKey) {
  return new Date(`${dayKey}T12:00:00`).toLocaleDateString("de-DE");
}

export function getRollingDays(dayCount = ACTIVITY_HEATMAP_DAYS) {
  const today = startOfLocalDay(new Date());
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - dayCount + 1);

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + index);

    return {
      date,
      key: getDayKey(date),
    };
  });
}

export function getFilteredActivityLog(activityLog, selectedActivityId) {
  if (selectedActivityId === "all") return activityLog;

  return activityLog.filter((entry) => entry.activityId === selectedActivityId);
}

export function getQuantitySummary(entries) {
  if (!entries.length) return "0";

  const totalsByUnit = entries.reduce((totals, entry) => {
    const unit = entry.unit || "units";
    totals[unit] = (totals[unit] || 0) + Number(entry.quantity || 0);
    return totals;
  }, {});
  const units = Object.keys(totalsByUnit);

  if (units.length === 1) {
    const unit = units[0];
    return `${formatInteger(totalsByUnit[unit])} ${unit}`;
  }

  return "Mixed units";
}

export function getLongestStreak(dayKeys) {
  const sortedKeys = [...new Set(dayKeys)].sort();
  let currentStart = null;
  let currentEnd = null;
  let currentLength = 0;
  let bestStart = null;
  let bestEnd = null;
  let bestLength = 0;
  let previousDate = null;

  sortedKeys.forEach((dayKey) => {
    const date = new Date(`${dayKey}T12:00:00`);
    const isConsecutive = previousDate && Math.round((date - previousDate) / DAY_MS) === 1;

    if (!isConsecutive) {
      currentStart = dayKey;
      currentLength = 1;
    } else {
      currentLength += 1;
    }

    currentEnd = dayKey;
    previousDate = date;

    if (currentLength > bestLength) {
      bestStart = currentStart;
      bestEnd = currentEnd;
      bestLength = currentLength;
    }
  });

  return {
    end: bestEnd,
    length: bestLength,
    start: bestStart,
  };
}

export function getActivityStats(activityLog, selectedActivityId) {
  const filteredEntries = getFilteredActivityLog(activityLog, selectedActivityId);
  const days = getRollingDays();
  const dailyTotals = filteredEntries.reduce((totals, entry) => {
    const key = getDayKey(new Date(entry.timestamp));
    const current = totals.get(key) || { entries: 0, quantity: 0, rap: 0 };

    current.entries += 1;
    current.quantity += Number(entry.quantity || 0);
    current.rap += Number(entry.rapEarned || 0);
    totals.set(key, current);

    return totals;
  }, new Map());
  const activeDayKeys = Array.from(dailyTotals.keys());
  const longestStreak = getLongestStreak(activeDayKeys);
  const maxEntries = Math.max(1, ...Array.from(dailyTotals.values()).map((day) => day.entries));
  const heatmapDays = days.map((day) => {
    const totals = dailyTotals.get(day.key) || { entries: 0, quantity: 0, rap: 0 };
    const intensity = totals.entries === 0 ? 0 : Math.max(1, Math.ceil((totals.entries / maxEntries) * 4));

    return {
      ...day,
      ...totals,
      intensity,
    };
  });

  return {
    activeDays: activeDayKeys.length,
    entries: filteredEntries.length,
    heatmapDays,
    longestStreak,
    quantity: getQuantitySummary(filteredEntries),
    rap: filteredEntries.reduce((sum, entry) => sum + Number(entry.rapEarned || 0), 0),
  };
}

export function getGroupedActivityLog(activityLog) {
  const grouped = new Map();

  activityLog.slice(0, ACTIVITY_LOG_LIMIT).forEach((entry) => {
    const key = `${entry.activityId}-${entry.title}-${entry.unit}`;
    const current = grouped.get(key);

    if (!current) {
      grouped.set(key, {
        activityId: entry.activityId,
        count: 1,
        lastTimestamp: entry.timestamp,
        quantity: Number(entry.quantity),
        rapEarned: Number(entry.rapEarned),
        title: entry.title,
        unit: entry.unit,
      });
      return;
    }

    current.count += 1;
    current.quantity += Number(entry.quantity);
    current.rapEarned += Number(entry.rapEarned);

    if (new Date(entry.timestamp) > new Date(current.lastTimestamp)) {
      current.lastTimestamp = entry.timestamp;
    }
  });

  return Array.from(grouped.values()).sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp));
}
