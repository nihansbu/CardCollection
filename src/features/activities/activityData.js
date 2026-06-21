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
    id: "walking",
    title: "Walking",
    description: "Track intentional walks, errands, and outdoor movement.",
    type: "Exercise",
    unit: "minutes",
    defaultQuantity: 10,
    rapPerUnit: 10,
    color: "#61d6a1",
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
