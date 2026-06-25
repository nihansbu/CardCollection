import React, { useEffect, useRef, useState } from "react";
import {
  DeedsPanel,
  DeedCreatePanel,
  DeedLogPanel,
  DeedStatsPanel,
} from "../features/deeds/DeedsView.jsx";
import { AccountPanel } from "../features/account/AccountPanel.jsx";
import { deedStorageKeys, defaultDeeds } from "../features/deeds/deedData.js";
import {
  calculateDeedReward,
  clampDeedQuantity,
  getDeedType,
  normalizeDeeds,
} from "../features/deeds/deedUtils.js";
import { BeastiaryPanel, CodexPanel, PlaceholderPanel } from "../features/codex/CodexPanels.jsx";
import { QuestsPanel } from "../features/quests/QuestsPanel.jsx";
import {
  applyQuestProgress,
  questStorageKeys,
  startQuestUnlock,
} from "../features/quests/questData.js";
import { SkillDetailPanel, SkillsPanel, SkillsTrainingPanel } from "../features/skills/SkillsPanel.jsx";
import {
  applySkillUnlockProgress,
  applySkillTrainingProgress,
  resolveTrainingSlotSelection,
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
    const questElapsedSeconds = Math.max(0, (now - localSave.questLastTick) / 1000);
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
    const nextQuestState = applyQuestProgress({
      elapsedSeconds: questElapsedSeconds,
      quests: localSave.quests,
      rap: nextUnlockState.rap,
    });

    writeJson(deedStorageKeys.rap, nextQuestState.rap);
    writeJson(skillStorageKeys.skills, nextTrainingState.skills);
    writeJson(skillStorageKeys.trainingSlots, nextTrainingState.trainingSlots);
    writeJson(skillStorageKeys.trainingLastTick, now);
    writeJson(skillStorageKeys.unlockLastTick, now);
    writeJson(skillStorageKeys.unlocks, nextUnlockState.unlocks);
    writeJson(questStorageKeys.lastTick, now);
    writeJson(questStorageKeys.quests, nextQuestState.quests);
    initialTrainingState.current = {
      ...localSave,
      ...nextTrainingState,
      ...nextUnlockState,
      ...nextQuestState,
      questLastTick: now,
      trainingLastTick: now,
      unlockLastTick: now,
    };
  }

  const [selectedSkillName, setSelectedSkillName] = useState(null);
  const [skillMode, setSkillMode] = useState("overview");
  const [selectedTrainingSlot, setSelectedTrainingSlot] = useState(0);
  const [skills, setSkills] = useState(initialTrainingState.current.skills);
  const [trainingSlots, setTrainingSlots] = useState(initialTrainingState.current.trainingSlots);
  const [deedMode, setDeedMode] = useState("list");
  const [deeds, setDeeds] = useState(() => normalizeDeeds(initialTrainingState.current.deeds || defaultDeeds));
  const [deedLog, setDeedLog] = useState(() => initialTrainingState.current.deedLog || []);
  const [quests, setQuests] = useState(initialTrainingState.current.quests);
  const [rap, setRap] = useState(initialTrainingState.current.rap);
  const [unlocks, setUnlocks] = useState(initialTrainingState.current.unlocks);
  const rapRef = useRef(rap);
  const skillsRef = useRef(skills);
  const trainingSlotsRef = useRef(trainingSlots);
  const unlocksRef = useRef(unlocks);
  const questsRef = useRef(quests);
  const deedLogRef = useRef(deedLog);
  const manualTrainingSlotSelectionRef = useRef(false);

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
    questsRef.current = quests;
  }, [quests]);

  useEffect(() => {
    deedLogRef.current = deedLog;
  }, [deedLog]);

  useEffect(() => {
    if (activeView !== "skills") {
      setSelectedSkillName(null);
      setSkillMode("overview");
    }

    if (activeView !== "deeds") {
      setDeedMode("list");
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
      const nextQuestState = applyQuestProgress({
        elapsedSeconds: 1,
        quests: questsRef.current,
        rap: nextUnlockState.rap,
      });

      writeJson(skillStorageKeys.trainingLastTick, Date.now());
      writeJson(skillStorageKeys.unlockLastTick, Date.now());
      writeJson(questStorageKeys.lastTick, Date.now());

      if (!nextTrainingState.changed && !nextUnlockState.changed && !nextQuestState.changed) return;

      rapRef.current = nextQuestState.rap;
      skillsRef.current = nextTrainingState.skills;
      trainingSlotsRef.current = nextTrainingState.trainingSlots;
      unlocksRef.current = nextUnlockState.unlocks;
      questsRef.current = nextQuestState.quests;
      setRap(nextQuestState.rap);
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
      if (nextQuestState.changed) {
        setQuests(nextQuestState.quests);
        writeJson(questStorageKeys.quests, nextQuestState.quests);
      }
      writeJson(deedStorageKeys.rap, nextQuestState.rap);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const createDeed = (deed) => {
    setDeeds((current) => {
      const nextDeeds = [...current, deed];
      writeJson(deedStorageKeys.deeds, nextDeeds);
      return nextDeeds;
    });
    setDeedMode("list");
  };

  const completeDeed = (deed, requestedQuantity = deed.defaultQuantity) => {
    const now = new Date();
    const quantity = clampDeedQuantity(deed, requestedQuantity);
    const reward = calculateDeedReward(deed, deedLogRef.current, quantity, now);
    const rapEarned = reward.rapEarned;
    const entry = {
      deedId: deed.id,
      id: `log-${Date.now()}`,
      baseRapEarned: Math.floor(reward.baseRap),
      goalBonusRap: Math.floor(reward.goalBonusRap),
      goalBreakdown: reward.goalBreakdown,
      isSoftCapped: reward.isSoftCapped,
      quantity,
      rapEarned,
      softCappedQuantity: reward.quantityAfterSoftCap,
      timestamp: now.toISOString(),
      title: deed.title,
      type: getDeedType(deed),
      unit: deed.unit,
    };

    setRap((currentRap) => {
      const nextRap = currentRap + rapEarned;
      rapRef.current = nextRap;
      writeJson(deedStorageKeys.rap, nextRap);
      writeJson(skillStorageKeys.trainingLastTick, Date.now());
      return nextRap;
    });

    setDeedLog((currentLog) => {
      const nextLog = [entry, ...currentLog].slice(0, 250);
      deedLogRef.current = nextLog;
      writeJson(deedStorageKeys.deedLog, nextLog);
      return nextLog;
    });
  };

  const selectTrainingSlot = (slotIndex) => {
    manualTrainingSlotSelectionRef.current = true;
    setSelectedTrainingSlot(slotIndex);
  };

  const selectTrainingSkill = (skill) => {
    setTrainingSlots((currentSlots) => {
      const nextTrainingSelection = resolveTrainingSlotSelection({
        isManualSlotSelection: manualTrainingSlotSelectionRef.current,
        selectedSlot: selectedTrainingSlot,
        skillName: skill.name,
        slots: currentSlots,
      });
      const nextSlots = nextTrainingSelection.slots;

      manualTrainingSlotSelectionRef.current = false;
      setSelectedTrainingSlot(nextTrainingSelection.nextSelectedSlot);
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

  const startQuest = (quest) => {
    if (rapRef.current <= 0) return;

    setQuests((currentQuests) => {
      const nextQuests = startQuestUnlock({
        questId: quest.id,
        quests: currentQuests,
        skills: skillsRef.current,
      });

      questsRef.current = nextQuests;
      writeJson(questStorageKeys.quests, nextQuests);
      writeJson(questStorageKeys.lastTick, Date.now());
      return nextQuests;
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
          onSelectTrainingSlot={selectTrainingSlot}
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

  if (activeView === "deeds") {
    if (deedMode === "create") {
      return <DeedCreatePanel onBack={() => setDeedMode("list")} onCreate={createDeed} />;
    }

    if (deedMode === "log") {
      return <DeedLogPanel deedLog={deedLog} onBack={() => setDeedMode("list")} rap={rap} />;
    }

    if (deedMode === "stats") {
      return <DeedStatsPanel deeds={deeds} deedLog={deedLog} onBack={() => setDeedMode("list")} rap={rap} />;
    }

    return (
      <DeedsPanel
        deeds={deeds}
        deedLog={deedLog}
        onCompleteDeed={completeDeed}
        onOpenCreate={() => setDeedMode("create")}
        onOpenLog={() => setDeedMode("log")}
        onOpenStats={() => setDeedMode("stats")}
        rap={rap}
      />
    );
  }

  if (activeView === "quests") {
    return (
      <QuestsPanel
        onStartQuest={startQuest}
        quests={quests}
        rap={rap}
        skills={skills}
      />
    );
  }

  if (activeView === "beastiary") {
    return <BeastiaryPanel />;
  }

  return <PlaceholderPanel />;
}
