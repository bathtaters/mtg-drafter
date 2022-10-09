import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import nookies, { parseCookies, setCookie } from 'nookies'
import { nanoid } from 'nanoid'

const sessionIdKey = 'sessionId'
const cookieOptions = Object.freeze({
  expires: new Date(2149563600000), // Expires in 2038 @ epoch
  httpOnly: true,
  sameSite: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
})

export const getCtxSessionId = (ctx: GetServerSidePropsContext) => {
  let sessionId = nookies.get(ctx).sessionId
  if (sessionId) return sessionId

  sessionId = nanoid()
  nookies.set(ctx, sessionIdKey, sessionId, cookieOptions)
  return sessionId
}

export const getReqSessionId = (req: NextApiRequest, res: NextApiResponse) => {
  let sessionId = parseCookies({ req }).sessionId
  if (sessionId) return sessionId

  sessionId = nanoid()
  setCookie({ res }, sessionIdKey, sessionId, cookieOptions)
  return sessionId
}
