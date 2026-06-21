import React from "react";
import { ContentPanel } from "../../components/ContentPanel.jsx";

const codexPillars = [
  ["Train", "Spend points to level skills and unlock better actions."],
  ["Collect", "Discover cards, creatures, logs, items, and progression entries."],
  ["Upgrade", "Turn duplicates and resources into stronger account-wide bonuses."],
  ["Unlock", "Open new modules, tiers, rewards, and long-term milestones."],
];

export function CodexPanel() {
  return (
    <ContentPanel
      className="codex-overview-panel"
      stats={[
        { label: "Project", value: "Collector" },
        { label: "Loop", value: "Train" },
        { label: "Status", value: "WIP" },
      ]}
      title="Codex"
    >
      <div className="codex-overview-grid">
        <article className="codex-hero-card">
          <span>Core Direction</span>
          <h2>Codex Collector</h2>
          <p>
            A PC-first collection game where players spend earned points to train,
            collect, upgrade, unlock, and expand a growing account codex.
          </p>
        </article>

        <div className="codex-pillar-grid">
          {codexPillars.map(([title, text]) => (
            <article className="codex-pillar-card" key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </ContentPanel>
  );
}

export function BeastiaryPanel() {
  return (
    <ContentPanel
      className="beastiary-panel"
      stats={[
        { label: "Entries", value: "0" },
        { label: "Kills", value: "0" },
        { label: "Mastery", value: "0%" },
      ]}
      title="Beastiary"
    >
      <div className="beastiary-shell">
        <div className="beastiary-emblem" aria-hidden="true">BS</div>
        <div>
          <span>Planned Module</span>
          <h2>Creature Collection</h2>
          <p>
            This module is reserved for creatures, drops, encounter progress,
            kill counts, unlocks, and mastery rewards.
          </p>
        </div>
      </div>
    </ContentPanel>
  );
}

export function PlaceholderPanel() {
  return (
    <ContentPanel
      className="codex-empty-panel"
      stats={[
        { label: "Module", value: "Empty" },
        { label: "Status", value: "Locked" },
        { label: "Data", value: "None" },
      ]}
      title="Placeholder"
    >
      <div className="placeholder-body">
        <div className="empty-emblem" aria-hidden="true">PH</div>
        <div>
          <span>Coming soon</span>
          <h2>Future Module Slot</h2>
          <p>
            This button is intentionally empty so the topbar can keep its final
            shape while future systems are designed one by one.
          </p>
        </div>
      </div>
    </ContentPanel>
  );
}
