import React from "react";

function publicAsset(path) {
  return `${import.meta.env?.DEV ? "/" : "./"}${path}`;
}

export function makeUiIcon(slug) {
  const src = publicAsset(`ui-icons/${slug}.png`);

  return function UiIconImage({ size = 22 }) {
    return (
      <img
        alt=""
        aria-hidden="true"
        className="ui-icon-image"
        height={size}
        src={src}
        width={size}
      />
    );
  };
}

export const uiIcons = {
  activities: makeUiIcon("activities"),
  beastiary: makeUiIcon("beastiary"),
  character: makeUiIcon("character"),
  codex: makeUiIcon("codex"),
  currentXp: makeUiIcon("current-xp"),
  explore: makeUiIcon("explore"),
  gear: makeUiIcon("gear"),
  inventory: makeUiIcon("inventory"),
  level: makeUiIcon("level"),
  more: makeUiIcon("more"),
  placeholder: makeUiIcon("placeholder-mystery"),
  rap: makeUiIcon("rap"),
  skills: makeUiIcon("skills"),
  stats: makeUiIcon("stats"),
  xpToNext: makeUiIcon("xp-to-next"),
};
