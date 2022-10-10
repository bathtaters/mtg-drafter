import type { Card, Game, Pack, GameCard, Player, Board } from '@prisma/client'
import type { BasicLands, PlayerStatus } from 'types/definitions'

export type CardFull = Card & { otherFaces: Card[] }
export type GameCardFull = GameCard & { card: CardFull }
export type PackFull = Pack & { cards: GameCardFull[] }
export type PlayerFull = Player & { cards: GameCardFull[] }

export interface ServerProps {
  options?: Game,
  players?: Player[],
  playerSlots?: Player['id'][],
  packs?: PackFull[],
  player?: PlayerFull | null,
  error?: string,
}

export type GameProps = Omit<Required<ServerProps>, 'error'>


export namespace Local {
  type NextRound    = (round: Game['round']) => void
  type RenamePlayer = (playerId: Player['id'], name: Player['name']) => void
  type OtherPick    = (playerId: Player['id'], pick: Player['pick']) => void
  type PickCard     = (pick: Player['pick'], gameCard: GameCard['id'], board?: Board) => void
  type SwapCard     = (gameCardId: GameCard['id'], board: Board) => void
  type SetLands     = (basics: BasicLands) => void
  type SetPack      = (pickableIds?: GameCard['id'][]) => void
  type SetStatus    = (playerId: Player['id'], sessionId: Player['sessionId'], isSelf?: boolean) => void
}

export namespace Socket {
  type RenamePlayer  = (name: string) => void
  type NextRound     = () => void
  type PickCard      = (cardIdx: number) => void
  type GetPack       = (packId?: string) => void
  type SwapCard      = (gameCardId: GameCard['id'], toBoard: Board) => void
  type SetLands      = (lands: BasicLands) => void
  type SetStatus     = (playerId: Player['id'], status?: PlayerStatus) => void
}

// Alias
export type RenamePlayer  = Socket.RenamePlayer
export type NextRound     = Socket.NextRound
export type PickCard      = Socket.PickCard
export type GetPack       = Socket.GetPack
export type SwapCard      = Socket.SwapCard
export type SetLands      = Socket.SetLands
export type SetStatus     = Socket.SetStatus