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
  getSkillLevelForXp,
  normalizeSkills,
  normalizeTrainingSlots,
  skillStorageKeys,
  SKILL_TRAINING_RAP_PER_SECOND,
} from "../features/skills/skillData.js";

export function MainMenuView({ activeView }) {
  const [selectedSkillName, setSelectedSkillName] = useState(null);
  const [skillMode, setSkillMode] = useState("overview");
  const [selectedTrainingSlot, setSelectedTrainingSlot] = useState(0);
  const [skills, setSkills] = useState(() => normalizeSkills(readJson(skillStorageKeys.skills, [])));
  const [trainingSlots, setTrainingSlots] = useState(() => normalizeTrainingSlots(readJson(skillStorageKeys.trainingSlots, [])));
  const [activityMode, setActivityMode] = useState("list");
  const [activities, setActivities] = useState(() => normalizeActivities(readJson(activityStorageKeys.activities, defaultActivities)));
  const [activityLog, setActivityLog] = useState(() => readJson(activityStorageKeys.activityLog, []));
  const [rap, setRap] = useState(() => readJson(activityStorageKeys.rap, 0));
  const rapRef = useRef(rap);
  const skillsRef = useRef(skills);

  useEffect(() => {
    rapRef.current = rap;
  }, [rap]);

  useEffect(() => {
    skillsRef.current = skills;
  }, [skills]);

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
    const activeTrainingSkills = [...new Set(trainingSlots.filter(Boolean))];

    if (activeTrainingSkills.length === 0) return undefined;

    const intervalId = window.setInterval(() => {
      const availableRap = Number(rapRef.current) || 0;
      const spentRap = Math.min(availableRap, SKILL_TRAINING_RAP_PER_SECOND);

      if (spentRap <= 0) return;

      const xpPerSkill = spentRap / activeTrainingSkills.length;
      const nextRap = Math.max(0, availableRap - spentRap);

      rapRef.current = nextRap;
      setRap(nextRap);
      writeJson(activityStorageKeys.rap, nextRap);

      const nextSkills = skillsRef.current.map((skill) => {
        if (!activeTrainingSkills.includes(skill.name)) return skill;

        const currentXp = skill.currentXp + xpPerSkill;

        return {
          ...skill,
          currentXp,
          level: getSkillLevelForXp(currentXp),
        };
      });

      skillsRef.current = nextSkills;
      setSkills(nextSkills);
      writeJson(skillStorageKeys.skills, nextSkills);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [trainingSlots]);

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
