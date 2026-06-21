import React, { useEffect, useRef, useState } from "react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import {
  averageSkillLevel,
  flatSkills,
  formatSkillXp,
  getSkillXpForLevel,
  totalSkillLevel,
} from "./skillData.js";

const LONG_PRESS_MS = 520;

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
      aria-label={`${skill.name}. Level ${skill.level} of ${skill.maxLevel}. Long press for details.`}
    >
      <div className="skill-sprite" aria-hidden="true">
        <span>{skill.short}</span>
      </div>
      <div className="skill-level-stack" aria-hidden="true">
        <strong>{skill.level}</strong>
        <span>{skill.maxLevel}</span>
      </div>
    </button>
  );
}

export function SkillsPanel({ onSelectSkill }) {
  const [previewSkill, setPreviewSkill] = useState(null);

  return (
    <ContentPanel
      className="skills-panel"
      stats={[
        { label: "Total Skills", value: flatSkills.length },
        { label: "Skill Level", value: totalSkillLevel },
        { label: "Average Level", value: averageSkillLevel },
      ]}
      title="Skills"
    >
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
              <span style={{ "--skill-color": previewSkill.color }}>{previewSkill.short}</span>
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
                <dd>{previewSkill.level}/{previewSkill.maxLevel}</dd>
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
    </ContentPanel>
  );
}

export function SkillDetailPanel({ onBack, skill }) {
  return (
    <ContentPanel
      className="skill-detail-panel"
      onBack={onBack}
      stats={[
        { label: "Level", value: `${skill.level}/${skill.maxLevel}` },
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
