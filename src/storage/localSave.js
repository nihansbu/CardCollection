import { defaultActivities } from "../features/activities/activityData.js";
import { normalizeActivities } from "../features/activities/activityUtils.js";
import { normalizeSkills, normalizeTrainingSlots } from "../features/skills/skillData.js";
import { readJson, writeJson } from "./jsonStorage.js";
import { LOCAL_SAVE_SCHEMA_VERSION, localStorageKeys } from "./storageKeys.js";
export { readJson, writeJson } from "./jsonStorage.js";

export function readNumber(key, fallback = 0) {
  return Math.max(0, Number(readJson(key, fallback)) || fallback);
}

export function loadLocalGameSave(now = Date.now()) {
  return {
    activities: normalizeActivities(readJson(localStorageKeys.activities, defaultActivities)),
    activityLog: readJson(localStorageKeys.activityLog, []),
    exportedAt: new Date(now).toISOString(),
    rap: readNumber(localStorageKeys.rap, 0),
    schemaVersion: LOCAL_SAVE_SCHEMA_VERSION,
    skills: normalizeSkills(readJson(localStorageKeys.skills, [])),
    trainingLastTick: Math.max(0, Number(readJson(localStorageKeys.trainingLastTick, now)) || now),
    trainingSlots: normalizeTrainingSlots(readJson(localStorageKeys.trainingSlots, [])),
  };
}

export function writeLocalGameSave(save) {
  writeJson(localStorageKeys.activities, normalizeActivities(save.activities || defaultActivities));
  writeJson(localStorageKeys.activityLog, Array.isArray(save.activityLog) ? save.activityLog : []);
  writeJson(localStorageKeys.rap, Math.max(0, Number(save.rap) || 0));
  writeJson(localStorageKeys.skills, normalizeSkills(save.skills || []));
  writeJson(localStorageKeys.trainingLastTick, Math.max(0, Number(save.trainingLastTick) || Date.now()));
  writeJson(localStorageKeys.trainingSlots, normalizeTrainingSlots(save.trainingSlots || []));
}

export function writeLocalGameSavePatch(patch) {
  Object.entries(patch).forEach(([key, value]) => {
    if (!Object.prototype.hasOwnProperty.call(localStorageKeys, key)) return;
    writeJson(localStorageKeys[key], value);
  });
}

export function exportLocalGameSave() {
  return loadLocalGameSave();
}

export function importLocalGameSave(save) {
  writeLocalGameSave(save);
  return loadLocalGameSave();
}
