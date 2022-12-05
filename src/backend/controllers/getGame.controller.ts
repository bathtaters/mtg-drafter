import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import type { ServerProps, PlayerFull, ServerSuccess } from 'types/game'
import { getGame } from '../services/game/game.services'
import { getPlayer } from '../services/game/player.services'
import { getCtxSessionId, getReqSessionId } from 'components/base/services/sessionId.services'
import validation from 'types/game.validation'

async function getGameProps(url: string | string[] | undefined, sessionId: string, throwOnNoPlayer: boolean = false): Promise<ServerProps> {
  if (!url || Array.isArray(url)) return { error: `Invalid URL: ${url}` }
  
  const game = await getGame(url)
  if (!game) return { error: 'Unable to find game' }
  
  const { players, packs, ...options } = game
  const player = await getPlayer(sessionId, players) as PlayerFull | null // Convert type JSON value -> BasicLands
  if (throwOnNoPlayer && !player) return { error: 'You are not registered for this game' }

  const playerSlots = players.filter(({ sessionId }) => !sessionId).map(({ id }) => id)
  return { options, players, packs, player, playerSlots, sessionId }
}

export function serverSideHandler(ctx: GetServerSidePropsContext) {
  const url = validation.url.parse(ctx.query.url)
  return getGameProps(url, getCtxSessionId(ctx))
}

export async function apiHandler(req: NextApiRequest, res: NextApiResponse<ServerSuccess>) {
  const url = validation.url.parse(req.query.url)
  const props = await getGameProps(url, getReqSessionId(req, res), true)
  if (props.error) {
    console.error('Error with game',url,'player',getReqSessionId(req,res),props.error)
    return res.status(400).end()
  }

  res.status(200).json(props as ServerSuccess)
}
