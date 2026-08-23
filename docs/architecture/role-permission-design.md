# 03. Thiết Kế Role Và Permission

Branch đề xuất: `feature/auth-permission-model`

Tài liệu này xác định mô hình role, permission, quyền truy cập route và ranh giới dữ liệu cho Sales Builder. Sales Builder không chỉ là một website bán hàng đơn lẻ, mà là nền tảng multi-tenant cho nhiều doanh nghiệp bán hàng. Mỗi doanh nghiệp có website riêng, nhân sự riêng, khách hàng riêng, bộ dịch vụ đã mua riêng và giao diện riêng.

## Kết Luận Rà Soát Yêu Cầu Hiện Tại

Tài liệu cũ mới đáp ứng mức RBAC cơ bản cho một shop đơn lẻ:

- Có `guest`, `customer`, `staff`, `admin`.
- Có permission theo `resource.action`.
- Có route matrix cho storefront/account/admin.

Tài liệu cũ chưa đáp ứng đủ các yêu cầu mới:

- Chưa phân biệt admin nền tảng Sales Builder với admin của từng doanh nghiệp.
- Chưa có nhiều cấp admin, trong đó quyền cao nhất là sở hữu toàn bộ hệ thống.
- Chưa có nhiều loại nhân viên như bán hàng, sửa chữa, quản lý kho, nhân sự.
- Chưa tách khách hàng vãng lai và khách hàng thân thiết.
- Chưa mô hình hóa doanh nghiệp/tenant, dịch vụ đã mua, domain/subdomain và theme/template riêng.
- Chưa có policy kiểm tra quyền theo dịch vụ đã kích hoạt, ví dụ doanh nghiệp chỉ dùng được module sửa chữa khi đã mua dịch vụ sửa chữa.

Vì vậy mô hình chính thức bên dưới mở rộng từ RBAC đơn giản sang RBAC theo tenant, có thêm service entitlement và ownership check.

## Nguyên Tắc Thiết Kế

- `guest` là trạng thái suy diễn khi không có session, không lưu như role trong database user.
- Người dùng đăng nhập có thể có nhiều membership ở nhiều doanh nghiệp khác nhau.
- Permission phải luôn được kiểm tra theo ngữ cảnh `tenantId`, trừ nhóm quản trị nền tảng.
- Quyền truy cập tính năng phụ thuộc vào cả role/permission và dịch vụ doanh nghiệp đã mua.
- Không hard-code `role === "admin"` trong module nghiệp vụ; mọi nơi dùng helper tập trung.
- Các quyền có hậu tố `_own` phải check ownership ở service sở hữu dữ liệu.
- Platform admin không được mặc định can thiệp dữ liệu doanh nghiệp nếu không có quyền hỗ trợ/vận hành được audit rõ ràng.

## Mô Hình Đối Tượng

```txt
Platform
+- platform users
+- platform roles
+- service catalog
+- subscription/package
+- tenant provisioning

Tenant / Business
+- tenant admins
+- staff
+- customers
+- loyalty customers
+- purchased services
+- storefront theme
+- subdomain/custom domain
```

Khái niệm chính:

- `tenant`: một doanh nghiệp bán hàng sử dụng Sales Builder.
- `platform_user`: người thuộc đội vận hành Sales Builder.
- `tenant_user`: người thuộc một doanh nghiệp cụ thể, gồm admin và nhân viên.
- `customer`: khách hàng mua hàng tại website của một tenant.
- `service_entitlement`: dịch vụ/module mà tenant đã mua và đang được phép dùng.
- `tenant_theme`: cấu hình giao diện của tenant như màu sắc, template, logo, font, layout.
- `tenant_domain`: subdomain hoặc custom domain trỏ tới storefront của tenant.

Ví dụ URL tenant:

```txt
doanhnghiep1.sales-builder.com/home
doanhnghiep2.sales-builder.com/products
shop-a.example.com
```

## Role Chính Thức

### Platform Roles

Các role này thuộc Sales Builder, không thuộc doanh nghiệp bán hàng.

