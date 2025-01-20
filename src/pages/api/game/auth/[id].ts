import type { NextApiRequest, NextApiResponse } from 'next'
import { LogAuthResponse } from 'types/game'
import checkPass from 'backend/controllers/checkPass.controller'

export default async function handler(req: NextApiRequest, res: NextApiResponse<LogAuthResponse>) {
  const message = await checkPass(req, res)
  res.status(200).json({ success: !message, message })
}
