import React from "react";
import { X } from "lucide-react";
import { rarityConfig } from "../data.js";

export function CardListModal({ pack, onClose }) {
  if (!pack) return null;

  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="card-list-title">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="card-list-modal">
        <button className="close-button" type="button" onClick={onClose} aria-label="Kartenliste schliessen">
          <X size={20} />
        </button>
        <div className="modal-heading">
          <span>{pack.universe}</span>
          <h2 id="card-list-title">{pack.title}</h2>
          <p>{pack.cardsPerOpen ?? 5} Karten pro Pack, mindestens {rarityConfig[pack.guaranteedRarity ?? "uncommon"].label}+.</p>
        </div>
        <div className="card-list">
          {pack.cards.map((card) => (
            <div className="card-row" key={card.id}>
              <span className="dot" style={{ background: rarityConfig[card.rarity].color }} />
              <strong>{card.name}</strong>
              <em style={{ color: rarityConfig[card.rarity].color }}>{rarityConfig[card.rarity].label}</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
