import React, { useEffect, useRef, useState } from "react";
import { BarChart3, CircleDot, Coins, Grid3X3, Sigma, Swords } from "lucide-react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import {
  formatCompactSkillValue,
  getSkillLevelProgress,
  getSkillXpForLevel,
  getSkillTotals,
} from "./skillData.js";
import { skillIcons } from "./SkillIcons.jsx";

const LONG_PRESS_MS = 520;

function XpIcon({ size = 19, strokeWidth = 2.8 }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="m4 7 6 10" />
      <path d="m10 7-6 10" />
      <path d="M14 17V7h4.2a3 3 0 0 1 0 6H14" />
    </svg>
  );
}

function SkillEmblem({ skill, size = 22 }) {
  const SkillIcon = skillIcons[skill.name];

  if (SkillIcon) {
    return <SkillIcon size={size} strokeWidth={2.8} />;
  }

  return <span>{skill.short}</span>;
}

function SkillCard({ isSelectedTrainingSkill = false, onPreview, onSelect, skill, trainingSlotIndex = -1 }) {
  const longPressTimer = useRef(null);
  const suppressClick = useRef(false);
  const isTrainingSkill = trainingSlotIndex >= 0;
  const levelProgress = isTrainingSkill ? getSkillLevelProgress(skill) : null;

  const clearLongPress = () => {
    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const startLongPress = () => {
    clearLongPress();
    suppressClick.current = false;
    longPressTimer.current = window.setTimeout(() => {
      suppressClick.current = true;
      onPreview(skill);
    }, LONG_PRESS_MS);
  };

  const handleClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }

    onSelect(skill);
  };

  useEffect(() => () => window.clearTimeout(longPressTimer.current), []);

  return (
    <button
      className={`skill-card ${isTrainingSkill ? "is-training-skill" : ""} ${isSelectedTrainingSkill ? "is-selected-training-skill" : ""}`.trim()}
      onClick={handleClick}
      onContextMenu={(event) => event.preventDefault()}
      onPointerCancel={clearLongPress}
      onPointerDown={startLongPress}
      onPointerLeave={clearLongPress}
      onPointerUp={clearLongPress}
      style={{ "--skill-color": skill.color }}
      type="button"
      aria-label={`${skill.name}. Level ${skill.level}${isTrainingSkill ? `. Training slot ${trainingSlotIndex + 1}` : ""}. Long press for details.`}
    >
      <div className="skill-sprite" aria-hidden="true">
        <SkillEmblem skill={skill} />
      </div>
      {isTrainingSkill ? <span className="skill-training-badge" aria-hidden="true">{trainingSlotIndex + 1}</span> : null}
      <div className="skill-level-stack" aria-hidden="true">
        <strong>{skill.level}</strong>
        {isTrainingSkill ? <span>{levelProgress}%</span> : null}
      </div>
    </button>
  );
}

function SkillGrid({
  onSelectSkill,
  previewSkill,
  selectedTrainingSlot,
  setPreviewSkill,
  skills,
  trainingSlots = [],
}) {
  return (
    <div className="skill-board" onPointerDown={() => setPreviewSkill(null)}>
      {skills.map((skill) => {
        const trainingSlotIndex = trainingSlots.indexOf(skill.name);

        return (
          <SkillCard
            isSelectedTrainingSkill={trainingSlotIndex >= 0 && trainingSlotIndex === selectedTrainingSlot}
            key={skill.name}
            onPreview={setPreviewSkill}
            onSelect={onSelectSkill}
            skill={skill}
            trainingSlotIndex={trainingSlotIndex}
          />
        );
      })}
      {previewSkill && (
        <div className="skill-quicklook" role="status" onPointerDown={(event) => event.stopPropagation()}>
          <div className="skill-quicklook-head">
            <span style={{ "--skill-color": previewSkill.color }}>
              <SkillEmblem skill={previewSkill} size={21} />
            </span>
            <div>
              <strong>{previewSkill.name}</strong>
              <small>{previewSkill.group} Skill</small>
            </div>
            <button aria-label="Close skill preview" onClick={() => setPreviewSkill(null)} type="button">
              x
            </button>
          </div>
          <dl>
            <div>
              <dt>Level</dt>
              <dd>{previewSkill.level}</dd>
            </div>
            <div>
              <dt>XP</dt>
              <dd>{formatCompactSkillValue(previewSkill.currentXp)}</dd>
            </div>
            <div>
              <dt>Next</dt>
              <dd>{formatCompactSkillValue(getSkillXpForLevel(previewSkill.level + 1))}</dd>
            </div>
          </dl>
          <p>{previewSkill.description}</p>
        </div>
      )}
    </div>
  );
}

