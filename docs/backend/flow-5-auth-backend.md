# Flow 5: Auth Backend Theo Role Và API Đăng Nhập

Tài liệu này ghi lại kế hoạch và trạng thái triển khai backend auth cho Sales Builder. Phạm vi flow 5 chỉ nằm ở backend: `auth-service`, `api-gateway`, migration database, contract auth và test. Frontend chưa nằm trong flow này.

## Mục Tiêu

- Tách API auth theo nhóm actor: customer, tenant admin/staff và platform admin/staff.
- Customer có thể đăng ký/đăng nhập bằng email, số điện thoại hoặc Google.
- Customer luôn phải có số điện thoại đã xác thực trước khi tạo phiên đăng nhập hợp lệ.
- Địa chỉ mặc định của customer dùng mã hành chính Việt Nam sau sáp nhập 07/2025 theo cấu trúc API v2 của `provinces.open-api.vn`.
- Admin, nhân viên và tenant admin không được tự đăng ký public; tài khoản phải do người có thẩm quyền tạo.
- Sau khi đăng nhập, hệ thống biết user hiện tại là ai, thuộc `actorType` nào, có role/permission nào và đang ở tenant nào.

## Role Và Actor

Customer:

- `guest`
- `customer_guest_checkout`
- `customer_registered`
- `customer_loyalty`

Tenant user:

- `tenant_owner`
- `tenant_admin`
- `tenant_manager`
- `tenant_theme_admin`
- `sales_staff`
- `repair_staff`
- `inventory_staff`
- `hr_staff`
- `content_staff`
- `support_staff`
- `finance_staff`

Platform user:

- `platform_owner`
- `platform_admin`
- `platform_sales_admin`
- `platform_support`
- `platform_billing`

Quy ước quan trọng:

- `guest` là trạng thái suy diễn khi không có session, không lưu thành user role.
- Public customer register chỉ tạo `customer_registered`.
- Tenant user chỉ lấy role từ `tenant_member_roles` trong tenant hiện tại.
- Platform user chỉ lấy role từ `platform_user_roles`.
- Không trộn platform context với tenant/customer context trong cùng một session.

## API Backend

Customer auth:

- `POST /api/auth/customer/phone-verifications/request`
- `POST /api/auth/customer/phone-verifications/verify`
- `POST /api/auth/customer/register/email`
- `POST /api/auth/customer/register/phone`
- `POST /api/auth/customer/register/google`
- `POST /api/auth/customer/login/email`
- `POST /api/auth/customer/login/phone`
- `POST /api/auth/customer/login/google`
- `POST /api/auth/customer/password/forgot`
- `POST /api/auth/customer/password/reset`
- `POST /api/auth/customer/password/update`

Tenant auth:

- `POST /api/auth/tenant/login`
- `POST /api/auth/tenant/password/forgot`
- `POST /api/auth/tenant/password/reset`
- `POST /api/auth/tenant/password/update`
- `POST /api/auth/tenant/users`

Platform auth:

- `POST /api/auth/platform/login`
- `POST /api/auth/platform/password/forgot`
- `POST /api/auth/platform/password/reset`
- `POST /api/auth/platform/password/update`
- `POST /api/auth/platform/users`

Session/current user:

- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Session Và Token

- Dùng access token ngắn hạn và refresh token dài hạn.
- Access JWT payload gồm `sub`, `sid`, `actorType`, `roles`, `tenantId`, `phoneVerified`, `iat`, `exp`.
- Refresh token là opaque random token, chỉ lưu hash.
- Cookie backend dùng `HttpOnly`, `Secure` ở production và `SameSite=Lax`.
- `GET /api/auth/me` trả user identity, actor type, roles, permissions, tenant id và trạng thái xác thực số điện thoại.

## Database Và Service Boundary

`auth-service` sở hữu:

- `users`
- `platform_user_roles`
- `tenant_memberships`
- `tenant_member_roles`
- `sessions`
- `refresh_tokens`
- `password_reset_tokens`
- `phone_verification_codes`
- `oauth_identities`

`user-service` sở hữu customer profile và địa chỉ mặc định. Khi customer đăng ký thành công, `auth-service` gọi port/event để `user-service` tạo customer profile gồm `name`, `phoneNumber`, `defaultAddress`.

