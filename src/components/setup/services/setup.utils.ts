import type { BoosterOptions, CubeOptions } from "types/setup"
import type { GameOptions, CubeFile } from "types/setup"

const adaptCube = ({ name, players, timer, packs, packSize }: GameOptions, file: CubeFile|null): CubeOptions => ({
  name,
  playerCount: +players,
  timer: +timer,
  roundCount: +packs,
  packSize: +packSize,
  cardList: file?.data?.accepted || []
})

const adaptBooster = ({ name, players, timer, packList }: GameOptions): BoosterOptions => ({
  name,
  playerCount: +players,
  timer: +timer,
  packList,
})

export const adaptOptions = (options: GameOptions, file: CubeFile|null) => 
  options.type === 'Cube' ? adaptCube(options,file) : adaptBooster(options)