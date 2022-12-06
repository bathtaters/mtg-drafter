import type { Card, Game, Pack, GameCard, Player, Board, Color, PlayerStatus } from "@prisma/client"
import type { SortKey } from "components/base/services/cardSort.services"
import z from "backend/libs/validation"
import { boardLands } from "./game.validation"

export type CardOptions = { width: string, showArt: boolean, sort?: SortKey }

export type BoardLands = z.infer<typeof boardLands>
export type BasicLands = { [board in Board]: BoardLands } & { pack: never }

export type CardFull = Card & { otherFaces: Card[] }
export type GameCardFull = GameCard & { card: CardFull }
export type PackFull = Pack & { cards: GameCardFull[] }
export type PlayerFull = Player & { cards: GameCardFull[], basics: BasicLands }

export interface ServerSuccess {
  options: Game,
  players: Player[],
  packs: PackFull[],
  player: PlayerFull | null,
  sessionId: string,
  error?: never,
}
export interface ServerUnreg {
  options: Pick<Game,"id"|"name"|"url">,
  players: Player[],
  packs?: never,
  player?: never,
  sessionId: string,
  error?: never,
}
export interface ServerFail {
  error: string,
  options?: never,
  players?: never,
  packs?: never,
  player?: never,
  sessionId?: never,
}
export type ServerProps = ServerSuccess | ServerFail | ServerUnreg

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
  type PickCard      = (gameCardId: GameCard['id']) => void
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