import type { NextApiRequest, NextApiResponse } from "next";
import type { ServerProps } from "types/game";
import { apiHandler } from "backend/controllers/getGame.controller";
import { withMetrics } from "backend/libs/metrics";

function handler(req: NextApiRequest, res: NextApiResponse<ServerProps>) {
  return apiHandler(req, res);
}

export default withMetrics("/api/game/[url]/all", handler);
