import type { Event, Server, Socket } from 'socket.io'
import type { Socket as Client } from 'socket.io-client'
import type { Game, GameCard, Pack, PlayerStatus } from '@prisma/client'
import type { Player, PlayerFull, BasicLands, Board } from 'types/game'

export interface GameServerToClient {
  updateTitle: (title: Game['name']) => void;
  updateRound: (round: Game['round']) => void;
  updatePick:  (playerId: Player['id'], pick: Player['pick'], passingToId?: Player['id']) => void;
  updateName:  (playerId: Player['id'], name: Player['name']) => void;
  updateSlot:  (playerId: Player['id'], sessionId: Player['sessionId']) => void;
  error:       (message: string) => void;
}

export interface GameClientToServer {
  setTitle:   (gameId: Game['id'], title: Game['name']) => void;
  nextRound:  (gameId: Game['id'], round: Game['round']) => void;
  setName:    (playerId: Player['id'], name: Player['name'], byHost: boolean) => void;
  pickCard:   (playerId: Player['id'], gameCardId: GameCard['id'], callback: (pick?: Player['pick']) => void) => void;
  setStatus:  (playerId: Player['id'], status: PlayerStatus, byHost: boolean, callback: (player?: PlayerFull | Player) => void) => void;

  swapBoards: (gameCardId: GameCard['id'], toBoard: Board, callback: (gameCardId: GameCard['id'] | void, toBoard?: Board | void) => void) => void;
  setLands:   (playerId: Player['id'], lands: BasicLands, callback: (lands: BasicLands | void) => void) => void;
}

export interface GameServerToServer {}

export type GameServer = Server<GameClientToServer, GameServerToClient, GameServerToServer>
export type GameSocket = Socket<GameClientToServer, GameServerToClient, GameServerToServer>
export type GameClient = Client<GameServerToClient, GameClientToServer>

export type GameMiddleware = (ev: Event, next: (err?: Error) => void, socket: GameSocket, io: GameServer) => Promise<any>