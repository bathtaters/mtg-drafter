import prisma from 'backend/libs/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { LogAuthResponse } from 'types/game'
import { getReqSessionId } from '../libs/auth'
import { logAuth } from 'types/game.validation'
import { testPassword, userInGame } from '../services/game/log.services'
import { checkBan } from 'backend/services/game/game.services'
import { gameIsEnded } from '../utils/game/game.utils'
import { banMsg } from 'assets/strings'

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse<LogAuthResponse>) {
    const sessionId = getReqSessionId(req, res)

    const gameId = logAuth.id.safeParse(req.query.id).data
    if (!gameId) return "Game not found"

    const isBanned = await checkBan(gameId, sessionId)
    if (isBanned) return banMsg

    const password = logAuth.password.safeParse(req.body.password).data
    if (!password) return "Missing password"
    
    const message = await testPassword(gameId, password)
    if (message) return message
    
    const game = await userInGame(gameId, sessionId)
    if (game && !gameIsEnded(game)) return "Players cannot view log until game has ended."

    await prisma.watcher.create({ data: { gameId, sessionId } })
    return undefined
}
