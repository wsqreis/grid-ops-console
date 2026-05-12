# Grid Ops Console

Grid Ops Console is a TypeScript monorepo for monitoring distributed energy assets, viewing telemetry, and dispatching flexibility events. It includes a NestJS API, a Vue 3 operations UI, shared domain types, containerized local runtime, and deployment assets for Kubernetes and observability.

## Overview

The project currently provides:

- a fleet overview with asset readiness, available capacity, and response posture
- dispatch event creation and tracking
- telemetry retrieval for individual assets
- a health endpoint and Swagger API docs
- local development with npm workspaces or Docker Compose

## Repository layout

- [apps/api/](apps/api/) — NestJS API for assets, dispatch events, telemetry, health, and Swagger docs
- [apps/web/](apps/web/) — Vue 3 + Vite single-page operations console
- [packages/shared/](packages/shared/) — shared domain types and helper logic used by the API and web app
- [docker-compose.yml](docker-compose.yml) — local multi-service container stack
- [k8s/grid-ops.yml](k8s/grid-ops.yml) — Kubernetes deployment and service manifests
- [observability/](observability/) — local OpenTelemetry collector configuration

## Prerequisites

- Node.js 22 or newer
- npm
- Docker and Docker Compose for the containerized runtime

The repository is currently standardized around Node 24 in CI and Docker images.

## Local development

### Install dependencies

```bash
npm ci
```

### Run both services with npm

```bash
npm run dev
```

This starts:

- API at `http://localhost:4000`
- web app at `http://localhost:5173`

During local web development, Vite proxies `/api` requests to `http://localhost:4000`.

### Run a single workspace

API only:

```bash
npm run dev -w apps/api
```

Web only:

```bash
npm run dev -w apps/web
```

## Docker runtime

Start the full local stack with:

```bash
docker compose up --build
```

This starts three services:

- API on `http://localhost:4000`
- web app on `http://localhost:8080`
- OpenTelemetry collector on `http://localhost:4318`

In the containerized web runtime, nginx proxies `/api/` requests to the API container. The web container serves the SPA on port `8080`.

## Environment variables

The repository includes [.env.example](.env.example):

- `PORT=4000` — API listen port
- `VITE_API_BASE_URL=` — optional base URL override for the web app; when empty, the frontend uses same-origin `/api`
- `OTEL_SERVICE_NAME=grid-ops-api` — OpenTelemetry service name for the API
- `OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318` — OTLP export endpoint

The frontend API client behavior is defined in [apps/web/src/services/api.ts](apps/web/src/services/api.ts). The API bootstrap, validation, and Swagger setup live in [apps/api/src/main.ts](apps/api/src/main.ts).

## Common commands

### Verification

```bash
npm run typecheck
npm run test
npm run build
```

### Workspace-specific tests

Shared package unit tests:

```bash
npm run test -w packages/shared
```

API tests:

```bash
npm run test -w apps/api
```

Web unit tests:

```bash
npm run test -w apps/web
```

Web Playwright smoke test:

```bash
npm run test:e2e -w apps/web
```

Note: the root `npm run test` command does not include the Playwright smoke test.

## Testing

The project uses different test runners by workspace:

- [packages/shared/](packages/shared/) — Vitest for shared helpers and domain logic
- [apps/api/](apps/api/) — Node's built-in test runner with `tsx` for API specs and e2e coverage
- [apps/web/](apps/web/) — Vitest for unit tests and Playwright for browser smoke coverage

Current API test coverage includes service logic and application-level endpoint checks. The browser smoke test exercises the running UI against the live API flow.

## API endpoints and docs

With the API running locally, the main endpoints are available under `/api`:

- `GET /api/health`
- `GET /api/assets`
- `GET /api/assets/summary`
- `GET /api/dispatch-events`
- `POST /api/dispatch-events`
- `GET /api/telemetry/:assetId`
- `POST /api/telemetry`

Swagger docs are available at:

- `http://localhost:4000/api/docs`

## CI and deployment artifacts

The repository includes:

- [`.gitlab-ci.yml`](.gitlab-ci.yml) for the existing GitLab pipeline
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for GitHub Actions parity checks
- [k8s/grid-ops.yml](k8s/grid-ops.yml) for Kubernetes deployment manifests
- [observability/otel-collector.yml](observability/otel-collector.yml) for local trace collection

The GitHub Actions workflow runs:

- `npm ci`
- `npm run typecheck`
- `npm run test`
- `npm run build`

On pushes to `master`, it also validates Docker builds for the API and web images.

## Deployment notes

The Kubernetes manifests currently define:

- API deployment and service
- web deployment and service
- API readiness and liveness probes on `/api/health`
- web readiness probe on `/`

## Troubleshooting

- If the web app cannot reach the API during local npm development, make sure the API is running on port `4000`.
- If the browser smoke test fails locally, ensure the Dockerized web app is available on `http://localhost:8080`.
- If Docker builds fail, confirm the Docker daemon is running and that workspace dependencies install cleanly with `npm ci`.
