import React from "react";
import { rarityConfig } from "../data.js";

export function PullModal({ opening, onClose }) {
  if (!opening) return null;

  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="pull-title">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="pull-modal multi-pull">
        <div className="modal-heading pull-heading">
          <span>{opening.packUniverse}</span>
          <h2 id="pull-title">{opening.packTitle}</h2>
          <p>
            {opening.pityTriggered
              ? `${rarityConfig[opening.pityTriggered].label} Pity wurde ausgeloest.`
              : "Pack geoeffnet."}
          </p>
        </div>
        <div className="pull-grid">
          {opening.pulls.map((pull) => (
            <div
              className={`pull-result ${pull.shiny ? "is-shiny" : ""}`}
              style={{ "--rarity": rarityConfig[pull.rarity].color }}
              key={pull.instanceId}
            >
              <div className="pull-glyph">{pull.shiny ? "S" : packInitial(pull.packUniverse)}</div>
              <strong>{pull.name}</strong>
              <em>{pull.shiny ? "Shiny " : ""}{rarityConfig[pull.rarity].label}</em>
            </div>
          ))}
        </div>
        <button type="button" onClick={onClose}>Weiter</button>
      </div>
    </div>
  );
}

function packInitial(value) {
  return value?.[0] ?? "C";
}
