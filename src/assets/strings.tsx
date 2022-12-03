import type { BoardLands } from "types/game"
import { getObjectSum } from "components/base/services/common.services"

export const FullGame = <p>This game is full, you can wait for an opening or <a href="/" className="link link-primary">start a new one</a>.</p>

export const cardCounter = (count?: number, lands?: BoardLands) => typeof count !== 'number' || (!count && !lands) ? undefined :
  lands ? `${count} | ${getObjectSum(lands) + count}` : `${count}`