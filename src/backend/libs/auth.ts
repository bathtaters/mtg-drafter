import type { IncomingMessage, ServerResponse } from "http";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { parse, serialize, SerializeOptions } from "cookie";
import { nanoid } from "nanoid";
import gameData from "types/game.validation";

const sessionIdKey = "sessionId";
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

const cookieOptions: SerializeOptions = Object.freeze({
  expires: new Date(Date.now() + ONE_YEAR),
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

const readSessionId = (req: IncomingMessage) =>
  parse(req.headers.cookie ?? "")[sessionIdKey];

const writeSessionId = (res: ServerResponse, sessionId: string) =>
  res.setHeader(
    "Set-Cookie",
    serialize(sessionIdKey, sessionId, cookieOptions)
  );

const validateSessionId = (sessionId: string | undefined) => {
  if (sessionId === undefined) return;
  const parsed = gameData.session.safeParse(sessionId);
  if (parsed.success) return parsed.data;
  if (sessionId)
    console.error(
      `Invalid sessionID ${JSON.stringify(sessionId)}: ${parsed.error}`
    );
};

export const getCtxSessionId = (ctx: GetServerSidePropsContext) => {
  let sessionId = validateSessionId(readSessionId(ctx.req));
  if (!sessionId) sessionId = nanoid();
  writeSessionId(ctx.res, sessionId);
  return sessionId;
};

export const getReqSessionId = (req: NextApiRequest, res: NextApiResponse) => {
  let sessionId = validateSessionId(readSessionId(req));
  if (!sessionId) sessionId = nanoid();
  writeSessionId(res, sessionId);
  return sessionId;
};

export const getExisitingSessionId = (req: IncomingMessage) =>
  validateSessionId(readSessionId(req));
