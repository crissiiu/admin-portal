# 03. Thiết Kế Role Và Permission

Branch đề xuất: `feature/auth-permission-model`

Tài liệu này xác định những việc hiện tại cần làm để chuẩn hóa role, permission và quyền truy cập route trong Sales Builder. Mục tiêu là có một nơi rõ ràng để check quyền, tránh việc từng module tự viết `role === "admin"` hoặc hard-code permission riêng lẻ.

## Mục Tiêu

- Định nghĩa tập role chính thức: `guest`, `customer`, `staff`, `admin`.
- Tạo danh sách permission theo từng role.
- Xác định route nào public, route nào cần đăng nhập, route nào chỉ dành cho role cụ thể.
- Viết helper check role/permission dùng chung cho storefront, account area, admin dashboard, gateway và service khi cần.
- Đảm bảo các module sau chỉ cần gọi permission helper thay vì tự check role.

## Hiện Trạng Trong Repo

Đang có một số code/tài liệu cũ theo hướng job portal:

- Auth role hiện tại vẫn là `candidate`, `employer`, `admin`.
- Frontend app hiện tại vẫn tên `candidate-web`.
- Cookie session hiện tại là `job_portal_session`.
- Một số permission cũ vẫn là `job.apply`, `profile.update`, `application.read`.

Cần chuyển dần sang domain bán hàng:

- `candidate` -> `customer`
- `employer` -> `staff` hoặc `admin` tùy quyền vận hành
- `job` -> `product`
- `application` -> `order`
- `candidate-web` -> storefront/customer web trong một branch refactor riêng
- `job_portal_session` -> `sales_builder_session`

## Role Chính Thức

```txt
guest
customer
staff
admin
```

Ý nghĩa:

- `guest`: người chưa đăng nhập. Được xem storefront, xem sản phẩm, thêm vào cart tạm thời và bắt đầu checkout guest nếu sản phẩm hỗ trợ.
- `customer`: khách hàng đã đăng nhập. Được quản lý tài khoản, địa chỉ, cart, checkout và xem đơn hàng của mình.
- `staff`: nhân sự vận hành shop. Được quản lý sản phẩm, đơn hàng, tồn kho và nội dung theo quyền được cấp.
- `admin`: chủ shop/quản trị hệ thống. Có toàn quyền cấu hình, quản lý user, staff, sản phẩm, đơn hàng, nội dung, discount và audit log.

Lưu ý: `guest` không nên là role lưu trong database auth user. Đây là role suy diễn khi không có session.

## Permission Đề Xuất

Permission nên đặt theo dạng `resource.action`.

```txt
product.read
product.create
product.update
product.publish
product.delete

category.read
category.manage
collection.read
collection.manage

cart.read_own
cart.update_own

checkout.create

order.create
order.read_own
order.cancel_own
order.read
order.update_status
order.refund

customer.read_own
customer.update_own
customer.read
customer.manage

inventory.read
inventory.update

discount.read
discount.manage

content.read
content.manage

staff.read
staff.manage

settings.read
settings.manage

audit_log.read
admin.access
```

## Permission Theo Role

| Role | Permissions |
| --- | --- |
| `guest` | `product.read`, `category.read`, `collection.read`, `content.read`, `cart.read_own`, `cart.update_own`, `checkout.create`, `order.create` |
| `customer` | Toàn bộ quyền của `guest`, thêm `customer.read_own`, `customer.update_own`, `order.read_own`, `order.cancel_own` |
| `staff` | `product.read`, `product.create`, `product.update`, `product.publish`, `category.read`, `category.manage`, `collection.read`, `collection.manage`, `order.read`, `order.update_status`, `customer.read`, `inventory.read`, `inventory.update`, `discount.read`, `content.read`, `content.manage` |
| `admin` | Tất cả permission, bao gồm `admin.access`, `settings.manage`, `staff.manage`, `customer.manage`, `discount.manage`, `order.refund`, `audit_log.read` |

