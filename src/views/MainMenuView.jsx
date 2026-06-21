import React, { useEffect, useState } from "react";
import {
  ActivitiesPanel,
  ActivityCreatePanel,
  ActivityLogPanel,
  ActivityStatsPanel,
} from "../features/activities/ActivitiesView.jsx";
import { activityStorageKeys, defaultActivities } from "../features/activities/activityData.js";
import {
  getActivityReward,
  getActivityType,
  normalizeActivities,
  readJson,
  writeJson,
} from "../features/activities/activityUtils.js";
import { BeastiaryPanel, CodexPanel, PlaceholderPanel } from "../features/codex/CodexPanels.jsx";
import { SkillDetailPanel, SkillsPanel } from "../features/skills/SkillsPanel.jsx";

export function MainMenuView({ activeView }) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [activityMode, setActivityMode] = useState("list");
  const [activities, setActivities] = useState(() => normalizeActivities(readJson(activityStorageKeys.activities, defaultActivities)));
  const [activityLog, setActivityLog] = useState(() => readJson(activityStorageKeys.activityLog, []));
  const [rap, setRap] = useState(() => readJson(activityStorageKeys.rap, 0));

  useEffect(() => {
    if (activeView !== "skills") {
      setSelectedSkill(null);
    }

    if (activeView !== "activities") {
      setActivityMode("list");
    }
  }, [activeView]);

  const createActivity = (activity) => {
    setActivities((current) => {
      const nextActivities = [...current, activity];
      writeJson(activityStorageKeys.activities, nextActivities);
      return nextActivities;
    });
    setActivityMode("list");
  };

  const completeActivity = (activity) => {
    const rapEarned = getActivityReward(activity);
    const entry = {
      activityId: activity.id,
      id: `log-${Date.now()}`,
      quantity: activity.defaultQuantity,
      rapEarned,
      timestamp: new Date().toISOString(),
      title: activity.title,
      type: getActivityType(activity),
      unit: activity.unit,
    };

    setRap((currentRap) => {
      const nextRap = currentRap + rapEarned;
      writeJson(activityStorageKeys.rap, nextRap);
      return nextRap;
    });

    setActivityLog((currentLog) => {
      const nextLog = [entry, ...currentLog].slice(0, 250);
      writeJson(activityStorageKeys.activityLog, nextLog);
      return nextLog;
    });
  };

  if (activeView === "codex") {
    return <CodexPanel />;
  }

  if (activeView === "skills") {
    if (selectedSkill) {
      return <SkillDetailPanel onBack={() => setSelectedSkill(null)} skill={selectedSkill} />;
    }

    return <SkillsPanel onSelectSkill={setSelectedSkill} />;
  }

  if (activeView === "activities") {
    if (activityMode === "create") {
      return <ActivityCreatePanel onBack={() => setActivityMode("list")} onCreate={createActivity} />;
    }

    if (activityMode === "log") {
      return <ActivityLogPanel activityLog={activityLog} onBack={() => setActivityMode("list")} rap={rap} />;
    }

    if (activityMode === "stats") {
      return <ActivityStatsPanel activities={activities} activityLog={activityLog} onBack={() => setActivityMode("list")} rap={rap} />;
    }

    return (
      <ActivitiesPanel
        activities={activities}
        activityLog={activityLog}
        onCompleteActivity={completeActivity}
        onOpenCreate={() => setActivityMode("create")}
        onOpenLog={() => setActivityMode("log")}
        onOpenStats={() => setActivityMode("stats")}
        rap={rap}
      />
    );
  }

  if (activeView === "beastiary") {
    return <BeastiaryPanel />;
  }

  return <PlaceholderPanel />;
}
