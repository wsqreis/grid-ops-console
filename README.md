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

