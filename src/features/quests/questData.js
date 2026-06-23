import { localStorageKeys } from "../../storage/storageKeys.js";
import { formatTrainingTime } from "../skills/skillData.js";

export const QUEST_RAP_PER_HOUR = 5000;
export const QUEST_RAP_PER_SECOND = QUEST_RAP_PER_HOUR / 3600;

export const questStorageKeys = {
  lastTick: localStorageKeys.questLastTick,
  quests: localStorageKeys.quests,
};

export const questDefinitions = [
  {
    color: "#61d6ff",
    description: "A small starter errand chain for learning how quest checks work.",
    iconText: "Q1",
    id: "first-steps",
    name: "First Steps",
    rapCost: 0,
    requirements: [],
  },
  {
    color: "#f2cf5a",
    description: "Help in the kitchen and prove basic Cooking discipline.",
    iconText: "CA",
    id: "cooks-assistant",
    name: "Cook's Assistant",
    rapCost: 200,
    requirements: [{ level: 1, skill: "Cooking" }],
  },
  {
    color: "#7ad36b",
    description: "A short village task that checks early Woodcutting and Fishing.",
    iconText: "VG",
    id: "village-gathering",
    name: "Village Gathering",
    rapCost: 350,
    requirements: [
      { level: 3, skill: "Fishing" },
      { level: 3, skill: "Woodcutting" },
    ],
  },
  {
    color: "#f07a2c",
    description: "Repair tools, carry supplies, and pass a light Smithing gate.",
    iconText: "RT",
    id: "rusted-tools",
    name: "Rusted Tools",
    rapCost: 600,
    requirements: [
      { level: 5, skill: "Mining" },
      { level: 5, skill: "Smithing" },
    ],
  },
  {
    color: "#8d6dff",
    description: "Trace basic runes and unlock a small magical favour.",
    iconText: "AR",
    id: "arcane-runes",
    name: "Arcane Runes",
    rapCost: 900,
    requirements: [
      { level: 7, skill: "Magic" },
      { level: 4, skill: "Runecraft" },
    ],
  },
  {
    color: "#ff7538",
    description: "Keep a remote camp alive with fire, food, and gathered materials.",
    iconText: "HC",
    id: "hillside-camp",
    name: "Hillside Camp",
    rapCost: 1200,
    requirements: [
      { level: 8, skill: "Cooking" },
      { level: 8, skill: "Firemaking" },
      { level: 8, skill: "Woodcutting" },
    ],
  },
  {
    color: "#66d3a1",
    description: "A route through shortcuts and rooftops that checks movement skills.",
    iconText: "RR",
    id: "rooftop-route",
    name: "Rooftop Route",
    rapCost: 1800,
    requirements: [
      { level: 12, skill: "Agility" },
      { level: 8, skill: "Thieving" },
    ],
  },
  {
    color: "#c88b45",
    description: "Track beasts in the field and complete a controlled hunt.",
    iconText: "WH",
    id: "wild-hunt",
    name: "Wild Hunt",
    rapCost: 2400,
    requirements: [
      { level: 15, skill: "Hunter" },
      { level: 10, skill: "Ranged" },
    ],
  },
  {
    color: "#d3a45c",
    description: "Recover old fragments and restore a damaged relic.",
    iconText: "RR",
    id: "relic-recovery",
    name: "Relic Recovery",
    rapCost: 3200,
    requirements: [
      { level: 18, skill: "Archaeology" },
      { level: 12, skill: "Crafting" },
    ],
  },
  {
    color: "#f2e7b5",
    description: "A long chain of errands and favours with demanding support checks.",
    iconText: "OSF",
    id: "one-small-favour",
    name: "Ein Kleiner Gefallen",
    rapCost: 5000,
    requirements: [
      { level: 45, skill: "Prayer" },
      { level: 32, skill: "Smithing" },
      { level: 81, skill: "Archaeology" },
    ],
  },
  {
    color: "#5fb7ff",
    description: "Bind a minor familiar and solve a charm-based ritual.",
    iconText: "FC",
    id: "familiar-contract",
    name: "Familiar Contract",
    rapCost: 6200,
    requirements: [
      { level: 50, skill: "Summoning" },
      { level: 35, skill: "Magic" },
    ],
  },
  {
    color: "#3fb9d8",
    description: "Prepare a small voyage and check maritime progress.",
    iconText: "SV",
    id: "sea-voyage",
    name: "Sea Voyage",
    rapCost: 7600,
    requirements: [
      { level: 55, skill: "Sailing" },
      { level: 35, skill: "Fishing" },
      { level: 25, skill: "Construction" },
    ],
  },
];

