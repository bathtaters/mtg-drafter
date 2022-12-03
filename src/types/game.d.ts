import type { Card, Game, Pack, GameCard, Player, Board } from '@prisma/client'
import type { SortKey } from "components/base/services/cardSort.services"

export type ColorLower = "w" | "u" | "b" | "r" | "g"

export const TabLabels = ['pack', 'main', 'side'] as const
export type TabLabels = (typeof TabLabels)[number]

export type BoardLands = Record<ColorLower, number>
export type BasicLands = { [board in Board]: BoardLands } & { pack: never }

export type CardFull = Card & { otherFaces: Card[] }
export type GameCardFull = GameCard & { card: CardFull }
export type PackFull = Pack & { cards: GameCardFull[] }
export type PlayerFull = Player & { cards: GameCardFull[], basics: BasicLands }

export type PlayerStatus = "join" | "leave"
export type CardOptions = { width: string, showArt: boolean, sort?: SortKey }

export interface ServerSuccess {
  options: Game,
  players: Player[],
  playerSlots: Player['id'][],
  packs: PackFull[],
  player: PlayerFull | null,
  sessionId: string,
  error?: never,
}
export interface ServerFail {
  error: string,
  options?: never,
  players?: never,
  playerSlots?: never,
  packs?: never,
  player?: never,
  sessionId?: never,
}
export type ServerProps = ServerSuccess | ServerFail

export type GameProps = Omit<Required<ServerProps>, 'error'>


export namespace Local {
  type NextRound    = (round: Game['round']) => void
  type RenamePlayer = (playerId: Player['id'], name: Player['name']) => void
  type PickCard     = (playerId: Player['id'], pick: Player['pick'], passingToId?: Player['id']) => void
  type SwapCard     = (gameCardId: GameCard['id'], board: Board) => void
  type SetLands     = (basics: BasicLands) => void
  type SetStatus    = (playerId: Player['id'], sessionId: Player['sessionId'], isSelf?: boolean) => void
}

export namespace Socket {
  type RenamePlayer  = (name: Player['name'], playerId?: Player['id']) => void
  type SetTitle      = (title: Game['name']) => void
  type NextRound     = () => void
  type PickCard      = (cardIdx: number) => void
  type SwapCard      = (gameCardId: GameCard['id'], toBoard: Board) => void
  type SetLands      = (lands: BasicLands) => void
  type SetStatus     = (playerId: Player['id'], status?: PlayerStatus) => void
}

// Alias
export type RenamePlayer  = Socket.RenamePlayer
export type SetTitle      = Socket.SetTitle
export type NextRound     = Socket.NextRound
export type PickCard      = Socket.PickCard
export type SwapCard      = Socket.SwapCard
export type SetLands      = Socket.SetLands
export type SetStatus     = Socket.SetStatus