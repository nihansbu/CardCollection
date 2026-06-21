import React, { useEffect, useRef, useState } from "react";
import { BarChart3, CircleDot, Coins, Grid3X3, Sigma, Swords } from "lucide-react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import {
  formatCompactSkillValue,
  formatUnlockDurationFromRap,
  getSkillLevelProgress,
  getSkillTimeToNextLevel,
  getSkillXpToNextLevel,
  getSkillTotals,
  getSkillUnlockStatus,
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

function getSkillNameSize(name) {
  if (name.length <= 7) return "0.5rem";
  if (name.length <= 10) return "0.43rem";
  if (name.length <= 13) return "0.35rem";
  return "0.3rem";
}

function getXpToNextDisplay(skill, trainingSlots) {
  return `${formatCompactSkillValue(getSkillXpToNextLevel(skill))} (${getSkillTimeToNextLevel(skill, trainingSlots)})`;
}

function getUnlockProgressDisplay(unlock) {
  if (unlock.status !== "unlocking") {
    return `${formatCompactSkillValue(unlock.rapCost)} RAP (${formatUnlockDurationFromRap(unlock.rapCost)})`;
  }

  const remainingRap = Math.max(0, unlock.rapCost - unlock.progressRap);

  return `${formatCompactSkillValue(remainingRap)} RAP left (${formatUnlockDurationFromRap(remainingRap)})`;
}

function getUnlockProgressPercent(unlock) {
  if (unlock.rapCost <= 0) return 100;

  return Math.max(0, Math.min(100, Math.floor((unlock.progressRap / unlock.rapCost) * 100)));
}

function getUnlockProgressStylePercent(unlock) {
  if (unlock.rapCost <= 0) return 100;

  const progress = (unlock.progressRap / unlock.rapCost) * 100;

  return Math.max(0, Math.min(100, progress));
}

function InfoPanel({ action, onClose, skill, stat, trainingSlots }) {
  const isSkillPanel = Boolean(skill);
  const preview = skill || stat || action;
  const PreviewIcon = preview?.Icon;

  if (!preview) return null;

  const title = skill?.name || stat?.label || action?.label;
  const subtitle = skill ? `${skill.group} Skill` : stat ? "Header Stat" : "Header Action";
  const description = skill?.description || stat?.description || action?.description || `${title}: ${stat?.value ?? action?.shortLabel ?? ""}`;
  const metrics = skill
    ? [
        ["Level", skill.level],
        ["Current XP", formatCompactSkillValue(skill.currentXp)],
        ["XP to Next Level", getXpToNextDisplay(skill, trainingSlots)],
      ]
    : [["Value", stat?.value ?? action?.shortLabel ?? action?.label]];

  return (
    <div
      className="skill-quicklook"
      role="status"
      onPointerDown={(event) => event.stopPropagation()}
      style={{ "--skill-color": skill?.color || "#24f2ff" }}
    >
      <div className="skill-quicklook-head">
        <span>
          {isSkillPanel ? <SkillEmblem skill={skill} size={21} /> : PreviewIcon ? <PreviewIcon size={21} strokeWidth={2.8} /> : null}
        </span>
        <div>
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </div>
        <button aria-label="Close info panel" onClick={onClose} type="button">
          x
        </button>
      </div>
      <dl style={{ "--quicklook-stat-count": metrics.length }}>
        {metrics.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p>{description}</p>
    </div>
  );
}

function SkillCard({ isSelectedTrainingSkill = false, onPreview, onSelect, skill, trainingSlotIndex = -1 }) {
  const longPressTimer = useRef(null);
  const suppressClick = useRef(false);
  const isTrainingSkill = trainingSlotIndex >= 0;
  const levelProgress = getSkillLevelProgress(skill);

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
      style={{ "--skill-color": skill.color, "--skill-progress": `${levelProgress}%` }}
      type="button"
      aria-label={`${skill.name}. Level ${skill.level}${isTrainingSkill ? `. Training slot ${trainingSlotIndex + 1}` : ""}. Long press for details.`}
    >
      <div className="skill-sprite" aria-hidden="true">
        <SkillEmblem skill={skill} />
      </div>
      {isTrainingSkill ? <span className="skill-training-badge" aria-hidden="true">{trainingSlotIndex + 1}</span> : null}
      <span className="skill-card-name" style={{ "--skill-name-size": getSkillNameSize(skill.name) }} aria-hidden="true">
        {skill.name}
      </span>
      <div className="skill-level-stack" aria-hidden="true">
        <strong>{skill.level}</strong>
        {isTrainingSkill ? <span>{levelProgress}%</span> : null}
      </div>
    </button>
  );
}

