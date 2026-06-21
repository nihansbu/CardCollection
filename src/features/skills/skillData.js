import { localStorageKeys } from "../../storage/storageKeys.js";

export const SKILL_STARTING_LEVEL = 1;
export const SKILL_MAX_LEVEL = 99;
export const SKILL_STARTING_XP = 0;
export const SKILL_TRAINING_RAP_PER_HOUR = 5000;
export const SKILL_TRAINING_RAP_PER_SECOND = SKILL_TRAINING_RAP_PER_HOUR / 3600;
export const SKILL_UNLOCK_RAP_PER_HOUR = 5000;
export const SKILL_UNLOCK_RAP_PER_SECOND = SKILL_UNLOCK_RAP_PER_HOUR / 3600;

export const skillStorageKeys = {
  skills: localStorageKeys.skills,
  trainingLastTick: localStorageKeys.trainingLastTick,
  trainingSlots: localStorageKeys.trainingSlots,
  unlockLastTick: localStorageKeys.unlockLastTick,
  unlocks: localStorageKeys.unlocks,
};

function publicAsset(path) {
  return `${import.meta.env?.DEV ? "/" : "./"}${path}`;
}

export const skillGroups = [
  {
    title: "Combat",
    skills: [
      ["Attack", "Melee accuracy and weapon control.", "ATK", "#d94a43"],
      ["Strength", "Heavy hits and melee max damage.", "STR", "#f07a2c"],
      ["Defence", "Armor mastery and incoming damage reduction.", "DEF", "#6aa4ff"],
      ["Ranged", "Bows, crossbows, thrown weapons, and distance damage.", "RNG", "#59c978"],
      ["Prayer", "Blessings, protection prayers, and holy utility.", "PRY", "#f2e7b5"],
      ["Magic", "Spells, teleports, runes, and elemental damage.", "MAG", "#8d6dff"],
      ["Hitpoints", "Maximum health and survival training.", "HP", "#67e3e5"],
      ["Slayer", "Assignments, monster hunting, and rare creature unlocks.", "SLY", "#393f46"],
    ],
  },
  {
    title: "Gathering",
    skills: [
      ["Mining", "Ore extraction, rocks, pickaxes, and geodes.", "MIN", "#8d97a6"],
      ["Fishing", "Fishing spots, catches, bait, and harpoons.", "FSH", "#4ab8ff"],
      ["Woodcutting", "Trees, axes, logs, and bird nests.", "WC", "#47bd65"],
      ["Farming", "Patches, herbs, trees, compost, and growth cycles.", "FRM", "#77d14d"],
      ["Hunter", "Tracking, traps, creatures, and field craft.", "HNT", "#c88b45"],
      ["Divination", "Wisps, memories, energy, and divine locations.", "DIV", "#74c7f7"],
      ["Archaeology", "Dig sites, relics, mysteries, and restoration.", "ARC", "#d3a45c"],
    ],
  },
  {
    title: "Artisan",
    skills: [
      ["Cooking", "Food preparation, burn rates, and healing meals.", "CK", "#f0a846"],
      ["Crafting", "Jewellery, leather, glass, pottery, and battlestaves.", "CRF", "#b68dff"],
      ["Smithing", "Bars, anvils, armor, weapons, and metalwork.", "SMT", "#d9d6ca"],
      ["Firemaking", "Logs, bonfires, braziers, and warmth buffs.", "FM", "#ff7538"],
      ["Fletching", "Bows, arrows, darts, bolts, and ranged supplies.", "FLT", "#c7df5f"],
      ["Herblore", "Potions, herbs, secondaries, and combat boosts.", "HER", "#42c58a"],
      ["Runecraft", "Rune essence, altars, pouches, and rune creation.", "RC", "#61d6ff"],
      ["Construction", "Player-owned rooms, furniture, portals, and workshops.", "CON", "#c28149"],
    ],
  },
  {
    title: "Support",
    skills: [
      ["Agility", "Courses, shortcuts, stamina, and movement mastery.", "AGI", "#66d3a1"],
      ["Thieving", "Pickpocketing, stalls, chests, and stealth routes.", "THV", "#a9a9b5"],
      ["Summoning", "Charms, familiars, pouches, and combat companions.", "SUM", "#5fb7ff"],
      ["Sailing", "Ships, sea routes, voyages, crews, and ocean discoveries.", "SAIL", "#3fb9d8"],
      ["Dungeoneering", "Floor clearing, puzzles, bosses, and party progression.", "DG", "#8a6752"],
      ["Invention", "Devices, augmentation, gizmos, and item discovery.", "INV", "#f4cf5a"],
      ["Necromancy", "Conjures, souls, rituals, and undead combat style.", "NEC", "#76f3d5"],
    ],
  },
];

