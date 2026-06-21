import React from "react";
import { CollectionSummary } from "../components/CollectionSummary.jsx";
import { rarityConfig, rarityOrder } from "../data.js";
import { getCollectionSummary } from "../utils/collection.js";

export function CollectionView({ collection, packs }) {
  const summary = getCollectionSummary(collection, packs);

  return (
    <section className="collection-view">
      <div className="collection-header">
        <div>
          <span>Sammlung</span>
          <h1>Card Collection</h1>
        </div>
        <strong>{summary.total.current}/{summary.total.total}</strong>
      </div>

      <CollectionSummary collection={collection} packs={packs} />

      <div className="collection-rarity-board">
        {rarityOrder.map((rarity) => (
          <article className="rarity-progress-card" key={rarity} style={{ "--rarity": rarityConfig[rarity].color }}>
            <span>{rarityConfig[rarity].label}</span>
            <strong>{summary.rarities[rarity]?.current ?? 0}/{summary.rarities[rarity]?.total ?? 0}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
