# Job Portal

Backend/CMS monorepo for the job portal project.

The backend is structured from `docs/architecture/backend-microservice-structure.md`:

- `services/*` contains independently buildable microservices.
- `packages/*` contains shared technical packages only.
- `infra/local` contains local development infrastructure.

## Commands

```bash
pnpm install
pnpm build
pnpm test
pnpm dev
```

All dependencies are pinned to exact versions.
