import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import client from "prom-client";

type Metrics = {
  registry: client.Registry;
  httpDuration: client.Histogram<string>;
  httpTotal: client.Counter<string>;
  socketActive: client.Gauge<string>;
  socketTotal: client.Counter<string>;
  activeGames: client.Gauge<string>;
  draftsStarted: client.Counter<string>;
  picksMade: client.Counter<string>;
};

declare global {
  var __metrics: Metrics | undefined;
}

function build(): Metrics {
  const registry = new client.Registry();
  registry.setDefaultLabels({ app: "mtg-drafter" });
  client.collectDefaultMetrics({ register: registry });

  const httpDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status"],
    buckets: [0.01, 0.05, 0.1, 0.3, 1, 3, 10],
    registers: [registry],
  });

  const httpTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total HTTP requests",
    labelNames: ["method", "route", "status"],
    registers: [registry],
  });

  const socketActive = new client.Gauge({
    name: "socket_connections_active",
    help: "Active Socket.io connections",
    labelNames: ["namespace"],
    registers: [registry],
  });

  const socketTotal = new client.Counter({
    name: "socket_connections_total",
    help: "Total Socket.io connections opened",
    labelNames: ["namespace"],
    registers: [registry],
  });

  const activeGames = new client.Gauge({
    name: "active_games",
    help: "Games currently in progress (round > 0)",
    registers: [registry],
    async collect() {
      try {
        const prisma = (await import("./db")).default;
        const count = await prisma.game.count({ where: { round: { gt: 0 } } });
        this.set(count);
      } catch {
        // Avoid breaking scrapes if DB is unavailable
      }
    },
  });

  const draftsStarted = new client.Counter({
    name: "drafts_started_total",
    help: "Drafts created via setup endpoints",
    labelNames: ["kind"],
    registers: [registry],
  });

  const picksMade = new client.Counter({
    name: "picks_made_total",
    help: "Card picks made (human + bot)",
    labelNames: ["actor"],
    registers: [registry],
  });

  return {
    registry,
    httpDuration,
    httpTotal,
    socketActive,
    socketTotal,
    activeGames,
    draftsStarted,
    picksMade,
  };
}

export const metrics: Metrics = globalThis.__metrics ?? build();
if (process.env.NODE_ENV !== "production") globalThis.__metrics = metrics;

export function withMetrics(
  routeLabel: string,
  handler: NextApiHandler,
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method ?? "UNKNOWN";
    const end = metrics.httpDuration.startTimer({ method, route: routeLabel });
    try {
      await handler(req, res);
    } finally {
      const status = String(res.statusCode);
      end({ status });
      metrics.httpTotal.inc({ method, route: routeLabel, status });
    }
  };
}
