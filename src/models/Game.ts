//import { Card } from "./Card"

export type Player = {
  id: string,
  name: string,
  sessionId: string,
  pick: number,
  mainBoard: string[],//Card[],
  sideBoard: string[],//Card[],
  basicLands: { w: number, u: number, b: number, r: number, g: number } & { [color: string]: number },
}

export type Game = {
  id: string,
  name: string,
  url: string,
  hostId: string, // ref: 'Draft.players'
  players: Player[],
  packs: string[][],//Card[][],
  round: number,
  roundCount: number,
  isPaused: boolean,
}
