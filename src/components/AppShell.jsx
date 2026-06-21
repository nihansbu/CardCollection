import React, { useState } from "react";
import {
  Activity,
  Backpack,
  BookOpen,
  Box,
  CircleEllipsis,
  CircleUserRound,
  KeyRound,
  Shield,
  Skull,
  Sparkles,
  Trophy,
} from "lucide-react";

const characterItems = [
  { id: "account", label: "Account", Icon: KeyRound, tone: "aqua" },
  { id: "codex", label: "Codex", Icon: BookOpen, tone: "cyan" },
  { id: "placeholder-1", label: "Gear", Icon: Shield, tone: "steel" },
  { id: "placeholder-2", label: "Stats", Icon: Trophy, tone: "gold" },
];

const bottomNavItems = [
  { id: "character", label: "Character", shortLabel: "Char", Icon: CircleUserRound, tone: "cyan", type: "flyout" },
  { id: "placeholder-4", label: "Inventory", shortLabel: "Inv", Icon: Backpack, tone: "amber" },
  { id: "skills", label: "Skills", Icon: Sparkles, tone: "teal" },
  { id: "activities", label: "Activities", shortLabel: "Act", Icon: Activity, tone: "green" },
  { id: "beastiary", label: "Beastiary", shortLabel: "Beast", Icon: Skull, tone: "red" },
  { id: "codex", label: "Codex", Icon: BookOpen, tone: "blue" },
  { id: "placeholder-5", label: "Slot 7", shortLabel: "Slot7", Icon: Box, tone: "steel" },
  { id: "placeholder-6", label: "More", Icon: CircleEllipsis, tone: "violet" },
];

export function AppShell({ activeView, children, onChangeView }) {
  const [isCharacterOpen, setIsCharacterOpen] = useState(false);

  const handleNavItemClick = (itemId) => {
    onChangeView(itemId);
    setIsCharacterOpen(false);
  };

  const isCharacterActive = characterItems.some((item) => item.id === activeView);

  return (
    <main className="app-shell">
      <div className="background-aura" />
      <div className="app-content">{children}</div>
      <nav className="bottom-nav-shell" aria-label="Hauptnavigation">
        {isCharacterOpen ? (
          <div className="character-flyout" role="menu" aria-label="Character navigation">
            {characterItems.map((item) => (
              <button
                aria-current={activeView === item.id ? "page" : undefined}
                className={activeView === item.id ? "character-flyout-item is-active" : "character-flyout-item"}
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                role="menuitem"
                style={{ "--tone": `var(--tone-${item.tone})` }}
                type="button"
              >
                <item.Icon size={17} strokeWidth={2.8} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="bottom-nav-grid">
          {bottomNavItems.map((item) => {
            const isActive = item.type === "flyout" ? isCharacterActive : activeView === item.id;

            return (
              <button
                aria-current={isActive ? "page" : undefined}
                aria-expanded={item.type === "flyout" ? isCharacterOpen : undefined}
                aria-label={item.label}
                className={isActive ? "bottom-nav-item is-active" : "bottom-nav-item"}
                key={item.id}
                onClick={() => {
                  if (item.type === "flyout") {
                    setIsCharacterOpen((current) => !current);
                    return;
                  }

                  handleNavItemClick(item.id);
                }}
                style={{ "--tone": `var(--tone-${item.tone})` }}
                type="button"
              >
                <span className="bottom-nav-icon" aria-hidden="true">
                  <item.Icon size={18} strokeWidth={2.8} />
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
