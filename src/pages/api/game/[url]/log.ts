import type { NextApiRequest, NextApiResponse } from 'next'
import type { LogFull } from 'types/game'
import getLog from 'backend/controllers/getLog.controller'

/** /game/[url]/log Endpoint
 * @param offset {Number?} Optional index from the end of the log to return from (If missing, returns the latest [logPageSize] entries)
 * @param logPageSize {Number} Set in constants.ts, the maximum possible size of log to return
 * @returns {LogFull} - { log: list of Log Entries, offset: input param, total: total count of Log Entries }
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<LogFull | null>) {
  return getLog(req, res)
}
