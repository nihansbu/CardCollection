import React, { useEffect, useRef, useState } from "react";
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
import { SkillDetailPanel, SkillsPanel, SkillsTrainingPanel } from "../features/skills/SkillsPanel.jsx";
import {
  applySkillTrainingProgress,
  normalizeSkills,
  normalizeTrainingSlots,
  skillStorageKeys,
} from "../features/skills/skillData.js";

export function MainMenuView({ activeView }) {
  const initialTrainingState = useRef(null);

  if (!initialTrainingState.current) {
    const now = Date.now();
    const storedSkills = normalizeSkills(readJson(skillStorageKeys.skills, []));
    const storedTrainingSlots = normalizeTrainingSlots(readJson(skillStorageKeys.trainingSlots, []));
    const storedRap = Math.max(0, Number(readJson(activityStorageKeys.rap, 0)) || 0);
    const lastTrainingTick = Math.max(0, Number(readJson(skillStorageKeys.trainingLastTick, now)) || now);
    const elapsedSeconds = Math.max(0, (now - lastTrainingTick) / 1000);
    const nextTrainingState = applySkillTrainingProgress({
      elapsedSeconds,
      rap: storedRap,
      skills: storedSkills,
      trainingSlots: storedTrainingSlots,
    });

    writeJson(activityStorageKeys.rap, nextTrainingState.rap);
    writeJson(skillStorageKeys.skills, nextTrainingState.skills);
    writeJson(skillStorageKeys.trainingSlots, nextTrainingState.trainingSlots);
    writeJson(skillStorageKeys.trainingLastTick, now);
    initialTrainingState.current = nextTrainingState;
  }

  const [selectedSkillName, setSelectedSkillName] = useState(null);
  const [skillMode, setSkillMode] = useState("overview");
  const [selectedTrainingSlot, setSelectedTrainingSlot] = useState(0);
  const [skills, setSkills] = useState(initialTrainingState.current.skills);
  const [trainingSlots, setTrainingSlots] = useState(initialTrainingState.current.trainingSlots);
  const [activityMode, setActivityMode] = useState("list");
  const [activities, setActivities] = useState(() => normalizeActivities(readJson(activityStorageKeys.activities, defaultActivities)));
  const [activityLog, setActivityLog] = useState(() => readJson(activityStorageKeys.activityLog, []));
  const [rap, setRap] = useState(initialTrainingState.current.rap);
  const rapRef = useRef(rap);
  const skillsRef = useRef(skills);
  const trainingSlotsRef = useRef(trainingSlots);

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

      writeJson(skillStorageKeys.trainingLastTick, Date.now());

      if (!nextTrainingState.changed) return;

      rapRef.current = nextTrainingState.rap;
      skillsRef.current = nextTrainingState.skills;
      trainingSlotsRef.current = nextTrainingState.trainingSlots;
      setRap(nextTrainingState.rap);
      setSkills(nextTrainingState.skills);
      setTrainingSlots(nextTrainingState.trainingSlots);
      writeJson(activityStorageKeys.rap, nextTrainingState.rap);
      writeJson(skillStorageKeys.skills, nextTrainingState.skills);
      writeJson(skillStorageKeys.trainingSlots, nextTrainingState.trainingSlots);
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

  if (activeView === "codex") {
    return <CodexPanel />;
  }

  if (activeView === "skills") {
    const selectedSkill = selectedSkillName ? skills.find((skill) => skill.name === selectedSkillName) : null;

    if (selectedSkill) {
      return <SkillDetailPanel onBack={() => setSelectedSkillName(null)} skill={selectedSkill} />;
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
