import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import type { ServerProps } from 'components/game/services/game'
import { getGame } from '../services/game/game.services'
import { getPlayer } from '../services/game/player.services'
import { getCtxSessionId, getReqSessionId } from 'components/base/services/sessionId.services'

async function getGameProps(url: string | string[] | undefined, sessionId: string): Promise<ServerProps> {
  if (!url || Array.isArray(url)) return { error: `Invalid URL: ${url}` }
  
  const game = await getGame(url)
  if (!game) return { error: 'Unable to find game' }
  
  const { players, packs, ...options } = game
  const player = await getPlayer(sessionId, players)

  const playerSlots = players.filter(({ sessionId }) => !sessionId).map(({ id }) => id)
  return { options, players, packs, player, playerSlots }
}

export function serverSideHandler(ctx: GetServerSidePropsContext): Promise<ServerProps> {
  return getGameProps(ctx.query.url, getCtxSessionId(ctx))
}

export async function apiHandler(req: NextApiRequest, res: NextApiResponse<Omit<ServerProps, 'error'>>) {
  const props = await getGameProps(req.query.url, getReqSessionId(req, res))
  if (props.error) return res.status(400).end()

  res.status(200).json(props)
}