Quy ước: `admin` có thể được implement bằng wildcard nội bộ hoặc bằng danh sách permission đầy đủ. Nếu dùng wildcard, helper vẫn phải expose kết quả qua `can(role, permission)` để module không cần biết chi tiết.

## Frontend Route Access Matrix

Route storefront đề xuất:

| Route | Access | Role được vào | Permission liên quan | Ghi chú |
| --- | --- | --- | --- | --- |
| `/` | Public | `guest`, `customer`, `staff`, `admin` | `content.read`, `product.read` | Homepage bán hàng |
| `/products` | Public | `guest`, `customer`, `staff`, `admin` | `product.read` | Danh sách sản phẩm |
| `/products/[slug]` | Public | `guest`, `customer`, `staff`, `admin` | `product.read` | Chi tiết sản phẩm |
| `/categories/[slug]` | Public | `guest`, `customer`, `staff`, `admin` | `category.read`, `product.read` | Trang danh mục |
| `/collections/[slug]` | Public | `guest`, `customer`, `staff`, `admin` | `collection.read`, `product.read` | Trang collection |
| `/cart` | Public/session | `guest`, `customer` | `cart.read_own`, `cart.update_own` | Cart cho guest và customer |
| `/checkout` | Public/session | `guest`, `customer` | `checkout.create`, `order.create` | Có thể yêu cầu login nếu muốn checkout bắt buộc tài khoản |
| `/sign-in` | Guest only | `guest` | none | User đã đăng nhập nên redirect về account/admin phù hợp |
| `/sign-up` | Guest only | `guest` | none | Public chỉ tạo được `customer` |
| `/account` | Auth required | `customer` | `customer.read_own` | Trang tài khoản |
| `/account/orders` | Auth required | `customer` | `order.read_own` | Lịch sử đơn hàng |
| `/admin` | Auth required | `staff`, `admin` | `admin.access` hoặc dashboard permission riêng | Dashboard vận hành |
| `/admin/products` | Auth required | `staff`, `admin` | `product.create`, `product.update` | Quản lý sản phẩm |
| `/admin/orders` | Auth required | `staff`, `admin` | `order.read`, `order.update_status` | Quản lý đơn hàng |
| `/admin/customers` | Auth required | `staff`, `admin` | `customer.read` | Quản lý khách hàng |
| `/admin/discounts` | Auth required | `staff`, `admin` | `discount.read`, `discount.manage` | Staff có thể chỉ được read tùy policy |
| `/admin/settings` | Auth required | `admin` | `settings.manage` | Cấu hình shop |
| `/admin/staff` | Auth required | `admin` | `staff.manage` | Quản lý nhân sự |

## Backend API Access Matrix

Endpoint đề xuất cho MVP:

| Endpoint | Access | Role được gọi | Permission |
| --- | --- | --- | --- |
| `POST /auth/register` | Public | `guest` | none |
| `POST /auth/login` | Public | `guest` | none |
| `GET /products` | Public | all | `product.read` |
| `GET /products/:slug` | Public | all | `product.read` |
| `POST /products` | Auth required | `staff`, `admin` | `product.create` |
| `PATCH /products/:id` | Auth required | `staff`, `admin` | `product.update` |
| `POST /products/:id/publish` | Auth required | `staff`, `admin` | `product.publish` |
| `GET /cart` | Session required | `guest`, `customer` | `cart.read_own` |
| `PATCH /cart` | Session required | `guest`, `customer` | `cart.update_own` |
| `POST /checkout` | Session required | `guest`, `customer` | `checkout.create`, `order.create` |
| `GET /orders/me` | Auth required | `customer` | `order.read_own` |
| `GET /orders` | Auth required | `staff`, `admin` | `order.read` |
| `PATCH /orders/:id/status` | Auth required | `staff`, `admin` | `order.update_status` |
| `POST /orders/:id/refund` | Auth required | `admin` | `order.refund` |

Cần làm rõ thêm khi implement:

