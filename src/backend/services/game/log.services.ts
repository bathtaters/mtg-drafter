import type { Watcher } from "@prisma/client"
import type { Game, Player } from "types/game"
import type { LogFilterParam } from "types/log.validation"
import prisma from "backend/libs/db"
import { validate, hash, getWatchSalt } from "backend/utils/db/password.utils"
import { getLastJoinSession, getName } from "backend/utils/game/player.utils"
import { type ViewAuthError, type ViewEntryData, otherPlayers } from "types/logs"
import { ALL_WATCHERS } from "assets/constants"
import { gameIsEnded } from "components/game/shared/game.utils"

const WATCH_SALT = getWatchSalt()

export const getGameLog = (url: Game['url'], take?: number, skip?: number, fromStart=false, filter?: LogFilterParam) => prisma.game.findUnique({
    where: { url },
    select: {
        id: true,
        hostId: true,
        watchers: { select: { sessionId: true } },
        log: {
            where: filter && { AND: [
                filter.actions  ? { action: { in: filter.actions } } : {},
                filter.hideHost ? { OR: [ { playerId: null }, { hostId: null }, { action: 'ban' }] } : {},
                !filter.players ? {} : otherPlayers.some((player) => filter.players?.includes(player)) ? 
                    { OR: [ { playerId: { in: filter.players } }, { playerId: null /* otherPlayers = NULL */ }] } :
                    { playerId: { in: filter.players } },
            ] },
            orderBy: { time: fromStart ? 'asc' : 'desc' },
            include: { card: { include: { card: { select: { scryfallId: true, name: true, img: true } } } } },
            skip, take,
        },
    },
})

export const getHasJoined = (gameId: Game['id'], sessionId: string) => prisma.logEntry.count({
    where: { gameId, sessionId, action: 'join' }, take: 1
}).then(Boolean)

export const getHasViewed = (gameId: Game['id'], sessionId: string) => prisma.logEntry.count({
    where: { gameId, sessionId, action: 'view' }, take: 1
}).then(Boolean)
  
export const getLogSize = (gameId: Game['id']) => prisma.logEntry.count({ where: { gameId } })

export const userInGame = (gameId: string, sessionId: string) => prisma.logEntry.findFirst({
    where: { gameId, action: 'join', player: { sessionId } },
    select: { game: { select: { round: true, roundCount: true } } },
}).then((res) => res?.game)

export const userIsWatcher = (gameId: string, sessionId: string) => prisma.watcher.findFirst({
    where: { gameId, sessionId },
    select: { sessionId: true },
}).then((res) => res?.sessionId)

export async function testPassword(id: string, password: string) {
    const game = await prisma.game.findFirst({
        where: { id },
        select: { watchKey: true },
    })
    if (!game) return "Game not found"
    if (!game.watchKey) return "Log view is disabled"

    const result = await validate(password, WATCH_SALT, game.watchKey)
    return result ? undefined : "Incorrect password"
}

export async function setPassword(id: string, password: string | null, hostId: Player['sessionId']) {
    if (password) password = await hash(password, WATCH_SALT)
    try {
        const result = await prisma.$transaction([
            prisma.game.update({
                where: { id },
                data: { watchKey: password },
            }),
            prisma.watcher.deleteMany({ where: { gameId: id } }),
            prisma.logEntry.create({ data: { gameId: id, hostId, action: 'leave', data: ALL_WATCHERS } }),
        ])
        return Boolean(result[0].watchKey)

    } catch (error: any) {
        if (error.code === 'P2025') console.error('Setting password: Game not found', id)
        else console.error('An unexpected error occurred:', error)
    }
    return null
}

export async function setWatcher(gameId: Game['id'], sessionId: string, join: boolean, hostId?: Player['sessionId']): Promise<Watcher>;
export async function setWatcher(gameId: Game['id'], sessionId: string, join: boolean, hostId: Player['sessionId'], ignoreError: true): Promise<number>;
export async function setWatcher(gameId: Game['id'], sessionId: string, join: boolean, hostId: Player['sessionId'], ignoreError: false | undefined): Promise<Watcher>;
export async function setWatcher(gameId: Game['id'], sessionId: string, join: boolean, hostId: Player['sessionId'], ignoreError: boolean): Promise<Watcher | number>;
export async function setWatcher(gameId: Game['id'], sessionId: string, join: boolean, hostId: Player['sessionId'] = null, ignoreError = false) {
    if (join) {
        const name = await getName(sessionId, gameId)
        return prisma.$transaction([
            prisma.watcher.create({ data: { gameId, sessionId, name } }),
            prisma.logEntry.create({ data: { gameId, sessionId, action: 'join', data: name, hostId } }),
        ]).then((res) => res[0])
    }
    
    const data = await getLastJoinSession(sessionId, gameId)
    if (ignoreError) {
        const { count } = await prisma.watcher.deleteMany({ where: { gameId, sessionId } })
        if (count) await prisma.logEntry.create({ data: { gameId, sessionId, action: 'leave', data, hostId } })
        return count
    }
    return prisma.$transaction([
        prisma.watcher.delete({ where: { sessionId_gameId: { gameId, sessionId } } }),
        prisma.logEntry.create({ data: { gameId, sessionId, action: 'leave', data, hostId } }),
    ]).then((res) => res[0])
}

/**
 * Check if the given user can view the pack or deck.
 *  Can view if:
 *  - User is the current host or an active watcher
 *  - Game has ended OR user has never joined the game OR user is viewing their own deck/pack
 * @param gameId ID of game to view cards from.
 * @param sessionId Session of user who is requesting the view.
 * @param playerId ID of player whose deck/pack to view.
 * @param cards Deck board OR pack/round number to view.
 * @param silent If true, do not log as a request.
 * @returns Error code if not authorized OR null if authorized.
 */
export async function canView(gameId: Game['id'], sessionId: string, playerId: Player['id'], cards: ViewEntryData, silent = false): Promise<ViewAuthError | null> {
    const [ isWatcher, game, hasJoined ] = await prisma.$transaction([
        prisma.watcher.count({ where: { gameId, sessionId }, take: 1 }),
        prisma.game.findUnique({ where: { id: gameId }, select: { hostId: true, round: true, roundCount: true } }),
        prisma.logEntry.count({
            // If user has joined as a player (other than the player whose deck will be viewed)
            where: { gameId, sessionId, action: 'join', playerId: playerId && { not: playerId }},
            take: 1,
        }),
    ])
    
    const isHost = game?.hostId === sessionId
    if (!isWatcher && !isHost) return "NOAUTH"
    if (hasJoined && (!game || !gameIsEnded(game))) return "PLAYER"

    // Log each view request
    if (!silent) await prisma.logEntry.create({
            data: { gameId, sessionId, playerId, action: 'view', data: cards.toString(), hostId: isHost ? sessionId : null }
        })

    return null
}
