import React from "react";
import { CollectionSummary } from "../components/CollectionSummary.jsx";
import { PackCard } from "../components/PackCard.jsx";
import { RollOddsPanel } from "../components/RollOddsPanel.jsx";

export function ShopView({ collection, packs, pity, rap, onBuyPack, onShowCards }) {
  return (
    <section className="shop-view">
      <div className="shop-grid">
        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            canAfford={rap >= pack.cost}
            onBuy={onBuyPack}
            onShowCards={onShowCards}
          />
        ))}
      </div>
      <CollectionSummary collection={collection} packs={packs} />
      <RollOddsPanel pity={pity} />
    </section>
  );
}