export const flatSkills = skillGroups.flatMap((group) => group.skills.map(([name, description, short, color]) => ({
  color,
  currentXp: SKILL_STARTING_XP,
  description,
  group: group.title,
  level: SKILL_STARTING_LEVEL,
  maxLevel: SKILL_MAX_LEVEL,
  name,
  short,
})));

export const skillUnlockDefinitions = [
  {
    description: "Basic trees and starting logs are available immediately.",
    iconSrc: publicAsset("unlock-icons/woodcutting/normal-logs.png"),
    iconText: "LOG",
    id: "woodcutting-normal-logs",
    levelRequired: 1,
    name: "Normal Logs",
    skill: "Woodcutting",
  },
  {
    description: "Unlock oak trees as the first paid Woodcutting milestone.",
    iconSrc: publicAsset("unlock-icons/woodcutting/oak-logs.png"),
    iconText: "OAK",
    id: "woodcutting-oak-logs",
    levelRequired: 2,
    name: "Oak Logs",
    skill: "Woodcutting",
  },
  {
    description: "Unlock willow trees for early gathering routes.",
    iconSrc: publicAsset("unlock-icons/woodcutting/willow-logs.png"),
    iconText: "WIL",
    id: "woodcutting-willow-logs",
    levelRequired: 5,
    name: "Willow Logs",
    skill: "Woodcutting",
  },
  {
    description: "Unlock maple trees for mid-tier logs.",
    iconSrc: publicAsset("unlock-icons/woodcutting/maple-logs.png"),
    iconText: "MAP",
    id: "woodcutting-maple-logs",
    levelRequired: 10,
    name: "Maple Logs",
    skill: "Woodcutting",
  },
  {
    description: "Unlock teak trees and faster material gathering.",
    iconSrc: publicAsset("unlock-icons/woodcutting/teak-logs.png"),
    iconText: "TEK",
    id: "woodcutting-teak-logs",
    levelRequired: 15,
    name: "Teak Logs",
    skill: "Woodcutting",
  },
  {
    description: "Unlock mahogany trees for valuable hardwood.",
    iconSrc: publicAsset("unlock-icons/woodcutting/mahogany-logs.png"),
    iconText: "MAH",
    id: "woodcutting-mahogany-logs",
    levelRequired: 20,
    name: "Mahogany Logs",
    skill: "Woodcutting",
  },
  {
    description: "Unlock yew trees and high-value long-term gathering.",
    iconSrc: publicAsset("unlock-icons/woodcutting/yew-logs.png"),
    iconText: "YEW",
    id: "woodcutting-yew-logs",
    levelRequired: 30,
    name: "Yew Logs",
    skill: "Woodcutting",
  },
  {
    description: "Unlock magic trees for rare logs and late-game activities.",
    iconSrc: publicAsset("unlock-icons/woodcutting/magic-logs.png"),
    iconText: "MAG",
    id: "woodcutting-magic-logs",
    levelRequired: 40,
    name: "Magic Logs",
    skill: "Woodcutting",
  },
  {
    description: "Unlock elder trees as a high-level Woodcutting target.",
    iconSrc: publicAsset("unlock-icons/woodcutting/elder-logs.png"),
    iconText: "ELD",
    id: "woodcutting-elder-logs",
    levelRequired: 60,
    name: "Elder Logs",
    skill: "Woodcutting",
  },
  {
    description: "Unlock crystal trees for future premium gathering rewards.",
    iconSrc: publicAsset("unlock-icons/woodcutting/crystal-trees.png"),
    iconText: "CRY",
    id: "woodcutting-crystal-trees",
    levelRequired: 75,
    name: "Crystal Trees",
    skill: "Woodcutting",
  },
];

export function getSkillXpForLevel(level) {
  let points = 0;

  for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
    points += Math.floor(currentLevel + 300 * 2 ** (currentLevel / 7));
  }

  return Math.floor(points / 4);
}

