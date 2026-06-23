import { defaultActivities } from "../features/activities/activityData.js";
import { normalizeActivities } from "../features/activities/activityUtils.js";
import { normalizeQuests } from "../features/quests/questData.js";
import { normalizeSkillUnlocks, normalizeSkills, normalizeTrainingSlots } from "../features/skills/skillData.js";
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
    questLastTick: Math.max(0, Number(readJson(localStorageKeys.questLastTick, now)) || now),
    quests: normalizeQuests(readJson(localStorageKeys.quests, [])),
    rap: readNumber(localStorageKeys.rap, 0),
    schemaVersion: LOCAL_SAVE_SCHEMA_VERSION,
    skills: normalizeSkills(readJson(localStorageKeys.skills, [])),
    trainingLastTick: Math.max(0, Number(readJson(localStorageKeys.trainingLastTick, now)) || now),
    trainingSlots: normalizeTrainingSlots(readJson(localStorageKeys.trainingSlots, [])),
    unlockLastTick: Math.max(0, Number(readJson(localStorageKeys.unlockLastTick, now)) || now),
    unlocks: normalizeSkillUnlocks(readJson(localStorageKeys.unlocks, [])),
  };
}

export function writeLocalGameSave(save) {
  writeJson(localStorageKeys.activities, normalizeActivities(save.activities || defaultActivities));
  writeJson(localStorageKeys.activityLog, Array.isArray(save.activityLog) ? save.activityLog : []);
  writeJson(localStorageKeys.questLastTick, Math.max(0, Number(save.questLastTick) || Date.now()));
  writeJson(localStorageKeys.quests, normalizeQuests(save.quests || []));
  writeJson(localStorageKeys.rap, Math.max(0, Number(save.rap) || 0));
  writeJson(localStorageKeys.skills, normalizeSkills(save.skills || []));
  writeJson(localStorageKeys.trainingLastTick, Math.max(0, Number(save.trainingLastTick) || Date.now()));
  writeJson(localStorageKeys.trainingSlots, normalizeTrainingSlots(save.trainingSlots || []));
  writeJson(localStorageKeys.unlockLastTick, Math.max(0, Number(save.unlockLastTick) || Date.now()));
  writeJson(localStorageKeys.unlocks, normalizeSkillUnlocks(save.unlocks || []));
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
