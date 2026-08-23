# ADR 0001: Backend Microservice Foundation Cho Sales Builder

Status: Accepted

## Context

Backend nền ban đầu được tạo theo hướng job portal, nhưng mục tiêu sản phẩm đã chuyển sang Sales Builder: một website bán hàng/e-commerce. Một số service và package hiện vẫn giữ tên cũ trong giai đoạn chuyển đổi, nhưng kiến trúc mục tiêu cần xoay sang domain bán hàng.

## Decision

Giữ backend dưới dạng pnpm monorepo với các service có thể build độc lập và shared packages được scope hẹp:

- `services/api-gateway`
- `services/auth-service`
- `services/user-service`
- `services/product-service`
- `services/cart-service`
- `services/checkout-service`
- `services/order-service`
- `services/inventory-service`
- `services/content-service`
- `packages/config`
- `packages/logger`
- `packages/errors`
- `packages/message-bus`

Trong repo hiện tại, `services/job-service` có thể vẫn tồn tại tạm thời cho đến khi có branch refactor đổi sang `product-service`. Mỗi service tuân theo boundary `api`, `application`, `domain`, `infrastructure`, và `shared` từ `docs/architecture/backend-microservice-structure.md`.

## Consequences

Controllers chỉ validate và adapt HTTP requests. Business workflows như quản lý sản phẩm, cart, checkout, order, inventory và content nằm trong use cases. Database và broker implementations nằm sau interface để có thể thay thế mà không đổi domain logic.
