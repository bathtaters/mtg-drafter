# mtg-drafter v2

Mtg multi-player draft server
Server created in Next.JS using Prisma w/ CockroachDB, Sockets.IO & Tailwind w/ Daisy.UI
Card/Set database info from MTGJSON - Images from Scryfall

Also see [mtg-drafter-mcp](https://github.com/bathtaters/mtg-drafter-mcp) for an MCP server that can interact with this app's database.

Online at https://www.mtg-drafter.com/

## Grafana / Prometheus metrics

The server exposes Prometheus metrics at `/api/metrics` (HTTP counts/durations, active socket connections, active games, drafts started, picks made, plus default Node.js process metrics).

### 1. Enable the endpoint

Set `METRICS_TOKEN` in your `.env` to a random secret. If unset, `/api/metrics` returns 401.

```
METRICS_TOKEN=<random-secret>
```

### 2. Scrape with Prometheus

Add a job to `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: mtg-drafter
    metrics_path: /api/metrics
    scheme: https
    authorization:
      type: Bearer
      credentials: <METRICS_TOKEN>
    static_configs:
      - targets: ["your-host:443"]
```

### 3. Import the Grafana dashboard

In Grafana: **Dashboards → New → Import**, upload [mtg-drafter-grafana.json](mtg-drafter-grafana.json), and select your Prometheus data source when prompted.
