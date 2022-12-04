import type { Game } from "@prisma/client"
import type { BoardLands, GameStatus } from "types/game"
import { getObjectSum } from "components/base/services/common.services"

export const FullGame = () => <p className="opacity-70 italic">
  Wait here for an opening or <a href="/" className="link link-primary">start a new one</a>.
</p>

export const roundCounter = (status?: GameStatus, game?: Game) =>
  !status ? 'Waiting Room' :
  status === 'active' ? `Pack ${game?.round ?? '–'} of ${game?.roundCount ?? '–'}` :
  status === 'end' ? 'Finished' : 'Awaiting'

export const hostButtonLabel: { [label in GameStatus]: string } = {
  start:  'Start Game',
  active: 'Next Round',
  end:    'End Game',
}

export const cardCounter = (count?: number, lands?: BoardLands) => typeof count !== 'number' || (!count && !lands) ? undefined :
  lands ? `${count} | ${getObjectSum(lands) + count}` : `${count}`