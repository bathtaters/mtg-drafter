import type { ParsedUrlQuery } from 'querystring'
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import type { ServerProps, ServerSuccess, PlayerFullTimer, PackFull } from 'types/game'
import { checkBan, getGame, getRoundPackSize } from '../services/game/game.services'
import { getPlayer } from '../services/game/player.services'
import { getCtxSessionId, getReqSessionId } from '../libs/auth'
import validation from 'types/game.validation'
import { unregGameAdapter, canWatch } from '../utils/game/game.utils'

const NOTFOUND = 'Unable to find game'
const BANNED = 'Access restricted'

async function getGameProps(query: ParsedUrlQuery, sessionId: string, includePacks = true): Promise<ServerProps> {
  let url: string, packSize: number;
  try { url = validation.url.parse(query.url) }
  catch(e) { return { error: NOTFOUND } } 

  const game = await getGame(url, includePacks)
  if (!game) return { error: NOTFOUND }

  const isBanned = await checkBan(game.id, sessionId)
  if (isBanned) return { error: BANNED, options: unregGameAdapter(game) }
  
  try { packSize = await getRoundPackSize(game.id, game.round, game.roundCount, game.players.length) }
  catch(e: any) { return { error: `Server Error: ${e.message}`, options: unregGameAdapter(game) } }

  const { players, packs, ...options } = game
  const now = Date.now()
  const player = await getPlayer(sessionId, players, game, packSize, now) as PlayerFullTimer | null // Convert type JSON value -> BasicLands
  
  return player || canWatch(options, sessionId) ?
    { options, players, player, sessionId, now, packSize, packs: packs as PackFull[] || [] } :
    { options: unregGameAdapter(options), players, sessionId }
}

export async function serverSideHandler(ctx: GetServerSidePropsContext) {
  return getGameProps(ctx.query, getCtxSessionId(ctx), false)
}

export async function apiHandler(req: NextApiRequest, res: NextApiResponse<ServerSuccess>) {
  const props = await getGameProps(req.query, getReqSessionId(req, res), true)
  if (props.error) {
    console.error('Game API Error -- game:',req.query.url,', player:',getReqSessionId(req,res),'--',props.error)
    res.writeHead(props.error === NOTFOUND ? 404 : props.error === BANNED ? 403 : 400, props.error)
  } else {
    res.status(200).json(props as ServerSuccess)
  }
}