```txt
platform_owner
platform_admin
platform_sales_admin
platform_support
platform_billing
```

Ý nghĩa:

- `platform_owner`: quyền cao nhất, sở hữu toàn bộ nền tảng, quản lý platform admin, service catalog, billing, tenant provisioning và audit cấp hệ thống.
- `platform_admin`: quản trị vận hành nền tảng, tạo/khóa tenant, cấu hình dịch vụ, hỗ trợ kỹ thuật.
- `platform_sales_admin`: admin cấp cao tham gia bán dịch vụ cho doanh nghiệp; được tạo tenant, xem gói dịch vụ, gán/mở dịch vụ theo hợp đồng và quản lý pipeline bán dịch vụ.
- `platform_support`: hỗ trợ kỹ thuật, được xem thông tin tenant cần thiết và thao tác hỗ trợ có audit, không có quyền billing/service catalog nếu không được cấp.
- `platform_billing`: quản lý hóa đơn, gói dịch vụ, trạng thái thanh toán và gia hạn.

### Tenant Admin Roles

Các role này thuộc từng doanh nghiệp.

```txt
tenant_owner
tenant_admin
tenant_manager
tenant_theme_admin
```

Ý nghĩa:

- `tenant_owner`: chủ doanh nghiệp, toàn quyền trong tenant, quản lý admin, nhân viên, dịch vụ đã mua, cấu hình website và dữ liệu bán hàng.
- `tenant_admin`: quản trị doanh nghiệp, có quyền vận hành mạnh nhưng không được chuyển quyền sở hữu hoặc đóng tenant.
- `tenant_manager`: quản lý vận hành theo phạm vi được cấp, thường dùng cho quản lý bán hàng/kho/dịch vụ.
- `tenant_theme_admin`: quản lý giao diện website như template, màu sắc, logo, banner, trang nội dung.

### Staff Roles

Các role nhân viên có quyền theo nghiệp vụ cụ thể.

```txt
sales_staff
repair_staff
inventory_staff
hr_staff
content_staff
support_staff
finance_staff
```

Ý nghĩa:

- `sales_staff`: tư vấn bán hàng, tạo/cập nhật đơn, xem khách hàng liên quan đến bán hàng.
- `repair_staff`: tiếp nhận, xử lý và cập nhật phiếu sửa chữa/bảo hành nếu tenant đã mua dịch vụ sửa chữa.
- `inventory_staff`: quản lý tồn kho, nhập/xuất kho, kiểm kho.
- `hr_staff`: quản lý hồ sơ nhân sự nội bộ của tenant nếu tenant dùng module nhân sự.
- `content_staff`: quản lý nội dung storefront, banner, bài viết, trang tĩnh.
- `support_staff`: chăm sóc khách hàng, ticket, khiếu nại.
- `finance_staff`: xem thanh toán, đối soát, hoàn tiền theo giới hạn được cấp.

### Customer Roles

```txt
guest
customer_guest_checkout
customer_registered
customer_loyalty
```

Ý nghĩa:

- `guest`: khách chỉ xem website, chưa đăng nhập và chưa tham gia giao dịch.
- `customer_guest_checkout`: khách vãng lai có tham gia giao dịch nhưng chưa tạo tài khoản; được theo dõi đơn bằng email/số điện thoại/mã đơn.
- `customer_registered`: khách hàng đã đăng ký tài khoản trong tenant.
- `customer_loyalty`: khách hàng thân thiết, có điểm thưởng/hạng thành viên/ưu đãi riêng trong tenant.

## Permission Namespace

Permission đặt theo dạng `resource.action`. Với SaaS multi-tenant, resource nên chia nhóm rõ:

