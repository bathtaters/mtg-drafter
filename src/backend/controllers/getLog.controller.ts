import type { NextApiRequest, NextApiResponse } from 'next'
import type { LogFull } from 'types/game'
import { getGameLog } from '../services/game/game.services'
import { getReqSessionId } from '../libs/auth'
import validation from 'types/game.validation'

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse<LogFull>) {
  const url = validation.url.parse(req.query.url), currentSessionId = getReqSessionId(req, res)
  
  const game = await getGameLog(url)
  if (!game) {
    console.error('Error with game',url,'player',getReqSessionId(req,res),'Game not found!')
    return res.status(404).end()
  } 
  // if (game.players.find(({ sessionId }) => sessionId === currentSessionId)?.id !== game.hostId) {
  //   console.error('Error with game',url,'player',getReqSessionId(req,res),'Player is not host or was not found in game!')
  //   return res.status(403).end()
  // }

  return res.status(200).json(game.log)
}
