import React from "react";
import { Archive, Circle, Sparkles } from "lucide-react";
import { rarityConfig, rarityOrder } from "../data.js";
import { getCollectionSummary } from "../utils/collection.js";

export function CollectionSummary({ collection, packs }) {
  const summary = getCollectionSummary(collection, packs);
  const items = [
    {
      id: "total",
      label: "Total Cards",
      current: summary.total.current,
      total: summary.total.total,
      color: "#f7d985",
      Icon: Archive,
    },
    ...rarityOrder.map((rarity) => ({
      id: rarity,
      label: rarityConfig[rarity].label,
      current: summary.rarities[rarity]?.current ?? 0,
      total: summary.rarities[rarity]?.total ?? 0,
      color: rarityConfig[rarity].color,
      Icon: rarity === "mythic" ? Sparkles : Circle,
    })),
  ];

  return (
    <section className="collection-summary" aria-label="Collection Progress">
      <div className="summary-heading">
        <span>Collection</span>
        <strong>{summary.total.current}/{summary.total.total}</strong>
      </div>
      <div className="summary-grid">
        {items.map(({ id, label, current, total, color, Icon }) => (
          <div className={`summary-chip summary-${id}`} key={id} style={{ "--rarity": color }}>
            <Icon size={18} />
            <span>{label}</span>
            <strong>{current}/{total}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
