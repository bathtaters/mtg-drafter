import type { Card, Game as DbGame, Pack, GameCard, Player as DbPlayer, Board, PlayerStatus, LogEntry, LogAction, FaceInCard, Ban } from "@prisma/client"
import type { SortKey } from "components/base/services/cardSort.services"
import type { Layout } from "./scryfall"
import z from "backend/libs/validation"
import { boardLands } from "./game.validation"

// -- DATABASE JSONs -- \\

export type BoardLands = z.infer<typeof boardLands>
export type BasicLands = { [board in Board]: BoardLands } & { pack: never }


// -- RELATED/PARTIAL TYPES -- \\

export interface Player extends Omit<DbPlayer, 'timer'> { timer: number | null, basics: BasicLands }
export type BasicPlayer = Pick<Player, "id"|"name"|"sessionId"|"pick">

export interface Game extends Omit<DbGame, 'pause'> { pause: number | null, watchers: string[], banned: Ban[] }
export type PartialGame = Pick<Game,"id"|"name"|"url"|"watchKey">
export type ListedGame = Pick<Game,"id"|"name"|"url"|"hostId"> & { player?: BasicPlayer }
export type LiveOptions = Partial<Pick<Game, "name"|"hostId"|"url"|"timerBase">>

export type CardStrict = Omit<Card,"layout"> & { layout: Layout | null }
export type CardFull = CardStrict & { otherFaces: Array<{ card: CardStrict, backImg: FaceInCard['backImg'] }> }
export type GameCardFull = GameCard & { card: CardFull }

export type PackMin = { cards: Pick<GameCard, "playerId">[] }
export type PackFull = Pack & { cards: GameCardFull[] }
export type PlayerFullTimer = Player & { cards: GameCardFull[], basics: BasicLands }
export type PlayerFull = Omit<PlayerFullTimer, 'timer'>

export type BanResponse = Partial<Ban> & { playerId: string | null, unban: boolean }

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
  Action extends 'settings' ? string :
   null

export interface LogEntryFull extends LogEntry {
  card: (GameCard & { card: Card }) | null,
  data: LogData
}
export type LogFull = LogEntryFull[]


// -- API TYPES -- \\

export type GameHistoryServerSideProps = { games?: ListedGame[], error?: string }

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

export type LogAuthResponse = { success?: boolean, message?: string }

// -- FRONTEND TYPES -- \\

export namespace Local {
  export type NextRound    = (round: Game['round']) => void
  export type PauseGame    = (pauseTime?: Game['pause']) => void
  export type RenamePlayer = (playerId: Player['id'], name: Player['name']) => void
  export type PickCard     = (playerId: Player['id'], pick: Player['pick'], passingToId?: Player['id']) => void
  export type SwapCard     = (gameCardId: GameCard['id'], board: Board) => void
  export type SetLands     = (basics: BasicLands) => void
  export type SetStatus    = (playerId: Player['id'], sessionId: Player['sessionId'], isSelf?: boolean) => void
  export type BanSession   = (data: BanResponse) => void
}

export namespace Socket {
  export type RenamePlayer  = (name: Player['name'], playerId?: Player['id'], byHost?: boolean) => void
  export type SetOptions    = (options: LiveOptions) => void
  export type NextRound     = () => void
  export type PauseGame     = (resume?: boolean) => void
  export type PickCard      = (gameCardOrPack: GameCard['id'] | Pack['index']) => void
  export type SwapCard      = (gameCardId: GameCard['id'], toBoard: Board) => void
  export type SetLands      = (lands: BasicLands) => void
  export type SetStatus     = (playerId: Player['id'], status?: PlayerStatus, byHost?: boolean) => void
  export type SetWatchPw    = (password: string | null) => void
  export type BanSession    = (sessionId: Player['sessionId'] | null, unban?: boolean, playerId?: Player['id']) => void
}

// Aliases
export type RenamePlayer  = Socket.RenamePlayer
export type SetOptions    = Socket.SetOptions
export type NextRound     = Socket.NextRound
export type PauseGame     = Socket.PauseGame
export type PickCard      = Socket.PickCard
export type SwapCard      = Socket.SwapCard
export type SetLands      = Socket.SetLands
export type SetStatus     = Socket.SetStatus
export type SetWatchPw    = Socket.SetWatchPw
export type BanSession    = Socket.BanSession