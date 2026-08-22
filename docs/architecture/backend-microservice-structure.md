# Backend Microservice Structure

This document is the reference structure for backend and CMS development in this repository.

Before adding or changing backend code, review this file and keep new code aligned with these service boundaries, folder conventions, and ownership rules.

## Mục Đích Tài Liệu

Tài liệu này là chuẩn tham chiếu cho toàn bộ phần backend và CMS của dự án. Trước khi tạo service mới, thêm API, sửa logic nghiệp vụ, thêm bảng database, hoặc viết consumer xử lý event, cần đọc lại tài liệu này để đảm bảo code đi đúng kiến trúc microservice đã thống nhất.

Nguyên tắc chính:

- Mỗi chức năng lớn được tách thành một service riêng.
- Mỗi service chịu trách nhiệm rõ ràng cho một business capability.
- Không để controller chứa business logic.
- Không để service này đọc trực tiếp database của service khác.
- Code dùng chung chỉ được đưa vào `packages` khi thật sự dùng lại ở nhiều service.
- CMS phải có boundary riêng, không trộn logic CMS vào `job-service`, `user-service`, hoặc `auth-service`.

## Goals

- Split backend features by business capability.
- Keep each service independently testable, buildable, and deployable.
- Avoid shared business logic across services.
- Keep CMS features separated from core job portal features.
- Use clear layers: API, application, domain, infrastructure, jobs, and shared utilities.

## Mục Tiêu Kiến Trúc

- Tách backend theo từng nhóm chức năng để dễ mở rộng và bảo trì.
- Mỗi service có thể test, build và deploy độc lập.
- Giảm phụ thuộc chéo giữa các module.
- Giữ logic nghiệp vụ nằm trong `application` và `domain`, không nằm trong `api/controller`.
- Tách rõ phần CMS với phần job portal chính.
- Chuẩn hóa cấu trúc thư mục để khi mở service nào cũng biết code nên nằm ở đâu.
- Hỗ trợ phát triển theo hướng event-driven bằng Kafka/RabbitMQ hoặc message broker tương đương.
- Dễ bổ sung logging, monitoring, rate limiting, caching và background jobs.

## Repository Structure

Đây là cấu trúc cấp cao của toàn bộ monorepo. `apps` chứa frontend, `services` chứa các backend microservice, `packages` chứa thư viện dùng chung có kiểm soát, `infra` chứa hạ tầng, còn `docs` chứa tài liệu kỹ thuật.

```txt
job-portal/
+- apps/
|  +- cms-admin/
|  +- candidate-web/
|  +- employer-portal/
|
+- services/
|  +- api-gateway/
|  +- auth-service/
|  +- user-service/
|  +- role-permission-service/
|  +- company-service/
|  +- job-service/
|  +- job-category-service/
|  +- application-service/
|  +- resume-service/
|  +- saved-job-service/
|  +- search-service/
|  +- cms-page-service/
|  +- cms-media-service/
|  +- cms-menu-service/
|  +- cms-seo-service/
|  +- notification-service/
|  +- email-template-service/
|  +- payment-service/
|  +- subscription-service/
|  +- report-service/
|  +- audit-log-service/
|  +- file-storage-service/
|
+- packages/
|  +- config/
|  +- logger/
|  +- errors/
|  +- validation/
|  +- http/
|  +- database/
|  +- message-bus/
|  +- auth-contracts/
|  +- user-contracts/
|  +- job-contracts/
|  +- cms-contracts/
|  +- notification-contracts/
|
+- infra/
|  +- docker/
|  +- k8s/
|  +- terraform/
|  +- local/
|     +- docker-compose.yml
|
+- docs/
|  +- architecture/
|  +- adr/
|  +- api/
|  +- events/
|
+- scripts/
+- package.json
+- pnpm-workspace.yaml
+- turbo.json
+- README.md
```

## Standard Service Structure

Use this structure for most backend services.

