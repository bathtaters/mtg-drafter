import type { Card, Game as DbGame, Pack, GameCard, Player as DbPlayer, Board, Color, PlayerStatus, LogEntry, LogAction } from "@prisma/client"
import type { SortKey } from "components/base/services/cardSort.services"
import z from "backend/libs/validation"
import { boardLands } from "./game.validation"

// -- DATABASE JSONs -- \\

export type BoardLands = z.infer<typeof boardLands>
export type BasicLands = { [board in Board]: BoardLands } & { pack: never }


// -- RELATED/PARTIAL TYPES -- \\

export interface Player extends DbPlayer { timer: number | null, basics: BasicLands }
export type BasicPlayer = Pick<Player, "id"|"name"|"sessionId"|"pick">

export interface Game extends DbGame { pause: number | null }
export type PartialGame = Pick<Game,"id"|"name"|"url">

export type CardFull = Card & { otherFaces: Array<{ card: Card }> }
export type GameCardFull = GameCard & { card: CardFull }

export type PackMin = { cards: Pick<GameCard, "playerId">[] }
export type PackFull = Pack & { cards: GameCardFull[] }
export type PlayerFullTimer = Player & { cards: GameCardFull[], basics: BasicLands }
export type PlayerFull = Omit<PlayerFullTimer, 'timer'>


// -- USER OPTIONS -- \\

export enum Direction { N = 'N', E = 'E', S = 'S', W = 'W' }
export type CardOptions = { width: string, showArt: boolean, sort?: SortKey }
export type LogOptions = { hideHost: boolean, hidePrivate: boolean }
export type TimerOptions = { secPerCard: number, secOffset?: number, roundTo?: number, minSec?: number, maxSec?: number }

// -- LOG TYPES -- \\

export type LogData<Action extends LogAction = LogAction> = 
  Action extends 'pick' ? `${string}:${string}` :
  Action extends 'join' ? string :
  Action extends 'leave' ? null :
  Action extends 'rename' ? string :
  Action extends 'round' ? `${number}` | 'END' :
  Action extends 'settings' ? `${Partial<Game>}` :
   undefined

export interface LogEntryFull extends LogEntry {
  card: (GameCard & { card: Card }) | null,
  data: LogData
}
export type LogFull = LogEntryFull[]


// -- API TYPES -- \\

export interface ServerSuccess {
  options: Game,
  players: BasicPlayer[],
  packs: PackFull[],
  packSize: number | null,
  player: PlayerFullTimer | null,
  sessionId: string,
  now: number,
  error?: never,
}
export interface ServerUnreg {
  options: PartialGame,
  players: BasicPlayer[],
  packs?: never,
  packSize?: never,
  player?: never,
  sessionId: string,
  now?: never,
  error?: never,
}
export interface ServerFail {
  error: string,
  options?: PartialGame,
  players?: never,
  packs?: never,
  packSize?: never,
  player?: never,
  sessionId?: never,
  now?: never,
}
export type ServerProps = ServerSuccess | ServerFail | ServerUnreg

export type GameProps = Omit<Required<ServerProps>, 'error'>


// -- FRONTEND TYPES -- \\

export namespace Local {
  type NextRound    = (round: Game['round']) => void
  type PauseGame    = (pauseTime?: Game['pause']) => void
  type RenamePlayer = (playerId: Player['id'], name: Player['name']) => void
  type PickCard     = (playerId: Player['id'], pick: Player['pick'], passingToId?: Player['id']) => void
  type SwapCard     = (gameCardId: GameCard['id'], board: Board) => void
  type SetLands     = (basics: BasicLands) => void
  type SetStatus    = (playerId: Player['id'], sessionId: Player['sessionId'], isSelf?: boolean) => void
}

export namespace Socket {
  type RenamePlayer  = (name: Player['name'], playerId?: Player['id'], byHost?: boolean) => void
  type SetTitle      = (title: Game['name']) => void
  type NextRound     = () => void
  type PauseGame     = (resume?: boolean) => void
  type PickCard      = (gameCardOrPack: GameCard['id'] | Pack['index']) => void
  type SwapCard      = (gameCardId: GameCard['id'], toBoard: Board) => void
  type SetLands      = (lands: BasicLands) => void
  type SetStatus     = (playerId: Player['id'], status?: PlayerStatus, byHost?: boolean) => void
}

// Aliases
export type RenamePlayer  = Socket.RenamePlayer
export type SetTitle      = Socket.SetTitle
export type NextRound     = Socket.NextRound
export type PauseGame     = Socket.PauseGame
export type PickCard      = Socket.PickCard
export type SwapCard      = Socket.SwapCard
export type SetLands      = Socket.SetLands
export type SetStatus     = Socket.SetStatus