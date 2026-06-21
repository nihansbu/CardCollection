import React, { useRef, useState } from "react";
import {
  Activity,
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronUp,
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
    label: `Slot ${String(index + 5).padStart(2, "0")}`,
    Icon: BookMarked,
    tone: index % 2 === 0 ? "steel" : "amber",
  })),
];

export function AppShell({ activeView, children, onChangeView }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const touchStartY = useRef(null);

  const handleNavItemClick = (itemId) => {
    onChangeView(itemId);
    setIsNavOpen(false);
  };

  const handleTouchStart = (event) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartY.current === null) return;

    const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
    const deltaY = endY - touchStartY.current;
    touchStartY.current = null;

    if (Math.abs(deltaY) < 34) return;
    setIsNavOpen(deltaY > 0);
  };

  return (
    <main className="app-shell">
      <div className="background-aura" />
      <header
        className={isNavOpen ? "app-masthead is-open" : "app-masthead is-collapsed"}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <div aria-hidden={!isNavOpen} className="codex-nav-panel" id="codex-navigation">
          <nav className="codex-nav" aria-label="Hauptnavigation">
            {navItems.map((item) => (
              <button
                aria-current={activeView === item.id ? "page" : undefined}
                aria-label={item.label}
                className={activeView === item.id ? "codex-nav-item is-active" : "codex-nav-item"}
                type="button"
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                style={{ "--tone": `var(--tone-${item.tone})` }}
                tabIndex={isNavOpen ? 0 : -1}
              >
                <span className="codex-nav-icon" aria-hidden="true">
                  <item.Icon size={19} strokeWidth={2.7} />
                </span>
                <span className="codex-nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <button
          aria-controls="codex-navigation"
          aria-expanded={isNavOpen}
          aria-label={isNavOpen ? "Navigation einklappen" : "Navigation ausklappen"}
          className="codex-nav-toggle"
          onClick={() => setIsNavOpen((current) => !current)}
          type="button"
        >
          {isNavOpen ? <ChevronUp size={18} strokeWidth={3} /> : <ChevronDown size={18} strokeWidth={3} />}
          <span>Menu</span>
        </button>
      </header>
      <div className="app-content">{children}</div>
    </main>
  );
}
