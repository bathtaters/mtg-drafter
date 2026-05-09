import type { NextApiRequest, NextApiResponse } from "next";
import { metrics } from "backend/libs/metrics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const expected = process.env.METRICS_TOKEN;
  if (!expected) return res.status(401).end();
  if (req.headers.authorization !== `Bearer ${expected}`)
    return res.status(401).end();

  res.setHeader("Content-Type", metrics.registry.contentType);
  res.status(200).send(await metrics.registry.metrics());
}
