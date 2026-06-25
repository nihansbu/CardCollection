import {
  DEED_HEATMAP_DAYS,
  DEED_LOG_LIMIT,
  DAY_MS,
  defaultDeeds,
} from "./deedData.js";
import { getSkillLevelForXp, getSkillXpForLevel } from "../skills/skillData.js";
export { readJson, writeJson } from "../../storage/jsonStorage.js";

const DEFAULT_DEED_GOAL_BONUS_RATE = 0.3;
const DEFAULT_DEED_SOFT_CAP_BASE_RATE = 0.5;
const DEFAULT_DEED_SOFT_CAP_GOAL_RATE = 0.33;
const DEFAULT_MAX_QUANTITY_PER_LOG = 10000;

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

export function getDeedReward(deed) {
  return Number(deed.defaultQuantity) * Number(deed.rapPerUnit);
}

export function formatDeedQuantity(value, unit) {
  return `${formatInteger(value)} ${unit || "units"}`;
}

export function normalizeDeed(deed) {
  const defaultMatch = defaultDeeds.find((defaultDeed) => defaultDeed.id === deed.id);

  return {
    ...deed,
    goals: Array.isArray(deed.goals) ? deed.goals : defaultMatch?.goals || [],
    maxQuantityPerLog: Number(deed.maxQuantityPerLog) || defaultMatch?.maxQuantityPerLog || DEFAULT_MAX_QUANTITY_PER_LOG,
    presetQuantities: Array.isArray(deed.presetQuantities) && deed.presetQuantities.length
      ? deed.presetQuantities
      : defaultMatch?.presetQuantities || [deed.defaultQuantity || 1],
    softCapBaseRate: Number(deed.softCapBaseRate) || defaultMatch?.softCapBaseRate || DEFAULT_DEED_SOFT_CAP_BASE_RATE,
    softCapDailyQuantity: Number(deed.softCapDailyQuantity) || defaultMatch?.softCapDailyQuantity || null,
    softCapGoalBonusRate: Number(deed.softCapGoalBonusRate) || defaultMatch?.softCapGoalBonusRate || DEFAULT_DEED_SOFT_CAP_GOAL_RATE,
    type: deed.type || defaultMatch?.type || "General",
  };
}

export function normalizeDeeds(deeds) {
  const normalizedDeeds = deeds.map(normalizeDeed);
  const existingIds = new Set(normalizedDeeds.map((deed) => deed.id));
  const missingDefaults = defaultDeeds
    .filter((deed) => !existingIds.has(deed.id))
    .map(normalizeDeed);

  return [...normalizedDeeds, ...missingDefaults];
}

export function getDeedType(deed) {
  return deed.type || "General";
}

export function getSortedDeeds(deeds, sortKey) {
  const sortedDeeds = [...deeds];

  if (sortKey === "name") {
    return sortedDeeds.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortKey === "rap") {
    return sortedDeeds.sort((a, b) => getDeedReward(b) - getDeedReward(a));
  }

  if (sortKey === "type") {
    return sortedDeeds.sort((a, b) => getDeedType(a).localeCompare(getDeedType(b)) || a.title.localeCompare(b.title));
  }

  if (sortKey === "unit") {
    return sortedDeeds.sort((a, b) => a.unit.localeCompare(b.unit) || a.title.localeCompare(b.title));
  }

  return sortedDeeds;
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

export function getPeriodRange(period, date = new Date()) {
  const start = startOfLocalDay(date);
  const end = new Date(start);

  if (period === "weekly") {
    const dayOffset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - dayOffset);
    end.setDate(start.getDate() + 7);
    return { end, start };
  }

  if (period === "monthly") {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1, 1);
    return { end, start };
  }

  end.setDate(start.getDate() + 1);
  return { end, start };
}

export function getDeedEntries(deedLog, deedId) {
  return deedLog.filter((entry) => entry.deedId === deedId);
}

export function getDeedEntriesForPeriod(deedLog, deedId, period, date = new Date()) {
  const { end, start } = getPeriodRange(period, date);

  return getDeedEntries(deedLog, deedId).filter((entry) => {
    const timestamp = new Date(entry.timestamp);
    return timestamp >= start && timestamp < end;
  });
}

export function getDeedQuantityForPeriod(deedLog, deedId, period, date = new Date()) {
  return getDeedEntriesForPeriod(deedLog, deedId, period, date)
    .reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);
}

export function getDeedPresets(deed) {
  const presets = Array.isArray(deed.presetQuantities) ? deed.presetQuantities : [];
  return [...new Set([deed.defaultQuantity, ...presets].map((value) => Math.max(1, Math.round(Number(value) || 1))))].sort((a, b) => a - b);
}

export function clampDeedQuantity(deed, quantity) {
  const maxQuantity = Math.max(1, Number(deed.maxQuantityPerLog) || DEFAULT_MAX_QUANTITY_PER_LOG);
  return Math.max(1, Math.min(maxQuantity, Math.round(Number(quantity) || Number(deed.defaultQuantity) || 1)));
}

export function getDeedGoalProgress(deed, deedLog, period, date = new Date()) {
  const goal = (deed.goals || []).find((entry) => entry.period === period);
  const quantity = getDeedQuantityForPeriod(deedLog, deed.id, period, date);

  if (!goal) {
    return {
      bonusRate: 0,
      period,
      progress: 0,
      remaining: 0,
      target: 0,
    };
  }

  const target = Math.max(0, Number(goal.targetQuantity) || 0);

  return {
    bonusRate: Number(goal.bonusRate) || DEFAULT_DEED_GOAL_BONUS_RATE,
    period,
    progress: Math.min(target, quantity),
    remaining: Math.max(0, target - quantity),
    target,
  };
}