function SkillGrid({
  onSelectSkill,
  previewAction,
  previewSkillName,
  previewStat,
  selectedTrainingSlot,
  setPreviewEntry,
  skills,
  trainingSlots = [],
}) {
  const previewSkill = previewSkillName ? skills.find((skill) => skill.name === previewSkillName) : null;

  return (
    <div className="skill-board" onPointerDown={() => setPreviewEntry(null)}>
      {skills.map((skill) => {
        const trainingSlotIndex = trainingSlots.indexOf(skill.name);

        return (
          <SkillCard
            isSelectedTrainingSkill={trainingSlotIndex >= 0 && trainingSlotIndex === selectedTrainingSlot}
            key={skill.name}
            onPreview={(previewedSkill) => setPreviewEntry({ skillName: previewedSkill.name, type: "skill" })}
            onSelect={onSelectSkill}
            skill={skill}
            trainingSlotIndex={trainingSlotIndex}
          />
        );
      })}
      <InfoPanel
        action={previewAction}
        onClose={() => setPreviewEntry(null)}
        skill={previewSkill}
        stat={previewStat}
        trainingSlots={trainingSlots}
      />
    </div>
  );
}

function getSkillStats(skills) {
  const { averageSkillLevel, totalSkillLevel, totalSkillXp } = getSkillTotals(skills);

  return [
    { Icon: BarChart3, description: "Sum of all current skill levels.", label: "Total Level", value: totalSkillLevel },
    { Icon: Sigma, description: "Average level across all skills.", label: "Average Level", value: averageSkillLevel },
    { Icon: XpIcon, description: "Total current XP across all skills.", label: "Total XP", value: formatCompactSkillValue(totalSkillXp) },
  ];
}

