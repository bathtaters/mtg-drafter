import type { IncomingMessage } from 'http'
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import nookies, { parseCookies, setCookie } from 'nookies'
import { nanoid } from 'nanoid'
import gameData from 'types/game.validation'

const sessionIdKey = 'sessionId'
const cookieOptions = Object.freeze({
  expires: new Date(2149563600000), // Expires in 2038 @ epoch
  httpOnly: true,
  sameSite: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
})

const validateSessionId = (sessionId: string) => {
  const parsed = gameData.session.safeParse(sessionId)
  if (parsed.success) return parsed.data
  if (sessionId) console.error(`Invalid sessionID ${JSON.stringify(sessionId)}: ${parsed.error}`)
}

export const getCtxSessionId = (ctx: GetServerSidePropsContext) => {
  let sessionId = validateSessionId(nookies.get(ctx).sessionId)
  if (sessionId) return sessionId

  sessionId = nanoid()
  nookies.set(ctx, sessionIdKey, sessionId, cookieOptions)
  return sessionId
}

export const getReqSessionId = (req: NextApiRequest, res: NextApiResponse) => {
  let sessionId = validateSessionId(parseCookies({ req }).sessionId)
  if (sessionId) return sessionId

  sessionId = nanoid()
  setCookie({ res }, sessionIdKey, sessionId, cookieOptions)
  return sessionId
}

export const getExisitingSessionId = (req: IncomingMessage) => validateSessionId(parseCookies({ req }).sessionId)