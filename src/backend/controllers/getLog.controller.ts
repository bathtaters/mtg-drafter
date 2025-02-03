import type { NextApiRequest, NextApiResponse } from 'next'
import type { LogFull } from 'types/game'
import { getGameLog, getLogSize } from '../services/game/log.services'
import { getReqSessionId } from '../libs/auth'
import validation from 'types/game.validation'
import { canWatch } from '../utils/game/game.utils'
import { logPageSize } from 'assets/constants'

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse<LogFull | null>) {
  const url = validation.url.parse(req.query.url),
    offset = validation.offset.parse(req.query.offset),
    currentSessionId = getReqSessionId(req, res)
  
  // Allow 'skip' to refer to highest index instead of lowest index
  const skip = offset == null ? undefined : offset < logPageSize ? 0 : offset - logPageSize + 1,
    take = offset == null || offset >= logPageSize ? logPageSize : offset + 1
  
  const game = await getGameLog(url, skip, take, offset != null)
  if (!game?.id) {
    console.error('Error with game',url,'player',currentSessionId,'Game not found!')
    res.status(404).end()
  } else if (!canWatch(game, currentSessionId) && currentSessionId !== game.host?.sessionId) {
    console.error('Error retrieving game log',url,'player',currentSessionId,'Player is not host or was not found in game!')
    res.status(403).end()
  } else if (!game.log.length) {
    console.error('Game log was empty at',url,'offset',offset)
    res.status(204).send(null)
  } else {
    const total = await getLogSize(game.id)
    res.status(200).json({ log: game.log, offset: skip, total })
  }
}