export function SkillsPanel({ onOpenTraining, onSelectSkill, skills, trainingSlots }) {
  const [previewEntry, setPreviewEntry] = useState(null);
  const actions = [
    {
      Icon: Swords,
      description: "Open Skills Training to spend RAP automatically on up to three selected skills.",
      label: "Training",
      onClick: onOpenTraining,
    },
  ];
  const stats = getSkillStats(skills);
  const previewSkillName = previewEntry?.type === "skill" ? previewEntry.skillName : null;
  const previewStat = previewEntry?.type === "stat" ? stats.find((stat) => stat.label === previewEntry.label) : null;
  const previewAction = previewEntry?.type === "action" ? actions.find((action) => action.label === previewEntry.label) : null;

  return (
    <ContentPanel
      className="skills-panel"
      actions={actions}
      onActionPreview={(action) => setPreviewEntry({ label: action.label, type: "action" })}
      onStatPreview={(stat) => setPreviewEntry({ label: stat.label, type: "stat" })}
      stats={stats}
      title="Skills"
    >
      <SkillGrid
        onSelectSkill={onSelectSkill}
        previewAction={previewAction}
        previewSkillName={previewSkillName}
        previewStat={previewStat}
        selectedTrainingSlot={-1}
        setPreviewEntry={setPreviewEntry}
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
  const [previewEntry, setPreviewEntry] = useState(null);
  const skillsByName = new Map(skills.map((skill) => [skill.name, skill]));
  const actions = [
    {
      Icon: Grid3X3,
      description: "Return to the Skills overview without changing the currently active training slots.",
      label: "Skills",
      onClick: onBackToSkills,
    },
  ];
  const stats = [
    { Icon: Coins, description: "Current Real Life Activity Points available for spending.", label: "RAP", value: formatCompactSkillValue(rap) },
    ...trainingSlots.map((skillName, index) => {
      const trainingSkill = skillName ? skillsByName.get(skillName) : null;
      const SlotIcon = trainingSkill ? skillIcons[trainingSkill.name] : CircleDot;

      return {
        Icon: SlotIcon,
        ariaLabel: `Training slot ${index + 1}`,
        description: trainingSkill
          ? `Slot ${index + 1} is training ${trainingSkill.name}.`
          : `Slot ${index + 1} is empty.`,
        label: `Slot ${index + 1}`,
        onClick: () => onSelectTrainingSlot(index),
        pressed: selectedTrainingSlot === index,
        value: trainingSkill?.short || "None",
      };
    }),
  ];
  const previewSkillName = previewEntry?.type === "skill" ? previewEntry.skillName : null;
  const previewStat = previewEntry?.type === "stat" ? stats.find((stat) => stat.label === previewEntry.label) : null;
  const previewAction = previewEntry?.type === "action" ? actions.find((action) => action.label === previewEntry.label) : null;

  return (
    <ContentPanel
      className="skills-panel skills-training-panel"
      actions={actions}
      onActionPreview={(action) => setPreviewEntry({ label: action.label, type: "action" })}
      onStatPreview={(stat) => setPreviewEntry({ label: stat.label, type: "stat" })}
      stats={stats}
      title="Skills Training"
    >
      <SkillGrid
        onSelectSkill={onSelectSkill}
        previewAction={previewAction}
        previewSkillName={previewSkillName}
        previewStat={previewStat}
        selectedTrainingSlot={selectedTrainingSlot}
        setPreviewEntry={setPreviewEntry}
        skills={skills}
        trainingSlots={trainingSlots}
      />
    </ContentPanel>
  );
}

function SkillUnlockRow({ onStartUnlock, skill, unlock }) {
  const status = getSkillUnlockStatus(unlock, skill.level);
  const isActionable = status === "available";
  const progressPercent = getUnlockProgressPercent(unlock);
  const statusLabel = {
    available: "Ready",
    locked: "Locked",
    unlocking: "Unlocking",
    unlocked: "Unlocked",
  }[status];

  return (
    <button
      aria-label={`${unlock.name}. Level ${unlock.levelRequired}. ${statusLabel}. ${getUnlockProgressDisplay(unlock)}.`}
      className={`skill-unlock-row is-${status}`}
      disabled={!isActionable}
      onClick={() => onStartUnlock(unlock)}
      style={{ "--unlock-progress": `${getUnlockProgressStylePercent(unlock)}%` }}
      type="button"
    >
      <span className="skill-unlock-level">Lv {unlock.levelRequired}</span>
      <span className="skill-unlock-icon" aria-hidden="true">
        {unlock.iconSrc ? <img alt="" src={unlock.iconSrc} /> : unlock.iconText}
      </span>
      <span className="skill-unlock-copy">
        <strong>{unlock.name}</strong>
        <small>{statusLabel}</small>
      </span>
      <span className="skill-unlock-cost">
        {getUnlockProgressDisplay(unlock)}
        {status === "unlocking" ? <small>{progressPercent}%</small> : null}
      </span>
    </button>
  );
}

function SkillUnlockList({ onStartUnlock, skill, unlocks }) {
  const skillUnlocks = unlocks.filter((unlock) => unlock.skill === skill.name);

  if (skillUnlocks.length === 0) {
    return (
      <div className="skill-unlock-list">
        <div className="skill-unlock-empty">No unlocks defined for this skill yet.</div>
      </div>
    );
  }

  return (
    <div className="skill-unlock-list" aria-label={`${skill.name} unlocks`}>
      {skillUnlocks.map((unlock) => (
        <SkillUnlockRow key={unlock.id} onStartUnlock={onStartUnlock} skill={skill} unlock={unlock} />
      ))}
    </div>
  );
}

export function SkillDetailPanel({ onBack, onStartUnlock, rap, skill, trainingSlots, unlocks }) {
  return (
    <ContentPanel
      actions={[
        {
          Icon: Grid3X3,
          label: "Skills",
          onClick: onBack,
        },
      ]}
      className="skills-panel skill-detail-panel"
      onBack={onBack}
      stats={[
        { label: "Level", value: skill.level },
        { label: "Current XP", value: formatCompactSkillValue(skill.currentXp) },
        { label: "XP to Next Level", value: getXpToNextDisplay(skill, trainingSlots) },
        { Icon: Coins, label: "RAP", value: formatCompactSkillValue(rap) },
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
        </div>
      </div>
      <SkillUnlockList onStartUnlock={onStartUnlock} skill={skill} unlocks={unlocks} />
    </ContentPanel>
  );
}
