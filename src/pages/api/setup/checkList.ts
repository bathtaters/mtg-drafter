import type { NextApiRequest, NextApiResponse } from 'next'

type ListResponse = {
  accepted: string[], // Card UUIDs
  rejected: string[], // Names
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListResponse>
) {
  // Check that cards exist in database
  res.status(200).json({ accepted: ['a','b','c'], rejected: ['d'] })
}
