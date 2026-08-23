# Backend Microservice Structure Cho Sales Builder

Tài liệu này là chuẩn tham chiếu cho backend của Sales Builder. Mục tiêu là xây dựng nền tảng bán hàng/e-commerce có service boundary rõ ràng, dễ test, dễ mở rộng và không trộn business logic vào controller.

## Mục Tiêu Kiến Trúc

- Tách backend theo business capability của bán hàng.
- Mỗi service có thể build, test và deploy độc lập.
- Không để service này đọc trực tiếp database của service khác.
- Giữ logic nghiệp vụ trong `application` và `domain`, không nằm trong `api/controller`.
- Chuẩn hóa auth, permission, validation, logging, error handling và event.
- Hỗ trợ phát triển dần từ các service hiện có sang domain e-commerce.

## Repository Structure Đề Xuất

```txt
sales-builder/
+- apps/
|  +- storefront/
|  +- admin-web/
|
+- services/
|  +- api-gateway/
|  +- auth-service/
|  +- user-service/
|  +- product-service/
|  +- catalog-service/
|  +- cart-service/
|  +- checkout-service/
|  +- order-service/
|  +- inventory-service/
|  +- payment-service/
|  +- shipping-service/
|  +- discount-service/
|  +- content-service/
|  +- notification-service/
|  +- audit-log-service/
|  +- file-storage-service/
|
+- packages/
|  +- config/
|  +- logger/
|  +- errors/
|  +- validation/
|  +- http/
|  +- auth-contracts/
|  +- product-contracts/
|  +- order-contracts/
|  +- commerce-contracts/
|  +- message-bus/
|
+- infra/
|  +- local/
|  +- docker/
|  +- k8s/
|
+- docs/
```

Giai đoạn hiện tại repo vẫn còn `job-service`. Không cần đổi tên service ngay trong cùng branch tài liệu; nên có branch refactor riêng để đổi `job-service` thành `product-service` hoặc tạo service mới và migrate dần.

## Standard Service Structure

```txt
services/{service-name}/
+- src/
|  +- main.ts
|  +- app.ts
|  |
|  +- api/
|  |  +- routes.ts
|  |  +- controller.ts
|  |  +- request.schema.ts
|  |  +- response.dto.ts
|  |  +- middleware.ts
|  |
|  +- application/
|  |  +- use-cases/
|  |  +- services/
|  |  +- ports/
|  |
|  +- domain/
|  |  +- entities/
|  |  +- value-objects/
|  |  +- repositories/
|  |  +- events/
|  |  +- errors/
|  |
|  +- infrastructure/
|  |  +- database/
|  |  +- repositories/
|  |  +- message-bus/
|  |  +- external-clients/
|  |  +- mappers/
|  |
|  +- jobs/
|  |  +- consumers/
|  |  +- processors/
|  |
|  +- shared/
|     +- config/
|     +- logger/
|     +- errors/
|     +- health/
|     +- utils/
|
+- prisma/
+- Dockerfile
+- package.json
+- tsconfig.json
+- .env.example
+- README.md
```

## Layer Responsibilities

`api`

- Nhận request HTTP.
- Validate request.
- Chuyển request thành input cho use case.
- Trả response DTO.
- Không chứa business logic phức tạp.

`application`

- Chứa use case chính: create product, add to cart, checkout, update order status.
- Điều phối repository, event publisher và external client thông qua port.

`domain`

- Chứa entity, value object, domain event, repository interface và domain error.
- Không phụ thuộc Express, Prisma, Kafka, Redis hoặc framework cụ thể.

`infrastructure`

- Chứa implementation database, message broker, external API và mapper persistence.

`jobs`

- Chứa consumer, queue processor, retry task hoặc scheduled task.

`shared`

- Helper nội bộ của service. Nếu dùng chung nhiều service, cân nhắc đưa lên `packages`.

## Service Responsibilities

### api-gateway

- Route request tới service nội bộ.
- Verify JWT.
- Áp dụng rate limit.
- Handle CORS.
- Gắn request ID.
- Normalize gateway-level errors.
- Không chứa business logic của product, cart, order hoặc payment.

### auth-service

- Register.
- Login.
- Logout.
- Refresh token.
- Forgot/reset password.
- Session management.
- Role mặc định public register là `customer`.

### user-service

- Customer profile.
- Staff/admin profile.
- Address book.
- User settings.
- User status: active, blocked, deleted.

### product-service

- Product CRUD.
- Product variant.
- Product media metadata.
- Product status: draft, active, archived.
- Product price snapshot source.

### catalog-service

- Category.
- Collection.
- Product placement in category/collection.
- Slug and public catalog navigation.

### cart-service

- Guest cart.
- Customer cart.
- Cart item.
- Cart merge after login.
- Cart validation against product/inventory.

### checkout-service

- Checkout session.
- Shipping address validation.
- Discount calculation coordination.
- Convert cart to order.

### order-service

- Order.
- Order item snapshot.
- Order status lifecycle.
- Customer order history.
- Admin order management.

### inventory-service

- Stock by product variant.
- Reserve/release stock.
- Reduce stock after confirmed order.
- Low-stock alerts.