export function getDeedTotals(deed, deedLog) {
  const entries = getDeedEntries(deedLog, deed.id);

  return entries.reduce((totals, entry) => {
    totals.logs += 1;
    totals.quantity += Number(entry.quantity || 0);
    totals.rap += Number(entry.rapEarned || 0);
    totals.bonusRap += Number(entry.goalBonusRap || 0);
    return totals;
  }, { bonusRap: 0, logs: 0, quantity: 0, rap: 0 });
}

export function getDeedMastery(deed, deedLog) {
  const totals = getDeedTotals(deed, deedLog);
  const currentXp = Math.floor(totals.rap);
  const level = getSkillLevelForXp(currentXp);
  const nextLevel = Math.min(99, level + 1);
  const currentLevelXp = getSkillXpForLevel(level);
  const nextLevelXp = getSkillXpForLevel(nextLevel);
  const progress = level >= 99 ? 100 : Math.max(0, Math.min(100, ((currentXp - currentLevelXp) / Math.max(1, nextLevelXp - currentLevelXp)) * 100));

  return {
    currentXp,
    level,
    nextLevel,
    progress,
    xpToNext: level >= 99 ? 0 : Math.max(0, nextLevelXp - currentXp),
  };
}

export function calculateDeedReward(deed, deedLog, requestedQuantity, date = new Date()) {
  const quantity = clampDeedQuantity(deed, requestedQuantity);
  const rapPerUnit = Math.max(0, Number(deed.rapPerUnit) || 0);
  const dailyQuantityBefore = getDeedQuantityForPeriod(deedLog, deed.id, "daily", date);
  const dailySoftCap = Number(deed.softCapDailyQuantity) || Infinity;
  const baseSoftCapRate = Number(deed.softCapBaseRate) || DEFAULT_DEED_SOFT_CAP_BASE_RATE;
  const goalSoftCapRate = Number(deed.softCapGoalBonusRate) || DEFAULT_DEED_SOFT_CAP_GOAL_RATE;
  const quantityBeforeSoftCap = Math.max(0, Math.min(quantity, dailySoftCap - dailyQuantityBefore));
  const quantityAfterSoftCap = Math.max(0, quantity - quantityBeforeSoftCap);
  const baseRap = (quantityBeforeSoftCap * rapPerUnit) + (quantityAfterSoftCap * rapPerUnit * baseSoftCapRate);
  const goalBreakdown = (deed.goals || []).map((goal) => {
    const progress = getDeedGoalProgress(deed, deedLog, goal.period, date);
    const appliedQuantity = Math.max(0, Math.min(quantity, progress.remaining));
    const bonusQuantityBeforeSoftCap = Math.min(appliedQuantity, quantityBeforeSoftCap);
    const bonusQuantityAfterSoftCap = Math.max(0, appliedQuantity - bonusQuantityBeforeSoftCap);
    const bonusRate = Number(goal.bonusRate) || DEFAULT_DEED_GOAL_BONUS_RATE;
    const bonusRap = (
      (bonusQuantityBeforeSoftCap * rapPerUnit * bonusRate) +
      (bonusQuantityAfterSoftCap * rapPerUnit * bonusRate * goalSoftCapRate)
    );

    return {
      bonusRap,
      bonusRate,
      period: goal.period,
      quantity: appliedQuantity,
      remainingAfter: Math.max(0, progress.remaining - appliedQuantity),
      target: progress.target,
    };
  }).filter((goal) => goal.quantity > 0 && goal.bonusRap > 0);
  const goalBonusRap = goalBreakdown.reduce((sum, goal) => sum + goal.bonusRap, 0);

  return {
    baseRap,
    goalBonusRap,
    goalBreakdown,
    isSoftCapped: quantityAfterSoftCap > 0,
    quantity,
    quantityAfterSoftCap,
    quantityBeforeSoftCap,
    rapEarned: Math.floor(baseRap + goalBonusRap),
  };
}

export function getDeedDashboardSummary(deeds, deedLog) {
  const todayEntries = deedLog.filter((entry) => {
    const timestamp = new Date(entry.timestamp);
    const { end, start } = getPeriodRange("daily");
    return timestamp >= start && timestamp < end;
  });
  const activeDayKeys = deedLog.map((entry) => getDayKey(new Date(entry.timestamp)));
  const longestStreak = getLongestStreak(activeDayKeys);

  return {
    deedCount: deeds.length,
    loggedToday: todayEntries.length,
    longestStreak: longestStreak.length,
    todayRap: todayEntries.reduce((sum, entry) => sum + Number(entry.rapEarned || 0), 0),
  };
}

export function getRollingDays(dayCount = DEED_HEATMAP_DAYS) {
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

export function getFilteredDeedLog(deedLog, selectedDeedId) {
  if (selectedDeedId === "all") return deedLog;

  return deedLog.filter((entry) => entry.deedId === selectedDeedId);
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

export function getDeedStats(deedLog, selectedDeedId) {
  const filteredEntries = getFilteredDeedLog(deedLog, selectedDeedId);
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

export function getGroupedDeedLog(deedLog) {
  const grouped = new Map();

  deedLog.slice(0, DEED_LOG_LIMIT).forEach((entry) => {
    const key = `${entry.deedId}-${entry.title}-${entry.unit}`;
    const current = grouped.get(key);

    if (!current) {
      grouped.set(key, {
        deedId: entry.deedId,
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