export function formatQuestDurationFromRap(rapCost) {
  return formatTrainingTime((Math.max(0, Number(rapCost) || 0) / QUEST_RAP_PER_HOUR) * 3600);
}

export function normalizeQuests(savedQuests = []) {
  const savedById = new Map((Array.isArray(savedQuests) ? savedQuests : []).map((quest) => [quest.id, quest]));

  return questDefinitions.map((definition) => {
    const savedQuest = savedById.get(definition.id);
    const rapCost = Math.max(0, Number(definition.rapCost) || 0);
    const progressRap = Math.min(rapCost, Math.max(0, Number(savedQuest?.progressRap) || 0));
    const isFreeQuest = rapCost <= 0 && definition.requirements.length === 0;
    const isComplete = isFreeQuest || savedQuest?.status === "completed" || progressRap >= rapCost;

    return {
      ...definition,
      completedAt: isComplete ? savedQuest?.completedAt || new Date(0).toISOString() : null,
      progressRap: isComplete ? rapCost : progressRap,
      startedAt: isComplete ? null : savedQuest?.startedAt || null,
      status: isComplete ? "completed" : savedQuest?.status === "unlocking" ? "unlocking" : "available",
    };
  });
}

export function getQuestStatus(quest, skills) {
  if (quest.status === "completed") return "completed";
  if (quest.status === "unlocking") return "unlocking";

  const skillsByName = new Map(skills.map((skill) => [skill.name, skill]));
  const hasRequirements = quest.requirements.every((requirement) => {
    const skill = skillsByName.get(requirement.skill);
    return skill && skill.level >= requirement.level;
  });

  return hasRequirements ? "available" : "locked";
}

export function getQuestProgressPercent(quest) {
  if (quest.status === "completed") return 100;
  if (quest.rapCost <= 0) return 100;

  return Math.max(0, Math.min(100, (quest.progressRap / quest.rapCost) * 100));
}

export function getQuestSummary(quests, skills) {
  const summary = quests.reduce((totals, quest) => {
    const status = getQuestStatus(quest, skills);
    totals[status] = (totals[status] || 0) + 1;
    totals.total += 1;
    return totals;
  }, { available: 0, completed: 0, locked: 0, total: 0, unlocking: 0 });

  return summary;
}

export function startQuestUnlock({ questId, quests, skills }) {
  return quests.map((quest) => {
    if (quest.id !== questId) return quest;
    if (getQuestStatus(quest, skills) !== "available") return quest;

    return {
      ...quest,
      startedAt: new Date().toISOString(),
      status: quest.rapCost <= 0 ? "completed" : "unlocking",
    };
  });
}

export function applyQuestProgress({ elapsedSeconds, quests, rap }) {
  const availableRap = Math.max(0, Number(rap) || 0);
  const seconds = Math.max(0, Number(elapsedSeconds) || 0);
  const activeQuests = quests.filter((quest) => quest.status === "unlocking");

  if (activeQuests.length === 0) {
    return { changed: false, quests, rap: availableRap };
  }

  if (availableRap <= 0 || seconds <= 0) {
    return { changed: false, quests, rap: availableRap };
  }

  const requestedRapPerQuest = QUEST_RAP_PER_SECOND * seconds;
  const requestedRap = activeQuests.reduce((sum, quest) => {
    const remainingRap = Math.max(0, quest.rapCost - quest.progressRap);
    return sum + Math.min(remainingRap, requestedRapPerQuest);
  }, 0);
  const spendScale = requestedRap > availableRap ? availableRap / requestedRap : 1;
  let spentRap = 0;
  let changed = false;

  const nextQuests = quests.map((quest) => {
    if (quest.status !== "unlocking") return quest;

    const remainingRap = Math.max(0, quest.rapCost - quest.progressRap);
    const progressRap = Math.min(remainingRap, requestedRapPerQuest) * spendScale;

    if (progressRap <= 0) return quest;

    const nextProgressRap = Math.min(quest.rapCost, quest.progressRap + progressRap);
    const isComplete = nextProgressRap >= quest.rapCost - 0.0001;

    spentRap += progressRap;
    changed = true;

    return {
      ...quest,
      completedAt: isComplete ? new Date().toISOString() : quest.completedAt,
      progressRap: isComplete ? quest.rapCost : nextProgressRap,
      startedAt: isComplete ? null : quest.startedAt,
      status: isComplete ? "completed" : "unlocking",
    };
  });

  return {
    changed,
    quests: nextQuests,
    rap: Math.max(0, availableRap - spentRap),
  };
}
