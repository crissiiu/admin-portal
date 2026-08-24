# Sales Builder

Sales Builder là monorepo cho website bán hàng/e-commerce. Mục tiêu của dự án là xây dựng một nền tảng có thể bán sản phẩm online, quản lý nội dung storefront, sản phẩm, giỏ hàng, đơn hàng, khách hàng và vận hành bán hàng cơ bản.

Kế hoạch xây dựng chính nằm trong [PROJECT_BUILD_FLOW.md](./PROJECT_BUILD_FLOW.md). Tài liệu database flow 4 nằm trong [docs/database](./docs/database/README.md).

## Yêu Cầu Môi Trường

- Node.js 22+.
- Corepack bật sẵn để dùng đúng `pnpm@11.22.0`.
- Docker Desktop hoặc Docker Engine.
- Git.

Kiểm tra nhanh:

```bash
node --version
corepack --version
docker --version
docker compose version
```

Nếu chưa bật Corepack:

```bash
corepack enable
```

## Cài Dependencies

```bash
corepack pnpm install
```

Dự án pin package manager trong `package.json`, vì vậy nên dùng `corepack pnpm ...` để tránh lệch phiên bản.

## Setup Biến Môi Trường

Tạo file `.env` từ `.env.example` cho các service hiện có.

PowerShell:

```powershell
Copy-Item services/auth-service/.env.example services/auth-service/.env
Copy-Item services/user-service/.env.example services/user-service/.env
Copy-Item services/job-service/.env.example services/job-service/.env
```

Bash:

```bash
cp services/auth-service/.env.example services/auth-service/.env
cp services/user-service/.env.example services/user-service/.env
cp services/job-service/.env.example services/job-service/.env
```

Database local mặc định:

```txt
User: sales_builder
Password: sales_builder
Host: localhost
Port: 3306
```

Các `DATABASE_URL` chính:

```txt
auth-service: mysql://sales_builder:sales_builder@localhost:3306/sales_builder_auth
user-service: mysql://sales_builder:sales_builder@localhost:3306/sales_builder_user
job-service hiện trỏ product DB: mysql://sales_builder:sales_builder@localhost:3306/sales_builder_product
```

`job-service` vẫn là tên service cũ trong giai đoạn chuyển đổi domain; database của nó đang trỏ sang `sales_builder_product` theo flow 4.

## Setup Database Local

Local infrastructure nằm ở [infra/local/docker-compose.yml](./infra/local/docker-compose.yml). Compose sẽ chạy:

- MySQL 8.4 trên port `3306`.
- Redis trên port `6379`.
- Kafka trên port `9092`.

Khởi động hạ tầng local:

```bash
docker compose -f infra/local/docker-compose.yml up -d
```

Khi MySQL volume mới được tạo, Docker init sẽ tự động:

- Tạo các database `sales_builder_*`.
- Chạy migration SQL đầu tiên của từng service từ `services/*/database/migrations/0001_initial_schema.sql`.

Các database được tạo:

```txt
sales_builder_auth
sales_builder_user
sales_builder_product
sales_builder_catalog
sales_builder_inventory
sales_builder_cart
sales_builder_order
sales_builder_payment
sales_builder_discount
sales_builder_content
sales_builder_audit
```

Kiểm tra database đã được tạo:

```bash
docker compose -f infra/local/docker-compose.yml exec mysql mysql -uroot -proot -e "SHOW DATABASES LIKE 'sales_builder_%';"
```

Kiểm tra số bảng theo từng database:

```bash
docker compose -f infra/local/docker-compose.yml exec mysql mysql -uroot -proot -e "SELECT table_schema, COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema LIKE 'sales_builder_%' GROUP BY table_schema ORDER BY table_schema;"
```

Kết quả mong đợi sau flow 4:

```txt
sales_builder_audit      1
sales_builder_auth       8
sales_builder_cart       2
sales_builder_catalog    3
sales_builder_content    1
sales_builder_discount   1
sales_builder_inventory  1
sales_builder_order      2
sales_builder_payment    1
sales_builder_product    2
sales_builder_user       2
```

## Reset Database Local

MySQL chỉ chạy init scripts khi volume mới được tạo. Nếu đã từng chạy compose và muốn tạo lại database từ đầu:

```bash
docker compose -f infra/local/docker-compose.yml down -v
docker compose -f infra/local/docker-compose.yml up -d mysql
```

Cẩn thận: `down -v` xoá volume database local. Chỉ dùng khi muốn reset dữ liệu local.

## Chạy Project

Chạy tất cả app/service ở chế độ dev:

```bash
corepack pnpm dev
```

Chạy các lệnh kiểm tra:

```bash
corepack pnpm build
corepack pnpm test
corepack pnpm lint
corepack pnpm typecheck
```

Nếu Turbo gặp lỗi không tìm thấy package manager binary trong môi trường local, có thể kiểm tra trực tiếp từng service:

```bash
corepack pnpm --filter @job-portal/auth-service typecheck
corepack pnpm --filter @job-portal/user-service typecheck
corepack pnpm --filter @job-portal/job-service typecheck
```

## Cấu Trúc Chính

- `apps/*`: frontend apps.
- `services/*`: microservices build độc lập.
- `packages/*`: shared technical packages.
- `infra/local`: hạ tầng local bằng Docker Compose.
- `docs/database`: tài liệu schema, migration và checklist database.

## Nguyên Tắc Database Hiện Tại

- Database dùng MySQL 8.x.
- Migration chính thức dùng SQL thuần.
- Schema tách theo service ownership.
- Không tạo foreign key xuyên database/service; relationship xuyên service dùng logical reference.
- Không xoá cứng dữ liệu business ngay khi user/admin bấm xoá.
- Bảng có thể xoá từ UI/API dùng soft delete và retention metadata như `deleted_at`, `delete_requested_at`, `delete_after`.
- Retention mặc định là 30 ngày trước khi cleanup job tương lai được phép xoá vật lý dữ liệu rác.
