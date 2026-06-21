import React, { useState } from "react";
import { AppShell } from "./components/AppShell.jsx";
import { MainMenuView } from "./views/MainMenuView.jsx";

export function App() {
  const [activeView, setActiveView] = useState("skills");

  return (
    <AppShell activeView={activeView} onChangeView={setActiveView}>
      <MainMenuView activeView={activeView} />
    </AppShell>
  );
}
