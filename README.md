# Grid Ops Console

Grid Ops Console is a real-time control surface for distributed energy assets. It combines a NestJS API, Vue application, typed domain contracts, deployment manifests, and observability hooks for teams that need to monitor telemetry, dispatch flexibility events, and keep operational services healthy.

## Capabilities

- Fleet overview with live operational status, response capacity, and recent telemetry.
- REST APIs for assets, dispatch events, telemetry ingestion, and system health.
- Event scoring that identifies assets with the best available flexibility.
- Automated unit and API tests around dispatch logic and service contracts.
- Container-first local runtime with CI checks and deployment manifests.

## Tech Stack

- TypeScript across the API, web app, and shared contracts.
- NestJS for modular backend services and RESTful endpoints.
- Vue 3 and Vite for a responsive operations UI.
- Docker Compose for local service orchestration.
- Kubernetes manifests for cloud-native deployment.
- OpenTelemetry-ready service structure and health endpoints.

## Quick Start

```bash
npm install
npm run build
npm run test
npm run dev
```

The API runs on `http://localhost:4000` and the web app runs on `http://localhost:5173` during development.

## Runtime

The service can also run as containers:

```bash
docker compose up --build
```

The containerized web app is available at `http://localhost:8080`, with API requests proxied through the web server.

## Delivery

The repository includes:

- GitLab CI checks for type safety, tests, production builds, and container image builds.
- Kubernetes manifests with readiness and liveness probes.
- OpenTelemetry trace export wiring for the API and a collector config for local trace inspection.