export function getSkillLevelForXp(xp) {
  let level = SKILL_STARTING_LEVEL;

  for (let nextLevel = SKILL_STARTING_LEVEL + 1; nextLevel <= SKILL_MAX_LEVEL; nextLevel += 1) {
    if (xp < getSkillXpForLevel(nextLevel)) break;
    level = nextLevel;
  }

  return level;
}

export function normalizeSkills(savedSkills = []) {
  const savedByName = new Map(savedSkills.map((skill) => [skill.name, skill]));

  return flatSkills.map((baseSkill) => {
    const savedSkill = savedByName.get(baseSkill.name);
    const currentXp = Math.max(0, Number(savedSkill?.currentXp ?? baseSkill.currentXp) || 0);

    return {
      ...baseSkill,
      currentXp,
      level: getSkillLevelForXp(currentXp),
    };
  });
}

export function normalizeTrainingSlots(savedSlots = []) {
  const knownSkillNames = new Set(flatSkills.map((skill) => skill.name));
  const slots = Array.isArray(savedSlots) ? savedSlots : [];

  return [0, 1, 2].map((index) => {
    const skillName = slots[index];
    return knownSkillNames.has(skillName) ? skillName : null;
  });
}

export function getUnlockRapCost(unlock) {
  if (unlock.levelRequired <= 1) return 0;

  return Math.max(0, unlock.levelRequired * 100);
}

export function normalizeSkillUnlocks(savedUnlocks = []) {
  const savedById = new Map((Array.isArray(savedUnlocks) ? savedUnlocks : []).map((unlock) => [unlock.id, unlock]));

  return skillUnlockDefinitions.map((definition) => {
    const savedUnlock = savedById.get(definition.id);
    const rapCost = getUnlockRapCost(definition);
    const progressRap = Math.min(rapCost, Math.max(0, Number(savedUnlock?.progressRap) || 0));
    const isLevelOneUnlock = definition.levelRequired <= 1;
    const isComplete = isLevelOneUnlock || savedUnlock?.status === "unlocked" || progressRap >= rapCost;

    return {
      ...definition,
      completedAt: isComplete ? savedUnlock?.completedAt || new Date(0).toISOString() : null,
      progressRap: isComplete ? rapCost : progressRap,
      rapCost,
      startedAt: isComplete ? null : savedUnlock?.startedAt || null,
      status: isComplete ? "unlocked" : savedUnlock?.status === "unlocking" ? "unlocking" : "available",
    };
  });
}

export function getSkillUnlockStatus(unlock, skillLevel) {
  if (unlock.status === "unlocked" || unlock.levelRequired <= 1) return "unlocked";
  if (skillLevel < unlock.levelRequired) return "locked";
  if (unlock.status === "unlocking") return "unlocking";
  return "available";
}

export function getSkillTotals(skills) {
  const totalSkillLevel = skills.reduce((sum, skill) => sum + skill.level, 0);
  const totalSkillXp = skills.reduce((sum, skill) => sum + skill.currentXp, 0);
  const averageSkillLevel = Math.round(totalSkillLevel / skills.length);

  return {
    averageSkillLevel,
    totalSkillLevel,
    totalSkillXp,
  };
}

