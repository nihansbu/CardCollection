import React from "react";
import {
  Activity,
  BookMarked,
  BookOpen,
  Skull,
  Sparkles,
} from "lucide-react";

const navItems = [
  { id: "codex", label: "Codex", Icon: BookOpen, tone: "cyan" },
  { id: "skills", label: "Skills", Icon: Sparkles, tone: "teal" },
  { id: "activities", label: "Activities", Icon: Activity, tone: "green" },
  { id: "beastiary", label: "Beastiary", Icon: Skull, tone: "red" },
  ...Array.from({ length: 12 }, (_, index) => ({
    id: `placeholder-${index + 1}`,
    label: "Placeholder",
    Icon: BookMarked,
    tone: index % 2 === 0 ? "steel" : "amber",
  })),
];

export function AppShell({ activeView, children, onChangeView }) {
  const activeItem = navItems.find((item) => item.id === activeView) || navItems[0];

  return (
    <main className="app-shell">
      <div className="background-aura" />
      <header className="app-masthead">
        <div className="app-brand">
          <span>RAP Card Collection</span>
          <strong>{activeItem.label}</strong>
        </div>
        <dl className="app-status-strip" aria-label="Account status">
          <div>
            <dt>Mode</dt>
            <dd>Codex</dd>
          </div>
          <div>
            <dt>Build</dt>
            <dd>Mobile</dd>
          </div>
        </dl>
        <nav className="codex-nav" aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <button
              className={activeView === item.id ? "codex-nav-item is-active" : "codex-nav-item"}
              type="button"
              key={item.id}
              onClick={() => onChangeView(item.id)}
              style={{ "--tone": `var(--tone-${item.tone})` }}
            >
              <span className="codex-nav-icon" aria-hidden="true">
                <item.Icon size={22} strokeWidth={2.7} />
              </span>
              <span className="codex-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </header>
      <div className="app-content">{children}</div>
    </main>
  );
}
