import React, { useEffect, useRef, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import { InfoPanel } from "../../components/InfoPanel.jsx";
import { uiIcons } from "../../components/UiIcon.jsx";
import { formatRap } from "../activities/activityUtils.js";
import {
  formatQuestDurationFromRap,
  getQuestProgressPercent,
  getQuestStatus,
  getQuestSummary,
} from "./questData.js";

const LONG_PRESS_MS = 520;

const questSortOptions = [
  { label: "Default", value: "default" },
  { label: "Alphabetical", value: "alphabetical" },
  { label: "Highest Skill Requirement", value: "highest-requirement" },
  { label: "Lowest Skill Requirement", value: "lowest-requirement" },
  { label: "Highest Quest Points", value: "highest-quest-points" },
  { label: "Lowest Quest Points", value: "lowest-quest-points" },
  { label: "Unlocked", value: "unlocked" },
  { label: "Available", value: "available" },
  { label: "Locked", value: "locked" },
];

function getQuestMaxRequirement(quest) {
  return quest.requirements.reduce((highest, requirement) => Math.max(highest, requirement.level), 0);
}

function getQuestSortStatusRank(quest, skills, preferredStatus) {
  const status = getQuestStatus(quest, skills);

  if (preferredStatus === "unlocked") return status === "completed" ? 0 : status === "unlocking" ? 1 : 2;
  if (preferredStatus === "available") return status === "available" ? 0 : status === "unlocking" ? 1 : status === "completed" ? 2 : 3;
  if (preferredStatus === "locked") return status === "locked" ? 0 : status === "available" ? 1 : status === "unlocking" ? 2 : 3;

  return 0;
}

function sortQuests(quests, skills, sortKey) {
  return [...quests].sort((a, b) => {
    if (sortKey === "alphabetical") return a.name.localeCompare(b.name);
    if (sortKey === "highest-requirement") return getQuestMaxRequirement(b) - getQuestMaxRequirement(a) || a.name.localeCompare(b.name);
    if (sortKey === "lowest-requirement") return getQuestMaxRequirement(a) - getQuestMaxRequirement(b) || a.name.localeCompare(b.name);
    if (sortKey === "highest-quest-points") return (b.questPoints || 0) - (a.questPoints || 0) || a.name.localeCompare(b.name);
    if (sortKey === "lowest-quest-points") return (a.questPoints || 0) - (b.questPoints || 0) || a.name.localeCompare(b.name);
    if (sortKey === "unlocked" || sortKey === "available" || sortKey === "locked") {
      return getQuestSortStatusRank(a, skills, sortKey) - getQuestSortStatusRank(b, skills, sortKey) || a.name.localeCompare(b.name);
    }

    return quests.indexOf(a) - quests.indexOf(b);
  });
}

function QuestInfoPanel({ onClose, quest, skills }) {
  if (!quest) return null;

  const status = getQuestStatus(quest, skills);
  const skillsByName = new Map(skills.map((skill) => [skill.name, skill]));
  const sortedRequirements = [...quest.requirements].sort((a, b) => {
    const aSkill = skillsByName.get(a.skill);
    const bSkill = skillsByName.get(b.skill);
    const aMet = aSkill && aSkill.level >= a.level;
    const bMet = bSkill && bSkill.level >= b.level;

    if (aMet !== bMet) return aMet ? 1 : -1;
    return b.level - a.level || a.skill.localeCompare(b.skill);
  });
  const remainingRap = Math.max(0, quest.rapCost - quest.progressRap);

  return (
    <InfoPanel
      accent={quest.color}
      badge={quest.iconText}
      className="content-info-panel--quest"
      description={quest.description}
      metrics={[
        { label: "RAP Cost", value: formatRap(quest.rapCost) },
        { label: "Quest Points", value: quest.questPoints || 0 },
        { label: "Time", value: formatQuestDurationFromRap(remainingRap || quest.rapCost) },
        { label: "Progress", value: `${Math.floor(getQuestProgressPercent(quest))}%` },
      ]}
      onClose={onClose}
      subtitle={`${status} quest`}
      title={quest.name}
    >
      <div className="quest-requirements" aria-label={`${quest.name} requirements`}>
        {sortedRequirements.length ? sortedRequirements.map((requirement) => {
          const skill = skillsByName.get(requirement.skill);
          const isMet = skill && skill.level >= requirement.level;

          return (
            <span className={isMet ? "is-met" : "is-missing"} key={`${quest.id}-${requirement.skill}`}>
              {requirement.skill} {requirement.level}
            </span>
          );
        }) : <span className="is-met">No skill requirements</span>}
      </div>
    </InfoPanel>
  );
}

function QuestTile({ onPreview, onStartQuest, quest, skills }) {
  const longPressTimer = useRef(null);
  const suppressClick = useRef(false);
  const status = getQuestStatus(quest, skills);
  const progressPercent = getQuestProgressPercent(quest);

  const clearLongPress = () => {
    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const startLongPress = () => {
    clearLongPress();
    suppressClick.current = false;
    longPressTimer.current = window.setTimeout(() => {
      suppressClick.current = true;
      onPreview(quest);
    }, LONG_PRESS_MS);
  };

  const handleClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }

    onStartQuest(quest);
  };

  useEffect(() => () => window.clearTimeout(longPressTimer.current), []);

  return (
    <button
      aria-label={`${quest.name}. ${status}. ${quest.rapCost} RAP. Long press for details.`}
      aria-disabled={status !== "available"}
      className={`quest-tile is-${status}`}
      onClick={handleClick}
      onContextMenu={(event) => event.preventDefault()}
      onPointerCancel={clearLongPress}
      onPointerDown={startLongPress}
      onPointerLeave={clearLongPress}
      onPointerUp={clearLongPress}
      style={{ "--quest-color": quest.color, "--quest-progress": `${progressPercent}%` }}
      type="button"
    >
      <span className="quest-tile-progress" aria-hidden="true" />
      <span className="quest-tile-icon" aria-hidden="true">{quest.iconText}</span>
    </button>
  );
}

