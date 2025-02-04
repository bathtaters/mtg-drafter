import type { NextApiRequest, NextApiResponse } from 'next'
import type { LogFull } from 'types/game'
import { getGameLog, getLogSize } from '../services/game/log.services'
import { getReqSessionId } from '../libs/auth'
import validation from 'types/game.validation'
import { canWatch } from '../utils/game/game.utils'

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse<LogFull | null>) {
  const url = validation.url.parse(req.query.url),
    offset = validation.offset.parse(req.query.offset),
    size = validation.size.parse(req.query.size),
    currentSessionId = getReqSessionId(req, res)
  
  const game = await getGameLog(url, offset, size, offset != null)
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
    res.status(200).json({ log: game.log, offset, total })
  }
}
