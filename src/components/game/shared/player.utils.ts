import type { Game, PartialGame } from "types/game"
import { LOG_DELIM } from "assets/constants"

export const sessionIsHost = (game?: Partial<Game>, sessionId?: string): game is Game => game?.hostId ? game.hostId === sessionId : false

export const playerIsBanned = (game?: Partial<Game | PartialGame>, sessionId?: string) => !game ? game : 
    (game as Game).banned && sessionId ? (game as Game).banned.some(({ sessionId: sId, gameId: gId }) => sId === sessionId && (!game.id || gId === game.id)) :
        (game as PartialGame).isBanned

export const getBanName = (logData: string | null) => logData && logData.split(LOG_DELIM, 2)[1] || null

export const getBanSession = (logData: string | null) => (logData && logData.split(LOG_DELIM, 2)[0]) || undefined
