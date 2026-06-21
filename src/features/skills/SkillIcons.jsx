import React from "react";
import {
  Axe,
  BicepsFlexed,
  Fish,
  HandHeart,
  HeartPulse,
  Pickaxe,
  Shield,
  Skull,
  Sprout,
  Swords,
} from "lucide-react";

function BowIcon({ size = 22, strokeWidth = 2.8 }) {
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
      <path d="M7 3c4.6 4.4 4.6 13.6 0 18" />
      <path d="M7 3c7.2 1.5 9.8 16.5 0 18" opacity="0.55" />
      <path d="M7 3v18" />
      <path d="M3 12h15" />
      <path d="m15 8 5 4-5 4" />
    </svg>
  );
}

function WizardHatIcon({ size = 22, strokeWidth = 2.8 }) {
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
      <path d="M8.5 15.5 12 3l4.1 12.5" />
      <path d="M5 17c2.2-1 11.8-1 14 0" />
      <path d="M4 19.5c3.6 1.4 12.4 1.4 16 0" />
      <path d="m10 9 1.1 1.5L13 10" />
      <path d="m14 6 .7 1 1.3-.4" />
    </svg>
  );
}

export const skillIcons = {
  Agility: null,
  Attack: Swords,
  Defence: Shield,
  Farming: Sprout,
  Fishing: Fish,
  Hitpoints: HeartPulse,
  Magic: WizardHatIcon,
  Mining: Pickaxe,
  Prayer: HandHeart,
  Ranged: BowIcon,
  Slayer: Skull,
  Strength: BicepsFlexed,
  Woodcutting: Axe,
};