Đây là cấu trúc chuẩn bên trong mỗi service. Khi tạo service mới, hãy dùng layout này làm mặc định. Chỉ lược bỏ thư mục nếu service thật sự không cần, ví dụ service không có background job thì có thể chưa cần `jobs`.

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
|  |  +- schedulers/
|  |
|  +- shared/
|  |  +- config/
|  |  +- logger/
|  |  +- errors/
|  |  +- health/
|  |  +- utils/
|  |
|  +- tests/
|     +- unit/
|     +- integration/
|     +- contract/
|
+- prisma/
|  +- schema.prisma
|  +- migrations/
|
+- Dockerfile
+- package.json
+- tsconfig.json
+- .env.example
+- README.md
```

## Layer Responsibilities

Mỗi layer có một trách nhiệm riêng. Khi viết code, cần đặt file vào đúng layer để tránh service bị rối khi lớn dần.

```txt
api/
- HTTP routes
- Controllers
- Request validation
- Response DTOs
- API middleware local to the service

application/
- Use cases
- Business workflows
- Application services
- Ports for external dependencies

domain/
- Entities
- Value objects
- Repository interfaces
- Domain events
- Domain errors

infrastructure/
- Database repository implementations
- Message bus producers/consumers
- External service clients
- Persistence mappers

jobs/
- Background consumers
- Queue processors
- Scheduled tasks

shared/
- Local service config
- Local logger setup
- Health checks
- Service-local helpers
```

### Giải Thích Layer Bằng Tiếng Việt

```txt
api/
- Nhận request HTTP.
- Định nghĩa route.
- Gọi validation cho request.
- Chuyển request sang input cho use case.
- Trả response DTO cho client.
- Không xử lý business logic phức tạp ở đây.

application/
- Chứa use case chính của hệ thống.
- Điều phối business workflow.
- Gọi repository interface, message publisher, external client thông qua port.
- Ví dụ: create job, publish job, apply job, verify company.

domain/
- Chứa logic lõi của nghiệp vụ.
- Định nghĩa entity, value object, domain event và repository interface.
- Không phụ thuộc Express, Prisma, Kafka, Redis hoặc framework cụ thể.

infrastructure/
- Chứa implementation cụ thể cho database, message broker, external API.
- Ví dụ: PrismaJobRepository implements JobRepository.
- Đây là nơi code phụ thuộc vào công nghệ cụ thể.

jobs/
- Chứa consumer, queue processor và scheduled task.
- Dùng cho các tác vụ chạy nền như gửi email, index search, retry webhook.

