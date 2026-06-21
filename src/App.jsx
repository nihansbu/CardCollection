import React, { useState } from "react";
import { AppShell } from "./components/AppShell.jsx";
import { AccountPanel } from "./features/account/AccountPanel.jsx";
import { getLocalAccountSession } from "./storage/accountSession.js";
import { MainMenuView } from "./views/MainMenuView.jsx";

export function App() {
  const [activeView, setActiveView] = useState("skills");
  const [localSession, setLocalSession] = useState(() => getLocalAccountSession());

  if (!localSession) {
    return (
      <main className="app-shell account-gate-shell">
        <div className="background-aura" />
        <div className="app-content">
          <AccountPanel isGate onAuthenticated={setLocalSession} />
        </div>
      </main>
    );
  }

  return (
    <AppShell activeView={activeView} onChangeView={setActiveView}>
      <MainMenuView activeView={activeView} onAccountChange={setLocalSession} />
    </AppShell>
  );
}