export function formatCompactSkillValue(value) {
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

export function getSkillLevelProgress(skill) {
  if (skill.level >= skill.maxLevel) return 100;

  const currentLevelXp = getSkillXpForLevel(skill.level);
  const nextLevelXp = getSkillXpForLevel(skill.level + 1);
  const progress = ((skill.currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return Math.max(0, Math.min(99, Math.floor(progress)));
}

export function getSkillXpToNextLevel(skill) {
  if (skill.level >= skill.maxLevel) return 0;

  return Math.max(0, Math.ceil(getSkillXpForLevel(skill.level + 1) - skill.currentXp));
}

export function getActiveTrainingSkills(trainingSlots) {
  return [...new Set(trainingSlots.filter(Boolean))];
}

export function getSkillTrainingRatePerHour(skillName, trainingSlots) {
  const activeTrainingSkills = getActiveTrainingSkills(trainingSlots);

  if (!activeTrainingSkills.includes(skillName)) return 0;

  return SKILL_TRAINING_RAP_PER_HOUR / activeTrainingSkills.length;
}

export function formatTrainingTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";

  const totalSeconds = Math.ceil(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

export function formatUnlockDurationFromRap(rapCost) {
  return formatTrainingTime((Math.max(0, Number(rapCost) || 0) / SKILL_UNLOCK_RAP_PER_HOUR) * 3600);
}

export function getSkillTimeToNextLevel(skill, trainingSlots) {
  const xpToNextLevel = getSkillXpToNextLevel(skill);
  const xpPerHour = getSkillTrainingRatePerHour(skill.name, trainingSlots);

  if (xpToNextLevel <= 0) return "0s";
  if (xpPerHour <= 0) return "Idle";

  return formatTrainingTime((xpToNextLevel / xpPerHour) * 3600);
}

export function applySkillTrainingProgress({ elapsedSeconds, rap, skills, trainingSlots }) {
  const activeTrainingSkills = getActiveTrainingSkills(trainingSlots);
  const availableRap = Math.max(0, Number(rap) || 0);
  const seconds = Math.max(0, Number(elapsedSeconds) || 0);

  if (activeTrainingSkills.length === 0) {
    return { changed: false, rap: availableRap, skills, trainingSlots };
  }

  if (availableRap <= 0) {
    return {
      changed: true,
      rap: 0,
      skills,
      trainingSlots: trainingSlots.map(() => null),
    };
  }

  const spentRap = Math.min(availableRap, SKILL_TRAINING_RAP_PER_SECOND * seconds);

  if (spentRap <= 0) {
    return { changed: false, rap: availableRap, skills, trainingSlots };
  }

  const xpPerSkill = spentRap / activeTrainingSkills.length;
  const nextSkills = skills.map((skill) => {
    if (!activeTrainingSkills.includes(skill.name)) return skill;

    const currentXp = skill.currentXp + xpPerSkill;

    return {
      ...skill,
      currentXp,
      level: getSkillLevelForXp(currentXp),
    };
  });

  return {
    changed: true,
    rap: Math.max(0, availableRap - spentRap),
    skills: nextSkills,
    trainingSlots: spentRap >= availableRap ? trainingSlots.map(() => null) : trainingSlots,
  };
}

export function startSkillUnlock({ skillLevel, unlockId, unlocks }) {
  return unlocks.map((unlock) => {
    if (unlock.id !== unlockId) return unlock;

    const status = getSkillUnlockStatus(unlock, skillLevel);

    if (status !== "available") return unlock;

    return {
      ...unlock,
      startedAt: new Date().toISOString(),
      status: "unlocking",
    };
  });
}

export function applySkillUnlockProgress({ elapsedSeconds, rap, unlocks }) {
  const availableRap = Math.max(0, Number(rap) || 0);
  const seconds = Math.max(0, Number(elapsedSeconds) || 0);
  const activeUnlocks = unlocks.filter((unlock) => unlock.status === "unlocking");

  if (activeUnlocks.length === 0) {
    return { changed: false, rap: availableRap, unlocks };
  }

  if (availableRap <= 0 || seconds <= 0) {
    return { changed: false, rap: availableRap, unlocks };
  }

  const requestedRapPerUnlock = SKILL_UNLOCK_RAP_PER_SECOND * seconds;
  const requestedRap = activeUnlocks.reduce((sum, unlock) => {
    const remainingRap = Math.max(0, unlock.rapCost - unlock.progressRap);
    return sum + Math.min(remainingRap, requestedRapPerUnlock);
  }, 0);

  const spendScale = requestedRap > availableRap ? availableRap / requestedRap : 1;
  let spentRap = 0;
  let changed = false;

  const nextUnlocks = unlocks.map((unlock) => {
    if (unlock.status !== "unlocking") return unlock;

    const remainingRap = Math.max(0, unlock.rapCost - unlock.progressRap);
    const progressRap = Math.min(remainingRap, requestedRapPerUnlock) * spendScale;

    if (progressRap <= 0) return unlock;

    const nextProgressRap = Math.min(unlock.rapCost, unlock.progressRap + progressRap);
    const isComplete = nextProgressRap >= unlock.rapCost - 0.0001;

    spentRap += progressRap;
    changed = true;

    return {
      ...unlock,
      completedAt: isComplete ? new Date().toISOString() : unlock.completedAt,
      progressRap: isComplete ? unlock.rapCost : nextProgressRap,
      startedAt: isComplete ? null : unlock.startedAt,
      status: isComplete ? "unlocked" : "unlocking",
    };
  });

  return {
    changed,
    rap: Math.max(0, availableRap - spentRap),
    unlocks: nextUnlocks,
  };
}
