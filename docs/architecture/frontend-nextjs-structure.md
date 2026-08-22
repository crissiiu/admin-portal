# Frontend Next.js Structure Cho Sales Builder

Tài liệu này là chuẩn tham chiếu cho frontend của Sales Builder. Mục tiêu là xây dựng storefront bán hàng, khu vực tài khoản khách hàng và admin dashboard theo cấu trúc dễ mở rộng.

## Mục Tiêu Kiến Trúc

- Tách rõ storefront public, customer account và admin dashboard.
- Không để component gọi API tùy tiện; data access đi qua client/query/action được kiểm soát.
- Chuẩn hóa auth, permission, error, loading, cache và form validation.
- Giữ domain bán hàng theo các module rõ ràng: catalog, cart, checkout, orders, customers, content.
- Hỗ trợ phát triển dần từ một app hiện có sang nhiều surface nếu cần.

## Repository Structure Đề Xuất

```txt
sales-builder/
+- apps/
|  +- storefront/
|  |  +- src/
|  |     +- app/
|  |     +- features/
|  |     +- entities/
|  |     +- widgets/
|  |     +- shared/
|  |     +- config/
|  |
|  +- admin-web/
|
+- packages/
|  +- ui/
|  +- design-tokens/
|  +- api-contracts/
|  +- auth-contracts/
|  +- eslint-config/
|  +- typescript-config/
|  +- test-utils/
|  +- telemetry/
|  +- feature-flags/
|
+- services/
+- infra/
+- docs/
```

Giai đoạn hiện tại repo vẫn còn `apps/candidate-web`. Không cần đổi thư mục ngay nếu việc đó làm vỡ import; nên tạo branch refactor riêng để đổi sang `apps/storefront`.

## App-Level Structure

```txt
apps/storefront/src/
+- app/
|  +- (storefront)/
|  |  +- page.tsx
|  |  +- products/
|  |  +- categories/
|  |  +- collections/
|  |
|  +- (auth)/
|  |  +- sign-in/
|  |  +- sign-up/
|  |
|  +- (account)/
|  |  +- account/
|  |  +- orders/
|  |
|  +- (checkout)/
|  |  +- cart/
|  |  +- checkout/
|  |
|  +- admin/
|  |  +- products/
|  |  +- orders/
|  |  +- customers/
|  |  +- discounts/
|  |  +- content/
|  |  +- settings/
|  |
|  +- layout.tsx
|  +- global-error.tsx
|  +- not-found.tsx
|
+- features/
|  +- auth/
|  +- product-search/
|  +- product-detail/
|  +- cart/
|  +- checkout/
|  +- order-management/
|  +- account-profile/
|  +- admin-product-editor/
|  +- admin-order-workflow/
|  +- content-management/
|
+- entities/
|  +- product/
|  +- category/
|  +- collection/
|  +- cart/
|  +- order/
|  +- customer/
|  +- discount/
|  +- cms-page/
|
+- widgets/
|  +- app-header/
|  +- storefront-footer/
|  +- product-grid/
|  +- cart-drawer/
|  +- account-shell/
|  +- admin-shell/
|
+- shared/
|  +- api/
|  +- auth/
|  +- cache/
|  +- errors/
|  +- providers/
|  +- styles/
|  +- types/
|  +- utils/
|
+- config/
   +- env.ts
   +- routes.ts
   +- runtime.ts
   +- app-metadata.ts
```

## Layer Ownership

`app`

- Chỉ chứa routing, layouts, route groups, server components và metadata.
- Không chứa business logic phức tạp.

`features`

- Chứa use case người dùng: search product, add to cart, checkout, update account, manage order.
- Có thể dùng nhiều `entities`.
- Chứa component, action, schema, query, mutation, state cục bộ của feature.

`entities`

- Đại diện cho domain object: product, cart, order, customer, discount.
- Chứa type, mapper, model helper và UI nhỏ gắn với entity.
- Không import ngược từ `features`.

`widgets`

- Composition cấp page/section: header, product grid, cart drawer, admin shell.
- Ghép `features`, `entities` và `shared/ui`.

`shared`

- Code app-level dùng chung nhưng chưa đáng đưa lên package.
- Không import từ `features`, `entities`, `widgets` hoặc `app`.

`packages`

- Code dùng chung giữa nhiều app hoặc service.
- Chỉ đưa code lên đây khi thật sự dùng lại hoặc là platform concern.

## Import Rules

Luồng import nên đi một chiều:

```txt
app -> widgets -> features -> entities -> shared -> packages
```

Quy tắc:

- `shared` không import `features`, `entities`, `widgets`, `app`.
- `entities` không import `features`.
- API clients chỉ dùng ở server layer hoặc qua action/query layer được kiểm soát.
- DTO backend phải được map sang frontend model trước khi render UI phức tạp.

## API Boundary

Frontend nên gọi API Gateway/BFF hoặc typed clients:

```txt
shared/api/
+- http-client.ts
+- clients/
|  +- auth.client.ts
|  +- product.client.ts
|  +- cart.client.ts
|  +- checkout.client.ts
|  +- order.client.ts
|  +- customer.client.ts
|  +- content.client.ts
+- contracts/
   +- pagination.ts
   +- problem-details.ts
```

Không gọi trực tiếp nhiều service rải rác trong component.

## Auth Và Permission

```txt
shared/auth/
+- session.server.ts
+- current-user.server.ts
+- permissions.ts
+- auth-guards.ts
+- route-policies.ts
```

Quy tắc:

- Public register chỉ tạo `customer`.
- `staff` và `admin` do admin tạo hoặc seed.
- Permission dựa trên capability, không rải `role === "admin"` khắp code.
- Customer chỉ xem/sửa dữ liệu của mình.
- Admin/staff route phải đi qua guard tập trung.

## UI Và UX

- Storefront ưu tiên sản phẩm, hình ảnh, giá, trạng thái còn hàng và CTA mua hàng.
- Admin dashboard ưu tiên thao tác nhanh, bảng dữ liệu rõ, filter/search và bulk action khi cần.
- Cart/checkout phải tối ưu mobile.
- Mọi form quan trọng có loading, success, error, validation state.
- Không để text, button hoặc card bị vỡ layout trên mobile.

## Testing Strategy

Test tối thiểu:

- Unit test: mapper, schema, format price, permission helper.
- Component test: product card, cart item, checkout form, admin product form.
- Integration test: add to cart, checkout, order status update.
- E2E smoke test: login, browse product, add to cart, checkout, admin update order.

## Recommended Initial Implementation

1. Giữ app hiện có nhưng đổi định hướng thành storefront.
2. Chuẩn hóa route config theo product/cart/checkout/account/admin.
3. Tạo `shared/auth` mới theo role `guest`, `customer`, `staff`, `admin`.
4. Tạo entity đầu tiên: `product`, `cart`, `order`, `customer`.
5. Tạo feature đầu tiên: `product-search`, `product-detail`, `cart`, `checkout`.
6. Tạo admin shell và product management sau khi catalog model ổn định.
