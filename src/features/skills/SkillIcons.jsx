import React from "react";
import {
  Anvil,
  Axe,
  BicepsFlexed,
  Bone,
  Castle,
  ChefHat,
  Cog,
  Fish,
  Flame,
  FlaskConical,
  Footprints,
  Gem,
  Hammer,
  HandHeart,
  HeartPulse,
  KeyRound,
  PawPrint,
  Pickaxe,
  Shield,
  Ship,
  Shovel,
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

function WispIcon({ size = 22, strokeWidth = 2.8 }) {
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
      <path d="M12 4c3.2 3.1 3.2 12.9 0 16" />
      <path d="M12 4c-3.2 3.1-3.2 12.9 0 16" />
      <path d="M7.2 8.2c2.2-1.2 7.4-1.2 9.6 0" />
      <path d="M7.2 15.8c2.2 1.2 7.4 1.2 9.6 0" />
      <path d="M4.5 12h15" />
      <path d="m18.8 5.2.7 1 1.2-.4" />
      <path d="m3.8 17.4.9.8 1-.7" />
    </svg>
  );
}

function ArrowFletchingIcon({ size = 22, strokeWidth = 2.8 }) {
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
      <path d="M4 20 18 6" />
      <path d="m14 6 4 0 0 4" />
      <path d="m5 19 4-.8-.8-4" />
      <path d="m7.2 16.8 2.8 2.8" />
      <path d="m9.5 14.5 2.8 2.8" />
    </svg>
  );
}

function RuneStoneIcon({ size = 22, strokeWidth = 2.8 }) {
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
      <path d="M8 3h8l4 6-2 10-6 2-6-2L4 9z" />
      <path d="M12 7v10" />
      <path d="m8.5 10.5 3.5 2 3.5-2" />
      <path d="m8.5 15 3.5-2 3.5 2" />
    </svg>
  );
}

function SpiritFamiliarIcon({ size = 22, strokeWidth = 2.8 }) {
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
      <path d="M12 3.8c4.1 2.2 6.2 5.1 6.2 8.6 0 4.2-2.9 7.3-6.2 7.3s-6.2-3.1-6.2-7.3c0-3.5 2.1-6.4 6.2-8.6Z" />
      <path d="M9.2 13.5c.8-.9 4.8-.9 5.6 0 .9 1-.7 2.7-2.8 2.7s-3.7-1.7-2.8-2.7Z" />
      <path d="M8.7 10h.1" />
      <path d="M15.2 10h.1" />
      <path d="m17 5.2 1.5-1.5" />
      <path d="m7 5.2-1.5-1.5" />
    </svg>
  );
}

export const skillIcons = {
  Agility: Footprints,
  Archaeology: Shovel,
  Attack: Swords,
  Construction: Hammer,
  Cooking: ChefHat,
  Crafting: Gem,
  Defence: Shield,
  Divination: WispIcon,
  Dungeoneering: Castle,
  Farming: Sprout,
  Firemaking: Flame,
  Fishing: Fish,
  Fletching: ArrowFletchingIcon,
  Herblore: FlaskConical,
  Hitpoints: HeartPulse,
  Hunter: PawPrint,
  Invention: Cog,
  Magic: WizardHatIcon,
  Mining: Pickaxe,
  Necromancy: Bone,
  Prayer: HandHeart,
  Ranged: BowIcon,
  Runecraft: RuneStoneIcon,
  Sailing: Ship,
  Slayer: Skull,
  Smithing: Anvil,
  Strength: BicepsFlexed,
  Summoning: SpiritFamiliarIcon,
  Thieving: KeyRound,
  Woodcutting: Axe,
};
