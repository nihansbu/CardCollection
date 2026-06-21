import { rarityOrder } from "../data.js";

export function getAllCards(packs) {
  return packs.flatMap((pack) => pack.cards.map((card) => ({ ...card, packId: pack.id, packTitle: pack.title })));
}

export function getCollectionSummary(collection, packs) {
  const allCards = getAllCards(packs);
  const collectedIds = new Set(collection.map((card) => card.id));

  const rarities = Object.fromEntries(
    rarityOrder.map((rarity) => {
      const available = allCards.filter((card) => card.rarity === rarity);
      const collected = available.filter((card) => collectedIds.has(card.id));
      return [rarity, { current: collected.length, total: available.length }];
    }),
  );

  return {
    total: {
      current: allCards.filter((card) => collectedIds.has(card.id)).length,
      total: allCards.length,
    },
    rarities,
  };
}