function getSkillStats(skills) {
  const { averageSkillLevel, totalSkillLevel, totalSkillXp } = getSkillTotals(skills);

  return [
    { Icon: BarChart3, label: "Total Level", value: totalSkillLevel },
    { Icon: Sigma, label: "Average Level", value: averageSkillLevel },
    { Icon: XpIcon, label: "Total XP", value: formatCompactSkillValue(totalSkillXp) },
  ];
}

export function SkillsPanel({ onOpenTraining, onSelectSkill, skills, trainingSlots }) {
  const [previewSkill, setPreviewSkill] = useState(null);

  return (
    <ContentPanel
      className="skills-panel"
      actions={[
        {
          Icon: Swords,
          label: "Training",
          onClick: onOpenTraining,
        },
      ]}
      stats={getSkillStats(skills)}
      title="Skills"
    >
      <SkillGrid
        onSelectSkill={onSelectSkill}
        previewSkill={previewSkill}
        selectedTrainingSlot={-1}
        setPreviewSkill={setPreviewSkill}
        skills={skills}
        trainingSlots={trainingSlots}
      />
    </ContentPanel>
  );
}

export function SkillsTrainingPanel({
  onBackToSkills,
  onSelectSkill,
  onSelectTrainingSlot,
  rap,
  selectedTrainingSlot,
  skills,
  trainingSlots,
}) {
  const [previewSkill, setPreviewSkill] = useState(null);
  const skillsByName = new Map(skills.map((skill) => [skill.name, skill]));

  return (
    <ContentPanel
      className="skills-panel skills-training-panel"
      actions={[
        {
          Icon: Grid3X3,
          label: "Skills",
          onClick: onBackToSkills,
        },
      ]}
      stats={[
        { Icon: Coins, label: "RAP", value: formatCompactSkillValue(rap) },
        ...trainingSlots.map((skillName, index) => {
          const trainingSkill = skillName ? skillsByName.get(skillName) : null;
          const SlotIcon = trainingSkill ? skillIcons[trainingSkill.name] : CircleDot;

          return {
            Icon: SlotIcon,
            ariaLabel: `Training slot ${index + 1}`,
            label: `Slot ${index + 1}`,
            onClick: () => onSelectTrainingSlot(index),
            pressed: selectedTrainingSlot === index,
            value: trainingSkill?.short || "None",
          };
        }),
      ]}
      title="Skills Training"
    >
      <SkillGrid
        onSelectSkill={onSelectSkill}
        previewSkill={previewSkill}
        selectedTrainingSlot={selectedTrainingSlot}
        setPreviewSkill={setPreviewSkill}
        skills={skills}
        trainingSlots={trainingSlots}
      />
    </ContentPanel>
  );
}

export function SkillDetailPanel({ onBack, skill }) {
  return (
    <ContentPanel
      className="skill-detail-panel"
      onBack={onBack}
      stats={[
        { label: "Level", value: skill.level },
        { label: "XP", value: formatCompactSkillValue(skill.currentXp) },
        { label: "Unlocks", value: "Soon" },
      ]}
      title={skill.name}
    >
      <div className="skill-detail-shell" style={{ "--skill-color": skill.color }}>
        <div className="skill-detail-sigil" aria-hidden="true">
          {skill.short}
        </div>
        <div>
          <span>{skill.group} Skill</span>
          <h2>{skill.name} Training</h2>
          <p>{skill.description}</p>
          <p>
            This subpage is ready for future skill-specific actions, costs,
            milestones, unlocks, rewards, and training logs.
          </p>
        </div>
      </div>
    </ContentPanel>
  );
}
