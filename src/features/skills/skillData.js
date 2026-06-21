export const SKILL_STARTING_LEVEL = 1;
export const SKILL_MAX_LEVEL = 99;
export const SKILL_STARTING_XP = 0;
export const SKILL_TRAINING_RAP_PER_HOUR = 5000;
export const SKILL_TRAINING_RAP_PER_SECOND = SKILL_TRAINING_RAP_PER_HOUR / 3600;

export const skillStorageKeys = {
  skills: "codex-collector-v1-skills",
  trainingLastTick: "codex-collector-v1-skill-training-last-tick",
  trainingSlots: "codex-collector-v1-skill-training-slots",
};

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
