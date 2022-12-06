import type { Game, GameStatus } from "@prisma/client"
import type { BoardLands } from "types/game"
import Link from "next/link"
import { getObjectSum } from "components/base/services/common.services"

export const FullGame = () => <p className="opacity-70 italic">
  Wait here for an opening or <Link href="/"><a className="link link-primary link-hover">start a new one</a></Link>.
</p>

export const roundCounter = (status?: GameStatus, game?: Game) =>
  !status ? 'Waiting Room' :
  status === 'start' ? 'Starting Soon' :
  status === 'end' ? 'Finished' :
    `Pack ${game?.round ?? '–'} of ${game?.roundCount ?? '–'}`

export const hostButtonLabel: { [label in GameStatus]: string } = {
  start:  'Start Game',
  active: 'Next Round',
  last:   'End Game',
  end:    'End Game',
}

export const cardCounter = (count?: number, lands?: BoardLands) => typeof count !== 'number' || (!count && !lands) ? undefined :
  lands ? `${count} | ${getObjectSum(lands) + count}` : `${count}`