import { defaultPity, pityRules, rarityConfig, rarityOrder, shinyChance } from "./data.js";

const randomIndex = (max) => Math.floor(Math.random() * max);

const rarityRank = (rarity) => rarityOrder.indexOf(rarity);

function buildWeights(pack, minimumRarity) {
  const baseWeights = pack.rarityWeights ?? Object.fromEntries(
    Object.entries(rarityConfig).map(([rarity, config]) => [rarity, config.weight]),
  );

  if (!minimumRarity) return baseWeights;

  const minimumRank = rarityRank(minimumRarity);
  return Object.fromEntries(
    Object.entries(baseWeights).filter(([rarity]) => rarityRank(rarity) >= minimumRank),
  );
}

export function rollRarity(pack, options = {}) {
  if (options.forcedRarity) return options.forcedRarity;

  const entries = Object.entries(buildWeights(pack, options.minimumRarity));
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;

  for (const [rarity, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }

  return entries[entries.length - 1][0];
}

function rollCard(pack, options = {}) {
  const rarity = rollRarity(pack, options);
  const pool = pack.cards.filter((card) => card.rarity === rarity);
  const fallbackPool = pack.cards.length > 0 ? pack.cards : [];
  const source = pool.length > 0 ? pool : fallbackPool;
  const card = source[randomIndex(source.length)];

  return {
    ...card,
    packId: pack.id,
    packTitle: pack.title,
    packUniverse: pack.universe,
    shiny: Math.random() < shinyChance,
    pulledAt: new Date().toISOString(),
    instanceId: crypto.randomUUID(),
  };
}

function getPitySlotOptions(pityState = defaultPity) {
  if (pityState.packsSinceLegendary >= pityRules.legendary - 1) {
    return { forcedRarity: "legendary", pityTriggered: "legendary" };
  }

  if (pityState.packsSinceEpic >= pityRules.epic - 1) {
    return { minimumRarity: "epic", pityTriggered: "epic" };
  }

  return { minimumRarity: null, pityTriggered: null };
}

function updatePityState(pityState = defaultPity, pulls) {
  const hasEpicOrBetter = pulls.some((pull) => rarityRank(pull.rarity) >= rarityRank("epic"));
  const hasLegendary = pulls.some((pull) => pull.rarity === "legendary");

  return {
    packsSinceEpic: hasEpicOrBetter ? 0 : pityState.packsSinceEpic + 1,
    packsSinceLegendary: hasLegendary ? 0 : pityState.packsSinceLegendary + 1,
  };
}

export function openPack(pack, pityState = defaultPity) {
  const cardCount = pack.cardsPerOpen ?? 5;
  const pitySlot = getPitySlotOptions(pityState);
  const firstSlotOptions = pitySlot.pityTriggered
    ? pitySlot
    : { minimumRarity: pack.guaranteedRarity ?? "uncommon" };

  const pulls = [
    rollCard(pack, firstSlotOptions),
    ...Array.from({ length: cardCount - 1 }, () => rollCard(pack)),
  ];

  return {
    pulls,
    nextPity: updatePityState(pityState, pulls),
    pityTriggered: pitySlot.pityTriggered,
  };
}
