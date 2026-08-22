# ADR 0001: Backend Microservice Foundation

Status: Accepted

## Context

The previous backend mixed route handlers, database access, file upload, Kafka producers, and utility code inside service-local controllers and a `utils` service.

## Decision

Rebuild the backend as a pnpm monorepo with independently buildable services and narrowly scoped shared packages:

- `services/api-gateway`
- `services/auth-service`
- `services/user-service`
- `services/job-service`
- `packages/config`
- `packages/logger`
- `packages/errors`
- `packages/message-bus`

Each service follows `api`, `application`, `domain`, `infrastructure`, and `shared` boundaries from `docs/architecture/backend-microservice-structure.md`.

## Consequences

Controllers validate and adapt HTTP requests only. Business workflows live in use cases. Database and broker implementations sit behind interfaces and can be replaced without changing domain logic.
