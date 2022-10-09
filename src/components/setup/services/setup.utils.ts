import type { CubeOptions } from "types/definitions"
import type { GameOptions, CubeFile } from "./setup"

export const defaultOptions: GameOptions = { name: "", players: "8", packs: "3", packSize: "15" }

export const fileID = "cubeFile"
export const fileType = "text/plain"

export const adaptOptions = ({ name, players, packs, packSize }: GameOptions, file: CubeFile): CubeOptions => ({
  name,
  playerCount: +players,
  roundCount: +packs,
  packSize: +packSize,
  cardList: file.data?.accepted || []
})

export { gameURL, newGameURL, cubeListURL } from '../../../assets/urls'
export { upload, post } from '../../base/services/fetch.services'