shared/
- Chứa helper nội bộ của service.
- Chỉ dùng trong service hiện tại.
- Nếu helper được dùng ở nhiều service, cân nhắc chuyển sang packages.
```

## Service Responsibilities

Danh sách dưới đây mô tả trách nhiệm của từng service. Khi thêm chức năng mới, hãy xác định chức năng đó thuộc service nào trước khi viết code.

### api-gateway

- Route requests to internal services.
- Verify JWT.
- Apply rate limiting.
- Handle CORS.
- Add request IDs.
- Normalize gateway-level errors.

### auth-service

- Register.
- Login.
- Logout.
- Refresh token.
- Forgot password.
- Reset password.
- Email verification.
- Session management.

### user-service

- Candidate profile.
- Employer profile.
- Admin profile.
- User settings.
- Avatar metadata.
- User status: active, blocked, deleted.

### role-permission-service

- Roles.
- Permissions.
- RBAC.
- Admin permission matrix.
- Feature access policy.

### company-service

- Company profile.
- Company verification.
- Company members.
- Employer-company relation.
- Company branding.

### job-service

- Job CRUD.
- Job publishing.
- Job moderation.
- Job status.
- Job visibility.
- Job ownership.

### job-category-service

- Job categories.
- Skill taxonomy.
- Location taxonomy.
- Job type.
- Experience level.
- Salary range metadata.

### application-service

- Apply job.
- Application status.
- Recruiter review.
- Interview pipeline.
- Withdraw application.

### resume-service

- Candidate resumes.
- Resume parsing.
- Resume versioning.
- Resume attachment mapping.

### saved-job-service

- Save job.
- Unsave job.
- Candidate job wishlist.
- Recently viewed jobs.

### search-service

- Job indexing.
- Candidate search.
- Company search.
- Full-text search.
- Filter aggregation.
- Sync with OpenSearch or Elasticsearch.

### cms-page-service

- CMS pages.
- Blog posts.
- Landing content.
- Static content blocks.
- Draft and publish workflow.

### cms-media-service

- Banners.
- Image gallery.
- CMS asset metadata.
- Media usage tracking.

### cms-menu-service

- Header menu.
- Footer menu.
- Navigation tree.
- CMS routing config.

### cms-seo-service

- SEO title.
- Meta description.
- Open Graph data.
- Canonical URL.
- Sitemap data.

### notification-service

- Send email.
- Send SMS.
- Push notification.
- Notification queue.
- Retry failed notification.

### email-template-service

- Email templates.
- Template variables.
- Template preview.
- Versioned templates.

### payment-service

- Payment transactions.
- Invoices.
- Payment provider webhooks.
- Refunds.

### subscription-service

- Employer plans.
- Job posting quota.
- Featured job packages.
- Subscription lifecycle.

### report-service

- Admin reports.
- Employer dashboard metrics.
- Job performance.
- Application analytics.

### audit-log-service

- Admin activity logs.
- Security event logs.
- CMS content change logs.
- User action history.

### file-storage-service

- Upload file.
- Signed URLs.
- Delete file.
- File virus scan hook.
- Storage provider abstraction.

## Trách Nhiệm Service Bằng Tiếng Việt

### api-gateway

`api-gateway` là cửa vào chính của backend. Gateway chịu trách nhiệm định tuyến request từ frontend tới service tương ứng, xác thực JWT ở lớp ngoài, áp dụng rate limit, CORS, request ID và chuẩn hóa lỗi ở tầng gateway.

Không đặt business logic của `job`, `user`, `cms` hoặc `payment` trong gateway.

### auth-service

`auth-service` quản lý toàn bộ xác thực: đăng ký, đăng nhập, đăng xuất, refresh token, quên mật khẩu, đặt lại mật khẩu, xác thực email và quản lý session.

Service này sở hữu dữ liệu liên quan đến tài khoản đăng nhập, token và session.

### user-service

`user-service` quản lý hồ sơ người dùng: hồ sơ ứng viên, hồ sơ nhà tuyển dụng, hồ sơ admin, cài đặt tài khoản, metadata avatar và trạng thái người dùng.

Không đặt logic đăng nhập hoặc phân quyền sâu trong service này. Các phần đó thuộc `auth-service` và `role-permission-service`.

### role-permission-service

`role-permission-service` quản lý role, permission, RBAC, ma trận quyền trong CMS admin và chính sách truy cập tính năng.

Service này trả lời câu hỏi: người dùng này có được thực hiện hành động này không?

### company-service

`company-service` quản lý hồ sơ công ty, xác minh công ty, thành viên công ty, quan hệ giữa employer và company, cùng branding của công ty.

`job-service` có thể tham chiếu `companyId`, nhưng không được sở hữu dữ liệu chi tiết của công ty.

### job-service

`job-service` quản lý tin tuyển dụng: tạo/sửa/xóa job, publish/unpublish job, trạng thái job, kiểm duyệt job, quyền sở hữu job và khả năng hiển thị job.

Service này không xử lý apply job. Apply job thuộc `application-service`.

### job-category-service

`job-category-service` quản lý dữ liệu phân loại: danh mục ngành nghề, skill taxonomy, location taxonomy, job type, experience level và salary range metadata.

Các service khác dùng dữ liệu phân loại thông qua API hoặc cache/event sync.

### application-service

`application-service` quản lý quá trình ứng tuyển: ứng viên apply job, trạng thái hồ sơ ứng tuyển, recruiter review, pipeline phỏng vấn và rút đơn ứng tuyển.

Service này có thể cần gọi `job-service`, `user-service`, `resume-service`, nhưng không đọc database của các service đó trực tiếp.

### resume-service

`resume-service` quản lý CV/resume: resume của ứng viên, parse resume, version resume và mapping resume với file đính kèm.

File vật lý hoặc object storage nên đi qua `file-storage-service`.

### saved-job-service

`saved-job-service` quản lý hành vi lưu job: save job, unsave job, danh sách job yêu thích và recently viewed jobs.

Tách service này giúp `job-service` không bị phình ra bởi dữ liệu hành vi người dùng.

### search-service

`search-service` quản lý tìm kiếm: index job, search job, search candidate, search company, full-text search, filter aggregation và đồng bộ dữ liệu với OpenSearch/Elasticsearch.

Service này thường consume event như `job.published.v1`, `job.updated.v1`, `company.verified.v1`.

### cms-page-service

`cms-page-service` quản lý nội dung trang: page CMS, blog post, landing content, content block, draft/publish workflow và version nội dung.

Đây là service chính cho CMS content, không trộn vào frontend hoặc `job-service`.

### cms-media-service

`cms-media-service` quản lý media dùng trong CMS: banner, gallery, metadata asset và theo dõi asset đang được dùng ở đâu.

Việc upload file gốc có thể đi qua `file-storage-service`, còn metadata CMS nằm ở service này.

### cms-menu-service

`cms-menu-service` quản lý navigation: header menu, footer menu, navigation tree và route config cho CMS/public site.

Tách riêng để CMS admin có thể chỉnh menu mà không ảnh hưởng service nội dung.

### cms-seo-service

`cms-seo-service` quản lý SEO: SEO title, meta description, Open Graph, canonical URL và sitemap metadata.

Service này có thể consume event từ `cms-page-service` để cập nhật sitemap.

### notification-service

`notification-service` gửi thông báo: email, SMS, push notification, queue gửi thông báo và retry khi gửi thất bại.

Service này nên hoạt động theo event-driven, ví dụ consume `application.submitted.v1`.

### email-template-service

`email-template-service` quản lý template email: tạo template, preview template, version template và biến động trong template.

`notification-service` gọi service này để render nội dung email.

### payment-service

`payment-service` quản lý thanh toán: payment transaction, invoice, webhook từ payment provider và refund.

Không đặt logic subscription quota ở đây. Quota thuộc `subscription-service`.

### subscription-service

`subscription-service` quản lý gói dịch vụ: employer plan, quota đăng tin, featured job package và lifecycle subscription.

Service này quyết định employer còn quyền đăng thêm job hay không.

### report-service

`report-service` quản lý báo cáo: báo cáo admin, dashboard metrics cho employer, hiệu quả job và analytics ứng tuyển.

Service này nên đọc từ snapshot, event projection hoặc warehouse, tránh query trực tiếp nhiều database production của service khác.

### audit-log-service

`audit-log-service` ghi lịch sử hành động: admin activity log, security event log, CMS content change log và user action history.

Các service khác phát event hoặc gọi API để ghi audit log.

### file-storage-service

`file-storage-service` quản lý file: upload file, signed URL, delete file, hook quét virus và abstraction cho S3, Cloudinary, local storage hoặc provider khác.

Service này sở hữu metadata file và không xử lý nghiệp vụ resume, CMS hoặc company branding.

## Detailed Example: job-service

```txt
services/job-service/
+- src/
|  +- main.ts
|  +- app.ts
|  +- api/
|  |  +- job.routes.ts
|  |  +- job.controller.ts
|  |  +- job.request.schema.ts
|  |  +- job.response.dto.ts
|  +- application/
|  |  +- use-cases/
|  |  |  +- create-job.usecase.ts
|  |  |  +- update-job.usecase.ts
|  |  |  +- publish-job.usecase.ts
|  |  |  +- close-job.usecase.ts
|  |  |  +- get-job-detail.usecase.ts
|  |  +- ports/
|  |     +- company-client.port.ts
|  |     +- message-publisher.port.ts
|  +- domain/
|  |  +- entities/
|  |  |  +- job.entity.ts
|  |  +- repositories/
|  |  |  +- job.repository.ts
|  |  +- events/
|  |  |  +- job-created.event.ts
|  |  |  +- job-published.event.ts
|  |  +- errors/
|  |     +- job.errors.ts
|  +- infrastructure/
|  |  +- repositories/
|  |  |  +- prisma-job.repository.ts
|  |  +- message-bus/
|  |  |  +- kafka-job.publisher.ts
|  |  +- mappers/
|  |     +- job.mapper.ts
|  +- shared/
|     +- health/
|     +- config/
+- prisma/
+- Dockerfile
+- package.json
```

## Detailed Example: cms-page-service

```txt
services/cms-page-service/
+- src/
|  +- main.ts
|  +- app.ts
|  +- api/
|  |  +- cms-page.routes.ts
|  |  +- cms-page.controller.ts
|  |  +- cms-page.request.schema.ts
|  |  +- cms-page.response.dto.ts
|  +- application/
|  |  +- use-cases/
|  |  |  +- create-page.usecase.ts
|  |  |  +- update-page.usecase.ts
|  |  |  +- publish-page.usecase.ts
|  |  |  +- unpublish-page.usecase.ts
|  |  |  +- get-page-by-slug.usecase.ts
|  |  +- services/
|  |     +- page-versioning.service.ts
|  +- domain/
|  |  +- entities/
|  |  |  +- cms-page.entity.ts
|  |  |  +- cms-block.entity.ts
|  |  +- repositories/
|  |  |  +- cms-page.repository.ts
|  |  +- events/
|  |  |  +- cms-page-created.event.ts
|  |  |  +- cms-page-published.event.ts
|  |  +- errors/
|  +- infrastructure/
|  |  +- repositories/
|  |  |  +- prisma-cms-page.repository.ts
|  |  +- message-bus/
|  |  +- mappers/
|  +- shared/
+- prisma/
+- Dockerfile
+- package.json
```

## Detailed Example: auth-service

```txt
services/auth-service/
+- src/
|  +- main.ts
|  +- app.ts
|  +- api/
|  |  +- auth.routes.ts
|  |  +- auth.controller.ts
|  |  +- auth.request.schema.ts
|  |  +- auth.response.dto.ts
|  +- application/
|  |  +- use-cases/
|  |  |  +- register.usecase.ts
|  |  |  +- login.usecase.ts
|  |  |  +- refresh-token.usecase.ts
|  |  |  +- logout.usecase.ts
|  |  |  +- forgot-password.usecase.ts
|  |  |  +- reset-password.usecase.ts
|  |  +- services/
|  |  |  +- password.service.ts
|  |  |  +- token.service.ts
|  |  |  +- otp.service.ts
|  |  +- ports/
|  |     +- user-client.port.ts
|  |     +- notification-client.port.ts
|  +- domain/
|  |  +- entities/
|  |  |  +- auth-user.entity.ts
|  |  |  +- session.entity.ts
|  |  +- repositories/
|  |  |  +- auth-user.repository.ts
|  |  |  +- session.repository.ts
|  |  +- events/
|  |  |  +- user-registered.event.ts
|  |  +- errors/
|  +- infrastructure/
|  |  +- repositories/
|  |  +- external-clients/
|  |  +- message-bus/
|  |  +- security/
|  +- shared/
+- prisma/
+- Dockerfile
+- package.json
```

## Data Ownership Rules

Each service owns its own data model. One service must not directly query another service's database.

Mỗi service sở hữu dữ liệu của chính nó. Đây là rule rất quan trọng trong microservice. Nếu service này đọc thẳng database của service khác, boundary sẽ bị phá vỡ và sau này rất khó deploy độc lập.

Quy tắc:

- Service chỉ được ghi database do nó sở hữu.
- Không join SQL trực tiếp qua database của service khác.
- Nếu cần dữ liệu service khác, dùng internal API hoặc consume event để tạo read model/cache cục bộ.
- Database schema nên được đặt trong service tương ứng, ví dụ `services/job-service/prisma`.
- Migration của service nào do service đó quản lý.

```txt
auth-service owns auth_users, sessions, refresh_tokens
user-service owns user_profiles, user_settings
role-permission-service owns roles, permissions, role_permissions
company-service owns companies, company_members, company_verifications
job-service owns jobs
job-category-service owns job_categories, skills, locations, job_types
application-service owns applications, application_status_history
resume-service owns resumes, resume_versions
saved-job-service owns saved_jobs, recently_viewed_jobs
cms-page-service owns cms_pages, cms_blocks, cms_page_versions
cms-media-service owns cms_assets, cms_banners
cms-menu-service owns cms_menus, cms_menu_items
cms-seo-service owns seo_metadata, sitemap_entries
notification-service owns notifications, delivery_attempts
email-template-service owns email_templates, email_template_versions
payment-service owns payments, invoices, refunds
subscription-service owns plans, subscriptions, quotas
report-service owns report_snapshots
audit-log-service owns audit_logs
file-storage-service owns files, file_scan_results
```

## Communication Rules

Use synchronous communication for direct commands and queries.

Dùng giao tiếp đồng bộ khi cần kết quả ngay lập tức, ví dụ frontend gọi API để lấy danh sách job hoặc admin publish một page CMS.

```txt
Frontend app -> api-gateway -> target service
Internal service -> target service internal API
```

Use asynchronous events for side effects and cross-service workflows.

Dùng event bất đồng bộ cho side effect hoặc workflow liên service. Ví dụ sau khi job được publish, `job-service` không nên tự index search và gửi email trong cùng request. Thay vào đó, service phát event để `search-service` và `notification-service` tự xử lý.

```txt
job-service emits job.created.v1
search-service consumes job.created.v1 and indexes the job