export function QuestsPanel({ onStartQuest, quests, rap, skills }) {
  const [sortKey, setSortKey] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [previewQuestId, setPreviewQuestId] = useState(null);
  const sortedQuests = sortQuests(quests, skills, sortKey);
  const activeSortLabel = questSortOptions.find((option) => option.value === sortKey)?.label || "Default";
  const previewQuest = previewQuestId ? quests.find((quest) => quest.id === previewQuestId) : null;
  const summary = getQuestSummary(quests, skills);

  return (
    <ContentPanel
      actions={[
        {
          Icon: ArrowUpDown,
          description: "Sort the quest grid by name, requirements, quest points, or unlock state.",
          expanded: isSortOpen,
          label: "Sort",
          onClick: () => setIsSortOpen((isOpen) => !isOpen),
          panel: isSortOpen ? (
            <div className="quest-sort-menu" role="menu">
              <span>Sort By - {activeSortLabel}</span>
              {questSortOptions.map((option) => (
                <button
                  className={option.value === sortKey ? "is-active" : ""}
                  key={option.value}
                  onClick={() => {
                    setSortKey(option.value);
                    setIsSortOpen(false);
                    setPreviewQuestId(null);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null,
        },
      ]}
      className="quests-panel"
      infoPanel={<QuestInfoPanel onClose={() => setPreviewQuestId(null)} quest={previewQuest} skills={skills} />}
      stats={[
        { Icon: uiIcons.rap, description: "Current Real Life Activity Points available for quests.", label: "RAP", value: formatRap(rap) },
        { Icon: uiIcons.skills, description: "Quests whose skill requirements are met and can be started.", label: "Ready", value: summary.available },
        { Icon: uiIcons.stats, description: "Completed quests.", label: "Done", value: summary.completed },
      ]}
      title="Quests"
    >
      <div className="quest-board" onPointerDown={() => setPreviewQuestId(null)}>
        {sortedQuests.map((quest) => (
          <QuestTile
            key={quest.id}
            onPreview={(previewQuest) => setPreviewQuestId(previewQuest.id)}
            onStartQuest={onStartQuest}
            quest={quest}
            skills={skills}
          />
        ))}
      </div>
    </ContentPanel>
  );
}