Không service nào đọc trực tiếp database của service khác. Customer login bằng email/số điện thoại phải resolve theo tenant context để tránh lẫn dữ liệu giữa các tenant.

## Địa Chỉ Customer Theo Địa Giới Việt Nam 2025

Địa chỉ mặc định trong customer register dùng mô hình địa giới 2 cấp sau sáp nhập:

- Cấp tỉnh/thành: lấy từ `https://provinces.open-api.vn/api/v2/p/` hoặc `GET /api/v2/p/{code}`.
- Cấp xã/phường/đặc khu: lấy từ `https://provinces.open-api.vn/api/v2/w/` hoặc `GET /api/v2/w/{code}`.
- Không nhận `district`, vì API v2 sau sáp nhập không còn dùng cấp quận/huyện trong form địa chỉ mới.
- Backend lưu cả `code` và `name` để vừa validate/canonicalize được, vừa giữ snapshot địa chỉ tại thời điểm đăng ký.
- `auth-service` có `AddressValidationService` cho địa chỉ Việt Nam. Mặc định local dùng `VN_ADDRESS_VALIDATE_MODE=offline` để validate cấu trúc; khi bật `VN_ADDRESS_VALIDATE_MODE=live`, service gọi `VN_ADDRESS_API_BASE_URL` và kiểm tra `wardCode` thuộc đúng `provinceCode`.

Shape `defaultAddress`:

```json
{
  "fullName": "Nguyen Van A",
  "phoneNumber": "0900000001",
  "addressLine": "123 Nguyen Trai",
  "line2": "Tang 2",
  "provinceCode": 79,
  "provinceName": "Thành phố Hồ Chí Minh",
  "provinceCodename": "ho_chi_minh",
  "provinceDivisionType": "thành phố trung ương",
  "wardCode": 26734,
  "wardName": "Phường Sài Gòn",
  "wardCodename": "phuong_sai_gon",
  "wardDivisionType": "phường",
  "countryCode": "VN",
  "administrativeVersion": "VN_2025_07"
}
```

## Gateway Authorization

- `api-gateway` verify token và dựng `AccessContext`.
- Public auth endpoints không yêu cầu session.
- Protected route check role, permission và service entitlement theo `packages/auth-contracts`.
- Request hợp lệ được forward kèm `x-actor-id`, `x-actor-type`, `x-actor-roles`, `x-tenant-id`, `x-session-id`, `x-request-id`.
- Guest vào private route trả `401`.
- User thiếu role, permission hoặc service entitlement trả `403`.

## Checklist Triển Khai

