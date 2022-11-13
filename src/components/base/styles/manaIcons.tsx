import { Rarity } from "@prisma/client"
import { ColorLower } from "types/game"

export const colorClass: Record<ColorLower, string> = {
  w: "text-ms bg-msw",
  u: "text-ms bg-msu",
  b: "text-ms bg-msb",
  r: "text-ms bg-msr",
  g: "text-ms bg-msg",
}

export const hoverClass: Record<ColorLower, string> = {
  w: "hover:text-msw hover:bg-ms border-msw",
  u: "hover:text-msu hover:bg-ms border-msu",
  b: "hover:text-msb hover:bg-ms border-msb",
  r: "hover:text-msr hover:bg-ms border-msr",
  g: "hover:text-msg hover:bg-ms border-msg",
}

export const colorPip: Record<ColorLower, string> = {
  w: "ms ms-w",
  u: "ms ms-u",
  b: "ms ms-b",
  r: "ms ms-r",
  g: "ms ms-g",
}

export const bgdClass: Record<ColorLower|"none"|"multi"|"land", string> = {
  w: 'bg-bgw',
  u: 'bg-bgu',
  b: 'bg-bgb',
  r: 'bg-bgr',
  g: 'bg-bgg',
  none: 'bg-bgc',
  multi: 'bg-bgmulti',
  land: 'bg-bgland',
}

export const rarityClass: Record<Rarity, string> = {
  mythic:   'text-mythic',
  rare:     'text-rare',
  uncommon: 'text-uncommon',
  common:   'text-common',
  bonus:    '',
  special:  '',
}
