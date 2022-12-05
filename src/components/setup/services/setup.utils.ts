import type { CubeOptions } from "types/setup"
import type { GameOptions, CubeFile } from "types/setup"

export const adaptOptions = ({ name, players, packs, packSize }: GameOptions, file: CubeFile): CubeOptions => ({
  name,
  playerCount: +players,
  roundCount: +packs,
  packSize: +packSize,
  cardList: file.data?.accepted || []
})
