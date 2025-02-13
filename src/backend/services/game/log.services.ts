import type { Watcher } from "@prisma/client"
import type { Game } from "types/game"
import type { LogFilterParam } from "types/log.validation"
import prisma from "backend/libs/db"
import { validate, hash } from "backend/utils/db/password.utils"
import { getName } from "backend/utils/game/player.utils"
import { otherPlayers } from "types/logs"

const LOG_SALT = "92c23bc8fd75cb3e2880b983ce84d736"

export const getGameLog = (url: Game['url'], take?: number, skip?: number, fromStart=false, filter?: LogFilterParam) => prisma.game.findUnique({
    where: { url },
    select: {
        id: true,
        hostId: true,
        watchers: { select: { sessionId: true } },
        log: {
            where: filter && { AND: [
                filter.actions  ? { action: { in: filter.actions } } : {},
                filter.hideHost ? { OR: [ { playerId: null }, { byHost: false }, { action: 'ban' }] } : {},
                !filter.players ? {} : otherPlayers.some((player) => filter.players?.includes(player)) ? 
                    { OR: [ { playerId: { in: filter.players } }, { playerId: null /* otherPlayers = NULL */ }] } :
                    { playerId: { in: filter.players } },
            ] },
            orderBy: { time: fromStart ? 'asc' : 'desc' },
            include: { card: { include: { card: true } } },
            skip, take,
        },
    },
})
  
  
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

    const result = await validate(password, LOG_SALT, game.watchKey)
    return result ? undefined : "Incorrect password"
}

export async function setPassword(id: string, password: string | null) {
    if (password) password = await hash(password, LOG_SALT)
    try {
        const result = await prisma.$transaction([
            prisma.game.update({
                where: { id },
                data: { watchKey: password },
            }),
            prisma.watcher.deleteMany({ where: { gameId: id } })
        ])
        return Boolean(result[0].watchKey)

    } catch (error: any) {
        if (error.code === 'P2025') console.error('Setting password: Game not found', id)
        else console.error('An unexpected error occurred:', error)
    }
    return null
}

export async function setWatcher(gameId: string, sessionId: string, join: boolean): Promise<Watcher>;
export async function setWatcher(gameId: string, sessionId: string, join: boolean, ignoreError: true): Promise<number>;
export async function setWatcher(gameId: string, sessionId: string, join: boolean, ignoreError: false | undefined): Promise<Watcher>;
export async function setWatcher(gameId: string, sessionId: string, join: boolean, ignoreError: boolean): Promise<Watcher | number>;
export async function setWatcher(gameId: string, sessionId: string, join: boolean, ignoreError = false) {
    if (join) {
        const name = await getName(sessionId, gameId)
        return prisma.watcher.create({ data: { gameId, sessionId, name } })
    } if (ignoreError) {
        return prisma.watcher.deleteMany({ where: { gameId, sessionId } })
            .then((res) => res.count)
    }
    return prisma.watcher.delete({ where: { sessionId_gameId: { gameId, sessionId } } })
}