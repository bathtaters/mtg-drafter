import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import type { ServerProps, ServerSuccess, PlayerFullTimer } from 'types/game'
import { getGame } from '../services/game/game.services'
import { getPlayer } from '../services/game/player.services'
import { getCtxSessionId, getReqSessionId } from '../libs/auth'
import validation from 'types/game.validation'
import { unregGameAdapter } from 'backend/utils/game/game.utils'

async function getGameProps(url: string, sessionId: string): Promise<ServerProps> {  
  const game = await getGame(url)
  if (!game) return { error: 'Unable to find game' }
  
  const { players, packs, ...options } = game
  const now = Date.now()
  const player = await getPlayer(sessionId, players, game, now) as PlayerFullTimer | null // Convert type JSON value -> BasicLands
  
  return !player ?
    { options: unregGameAdapter(options), players, sessionId } :
    { options, players, packs, player, sessionId, now }
}

export function serverSideHandler(ctx: GetServerSidePropsContext) {
  const url = validation.url.parse(ctx.query.url)
  return getGameProps(url, getCtxSessionId(ctx))
}

export async function apiHandler(req: NextApiRequest, res: NextApiResponse<ServerSuccess>) {
  const url = validation.url.parse(req.query.url)
  const props = await getGameProps(url, getReqSessionId(req, res))
  if (props.error) {
    console.error('Error with game',url,'player',getReqSessionId(req,res),props.error)
    return res.status(400).end()
  }

  res.status(200).json(props as ServerSuccess)
}
