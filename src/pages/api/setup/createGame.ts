import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: string }>
) {
  // Take form data & create new game
  res.status(200).json({ id: '_TEST' })
}