```txt
platform.tenant.read
platform.tenant.create
platform.tenant.update
platform.tenant.suspend
platform.tenant.impersonate_support

platform.service_catalog.read
platform.service_catalog.manage
platform.subscription.read
platform.subscription.manage
platform.billing.read
platform.billing.manage
platform.audit_log.read
platform.admin.manage

tenant.dashboard.access
tenant.settings.read
tenant.settings.manage
tenant.admin.manage
tenant.staff.read
tenant.staff.manage
tenant.audit_log.read

tenant.domain.read
tenant.domain.manage
tenant.theme.read
tenant.theme.manage
tenant.service.read
tenant.service.request

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
order.create_manual
order.update_status
order.refund

customer.read_own
customer.update_own
customer.read
customer.manage
customer.loyalty_read
customer.loyalty_manage

inventory.read
inventory.update
inventory.adjust

repair.read
repair.create
repair.update_status
repair.assign
repair.invoice

hr.employee.read
hr.employee.manage
hr.role.assign

discount.read
discount.manage
content.read
content.manage
support.ticket.read
support.ticket.manage
finance.payment.read
finance.payment.refund
```

## Permission Theo Role Mặc Định

| Role | Permissions mặc định |
| --- | --- |
| `platform_owner` | Tất cả `platform.*`, quyền tạo/sửa/xóa platform admin, quản lý service catalog, billing, tenant, audit. |
| `platform_admin` | `platform.tenant.*`, `platform.service_catalog.read`, `platform.subscription.read`, `platform.audit_log.read`, hỗ trợ tenant theo chính sách. |
| `platform_sales_admin` | `platform.tenant.read`, `platform.tenant.create`, `platform.subscription.read`, `platform.subscription.manage`, `platform.service_catalog.read`, `platform.billing.read`. |
| `platform_support` | `platform.tenant.read`, `platform.tenant.impersonate_support`, `platform.audit_log.read` giới hạn theo ticket/support case. |
| `platform_billing` | `platform.billing.*`, `platform.subscription.read`, `platform.subscription.manage`, `platform.tenant.read`. |
| `tenant_owner` | Tất cả quyền trong tenant, gồm `tenant.admin.manage`, `tenant.staff.manage`, `tenant.theme.manage`, `tenant.domain.manage`, `tenant.service.request`. |
| `tenant_admin` | Hầu hết quyền vận hành tenant, trừ chuyển ownership, xóa tenant, thay đổi owner và một số billing contract. |
| `tenant_manager` | `tenant.dashboard.access`, quản lý sản phẩm/đơn hàng/khách hàng/tồn kho theo phân quyền cụ thể. |
| `tenant_theme_admin` | `tenant.theme.read`, `tenant.theme.manage`, `tenant.domain.read`, `content.read`, `content.manage`. |
| `sales_staff` | `tenant.dashboard.access`, `product.read`, `order.read`, `order.create_manual`, `order.update_status`, `customer.read`, `discount.read`. |
| `repair_staff` | `tenant.dashboard.access`, `customer.read`, `repair.read`, `repair.create`, `repair.update_status`. |
| `inventory_staff` | `tenant.dashboard.access`, `product.read`, `inventory.read`, `inventory.update`, `inventory.adjust`. |
| `hr_staff` | `tenant.dashboard.access`, `hr.employee.read`, `hr.employee.manage`, `tenant.staff.read`. |
| `content_staff` | `tenant.dashboard.access`, `content.read`, `content.manage`, `product.read`, `category.read`, `collection.read`. |
| `support_staff` | `tenant.dashboard.access`, `customer.read`, `order.read`, `support.ticket.read`, `support.ticket.manage`. |
| `finance_staff` | `tenant.dashboard.access`, `order.read`, `finance.payment.read`, `order.refund` hoặc `finance.payment.refund` nếu được cấp riêng. |
| `guest` | `content.read`, `product.read`, `category.read`, `collection.read`, `cart.read_own`, `cart.update_own`. |
| `customer_guest_checkout` | Quyền của `guest`, thêm `checkout.create`, `order.create`, tra cứu đơn vãng lai theo token/mã xác thực. |
| `customer_registered` | Quyền của `guest`, thêm `checkout.create`, `order.create`, `customer.read_own`, `customer.update_own`, `order.read_own`, `order.cancel_own`. |
| `customer_loyalty` | Quyền của `customer_registered`, thêm `customer.loyalty_read` và quyền dùng ưu đãi thân thiết theo policy. |