### payment-service

- Payment intent.
- Payment transaction.
- Refund.
- Payment provider webhook.

### shipping-service

- Shipping method.
- Shipping fee estimate.
- Shipment tracking.
- Delivery status.

### discount-service

- Discount code.
- Promotion rule.
- Usage limit.
- Validity window.

### content-service

- CMS page.
- Homepage section.
- Banner/hero content.
- Policy pages.
- SEO metadata.

### notification-service

- Order confirmation notification.
- Order status notification.
- Admin new order notification.
- Email/SMS/push integration later.

### audit-log-service

- Audit log for admin/staff actions.
- Security-sensitive event tracking.
- Order status change history.

### file-storage-service

- Product image upload.
- CMS media upload.
- File metadata.
- Scan result and file access policy.

## Data Ownership Rules

Mỗi service sở hữu dữ liệu của chính nó:

```txt
auth-service owns auth_users, sessions, refresh_tokens
user-service owns customers, addresses, user_settings
product-service owns products, product_variants, product_media
catalog-service owns categories, collections, catalog_placements
cart-service owns carts, cart_items
checkout-service owns checkout_sessions
order-service owns orders, order_items, order_status_history
inventory-service owns inventory_items, stock_movements
payment-service owns payments, refunds, payment_webhooks
shipping-service owns shipping_methods, shipments
discount-service owns discount_codes, promotion_rules, discount_usages
content-service owns cms_pages, cms_blocks, seo_metadata
notification-service owns notifications, delivery_attempts
audit-log-service owns audit_logs
file-storage-service owns files, file_scan_results
```

Quy tắc:

- Service chỉ ghi database do nó sở hữu.
- Không join SQL trực tiếp qua database của service khác.
- Nếu cần dữ liệu service khác, dùng internal API hoặc consume event để tạo read model/cache cục bộ.
- Các snapshot quan trọng như order item name/price phải được lưu trong `order-service` tại thời điểm đặt hàng.

## Communication Rules

Dùng synchronous API cho command/query cần kết quả ngay:

```txt
Storefront -> api-gateway -> product-service
Storefront -> api-gateway -> cart-service
Storefront -> api-gateway -> checkout-service
Admin -> api-gateway -> order-service
```

Dùng event bất đồng bộ cho side effect:

```txt
order.created.v1 -> inventory-service reserves/reduces stock
order.created.v1 -> notification-service sends confirmation
order.status_changed.v1 -> notification-service notifies customer
product.published.v1 -> search/catalog read model updates
payment.succeeded.v1 -> order-service marks order paid
```

## Standard Events

```txt
user.registered.v1
product.created.v1
product.updated.v1
product.published.v1
cart.updated.v1
checkout.completed.v1
order.created.v1
order.status_changed.v1
inventory.stock_changed.v1
payment.succeeded.v1
payment.failed.v1
payment.refunded.v1
discount.created.v1
content.page_published.v1
notification.sent.v1
```

## Current Repository Migration Plan

Hiện tại repo vẫn có nhiều tên và service theo hướng job portal. Kế hoạch migrate:

1. Cập nhật tài liệu, README và root package name sang Sales Builder.
2. Chuyển role/permission sang `guest`, `customer`, `staff`, `admin`.
3. Refactor frontend route/domain từ job sang product/cart/checkout/order.
4. Đổi `apps/candidate-web` thành `apps/storefront` trong branch riêng.
5. Đổi hoặc thay thế `job-service` bằng `product-service`.
6. Thêm `cart-service`, `checkout-service`, `order-service`.
7. Thêm `inventory-service`, `discount-service`, `content-service`.
8. Cập nhật package scope từ `@job-portal/*` sang scope mới nếu cần, sau khi code domain đã ổn định.

## Coding Checklist

Trước khi thêm backend code:

1. Chức năng này thuộc service hiện có nào?
2. Nếu chưa thuộc service nào, nó có phải một business capability mới không?
3. File mới có đang nằm đúng layer không?
4. Controller có đang bị nhồi business logic không?
5. Database access đã đi qua repository interface chưa?
6. Service có đang đọc trực tiếp database của service khác không?
7. Code dùng chung có thật sự cần đưa vào packages không?
8. Request validation đã có chưa?
9. Error handling đã thống nhất chưa?
10. Logging, health check và request ID đã được cân nhắc chưa?
11. Có cần unit test, integration test hoặc contract test không?
12. Nếu có event mới, tên event đã có version chưa?
13. Nếu gọi service khác, đã dùng API/client/port rõ ràng chưa?
14. Thay đổi này có phá ownership dữ liệu của service nào không?

## Những Điều Không Nên Làm

- Không đặt business logic trong controller.
- Không import Prisma client của service khác.
- Không để `api-gateway` chứa logic tính giá, checkout hoặc order lifecycle.
- Không tính tổng tiền order chỉ ở frontend.
- Không tin price/stock từ request client.
- Không tạo order mà không lưu snapshot sản phẩm/giá.
- Không public endpoint quản trị sản phẩm/đơn hàng.
- Không bỏ qua ownership check cho customer order.
