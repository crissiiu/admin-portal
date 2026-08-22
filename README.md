# Sales Builder

Monorepo cho website bán hàng/e-commerce. Mục tiêu của dự án là xây dựng một nền tảng có thể bán sản phẩm online, quản lý nội dung storefront, sản phẩm, giỏ hàng, đơn hàng, khách hàng và vận hành bán hàng cơ bản.

Kế hoạch xây dựng chính nằm trong `PROJECT_BUILD_FLOW.md`.

Cấu trúc kỹ thuật hiện tại:

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
