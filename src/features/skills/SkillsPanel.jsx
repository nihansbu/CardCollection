import React, { useEffect, useRef, useState } from "react";
import { BarChart3, Sigma, Swords } from "lucide-react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import {
  averageSkillLevel,
  flatSkills,
  formatSkillXp,
  getSkillXpForLevel,
  totalSkillLevel,
  totalSkillXp,
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

function SkillCard({ onPreview, onSelect, skill }) {
  const longPressTimer = useRef(null);
  const suppressClick = useRef(false);

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
      className="skill-card"
      onClick={handleClick}
      onContextMenu={(event) => event.preventDefault()}
      onPointerCancel={clearLongPress}
      onPointerDown={startLongPress}
      onPointerLeave={clearLongPress}
      onPointerUp={clearLongPress}
      style={{ "--skill-color": skill.color }}
      type="button"
      aria-label={`${skill.name}. Level ${skill.level}. Long press for details.`}
    >
      <div className="skill-sprite" aria-hidden="true">
        <SkillEmblem skill={skill} />
      </div>
      <div className="skill-level-stack" aria-hidden="true">
        <strong>{skill.level}</strong>
      </div>
    </button>
  );
}

function SkillTrainingMenu() {
  return (
    <div className="skill-training-menu">
      <article>
        <span>Training</span>
        <strong>Active Skill</strong>
        <p>Select a skill later to spend RAP, earn XP, and unlock skill-specific actions.</p>
      </article>
      <article>
        <span>Queue</span>
        <strong>Next Action</strong>
        <p>This area is reserved for quick training actions, costs, timers, and rewards.</p>
      </article>
      <article>
        <span>Progress</span>
        <strong>Milestones</strong>
        <p>Future unlocks, level goals, and training logs will live here.</p>
      </article>
    </div>
  );
}

export function SkillsPanel({ onSelectSkill }) {
  const [previewSkill, setPreviewSkill] = useState(null);
  const [mode, setMode] = useState("overview");
  const isTrainingMode = mode === "training";

  return (
    <ContentPanel
      className="skills-panel"
      actions={[
        {
          Icon: Swords,
          label: "Training",
          onClick: () => {
            setPreviewSkill(null);
            setMode((currentMode) => (currentMode === "training" ? "overview" : "training"));
          },
          pressed: isTrainingMode,
        },
      ]}
      stats={[
        { Icon: BarChart3, label: "Total Level", value: totalSkillLevel },
        { Icon: Sigma, label: "Average Level", value: averageSkillLevel },
        { Icon: XpIcon, label: "Total XP", value: formatSkillXp(totalSkillXp) },
      ]}
      title="Skills"
    >
      {isTrainingMode ? (
        <SkillTrainingMenu />
      ) : (
        <div className="skill-board" onPointerDown={() => setPreviewSkill(null)}>
          {flatSkills.map((skill) => (
            <SkillCard
              key={skill.name}
              onPreview={setPreviewSkill}
              onSelect={onSelectSkill}
              skill={skill}
            />
          ))}
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
                  <dd>{formatSkillXp(previewSkill.currentXp)}</dd>
                </div>
                <div>
                  <dt>Next</dt>
                  <dd>{formatSkillXp(getSkillXpForLevel(previewSkill.level + 1))}</dd>
                </div>
              </dl>
              <p>{previewSkill.description}</p>
            </div>
          )}
        </div>
      )}
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
        { label: "XP", value: "0" },
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
