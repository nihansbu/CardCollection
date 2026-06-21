import React from "react";
import { Dices } from "lucide-react";
import { pityRules, rarityConfig, rarityOrder, shinyChance } from "../data.js";

export function RollOddsPanel({ pity }) {
  return (
    <section className="roll-odds-panel" aria-label="Roll Odds">
      <div className="roll-heading">
        <Dices size={18} />
        <span>Roll Odds</span>
      </div>
      <div className="roll-odds-list">
        {rarityOrder.map((rarity) => (
          <div className="odds-chip" key={rarity} style={{ "--rarity": rarityConfig[rarity].color }}>
            <span className="dot" />
            <span>{rarityConfig[rarity].label}</span>
            <strong>{rarityConfig[rarity].weight}%</strong>
          </div>
        ))}
        <div className="odds-chip shiny">
          <span className="dot shimmer-dot" />
          <span>Shiny</span>
          <strong>1:{Math.round(1 / shinyChance)}</strong>
        </div>
      </div>
      <div className="pity-line">
        <span>Epic Pity {pity.packsSinceEpic}/{pityRules.epic}</span>
        <span>Legendary Pity {pity.packsSinceLegendary}/{pityRules.legendary}</span>
      </div>
    </section>
  );
}