Quy ước:

- Role mặc định là preset. Hệ thống vẫn nên hỗ trợ custom role theo tenant ở phase sau.
- `platform_owner` và `tenant_owner` có thể dùng wildcard nội bộ, nhưng helper vẫn phải trả lời qua `can(actor, permission, context)`.
- Một user có thể là `platform_sales_admin` trên platform và đồng thời là `tenant_owner` của tenant demo; hai ngữ cảnh quyền không được trộn lẫn.

## Service Entitlement

Dịch vụ là module mà doanh nghiệp mua từ Sales Builder. Có quyền role chưa đủ; tenant phải đang sở hữu dịch vụ tương ứng.

```txt
service.storefront
service.product_catalog
service.cart_checkout
service.order_management
service.inventory
service.repair
service.loyalty
service.hr
service.content_cms
service.custom_domain
service.theme_builder
service.discount
service.support_ticket
service.finance
```

Ví dụ policy:

| Hành động | Permission cần có | Service tenant cần có |
| --- | --- | --- |
| Xem storefront | `content.read`, `product.read` | `service.storefront`, `service.product_catalog` |
| Checkout | `checkout.create`, `order.create` | `service.cart_checkout`, `service.order_management` |
| Quản lý tồn kho | `inventory.update` | `service.inventory` |
| Quản lý sửa chữa | `repair.update_status` | `service.repair` |
| Khách thân thiết dùng điểm | `customer.loyalty_read` | `service.loyalty` |
| Nhân sự quản lý nhân viên | `hr.employee.manage` | `service.hr` |
| Đổi template/màu sắc | `tenant.theme.manage` | `service.theme_builder` |
| Gắn custom domain | `tenant.domain.manage` | `service.custom_domain` |

Helper cần kiểm tra theo thứ tự:

```txt
1. Actor có session hợp lệ không?
2. Actor thuộc platform hay tenant/customer?
3. Actor có membership trong tenant hiện tại không?
4. Actor có permission cần thiết không?
5. Tenant có service entitlement cần thiết không?
6. Nếu là quyền _own, actor có sở hữu resource không?
7. Nếu là thao tác nhạy cảm, có cần audit log hoặc approval không?
```

## Frontend Route Access Matrix

### Storefront Theo Tenant

| Route | Access | Role được vào | Permission | Service cần có |
| --- | --- | --- | --- | --- |
| `/` | Public | all | `content.read`, `product.read` | `service.storefront` |
| `/products` | Public | all | `product.read` | `service.product_catalog` |
| `/products/[slug]` | Public | all | `product.read` | `service.product_catalog` |
| `/cart` | Public/session | `guest`, customer roles | `cart.read_own`, `cart.update_own` | `service.cart_checkout` |
| `/checkout` | Session | `customer_guest_checkout`, `customer_registered`, `customer_loyalty` | `checkout.create`, `order.create` | `service.cart_checkout` |
| `/account` | Auth required | `customer_registered`, `customer_loyalty` | `customer.read_own` | none |
| `/account/orders` | Auth required | `customer_registered`, `customer_loyalty` | `order.read_own` | `service.order_management` |
| `/account/loyalty` | Auth required | `customer_loyalty` | `customer.loyalty_read` | `service.loyalty` |

### Tenant Admin Dashboard