- [x] Tách API auth theo nhóm customer, tenant user và platform user.
- [x] Thêm endpoint request/verify OTP số điện thoại cho customer.
- [x] Thêm customer register bằng email, số điện thoại và Google.
- [x] Bắt buộc customer register có `phoneNumber`, `name` và `defaultAddress`.
- [x] Chuẩn hóa `defaultAddress` theo địa chỉ hành chính Việt Nam sau sáp nhập 07/2025.
- [x] Chuyển `defaultAddress` sang mô hình 2 cấp `provinceCode/provinceName` và `wardCode/wardName`.
- [x] Reject field địa chỉ 3 cấp cũ như `district`, `ward`, `city`, `country` trong customer register.
- [x] Thêm `AddressValidationService` cho địa chỉ Việt Nam sau sáp nhập.
- [x] Hỗ trợ live validation `wardCode -> provinceCode` qua `VN_ADDRESS_API_BASE_URL` khi bật `VN_ADDRESS_VALIDATE_MODE=live`.
- [x] Cập nhật `.env.example` cho `VN_ADDRESS_API_BASE_URL` và `VN_ADDRESS_VALIDATE_MODE`.
- [x] Bắt buộc customer phải xác thực số điện thoại trước khi tạo account/session hợp lệ.
- [x] Chuẩn hóa public customer register: không nhận role từ request và mặc định tạo `customer_registered`.
- [x] Reject unknown keys trong customer register để chặn `role`, `roles`, `actorType`, `isAdmin`.
- [x] Thêm customer login bằng email, số điện thoại và Google trong tenant hiện tại.
- [x] Chặn customer login nếu số điện thoại chưa xác thực.
- [x] Thêm tenant login bằng identifier/password và roles từ `tenant_member_roles`.
- [x] Thêm platform login bằng identifier/password và roles từ `platform_user_roles`.
- [x] Không tạo public register cho tenant admin, staff hoặc platform user.
- [x] Thêm API tạo tenant user có kiểm quyền tenant/staff/HR.
- [x] Thêm API tạo platform user có kiểm quyền `platform.admin.manage`.
- [x] Thêm forgot/reset/update password riêng cho customer, tenant user và platform user.
- [x] Hỗ trợ reset password customer bằng OTP số điện thoại.
- [x] Thêm access token, refresh token, session, logout, refresh và `/me`.
- [x] Lưu refresh token dạng hash trong repository runtime.
- [x] Set/clear auth cookie dạng `HttpOnly`, `Secure` ở production, `SameSite=Lax`.
- [x] Thêm port/adapter giả cho OTP provider, email/reset sender, Google identity và customer profile client.
- [x] Thêm migration `0002_auth_runtime_schema.sql` cho `sessions`, `refresh_tokens`, `password_reset_tokens`, `phone_verification_codes`, `oauth_identities`.
- [x] Mount migration auth runtime vào local MySQL docker compose.
- [x] Thêm authorization middleware ở `api-gateway`.
- [x] Gateway verify JWT, dựng actor context và forward internal actor headers.
- [x] Gateway trả `401` cho request private không có token.
- [x] Gateway trả `403` khi thiếu permission hoặc service entitlement.
- [x] Gateway forward cookie request và `set-cookie` response giữa client và upstream auth-service.
- [x] Thêm CORS credentials config bằng `CORS_ORIGIN`.
- [x] Cập nhật `.env.example` cho token TTL, refresh/session TTL, Google client, OTP dev code, CORS và seed platform owner local.
- [x] Thêm test auth-service cho customer OTP register, chặn role injection, customer/tenant/platform login context và reset password bằng phone OTP.
- [x] Thêm test reject địa chỉ Việt Nam 3 cấp cũ trong customer register.
- [x] Chạy typecheck cho `auth-service`.
- [x] Chạy typecheck cho `api-gateway`.
- [x] Chạy typecheck cho `auth-contracts`.
- [x] Chạy test auth-service: 6 tests passed.
- [x] Chạy `git diff --check`.
- [ ] Thêm tenant resolution ở `api-gateway` dựa trên host/subdomain/custom domain.
- [ ] Thay in-memory auth repository bằng MySQL repository thật.
- [ ] Thay OTP provider giả bằng SMS provider thật.
- [ ] Thay email/reset sender giả bằng email provider thật.
- [ ] Thay Google verifier local bằng verifier thật theo `GOOGLE_CLIENT_ID`.
- [ ] Tích hợp thật với `user-service` để tạo customer profile và địa chỉ mặc định.
- [ ] Thêm cache nội bộ/đồng bộ định kỳ dữ liệu địa chỉ từ API v2 để production không phụ thuộc trực tiếp vào API ngoài trên mỗi request.
- [ ] Mở rộng live validation để canonicalize cả `provinceName`, `provinceCodename`, `wardCodename`, `divisionType`.
- [ ] Thêm rate limiter thật dùng shared store như Redis cho login/register/OTP/forgot/reset password.
- [ ] Thêm CSRF protection cho state-changing endpoints khi frontend dùng cookie auth.
- [ ] Thêm audit log runtime cho tạo platform user, tạo tenant user, đổi role và thao tác auth nhạy cảm.
- [ ] Thêm policy chi tiết cho tất cả backend API domain sau khi các service product/cart/order mới thay thế `job-service`.
- [ ] Thêm test integration qua HTTP cho `auth-service` controller và `api-gateway` authorization middleware.
- [ ] Chạy migration trên MySQL sạch và kiểm tra rollback/compatibility với dữ liệu hiện có.

## Verification Đã Chạy

- `node_modules\.bin\tsc.cmd -p services/auth-service/tsconfig.json --noEmit`
- `node_modules\.bin\tsc.cmd -p services/api-gateway/tsconfig.json --noEmit`
- `node_modules\.bin\tsc.cmd -p packages/auth-contracts/tsconfig.json --noEmit`
- `services\auth-service\node_modules\.bin\vitest.cmd run --passWithNoTests`
- `git diff --check`

Ghi chú: `pnpm` không resolve được trong shell hiện tại, nên verification dùng binary local trong `node_modules`.
