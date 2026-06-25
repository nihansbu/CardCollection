import React, { useState } from "react";
import { uiIcons } from "./UiIcon.jsx";

const characterItems = [
  { id: "account", label: "Account", Icon: uiIcons.character, tone: "aqua" },
  { id: "gear", label: "Gear", Icon: uiIcons.gear, tone: "steel" },
  { id: "stats", label: "Stats", Icon: uiIcons.stats, tone: "gold" },
];

const moreItems = [
  { id: "beastiary", label: "Beastiary", shortLabel: "Beast", Icon: uiIcons.beastiary, tone: "red" },
  { id: "codex", label: "Codex", Icon: uiIcons.codex, tone: "blue" },
];

const bottomNavItems = [
  { id: "character", label: "Character", shortLabel: "Char", Icon: uiIcons.character, tone: "cyan", type: "character-flyout" },
  { id: "deeds", label: "Deeds", shortLabel: "Deed", Icon: uiIcons.deeds, tone: "green" },
  { id: "skills", label: "Skills", Icon: uiIcons.skills, tone: "teal" },
  { id: "placeholder-4", label: "Inventory", shortLabel: "Inv", Icon: uiIcons.inventory, tone: "amber" },
  { id: "quests", label: "Quests", shortLabel: "Quest", Icon: uiIcons.codex, tone: "blue" },
  { id: "placeholder-2", label: "Slot 2", shortLabel: "Slot2", Icon: uiIcons.explore, tone: "lime" },
  { id: "placeholder-3", label: "Slot 3", shortLabel: "Slot3", Icon: uiIcons.gear, tone: "silver" },
  { id: "more", label: "More", Icon: uiIcons.more, tone: "violet", type: "more-flyout" },
];

export function AppShell({ activeView, children, onChangeView }) {
  const [isCharacterOpen, setIsCharacterOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleNavItemClick = (itemId) => {
    onChangeView(itemId);
    setIsCharacterOpen(false);
    setIsMoreOpen(false);
  };

  const isCharacterActive = characterItems.some((item) => item.id === activeView);
  const isMoreActive = moreItems.some((item) => item.id === activeView);

  return (
    <main className="app-shell">
      <div className="background-aura" />
      <div className="app-content">{children}</div>
      <nav className="bottom-nav-shell" aria-label="Hauptnavigation">
        {isCharacterOpen ? (
          <div className="bottom-nav-flyout character-flyout" role="menu" aria-label="Character navigation">
            {characterItems.map((item) => (
              <button
                aria-current={activeView === item.id ? "page" : undefined}
                className={activeView === item.id ? "bottom-nav-flyout-item is-active" : "bottom-nav-flyout-item"}
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                role="menuitem"
                style={{ "--tone": `var(--tone-${item.tone})` }}
                type="button"
              >
                <item.Icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ) : null}
        {isMoreOpen ? (
          <div className="bottom-nav-flyout more-flyout" role="menu" aria-label="More navigation">
            {moreItems.map((item) => (
              <button
                aria-current={activeView === item.id ? "page" : undefined}
                className={activeView === item.id ? "bottom-nav-flyout-item is-active" : "bottom-nav-flyout-item"}
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                role="menuitem"
                style={{ "--tone": `var(--tone-${item.tone})` }}
                type="button"
              >
                <item.Icon size={20} />
                <span>{item.shortLabel || item.label}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="bottom-nav-grid">
          {bottomNavItems.map((item) => {
            const isActive = item.type === "character-flyout" ? isCharacterActive : item.type === "more-flyout" ? isMoreActive : activeView === item.id;

            return (
              <button
                aria-current={isActive ? "page" : undefined}
                aria-expanded={item.type === "character-flyout" ? isCharacterOpen : item.type === "more-flyout" ? isMoreOpen : undefined}
                aria-label={item.label}
                className={isActive ? "bottom-nav-item is-active" : "bottom-nav-item"}
                key={item.id}
                onClick={() => {
                  if (item.type === "character-flyout") {
                    setIsCharacterOpen((current) => !current);
                    setIsMoreOpen(false);
                    return;
                  }

                  if (item.type === "more-flyout") {
                    setIsMoreOpen((current) => !current);
                    setIsCharacterOpen(false);
                    return;
                  }

                  handleNavItemClick(item.id);
                }}
                style={{ "--tone": `var(--tone-${item.tone})` }}
                type="button"
              >
                <span className="bottom-nav-icon" aria-hidden="true">
                  <item.Icon size={24} />
                </span>
                <span className="bottom-nav-label">{item.shortLabel || item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
