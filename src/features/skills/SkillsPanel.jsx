import React from "react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import {
  averageSkillLevel,
  flatSkills,
  totalSkillLevel,
} from "./skillData.js";

function SkillCard({ onSelect, skill }) {
  return (
    <button
      className="skill-card"
      onClick={() => onSelect(skill)}
      style={{ "--skill-color": skill.color }}
      type="button"
    >
      <div className="skill-sprite" aria-hidden="true">
        <span>{skill.short}</span>
      </div>
      <div className="skill-card-copy">
        <span>{skill.group}</span>
        <strong>{skill.name}</strong>
        <small>Level {skill.level}/{skill.maxLevel}</small>
      </div>
    </button>
  );
}

export function SkillsPanel({ onSelectSkill }) {
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
      <div className="skill-board">
        {flatSkills.map((skill) => (
          <SkillCard key={skill.name} onSelect={onSelectSkill} skill={skill} />
        ))}
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
