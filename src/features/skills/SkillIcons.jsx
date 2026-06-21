import React from "react";

function publicAsset(path) {
  return `${import.meta.env?.DEV ? "/" : "./"}${path}`;
}

function makeSkillIcon(slug) {
  const src = publicAsset(`skill-icons/${slug}.png`);

  return function SkillIconImage({ size = 22 }) {
    return (
      <img
        alt=""
        aria-hidden="true"
        className="skill-icon-image"
        height={size}
        src={src}
        width={size}
      />
    );
  };
}

export const skillIcons = {
  Agility: makeSkillIcon("agility"),
  Archaeology: makeSkillIcon("archaeology"),
  Attack: makeSkillIcon("attack"),
  Construction: makeSkillIcon("construction"),
  Cooking: makeSkillIcon("cooking"),
  Crafting: makeSkillIcon("crafting"),
  Defence: makeSkillIcon("defence"),
  Divination: makeSkillIcon("divination"),
  Dungeoneering: makeSkillIcon("dungeoneering"),
  Farming: makeSkillIcon("farming"),
  Firemaking: makeSkillIcon("firemaking"),
  Fishing: makeSkillIcon("fishing"),
  Fletching: makeSkillIcon("fletching"),
  Herblore: makeSkillIcon("herblore"),
  Hitpoints: makeSkillIcon("hitpoints"),
  Hunter: makeSkillIcon("hunter"),
  Invention: makeSkillIcon("invention"),
  Magic: makeSkillIcon("magic"),
  Mining: makeSkillIcon("mining"),
  Necromancy: makeSkillIcon("necromancy"),
  Prayer: makeSkillIcon("prayer"),
  Ranged: makeSkillIcon("ranged"),
  Runecraft: makeSkillIcon("runecraft"),
  Sailing: makeSkillIcon("sailing"),
  Slayer: makeSkillIcon("slayer"),
  Smithing: makeSkillIcon("smithing"),
  Strength: makeSkillIcon("strength"),
  Summoning: makeSkillIcon("summoning"),
  Thieving: makeSkillIcon("thieving"),
  Woodcutting: makeSkillIcon("woodcutting"),
};
