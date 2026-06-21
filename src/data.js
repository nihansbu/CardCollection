export const rarityConfig = {
  common: { label: "Common", weight: 57.67, color: "#aeb7c4" },
  uncommon: { label: "Uncommon", weight: 24, color: "#54d184" },
  rare: { label: "Rare", weight: 12, color: "#4fa4ff" },
  epic: { label: "Epic", weight: 5, color: "#b66cff" },
  legendary: { label: "Legendary", weight: 1, color: "#ffba3a" },
  mythic: { label: "Mythic", weight: 0.33, color: "#fff0ad" },
};

export const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

export const shinyChance = 1 / 100;

export const pityRules = {
  epic: 10,
  legendary: 40,
};

export const defaultPity = {
  packsSinceEpic: 0,
  packsSinceLegendary: 0,
};

export const packs = [
  {
    id: "halo-frontier",
    universe: "Halo",
    title: "Frontier Arsenal",
    subtitle: "UNSC Field Cache",
    category: "halo",
    cost: 500,
    accent: "#2c8dff",
    icon: "H",
    art: "halo",
    imageUrl: "/pack-art/frontier-arsenal.png",
    cardsPerOpen: 5,
    guaranteedRarity: "uncommon",
    description: "UNSC steel, covenant energy, old stars, new scars.",
    cards: [
      { id: "h-forerunner-crown", name: "Forerunner Crown", rarity: "mythic" },
      { id: "h-master-chief", name: "Master Chief", rarity: "legendary" },
      { id: "h-cortana", name: "Cortana Echo", rarity: "epic" },
      { id: "h-energy-sword", name: "Energy Sword", rarity: "rare" },
      { id: "h-warthog", name: "Warthog Run", rarity: "uncommon" },
      { id: "h-marine", name: "UNSC Marine", rarity: "common" },
    ],
  },
  {
    id: "runescape-gielinor",
    universe: "RuneScape",
    title: "Gielinor Relics",
    subtitle: "Quest Reward Chest",
    category: "runescape",
    cost: 450,
    accent: "#7cc74c",
    icon: "R",
    art: "runescape",
    cardsPerOpen: 5,
    guaranteedRarity: "uncommon",
    description: "Quest items, skill capes, dungeon loot, and campfire legends.",
    cards: [
      { id: "rs-guthix-relic", name: "Relic of Guthix", rarity: "mythic" },
      { id: "rs-partyhat", name: "Blue Partyhat", rarity: "legendary" },
      { id: "rs-slayer", name: "Slayer Master", rarity: "epic" },
      { id: "rs-dragon-scimitar", name: "Dragon Scimitar", rarity: "rare" },
      { id: "rs-skill-cape", name: "Skill Cape", rarity: "uncommon" },
      { id: "rs-shrimp", name: "Fresh Shrimp", rarity: "common" },
    ],
  },
  {
    id: "warcraft-azeroth",
    universe: "World of Warcraft",
    title: "Azeroth Champions",
    subtitle: "Raid Spoils",
    category: "warcraft",
    cost: 750,
    accent: "#ffd36b",
    icon: "W",
    art: "warcraft",
    cardsPerOpen: 5,
    guaranteedRarity: "uncommon",
    description: "Raid bosses, class fantasy, and legendary old-world drops.",
    cards: [
      { id: "wow-titan-soul", name: "Titan Soul", rarity: "mythic" },
      { id: "wow-lich-king", name: "The Lich King", rarity: "legendary" },
      { id: "wow-sylvanas", name: "Banshee Queen", rarity: "epic" },
      { id: "wow-ashbringer", name: "Ashbringer", rarity: "rare" },
      { id: "wow-gryphon", name: "Stormwind Gryphon", rarity: "uncommon" },
      { id: "wow-murloc", name: "Murloc Scout", rarity: "common" },
    ],
  },
  {
    id: "poe-wraeclast",
    universe: "Path of Exile",
    title: "Wraeclast Vault",
    subtitle: "Corrupted Treasury",
    category: "path-of-exile",
    cost: 850,
    accent: "#c64242",
    icon: "P",
    art: "poe",
    imageUrl: "/pack-art/wraeclast-vault.png",
    cardsPerOpen: 5,
    guaranteedRarity: "rare",
    description: "Currency shards, corrupted gods, and ruthless build-defining finds.",
    cards: [
      { id: "poe-ancient-key", name: "Ancient Reliquary Key", rarity: "mythic" },
      { id: "poe-mirror", name: "Mirror of Kalandra", rarity: "legendary" },
      { id: "poe-exalted", name: "Exalted Orb", rarity: "epic" },
      { id: "poe-tabula", name: "Tabula Rasa", rarity: "rare" },
      { id: "poe-map", name: "Crimson Temple Map", rarity: "uncommon" },
      { id: "poe-scroll", name: "Scroll of Wisdom", rarity: "common" },
    ],
  },
];
