import React, { useEffect, useRef, useState } from "react";
import {
  ActivitiesPanel,
  ActivityCreatePanel,
  ActivityLogPanel,
  ActivityStatsPanel,
} from "../features/activities/ActivitiesView.jsx";
import { AccountPanel } from "../features/account/AccountPanel.jsx";
import { activityStorageKeys, defaultActivities } from "../features/activities/activityData.js";
import {
  getActivityReward,
  getActivityType,
  normalizeActivities,
} from "../features/activities/activityUtils.js";
import { BeastiaryPanel, CodexPanel, PlaceholderPanel } from "../features/codex/CodexPanels.jsx";
import { SkillDetailPanel, SkillsPanel, SkillsTrainingPanel } from "../features/skills/SkillsPanel.jsx";
import {
  applySkillUnlockProgress,
  applySkillTrainingProgress,
  startSkillUnlock,
  skillStorageKeys,
} from "../features/skills/skillData.js";
import { loadLocalGameSave, writeJson } from "../storage/localSave.js";

export function MainMenuView({ activeView, onAccountChange }) {
  const initialTrainingState = useRef(null);

  if (!initialTrainingState.current) {
    const now = Date.now();
    const localSave = loadLocalGameSave(now);
    const trainingElapsedSeconds = Math.max(0, (now - localSave.trainingLastTick) / 1000);
    const unlockElapsedSeconds = Math.max(0, (now - localSave.unlockLastTick) / 1000);
    const nextTrainingState = applySkillTrainingProgress({
      elapsedSeconds: trainingElapsedSeconds,
      rap: localSave.rap,
      skills: localSave.skills,
      trainingSlots: localSave.trainingSlots,
    });
    const nextUnlockState = applySkillUnlockProgress({
      elapsedSeconds: unlockElapsedSeconds,
      rap: nextTrainingState.rap,
      unlocks: localSave.unlocks,
    });

    writeJson(activityStorageKeys.rap, nextUnlockState.rap);
    writeJson(skillStorageKeys.skills, nextTrainingState.skills);
    writeJson(skillStorageKeys.trainingSlots, nextTrainingState.trainingSlots);
    writeJson(skillStorageKeys.trainingLastTick, now);
    writeJson(skillStorageKeys.unlockLastTick, now);
    writeJson(skillStorageKeys.unlocks, nextUnlockState.unlocks);
    initialTrainingState.current = {
      ...localSave,
      ...nextTrainingState,
      ...nextUnlockState,
      trainingLastTick: now,
      unlockLastTick: now,
    };
  }

  const [selectedSkillName, setSelectedSkillName] = useState(null);
  const [skillMode, setSkillMode] = useState("overview");
  const [selectedTrainingSlot, setSelectedTrainingSlot] = useState(0);
  const [skills, setSkills] = useState(initialTrainingState.current.skills);
  const [trainingSlots, setTrainingSlots] = useState(initialTrainingState.current.trainingSlots);
  const [activityMode, setActivityMode] = useState("list");
  const [activities, setActivities] = useState(() => normalizeActivities(initialTrainingState.current.activities || defaultActivities));
  const [activityLog, setActivityLog] = useState(() => initialTrainingState.current.activityLog || []);
  const [rap, setRap] = useState(initialTrainingState.current.rap);
  const [unlocks, setUnlocks] = useState(initialTrainingState.current.unlocks);
  const rapRef = useRef(rap);
  const skillsRef = useRef(skills);
  const trainingSlotsRef = useRef(trainingSlots);
  const unlocksRef = useRef(unlocks);

  useEffect(() => {
    rapRef.current = rap;
  }, [rap]);

  useEffect(() => {
    skillsRef.current = skills;
  }, [skills]);

  useEffect(() => {
    trainingSlotsRef.current = trainingSlots;
  }, [trainingSlots]);

  useEffect(() => {
    unlocksRef.current = unlocks;
  }, [unlocks]);

  useEffect(() => {
    if (activeView !== "skills") {
      setSelectedSkillName(null);
      setSkillMode("overview");
    }

    if (activeView !== "activities") {
      setActivityMode("list");
    }
  }, [activeView]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const nextTrainingState = applySkillTrainingProgress({
        elapsedSeconds: 1,
        rap: rapRef.current,
        skills: skillsRef.current,
        trainingSlots: trainingSlotsRef.current,
      });
      const nextUnlockState = applySkillUnlockProgress({
        elapsedSeconds: 1,
        rap: nextTrainingState.rap,
        unlocks: unlocksRef.current,
      });

      writeJson(skillStorageKeys.trainingLastTick, Date.now());
      writeJson(skillStorageKeys.unlockLastTick, Date.now());

      if (!nextTrainingState.changed && !nextUnlockState.changed) return;

      rapRef.current = nextUnlockState.rap;
      skillsRef.current = nextTrainingState.skills;
      trainingSlotsRef.current = nextTrainingState.trainingSlots;
      unlocksRef.current = nextUnlockState.unlocks;
      setRap(nextUnlockState.rap);
      if (nextTrainingState.changed) {
        setSkills(nextTrainingState.skills);
        setTrainingSlots(nextTrainingState.trainingSlots);
        writeJson(skillStorageKeys.skills, nextTrainingState.skills);
        writeJson(skillStorageKeys.trainingSlots, nextTrainingState.trainingSlots);
      }
      if (nextUnlockState.changed) {
        setUnlocks(nextUnlockState.unlocks);
        writeJson(skillStorageKeys.unlocks, nextUnlockState.unlocks);
      }
      writeJson(activityStorageKeys.rap, nextUnlockState.rap);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

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
      rapRef.current = nextRap;
      writeJson(activityStorageKeys.rap, nextRap);
      writeJson(skillStorageKeys.trainingLastTick, Date.now());
      return nextRap;
    });

    setActivityLog((currentLog) => {
      const nextLog = [entry, ...currentLog].slice(0, 250);
      writeJson(activityStorageKeys.activityLog, nextLog);
      return nextLog;
    });
  };

  const selectTrainingSkill = (skill) => {
    setTrainingSlots((currentSlots) => {
      const currentSkillName = currentSlots[selectedTrainingSlot];
      const nextSlots = currentSlots.map((slotSkillName, slotIndex) => {
        if (slotIndex === selectedTrainingSlot) {
          return currentSkillName === skill.name ? null : skill.name;
        }

        return slotSkillName === skill.name ? null : slotSkillName;
      });

      writeJson(skillStorageKeys.trainingSlots, nextSlots);
      writeJson(skillStorageKeys.trainingLastTick, Date.now());
      return nextSlots;
    });
  };

  const startUnlock = (unlock) => {
    const skill = skillsRef.current.find((entry) => entry.name === unlock.skill);
    if (!skill || rapRef.current <= 0) return;

    setUnlocks((currentUnlocks) => {
      const nextUnlocks = startSkillUnlock({
        skillLevel: skill.level,
        unlockId: unlock.id,
        unlocks: currentUnlocks,
      });

      unlocksRef.current = nextUnlocks;
      writeJson(skillStorageKeys.unlocks, nextUnlocks);
      writeJson(skillStorageKeys.unlockLastTick, Date.now());
      return nextUnlocks;
    });
  };

  if (activeView === "codex") {
    return <CodexPanel />;
  }

  if (activeView === "account") {
    return <AccountPanel onAuthenticated={onAccountChange} />;
  }

  if (activeView === "skills") {
    const selectedSkill = selectedSkillName ? skills.find((skill) => skill.name === selectedSkillName) : null;

    if (selectedSkill) {
      return (
        <SkillDetailPanel
          onBack={() => setSelectedSkillName(null)}
          onStartUnlock={startUnlock}
          rap={rap}
          skill={selectedSkill}
          trainingSlots={trainingSlots}
          unlocks={unlocks}
        />
      );
    }

    if (skillMode === "training") {
      return (
        <SkillsTrainingPanel
          onBackToSkills={() => setSkillMode("overview")}
          onSelectSkill={selectTrainingSkill}
          onSelectTrainingSlot={setSelectedTrainingSlot}
          rap={rap}
          selectedTrainingSlot={selectedTrainingSlot}
          skills={skills}
          trainingSlots={trainingSlots}
        />
      );
    }

    return (
      <SkillsPanel
        onOpenTraining={() => setSkillMode("training")}
        onSelectSkill={(skill) => setSelectedSkillName(skill.name)}
        skills={skills}
        trainingSlots={trainingSlots}
      />
    );
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
