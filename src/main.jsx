import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles/base.css";
import "./styles/app-shell.css";
import "./styles/content-panel.css";
import "./styles/codex-panels.css";
import "./styles/account.css";
import "./styles/skills.css";
import "./styles/activities.css";
import "./styles/quests.css";
import "./styles/shop.css";
import "./styles/collection.css";
import "./styles/modals.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