application-service emits application.submitted.v1
notification-service consumes application.submitted.v1 and sends email

cms-page-service emits cms.page_published.v1
cms-seo-service consumes cms.page_published.v1 and updates sitemap metadata
```

## Standard Events

Tên event nên có dạng `{domain}.{action}.v{version}`. Luôn thêm version để sau này thay đổi payload mà không phá consumer cũ.

```txt
user.registered.v1
user.profile_updated.v1
company.created.v1
company.verified.v1
job.created.v1
job.updated.v1
job.published.v1
job.closed.v1
application.submitted.v1
application.status_changed.v1
cms.page_created.v1
cms.page_published.v1
cms.media_uploaded.v1
file.uploaded.v1
notification.sent.v1
payment.completed.v1
subscription.activated.v1
```

## Current Repository Migration Plan

Current structure:

Cấu trúc hiện tại của repo đang có các service sau:

```txt
services/auth
services/user
services/job
services/utils
```

Target first step:

Bước chuyển đầu tiên nên tập trung chuẩn hóa tên service và tách code dùng chung:

```txt
services/auth-service
services/user-service
services/job-service
packages/errors
packages/config
packages/logger
packages/message-bus
```

Recommended order:

Thứ tự refactor đề xuất:

```txt
1. Standardize the workspace and ignore generated folders such as dist and node_modules.
2. Create shared packages for errors, logger, config, and message bus.
3. Refactor auth-service into api, application, domain, infrastructure, shared.
4. Refactor user-service with the same internal structure.
5. Refactor job-service with the same internal structure.
6. Add api-gateway.
7. Add cms-page-service, cms-media-service, cms-menu-service, and cms-seo-service.
8. Add application-service, notification-service, and file-storage-service.
9. Add Docker Compose for local development.
10. Add architecture decision records in docs/adr.
```

Diễn giải bằng tiếng Việt:

```txt
1. Chuẩn hóa workspace và đảm bảo dist/node_modules không nằm trong source control.
2. Tạo packages dùng chung: errors, logger, config, message-bus.
3. Refactor auth-service theo cấu trúc api, application, domain, infrastructure, shared.
4. Refactor user-service theo cùng cấu trúc.
5. Refactor job-service theo cùng cấu trúc.
6. Thêm api-gateway.
7. Thêm các CMS service: cms-page-service, cms-media-service, cms-menu-service, cms-seo-service.
8. Thêm application-service, notification-service và file-storage-service.
9. Thêm Docker Compose cho local development.
10. Tạo ADR trong docs/adr để ghi lại các quyết định kiến trúc quan trọng.
```

## Coding Checklist

Before adding backend code, verify:

```txt
1. Does this feature belong to an existing service?
2. If not, is it a new business capability that deserves a new service?
3. Is the code placed in the correct layer?
4. Is business logic kept out of controllers?
5. Is database access hidden behind repository interfaces?
6. Is cross-service communication done through APIs or events?
7. Is shared code placed in packages only when it is truly reusable?
8. Are request validation, error handling, logging, and health checks included?
9. Are unit, integration, or contract tests needed for this change?
10. Does the change respect service data ownership?
```

## Checklist Trước Khi Code

Trước khi thêm hoặc sửa backend code, tự kiểm tra:

```txt
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
14. Nếu xử lý bất đồng bộ, đã có retry/dead-letter strategy chưa?
15. Thay đổi này có phá ownership dữ liệu của service nào không?
```

## Quy Tắc Đặt Tên

```txt
Service:
- Dùng kebab-case và hậu tố -service.
- Ví dụ: job-service, cms-page-service, notification-service.

