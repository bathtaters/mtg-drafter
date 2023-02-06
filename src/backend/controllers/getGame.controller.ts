import type { ParsedUrlQuery } from 'querystring'
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import type { ServerProps, ServerSuccess, PlayerFullTimer, ServerFail } from 'types/game'
import { getGame } from '../services/game/game.services'
import { getPlayer } from '../services/game/player.services'
import { getCtxSessionId, getReqSessionId } from '../libs/auth'
import validation from 'types/game.validation'
import { unregGameAdapter } from 'backend/utils/game/game.utils'

const NOTFOUND = 'Unable to find game'

async function getGameProps(query: ParsedUrlQuery, sessionId: string): Promise<ServerProps> {
  let url: string;
  try { url = validation.url.parse(query.url) }
  catch(e) { return { error: NOTFOUND } } 

  const game = await getGame(url)
  if (!game) return { error: NOTFOUND }
  
  const { players, packs, ...options } = game
  const now = Date.now()
  const player = await getPlayer(sessionId, players, game, now) as PlayerFullTimer | null // Convert type JSON value -> BasicLands
  
  return !player ?
    { options: unregGameAdapter(options), players, sessionId } :
    { options, players, packs, player, sessionId, now }
}

export async function serverSideHandler(ctx: GetServerSidePropsContext) {
  return getGameProps(ctx.query, getCtxSessionId(ctx))
}

export async function apiHandler(req: NextApiRequest, res: NextApiResponse<ServerSuccess>) {
  const props = await getGameProps(req.query, getReqSessionId(req, res))
  if (props.error) {
    console.error('Game API Error -- game:',req.query.url,', player:',getReqSessionId(req,res),'--',props.error)
    return res.writeHead(props.error === NOTFOUND ? 404 : 400, props.error)
  }

  res.status(200).json(props as ServerSuccess)
}
