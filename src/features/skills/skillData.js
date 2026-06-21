export const SKILL_STARTING_LEVEL = 1;
export const SKILL_MAX_LEVEL = 99;
export const SKILL_STARTING_XP = 0;

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

export const totalSkillLevel = flatSkills.reduce((sum, skill) => sum + skill.level, 0);
export const averageSkillLevel = Math.round(totalSkillLevel / flatSkills.length);

export function getSkillXpForLevel(level) {
  let points = 0;

  for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
    points += Math.floor(currentLevel + 300 * 2 ** (currentLevel / 7));
  }

  return Math.floor(points / 4);
}

export function formatSkillXp(value) {
  return new Intl.NumberFormat("de-DE").format(value);
}
