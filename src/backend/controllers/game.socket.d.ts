import type { Event, Server, Socket } from 'socket.io'
import type { Socket as Client } from 'socket.io-client'
import type { Game, GameCard, Pack, Player } from '@prisma/client'
import type { BasicLands, Board, PlayerStatus } from 'types/definitions'
import type { PlayerFull } from 'components/game/services/game'

export interface GameServerToClient {
  updateRound: (round: Game['round']) => void;
  updatePick:  (playerId: Player['id'], pick: Player['pick']) => void;
  updateName:  (playerId: Player['id'], name: Player['name']) => void;
  updateSlot:  (playerId: Player['id'], sessionId: Player['sessionId']) => void;
}

export interface GameClientToServer {
  nextRound:  (round: Game['round']) => void;
  setName:    (name: Player['name']) => void;
  pickCard:   (gameCardId: GameCard['id'], callback: (pick?: Player['pick']) => void) => void;
  setStatus:  (playerId: Player['id'], status: PlayerStatus, callback: (player?: PlayerFull | Player) => void) => void;

  getPack:    (packId: Pack['id'], callback: (gameCardIds: GameCard['id'][]) => void) => void;
  swapBoards: (gameCardId: GameCard['id'], toBoard: Board, callback: (gameCardId: GameCard['id'], toBoard: Board) => void) => void;
  setLands:   (lands: BasicLands, callback: (lands: BasicLands) => void) => void;
}

export interface GameServerToServer {}

export interface GameSocketData {
  gameId:     string;
  playerId:   string;
  gameUrl:    string;
  sessionId:  string;
}

export type GameServer = Server<GameClientToServer, GameServerToClient, GameServerToServer, GameSocketData>
export type GameSocket = Socket<GameClientToServer, GameServerToClient, GameServerToServer, GameSocketData>
export type GameClient = Client<GameServerToClient, GameClientToServer>

export type GameMiddleware = (socket: GameSocket, next: (err?: Error) => void) => Promise<any>