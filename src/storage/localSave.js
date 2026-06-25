import { defaultDeeds } from "../features/deeds/deedData.js";
import { normalizeDeeds } from "../features/deeds/deedUtils.js";
import { normalizeQuests } from "../features/quests/questData.js";
import { normalizeSkillUnlocks, normalizeSkills, normalizeTrainingSlots } from "../features/skills/skillData.js";
import { readJson, writeJson } from "./jsonStorage.js";
import { LOCAL_SAVE_SCHEMA_VERSION, localStorageKeys } from "./storageKeys.js";
export { readJson, writeJson } from "./jsonStorage.js";

export function readNumber(key, fallback = 0) {
  return Math.max(0, Number(readJson(key, fallback)) || fallback);
}

function readFirstJson(keys, fallback) {
  for (const key of keys) {
    const value = readJson(key, undefined);
    if (value !== undefined) return value;
  }

  return fallback;
}

function normalizeDeedLogEntries(entries) {
  if (!Array.isArray(entries)) return [];

  return entries.map((entry) => ({
    ...entry,
    deedId: entry.deedId || entry.activityId,
  }));
}

export function loadLocalGameSave(now = Date.now()) {
  const storedDeeds = readFirstJson([localStorageKeys.deeds, localStorageKeys.legacyActivities], defaultDeeds);
  const storedDeedLog = readFirstJson([localStorageKeys.deedLog, localStorageKeys.legacyActivityLog], []);

  return {
    deeds: normalizeDeeds(storedDeeds),
    deedLog: normalizeDeedLogEntries(storedDeedLog),
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
  writeJson(localStorageKeys.deeds, normalizeDeeds(save.deeds || save.activities || defaultDeeds));
  writeJson(localStorageKeys.deedLog, normalizeDeedLogEntries(Array.isArray(save.deedLog) ? save.deedLog : Array.isArray(save.activityLog) ? save.activityLog : []));
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
