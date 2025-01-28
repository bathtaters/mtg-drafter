import type { NextApiRequest, NextApiResponse } from 'next'
import type { LogFull } from 'types/game'
import { getGameLog } from '../services/game/game.services'
import { getReqSessionId } from '../libs/auth'
import validation from 'types/game.validation'
import { canWatch } from '../utils/game/game.utils'

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse<LogFull>) {
  const url = validation.url.parse(req.query.url), currentSessionId = getReqSessionId(req, res)
  
  const game = await getGameLog(url)
  if (!game) {
    console.error('Error with game',url,'player',getReqSessionId(req,res),'Game not found!')
    res.status(404).end()
  } else if (!canWatch(game, currentSessionId) && game.players.find(({ sessionId }) => sessionId === currentSessionId)?.id !== game.hostId) {
    console.error('Error retrieving game log',url,'player',getReqSessionId(req,res),'Player is not host or was not found in game!')
    res.status(403).end()
  } else {
    res.status(200).json(game.log)
  }
}
