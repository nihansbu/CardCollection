import React, { useEffect, useRef, useState } from "react";
import { ScrollText } from "lucide-react";
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
  const [previewQuestId, setPreviewQuestId] = useState(null);
  const previewQuest = previewQuestId ? quests.find((quest) => quest.id === previewQuestId) : null;
  const summary = getQuestSummary(quests, skills);

  return (
    <ContentPanel
      actions={[
        {
          Icon: ScrollText,
          description: "Quest list. Tap available quests to start spending RAP, or long-press a quest for requirements.",
          label: "Log",
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
        {quests.map((quest) => (
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
