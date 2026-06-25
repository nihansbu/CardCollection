import { localStorageKeys } from "../../storage/storageKeys.js";

export const ACTIVITY_LOG_LIMIT = 50;
export const ACTIVITY_HEATMAP_DAYS = 365;
export const DAY_MS = 24 * 60 * 60 * 1000;

export const activityStorageKeys = {
  activities: localStorageKeys.activities,
  activityLog: localStorageKeys.activityLog,
  rap: localStorageKeys.rap,
};

export const defaultActivities = [
  {
    color: "#61d6a1",
    defaultQuantity: 1000,
    description: "Track daily step counts from walks, errands, commuting, or movement.",
    goals: [
      { bonusRate: 0.3, period: "daily", targetQuantity: 10000 },
      { bonusRate: 0.3, period: "weekly", targetQuantity: 100000 },
      { bonusRate: 0.2, period: "monthly", targetQuantity: 400000 },
    ],
    id: "steps",
    maxQuantityPerLog: 50000,
    presetQuantities: [500, 1000, 5000, 10000],
    rapPerUnit: 1,
    softCapBaseRate: 0.5,
    softCapDailyQuantity: 100000,
    softCapGoalBonusRate: 0.33,
    title: "Steps",
    type: "Exercise",
    unit: "steps",
  },
  {
    id: "walking",
    title: "Walking",
    description: "Track intentional walks, errands, and outdoor movement.",
    type: "Exercise",
    unit: "minutes",
    defaultQuantity: 10,
    rapPerUnit: 10,
    color: "#61d6a1",
    goals: [
      { bonusRate: 0.3, period: "daily", targetQuantity: 30 },
      { bonusRate: 0.3, period: "weekly", targetQuantity: 240 },
    ],
    maxQuantityPerLog: 300,
    presetQuantities: [10, 30, 60, 120],
    softCapDailyQuantity: 360,
  },
  {
    id: "running",
    title: "Running",
    description: "Log focused runs, intervals, treadmill sessions, or jogs.",
    type: "Exercise",
    unit: "minutes",
    defaultQuantity: 10,
    rapPerUnit: 16,
    color: "#ff7a45",
    goals: [
      { bonusRate: 0.3, period: "daily", targetQuantity: 20 },
      { bonusRate: 0.3, period: "weekly", targetQuantity: 180 },
    ],
    maxQuantityPerLog: 240,
    presetQuantities: [10, 20, 45, 90],
    softCapDailyQuantity: 240,
  },
  {
    id: "reading",
    title: "Reading",
    description: "Reward books, articles, documentation, and study reading.",
    type: "Mind",
    unit: "pages",
    defaultQuantity: 10,
    rapPerUnit: 8,
    color: "#f2cf5a",
    goals: [
      { bonusRate: 0.3, period: "daily", targetQuantity: 20 },
      { bonusRate: 0.3, period: "weekly", targetQuantity: 180 },
    ],
    maxQuantityPerLog: 500,
    presetQuantities: [10, 20, 50, 100],
    softCapDailyQuantity: 300,
  },
  {
    id: "working",
    title: "Working",
    description: "Track deep work, focused tasks, and productive sessions.",
    type: "Productivity",
    unit: "minutes",
    defaultQuantity: 25,
    rapPerUnit: 6,
    color: "#8ab4ff",
    goals: [
      { bonusRate: 0.3, period: "daily", targetQuantity: 50 },
      { bonusRate: 0.3, period: "weekly", targetQuantity: 400 },
    ],
    maxQuantityPerLog: 360,
    presetQuantities: [25, 50, 90, 180],
    softCapDailyQuantity: 600,
  },
  {
    id: "instrument",
    title: "Instrument Practice",
    description: "Practice piano, guitar, drums, voice, or any instrument.",
    type: "Creative",
    unit: "minutes",
    defaultQuantity: 15,
    rapPerUnit: 12,
    color: "#b68dff",
    goals: [
      { bonusRate: 0.3, period: "daily", targetQuantity: 30 },
      { bonusRate: 0.3, period: "weekly", targetQuantity: 240 },
    ],
    maxQuantityPerLog: 240,
    presetQuantities: [15, 30, 60, 120],
    softCapDailyQuantity: 300,
  },
];

export const activityTypes = ["Exercise", "Mind", "Productivity", "Creative", "Social", "Home", "Recovery", "General"];

export const activitySortOptions = [
  { label: "Default", value: "default" },
  { label: "Name", value: "name" },
  { label: "RAP Reward", value: "rap" },
  { label: "Type", value: "type" },
  { label: "Unit", value: "unit" },
];
