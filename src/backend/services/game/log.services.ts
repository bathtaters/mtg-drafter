import prisma from "backend/libs/db"
import { validate } from "backend/utils/db/password.utils"

const LOG_SALT = "92c23bc8fd75cb3e2880b983ce84d736"

export const userInGame = (id: string, sessionId: string) => prisma.game.findFirst({
    where: { id, players: { some: { sessionId } } },
    select: { round: true, roundCount: true },
})

export async function testPassword(id: string, password: string) {
    const game = await prisma.game.findFirst({
        where: { id },
        select: { logKey: true },
    })
    if (!game) return "Game not found"
    if (!game.logKey) return "Log view is disabled"

    const result = await validate(password, LOG_SALT, game.logKey)
    return result ? undefined : "Incorrect password"
}

