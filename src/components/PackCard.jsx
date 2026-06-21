import React from "react";
import { Coins, Eye, Lock } from "lucide-react";

const formatRap = (value) => new Intl.NumberFormat("de-DE").format(value);

export function PackCard({ pack, canAfford, onBuy, onShowCards }) {
  return (
    <article className={`pack-card pack-${pack.art}`} style={{ "--accent": pack.accent }}>
      <div className="pack-frame">
        <div className="pack-corners" />
        <div
          className={`pack-art ${pack.imageUrl ? "has-image" : ""}`}
          style={pack.imageUrl ? { "--pack-image": `url(${pack.imageUrl})` } : undefined}
        >
          {!pack.imageUrl && (
            <>
              <div className="art-orbit" />
              <div className="art-sigil">{pack.icon}</div>
            </>
          )}
          <div className="pack-top-label">{pack.universe}</div>
        </div>
        <div className="pack-footer compact-pack-footer">
          <h3>{pack.title}</h3>
          <div className="pack-actions">
            <button
              className="details-button icon-only"
              type="button"
              onClick={() => onShowCards(pack)}
              aria-label={`${pack.title} Karten anzeigen`}
            >
              <Eye size={22} />
            </button>
            <button
              className="buy-button price-button"
              type="button"
              onClick={() => onBuy(pack)}
              disabled={!canAfford}
              aria-label={canAfford ? `${pack.title} fuer ${pack.cost} RAP kaufen` : `Zu wenig RAP fuer ${pack.title}`}
            >
              {canAfford ? <Coins size={21} /> : <Lock size={20} />}
              <strong>{formatRap(pack.cost)}</strong>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