Use case:
- Dùng dạng hành động + domain + .usecase.ts.
- Ví dụ: create-job.usecase.ts, publish-page.usecase.ts.

Repository interface:
- Đặt trong domain/repositories.
- Ví dụ: job.repository.ts, cms-page.repository.ts.

Repository implementation:
- Đặt trong infrastructure/repositories.
- Tên thể hiện công nghệ dùng bên dưới.
- Ví dụ: prisma-job.repository.ts, mongo-cms-page.repository.ts.

Event:
- Dùng dạng domain.action.vversion.
- Ví dụ: job.published.v1, application.submitted.v1.

DTO/schema:
- Request schema đặt trong api.
- Response DTO đặt trong api.
- Contract dùng chung đặt trong packages/*-contracts.
```

## Quy Tắc Khi Tạo Service Mới

Khi tạo service mới, làm theo thứ tự:

```txt
1. Xác định business capability của service.
2. Tạo thư mục services/{name}-service.
3. Tạo cấu trúc src/api, src/application, src/domain, src/infrastructure, src/shared.
4. Viết README.md ngắn mô tả service sở hữu dữ liệu gì và expose API/event nào.
5. Tạo .env.example.
6. Tạo health check endpoint.
7. Tạo repository interface trong domain.
8. Tạo repository implementation trong infrastructure.
9. Tạo use case trong application.
10. Tạo route/controller trong api.
11. Thêm unit/integration test tối thiểu cho luồng chính.
12. Cập nhật tài liệu API/event nếu có endpoint hoặc event mới.
```

## Những Điều Không Nên Làm

```txt
Không đặt business logic trong controller.
Không import Prisma client của service khác.
Không dùng packages như nơi chứa mọi thứ lặt vặt.
Không để utils-service trở thành service dùng chung cho toàn hệ thống.
Không publish event không có version.
Không gọi vòng tròn giữa các service.
Không tạo service mới chỉ vì có một API nhỏ.
Không đưa CMS logic vào job-service hoặc user-service.
Không bỏ qua validation ở boundary API.
Không dùng in-memory rate limit cho production multi-instance.
```


