import type { Event, Server, Socket } from "socket.io";
import type { Socket as Client } from "socket.io-client";
import type { GameCard, Pack, Ban } from "@prisma/client";
import type {
  Game,
  LiveOptions,
  Player,
  PlayerFull,
  PlayerStatus,
  LogAction,
  BasicLands,
  Board,
  BanResponse,
} from "types/game";
import type { ViewEntryData } from "types/logs";

export interface GameServerToClient {
  updateGame: (options: LiveOptions) => void;
  updateRound: (round: Game["round"]) => void;
  updateTimer: (pauseTime?: Game["pause"]) => void;
  updatePick: (
    playerId: Player["id"],
    pick: Player["pick"],
    passingToId?: Player["id"]
  ) => void;
  updateName: (playerId: Player["id"], name: Player["name"]) => void;
  updateSlot: (playerId: Player["id"], sessionId: Player["sessionId"]) => void;
  updateWatchPw: (watchKey: Game["watchKey"]) => void;
  updateWatcher: (
    sessionId: NonNullable<Player["sessionId"]>,
    joined: boolean,
    name?: string
  ) => void;
  updateBan: (banData: BanResponse) => void;
  viewedCards: (sessionId: NonNullable<Player["sessionId"]>) => void;
  errorMsg: (message: string) => void; // Custom error
  error: (message: string) => void; // Sockets error
}

export interface GameClientToServer {
  setOptions: (
    gameId: Game["id"],
    options: LiveOptions,
    newHost?: Player["id"]
  ) => void;
  nextRound: (gameId: Game["id"], round: Game["round"]) => void;
  pauseTimer: (gameId: Game["id"], resume: boolean) => void;
  setName: (
    playerId: Player["id"],
    name: Player["name"],
    byHost: boolean
  ) => void;
  pickCard: (
    playerId: Player["id"],
    gameCardOrPack: GameCard["id"] | Pack["index"],
    callback: (pick?: Player["pick"]) => void
  ) => void;
  setStatus: (
    playerId: Player["id"],
    status: PlayerStatus,
    byHost: boolean,
    callback: (player?: Player) => void
  ) => void;
  setWatchPw: (gameId: Game["id"], password: string | null) => void;
  watcherLogin: (
    gameId: Game["id"],
    sessionId: NonNullable<Player["sessionId"]>,
    password: string | null,
    callback: (success: boolean, reason?: string) => void
  ) => void;
  dropWatcher: (
    gameId: Game["id"],
    sessionId: NonNullable<Player["sessionId"]>,
    byHost?: boolean
  ) => void;
  banSession: (
    gameId: Game["id"],
    sessionId: Player["sessionId"] | null,
    unban: boolean,
    playerId?: Player["id"] | null
  ) => void;
  viewCards: (
    gameId: Game["id"],
    sessionId: NonNullable<Player["sessionId"]>,
    playerId: Player["id"],
    cards: ViewEntryData,
    callback: (success: boolean, reason?: string) => void
  ) => void;

  swapBoards: (
    gameCardId: GameCard["id"],
    toBoard: Board,
    callback: (
      gameCardId: GameCard["id"] | void,
      toBoard?: Board | void
    ) => void
  ) => void;
  setLands: (
    playerId: Player["id"],
    lands: BasicLands,
    callback: (lands: BasicLands | void) => void
  ) => void;
}

export interface GameServerToServer {}

export type GameServer = Server<
  GameClientToServer,
  GameServerToClient,
  GameServerToServer
>;
export type GameSocket = Socket<
  GameClientToServer,
  GameServerToClient,
  GameServerToServer
>;
export type GameClient = Client<GameServerToClient, GameClientToServer>;

export type GameMiddleware = (
  ev: Event,
  next: (err?: Error) => void,
  socket: GameSocket,
  io: GameServer
) => Promise<any>;