- Gateway verify JWT và gắn `currentUser`/headers nội bộ trước khi forward.
- Service không tin role từ request body.
- Các rule có chữ `own` phải check ownership ở service sở hữu data, không chỉ check role ở gateway.
- `POST /auth/register` không cho public tạo `staff` hoặc `admin`. Staff/admin creation cần là seed, internal command, hoặc admin-only endpoint riêng.

## Nơi Đặt Code Để Dùng Chung

Để tránh check role rải rác, cần có một module permission trung tâm.

Lựa chọn đề xuất:

```txt
packages/auth-contracts/
+- src/
   +- roles.ts
   +- permissions.ts
   +- role-permissions.ts
   +- route-policies.ts
   +- access-control.ts
```

Nếu chưa tạo package mới trong phase này, có thể đặt tạm trong:

```txt
apps/storefront/src/shared/auth/
+- roles.ts
+- permissions.ts
+- route-policies.ts
+- access-control.ts
```

Nhưng khi backend/gateway cần dùng cùng logic, nên chuyển lên `packages/auth-contracts` để frontend và backend import chung.

## Helper Cần Có

API helper tối thiểu:

```ts
type Role = "guest" | "customer" | "staff" | "admin";
type Permission = string;

function getPermissionsForRole(role: Role): Permission[];
function hasRole(userRole: Role, allowedRoles: Role[]): boolean;
function can(role: Role, permission: Permission): boolean;
function canAny(role: Role, permissions: Permission[]): boolean;
function canAll(role: Role, permissions: Permission[]): boolean;
function assertCan(role: Role, permission: Permission): void;
```

Server/frontend guard nên dùng helper trên:

```ts
await requireSession();
await requireRole(["staff", "admin"]);
await requirePermission("product.update");
```

Không nên làm:

```ts
if (user.role === "admin") {}
if (role !== "staff") {}
```

Ngoại lệ có thể chấp nhận: code nằm chính bên trong `access-control.ts`, migration/seed, hoặc test case của permission helper.

## Việc Cần Làm Trên Branch Này

1. Tạo branch `feature/auth-permission-model`.
2. Định nghĩa `Role` gồm `guest`, `customer`, `staff`, `admin`.
3. Mở rộng permission list thành danh sách chính thức theo tài liệu này.
4. Tạo `ROLE_PERMISSIONS` map role sang permission.
5. Tạo helper access-control dùng chung: `hasRole`, `can`, `canAny`, `canAll`.
6. Tạo route policy cho storefront/account/admin: public routes, guest-only routes, auth-required routes, role-required routes.
7. Cập nhật `auth-guards.ts` để dùng route policy/permission helper.
8. Cập nhật proxy hoặc middleware Next.js nếu đang dùng để redirect route auth.
9. Chuẩn hóa auth-service: public register chỉ tạo `customer`.
10. Thêm authorization middleware cho api-gateway hoặc xác định rõ gateway chỉ verify token, service check ownership.
11. Viết test cho permission helper, route policy, và register role validation.
12. Cập nhật README/tài liệu nếu package auth-contracts được tạo mới.

## Acceptance Criteria

- Có một source of truth cho role và permission.
- Module khác không hard-code role string để quyết định quyền.
- `guest` được xử lý như unauthenticated role, không cần lưu DB.
- Customer route chỉ customer.
- Admin/staff route chỉ staff/admin theo permission.
- Settings/staff management chỉ admin.
- API tạo/sửa sản phẩm không còn public.
- Public register không tạo được staff/admin.
- Test fail nếu permission matrix bị thay đổi sai.

## Phạm Vi Chưa Làm Trong Phase Này

- Chưa cần tạo đầy đủ `role-permission-service` riêng nếu dự án vẫn ở giai đoạn đầu.
- Chưa cần dynamic permission từ database.
- Chưa cần UI quản lý permission chi tiết cho admin.
- Chưa cần ABAC phức tạp. Các rule ownership như `own` xử lý bằng service data check riêng.
