import type { BoosterOptions, CubeOptions } from "types/setup"
import type { GameOptions, CubeFile } from "types/setup"

const adaptCube = ({ name, players, packs, packSize }: GameOptions, file: CubeFile|null): CubeOptions => ({
  name,
  playerCount: +players,
  roundCount: +packs,
  packSize: +packSize,
  cardList: file?.data?.accepted || []
})

const adaptBooster = ({ name, players, packList }: GameOptions): BoosterOptions => ({
  name,
  playerCount: +players,
  packList,
})

export const adaptOptions = (options: GameOptions, file: CubeFile|null) => 
  options.type === 'Cube' ? adaptCube(options,file) : adaptBooster(options)