| Route | Access | Role được vào | Permission | Service cần có |
| --- | --- | --- | --- | --- |
| `/admin` | Auth required | tenant admin/staff roles | `tenant.dashboard.access` | none |
| `/admin/products` | Auth required | `tenant_owner`, `tenant_admin`, `tenant_manager`, `sales_staff` | `product.create`, `product.update` | `service.product_catalog` |
| `/admin/orders` | Auth required | admin/manager/sales/support/finance | `order.read` | `service.order_management` |
| `/admin/inventory` | Auth required | admin/manager/inventory | `inventory.read`, `inventory.update` | `service.inventory` |
| `/admin/repairs` | Auth required | admin/manager/repair | `repair.read` | `service.repair` |
| `/admin/customers` | Auth required | admin/manager/sales/support | `customer.read` | none |
| `/admin/loyalty` | Auth required | admin/manager/sales | `customer.loyalty_manage` | `service.loyalty` |
| `/admin/hr` | Auth required | owner/admin/hr | `hr.employee.manage` | `service.hr` |
| `/admin/content` | Auth required | admin/theme/content | `content.manage` | `service.content_cms` |
| `/admin/theme` | Auth required | owner/admin/theme | `tenant.theme.manage` | `service.theme_builder` |
| `/admin/domain` | Auth required | owner/admin | `tenant.domain.manage` | `service.custom_domain` |
| `/admin/staff` | Auth required | owner/admin/hr giới hạn | `tenant.staff.manage` | none |
| `/admin/settings` | Auth required | owner/admin | `tenant.settings.manage` | none |

### Platform Console

| Route | Access | Role được vào | Permission |
| --- | --- | --- | --- |
| `/platform` | Auth required | platform roles | `platform.tenant.read` |
| `/platform/tenants` | Auth required | owner/admin/sales/support/billing | `platform.tenant.read` |
| `/platform/tenants/new` | Auth required | owner/admin/sales | `platform.tenant.create` |
| `/platform/services` | Auth required | owner/admin | `platform.service_catalog.manage` |
| `/platform/subscriptions` | Auth required | owner/admin/sales/billing | `platform.subscription.manage` |
| `/platform/billing` | Auth required | owner/billing | `platform.billing.manage` |
| `/platform/admins` | Auth required | owner | `platform.admin.manage` |
| `/platform/audit-logs` | Auth required | owner/admin/support | `platform.audit_log.read` |

## Backend API Access Matrix

| Endpoint | Access | Permission | Context bắt buộc |
| --- | --- | --- | --- |
| `POST /auth/register` | Public | none | Chỉ tạo `customer_registered` trong tenant hiện tại. |
| `POST /auth/login` | Public | none | Xác định platform session hoặc tenant/customer session. |
| `GET /tenants/current` | Public | none | Resolve tenant từ host/subdomain/domain. |
| `GET /products` | Public | `product.read` | `tenantId`, `service.product_catalog`. |
| `POST /products` | Tenant auth | `product.create` | `tenantId`, staff/admin membership. |
| `PATCH /products/:id` | Tenant auth | `product.update` | Product thuộc tenant hiện tại. |
| `POST /checkout` | Session | `checkout.create`, `order.create` | Cart thuộc guest/customer hiện tại. |
| `GET /orders/me` | Customer auth | `order.read_own` | Order thuộc customer hiện tại. |
| `GET /orders` | Tenant auth | `order.read` | Tenant staff/admin. |
| `PATCH /orders/:id/status` | Tenant auth | `order.update_status` | Order thuộc tenant hiện tại. |
| `POST /orders/:id/refund` | Tenant auth | `order.refund` hoặc `finance.payment.refund` | Payment/order thuộc tenant hiện tại, audit bắt buộc. |
| `GET /repairs` | Tenant auth | `repair.read` | `service.repair`. |
| `PATCH /repairs/:id/status` | Tenant auth | `repair.update_status` | Repair ticket thuộc tenant hiện tại. |
| `PATCH /tenant/theme` | Tenant auth | `tenant.theme.manage` | `service.theme_builder`. |
| `PATCH /tenant/domain` | Tenant auth | `tenant.domain.manage` | `service.custom_domain`. |
| `POST /platform/tenants` | Platform auth | `platform.tenant.create` | Platform role, audit bắt buộc. |
| `PATCH /platform/tenants/:id/subscription` | Platform auth | `platform.subscription.manage` | Platform sales/admin/billing, audit bắt buộc. |
| `PATCH /platform/service-catalog/:id` | Platform auth | `platform.service_catalog.manage` | Owner/admin only. |

Cần làm rõ khi implement:

- Gateway resolve `tenantId` từ host trước khi forward request.
- Gateway verify JWT/session và gắn internal headers như `x-actor-id`, `x-actor-type`, `x-tenant-id`, `x-request-id`.
- Service không tin role, permission, tenantId từ request body.
- Service phải check resource thuộc tenant hiện tại.
- Platform support impersonation phải có ticket/reason, thời hạn, audit log và không được dùng để thay đổi billing nếu không có quyền.

## Nơi Đặt Code Dùng Chung

Lựa chọn đề xuất:

```txt
packages/auth-contracts/
+- src/
   +- roles.ts
   +- permissions.ts
   +- role-permissions.ts
   +- service-entitlements.ts
   +- route-policies.ts
   +- access-control.ts
   +- actor-context.ts
```

Types tối thiểu:

```ts
type ActorType = "guest" | "customer" | "tenant_user" | "platform_user";
type Role =
  | "platform_owner"
  | "platform_admin"
  | "platform_sales_admin"
  | "platform_support"
  | "platform_billing"
  | "tenant_owner"
  | "tenant_admin"
  | "tenant_manager"
  | "tenant_theme_admin"
  | "sales_staff"
  | "repair_staff"
  | "inventory_staff"
  | "hr_staff"
  | "content_staff"
  | "support_staff"
  | "finance_staff"
  | "guest"
  | "customer_guest_checkout"
  | "customer_registered"
  | "customer_loyalty";

type Permission = string;
type ServiceEntitlement = string;

type AccessContext = {
  actorType: ActorType;
  actorId?: string;
  tenantId?: string;
  roles: Role[];
  tenantServices?: ServiceEntitlement[];
  resourceOwnerId?: string;
  resourceTenantId?: string;
};
```

Helper cần có:

```ts
function getPermissionsForRoles(roles: Role[]): Permission[];
function can(context: AccessContext, permission: Permission): boolean;
function canAny(context: AccessContext, permissions: Permission[]): boolean;
function canAll(context: AccessContext, permissions: Permission[]): boolean;
function hasService(context: AccessContext, service: ServiceEntitlement): boolean;
function assertCan(context: AccessContext, permission: Permission): void;
function assertServiceEnabled(context: AccessContext, service: ServiceEntitlement): void;
function assertTenantBoundary(context: AccessContext): void;
```

Guard nên dùng:

```ts
await requireSession();
await requireTenantContext();
await requirePermission("product.update");
await requireService("service.product_catalog");
```

Không nên làm:

```ts
if (user.role === "admin") {}
if (tenant.plan === "pro") {}
if (req.body.tenantId === currentTenantId) {}
```

Ngoại lệ có thể chấp nhận: code nằm trong `access-control.ts`, migration/seed, test case hoặc adapter resolve plan sang entitlement.

## Trạng Thái Triển Khai Hiện Tại

Đã hoàn thành bước nền đầu tiên:

- Đã tạo package `packages/auth-contracts` làm source of truth dùng chung.
- Đã định nghĩa role platform, tenant admin, staff và customer trong `roles.ts`.
- Đã định nghĩa permission namespace trong `permissions.ts`.
- Đã định nghĩa service entitlement trong `service-entitlements.ts`.
- Đã tạo `ROLE_PERMISSION_RULES` và helper `getPermissionsForRoles`.
- Đã tạo access-control helper: `can`, `canAny`, `canAll`, `hasService`, `hasAllServices`, `assertCan`, `assertServiceEnabled`, `assertTenantBoundary`, `decidePermission`, `isOwnResource`.
- Đã tạo route policy nền cho storefront, tenant admin dashboard và platform console trong `route-policies.ts`.
- Đã nối `auth-service` với `@job-portal/auth-contracts`.
- Đã chuẩn hóa public register của `auth-service`: request không còn nhận `role`, user mới mặc định là `customer_registered`.
- Đã thêm comment tiếng Việt mô tả công dụng hiện tại của các hàm/helper vừa viết.
- Đã chạy typecheck/lint liên quan cho `auth-contracts` và typecheck/test runner cho `auth-service`.

Chưa hoàn thành trong code:

- Chưa thêm tenant resolution ở `api-gateway`.
- Chưa thêm authorization middleware dùng `AccessContext`.
- Chưa có database/schema thật cho tenant, membership, subscription, entitlement, theme/domain.
- Chưa có audit log runtime cho thao tác nhạy cảm.
- Chưa có test case thật cho permission matrix, service entitlement, route policy và register role validation.

## Data Model Gợi Ý

Các bảng/collection chính:

```txt
platform_users
platform_user_roles

tenants
tenant_domains
tenant_themes
tenant_subscriptions
tenant_service_entitlements

tenant_memberships
tenant_member_roles
tenant_custom_roles
tenant_custom_role_permissions

customers
customer_loyalty_profiles
guest_checkout_identities

audit_logs
```

Quy tắc:

- `tenant_memberships` liên kết user nội bộ với tenant và trạng thái active/invited/suspended.
- `customers` thuộc tenant; cùng email có thể là khách hàng ở nhiều tenant khác nhau.
- `tenant_service_entitlements` là source of truth cho dịch vụ tenant được dùng.
- `tenant_themes` lưu cấu hình giao diện; assets nên đi qua file-storage-service.
- `tenant_domains` lưu subdomain và custom domain, trạng thái verify DNS/SSL.

## Việc Cần Làm Trên Branch Này

- [x] Mở rộng `Role` từ 4 role cơ bản sang platform roles, tenant admin roles, staff roles và customer roles.
- [x] Tạo permission list chính thức theo namespace platform/tenant/commerce/service.
- [x] Tạo `ROLE_PERMISSIONS` cho từng role mặc định.
- [x] Tạo service entitlement list và helper kiểm tra service.
- [x] Cập nhật route policy cho storefront, tenant admin dashboard và platform console.
- [x] Chuẩn hóa auth-service: public register chỉ tạo customer trong tenant hiện tại.
- [ ] Thêm tenant resolution ở api-gateway dựa trên host/subdomain/custom domain.
- [ ] Thêm authorization middleware dùng `AccessContext`.
- [ ] Đảm bảo service check tenant boundary và ownership.
- [ ] Thêm audit log cho thao tác nhạy cảm: đổi gói dịch vụ, impersonation, refund, đổi owner, domain/theme.
- [ ] Viết test cho permission helper, entitlement helper, route policy, tenant boundary và register role validation.
- [ ] Cập nhật README/tài liệu nếu tạo `packages/auth-contracts`.

## Acceptance Criteria

- [x] Có source of truth cho role, permission và service entitlement.
- [x] Phân biệt rõ platform admin và tenant admin.
- [x] `platform_owner` là quyền cao nhất cấp nền tảng.
- [x] `tenant_owner` là quyền cao nhất trong một doanh nghiệp nhưng không vượt tenant boundary.
- [x] Nhân viên bán hàng, sửa chữa, kho, nhân sự có quyền riêng.
- [x] Khách chỉ xem web là `guest`; khách vãng lai giao dịch là `customer_guest_checkout`; khách thân thiết là `customer_loyalty`.
- [x] Doanh nghiệp chỉ dùng module khi đã mua dịch vụ tương ứng.
- [ ] Theme/template/domain được quản lý theo tenant.
- [x] Route admin doanh nghiệp không truy cập được nếu thiếu permission hoặc thiếu service.
- [ ] Platform sales admin có thể bán/gán dịch vụ theo quyền, nhưng thao tác phải được audit.
- [x] Public register không tạo được staff/admin/platform user.
- [ ] Test fail nếu permission matrix hoặc service entitlement policy bị thay đổi sai.

## Phạm Vi Chưa Làm Trong Phase Này

- Chưa cần UI quản lý custom role chi tiết nếu MVP chỉ dùng preset role.
- Chưa cần policy engine phức tạp như OPA/Cedar nếu helper tập trung vẫn đủ.
- Chưa cần marketplace dịch vụ tự phục vụ đầy đủ; platform sales/admin có thể gán dịch vụ trước.
- Chưa cần custom domain production hoàn chỉnh nếu local/MVP chỉ dùng subdomain.
- Chưa cần impersonation nếu chưa có audit-log-service ổn định.
