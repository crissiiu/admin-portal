# Frontend Next.js Structure

This document is the reference structure for large-scale frontend development in this repository.

Mục tiêu là xây dựng frontend Next.js + TypeScript dễ scale, dễ maintain, phù hợp với backend microservice, và đủ rõ ràng để nhiều team cùng phát triển mà không giẫm lên boundary của nhau.

## Mục Tiêu Kiến Trúc

- Tách frontend theo product surface và business capability.
- Giữ routing, data fetching, UI, state, validation và API clients ở đúng boundary.
- Không để component gọi trực tiếp nhiều microservice một cách tùy tiện.
- Chuẩn hóa cách xử lý auth, error, loading, cache, logging và feature flags.
- Hỗ trợ nhiều app frontend như candidate web, employer portal, cms admin.
- Cho phép từng app build, test, deploy độc lập trong monorepo.
- Giữ shared code ở mức platform/design-system, không biến `shared` thành nơi chứa mọi thứ.

## Repository Structure

Frontend nên nằm trong `apps`, các thư viện dùng chung nằm trong `packages`.

```txt
job-portal/
+- apps/
|  +- candidate-web/
|  |  +- src/
|  |  |  +- app/
|  |  |  +- features/
|  |  |  +- entities/
|  |  |  +- widgets/
|  |  |  +- shared/
|  |  |  +- config/
|  |  |  +- middleware.ts
|  |  +- public/
|  |  +- tests/
|  |  +- next.config.ts
|  |  +- package.json
|  |
|  +- employer-portal/
|  +- cms-admin/
|
+- packages/
|  +- ui/
|  +- design-tokens/
|  +- api-contracts/
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

Recommended app split:

- `candidate-web`: public job search, job detail, candidate profile, applications.
- `employer-portal`: company dashboard, job posting, applicants, billing.
- `cms-admin`: content, menu, media, SEO, admin operations.

Nếu dự án nhỏ ở giai đoạn đầu, có thể bắt đầu bằng một app `apps/web`, nhưng vẫn nên giữ cấu trúc bên trong giống chuẩn này để tách app sau không đau.

## App-Level Structure

Mỗi Next.js app nên dùng App Router.

```txt
apps/candidate-web/src/
+- app/
|  +- (public)/
|  |  +- jobs/
|  |  |  +- page.tsx
|  |  |  +- loading.tsx
|  |  |  +- error.tsx
|  |  +- jobs/[jobId]/
|  |     +- page.tsx
|  |
|  +- (auth)/
|  |  +- sign-in/
|  |  +- sign-up/
|  |
|  +- (dashboard)/
|  |  +- profile/
|  |  +- applications/
|  |
|  +- api/
|  |  +- auth/
|  |  +- webhooks/
|  |
|  +- layout.tsx
|  +- global-error.tsx
|  +- not-found.tsx
|
+- features/
|  +- job-search/
|  +- job-detail/
|  +- application-submit/
|  +- candidate-profile/
|  +- auth/
|
+- entities/
|  +- job/
|  +- company/
|  +- user/
|  +- application/
|
+- widgets/
|  +- app-header/
|  +- app-sidebar/
|  +- job-search-panel/
|  +- candidate-dashboard-shell/
|
+- shared/
|  +- api/
|  +- auth/
|  +- cache/
|  +- config/
|  +- errors/
|  +- hooks/
|  +- i18n/
|  +- lib/
|  +- styles/
|  +- types/
|  +- utils/
|
+- config/
   +- env.ts
   +- routes.ts
   +- runtime.ts
```

## Layer Ownership

`app`

- Chỉ chứa routing, layouts, route groups, server components, metadata, route handlers.
- Không chứa business logic phức tạp.
- Không gọi trực tiếp raw HTTP clients nếu logic đó thuộc feature/entity.

`features`

- Chứa use case người dùng có hành vi rõ ràng: search jobs, submit application, update profile.
- Có thể dùng nhiều `entities`.
- Chứa component feature-specific, action, schema, query, mutation, state cục bộ.

`entities`

- Đại diện cho domain object: job, user, company, application.
- Chứa type, mapper, API repository, model helpers và UI nhỏ gắn với entity.
- Không import ngược từ `features`.

`widgets`

- Composition cấp page/section: header, sidebar, dashboard shell, search panel.
- Ghép `features`, `entities` và `shared/ui`.
- Không chứa business rules sâu.

`shared`

- Code app-level dùng chung nhưng chưa đáng đưa lên package.
- Không import từ `features`, `entities`, `widgets`, hoặc `app`.

`packages`

- Code dùng chung giữa nhiều app.
- Chỉ đưa code lên đây khi có ít nhất hai app cần dùng hoặc đó là platform concern.

## Import Rules

Luồng import nên đi một chiều:

```txt
app -> widgets -> features -> entities -> shared -> packages
```

Quy tắc:

- `shared` không được import `features`, `entities`, `widgets`, `app`.
- `entities` không được import `features`.
- `features` không được import feature khác trực tiếp nếu tạo coupling nghiệp vụ. Dùng composition ở `widgets` hoặc `app`.
- API clients dùng trong Server Components hoặc server actions nên đặt trong file có `server-only`.
- Client Components chỉ nhận data đã được normalize hoặc gọi qua query/mutation layer được kiểm soát.

Nên enforce bằng ESLint boundaries, path aliases và code review.

## API Boundary Với Microservices

Frontend không nên gọi microservice theo kiểu rải rác trong component. Nên có một trong hai mô hình:

1. API Gateway/BFF-first

- Frontend gọi `api-gateway` hoặc BFF.
- Gateway gom dữ liệu từ nhiều service.
- Phù hợp với app lớn, cần auth, rate limit, monitoring, contract ổn định.

2. Typed service clients

- Frontend có client riêng cho từng service trong `shared/api/clients`.
- Chỉ dùng ở server layer.
- Mỗi client có mapper chuyển DTO backend sang frontend model.

Khuyến nghị cho dự án này: dùng API Gateway/BFF cho flow phức tạp, và typed service clients cho server-side use case đơn giản trong nội bộ.

```txt
shared/api/
+- http-client.ts
+- clients/
|  +- auth.client.ts
|  +- user.client.ts
|  +- job.client.ts
|  +- company.client.ts
|  +- application.client.ts
+- mappers/
|  +- job.mapper.ts
|  +- user.mapper.ts
+- contracts/
   +- pagination.ts
   +- problem-details.ts
```

## Data Fetching Strategy

Server Components:

- Dùng cho initial page data, SEO pages, authenticated dashboard shell.
- Gọi API qua server-only clients.
- Dùng cache/revalidate rõ ràng theo từng use case.

Server Actions:

- Dùng cho mutation gắn với form: apply job, save job, update profile.
- Validate input bằng schema trước khi gọi backend.
- Trả về typed result thay vì throw error tùy tiện.

Client Query Layer:

- Dùng TanStack Query/SWR cho dữ liệu tương tác cao: filters, infinite scroll, notifications.
- Query key phải nằm gần feature/entity, không hard-code rải rác.

Route Handlers:

- Chỉ dùng cho BFF nhẹ, webhook, proxy cần cookie/session, hoặc integration không muốn lộ secret.
- Không biến `app/api` thành backend thứ hai.

## Auth And Session

```txt
shared/auth/
+- session.server.ts
+- permissions.ts
+- auth-guards.ts
+- token-refresh.server.ts
+- current-user.server.ts
```

Quy tắc:

- Token, refresh token và service credentials chỉ xử lý ở server.
- Client chỉ biết trạng thái session tối thiểu cần render UI.
- Permission nên dựa trên capability, không rải `role === 'admin'` khắp code.
- Middleware chỉ xử lý redirect/auth guard đơn giản, không gọi nhiều service nặng.

## Error Handling

Chuẩn hóa lỗi theo Problem Details hoặc contract tương đương.

```txt
shared/errors/
+- app-error.ts
+- api-error.ts
+- error-boundary.tsx
+- normalize-error.ts
+- user-facing-message.ts
```

Quy tắc:

- API client normalize mọi lỗi về một shape.
- Page có `error.tsx` cho lỗi route-level.
- Form mutation trả về lỗi field-level và form-level rõ ràng.
- Không expose message nội bộ của backend ra UI.

## State Management

Phân loại state:

- Server state: TanStack Query/SWR hoặc native Next cache.
- Form state: React Hook Form + Zod/Valibot.
- URL state: search params cho filter/sort/pagination.
- Client UI state: Zustand/Jotai chỉ khi state vượt quá phạm vi component.
- Auth/session: server-first, hydrate tối thiểu xuống client.

Tránh đưa mọi thứ vào global store. Global store lớn thường là dấu hiệu boundary chưa tốt.

## UI System

```txt
packages/ui/
+- src/
|  +- components/
|  |  +- button/
|  |  +- dialog/
|  |  +- form/
|  |  +- table/
|  +- primitives/
|  +- icons/
|  +- hooks/
|  +- styles/
|  +- index.ts
```

Quy tắc:

- `packages/ui` không biết domain job portal.
- Domain UI như `JobCard`, `CompanyLogo`, `ApplicationStatusBadge` nằm trong `entities`.
- Feature UI như `JobSearchForm`, `ApplicationSubmitForm` nằm trong `features`.
- Design tokens nằm riêng để nhiều app dùng chung.

## Configuration

```txt
src/config/
+- env.ts
+- routes.ts
+- app-metadata.ts
+- feature-flags.ts
```

Quy tắc:

- Validate env bằng schema tại startup.
- Tách public env và server env.
- Không đọc `process.env` trực tiếp trong component.
- URL route dùng constant/helper thay vì string rải rác.

## Testing Strategy

```txt
apps/candidate-web/tests/
+- e2e/
+- integration/
+- accessibility/

src/features/job-search/
+- __tests__/
   +- job-search-form.test.tsx
   +- job-search.schema.test.ts
```

Test pyramid:

- Unit test: mapper, schema, formatter, permission helper.
- Component test: form, table, critical UI states.
- Integration test: feature flow với mocked API.
- E2E test: login, search job, apply job, employer post job, CMS publish page.
- Contract test: frontend client và backend OpenAPI/schema.

## Observability

```txt
packages/telemetry/
+- logger.ts
+- metrics.ts
+- tracing.ts
+- web-vitals.ts
```

Nên có:

- Request ID/Correlation ID đi từ frontend tới API Gateway.
- Logging server-side cho failed API calls.
- Web vitals cho app public.
- Error tracking cho client/runtime errors.
- Feature-level analytics event được type hóa.

## Naming Conventions

- Folder dùng kebab-case: `job-search`, `candidate-profile`.
- Component dùng PascalCase: `JobSearchForm.tsx`.
- Hook dùng camelCase: `useJobFilters.ts`.
- Server-only file có suffix `.server.ts`.
- Client-only file có suffix `.client.tsx` khi cần rõ boundary.
- Schema: `job-search.schema.ts`.
- Mapper: `job.mapper.ts`.
- API client: `job.client.ts`.
- Query keys: `job.query-keys.ts`.

## Example Feature Structure

```txt
features/job-search/
+- components/
|  +- JobSearchForm.tsx
|  +- JobFilterDrawer.tsx
+- api/
|  +- search-jobs.action.ts
|  +- search-jobs.query.ts
+- model/
|  +- job-search.schema.ts
|  +- job-search.types.ts
|  +- job-search.query-keys.ts
+- lib/
|  +- build-job-search-params.ts
+- index.ts
```

`index.ts` chỉ export public API của feature. Không import sâu kiểu:

```ts
import { JobSearchForm } from '@/features/job-search/components/JobSearchForm';
```

Nên import:

```ts
import { JobSearchForm } from '@/features/job-search';
```

## Example Entity Structure

```txt
entities/job/
+- api/
|  +- job.repository.server.ts
+- model/
|  +- job.types.ts
|  +- job.mapper.ts
|  +- job.schema.ts
+- ui/
|  +- JobCard.tsx
|  +- JobStatusBadge.tsx
+- lib/
|  +- format-salary.ts
+- index.ts
```

Entity là nơi tốt để đặt logic gắn với domain object nhưng không thuộc riêng một use case.

## Deployment Model

Mỗi frontend app nên deploy độc lập:

- `candidate-web`: public app, ưu tiên SEO và performance.
- `employer-portal`: authenticated app, ưu tiên dashboard UX và data consistency.
- `cms-admin`: internal/admin app, ưu tiên permission và auditability.

CI/CD nên có:

- Type check.
- Lint.
- Unit/component tests.
- Build từng app bị ảnh hưởng.
- E2E smoke test cho app quan trọng.
- Bundle analysis định kỳ.

## Review Checklist

Trước khi merge frontend code:

- Code có nằm đúng layer không?
- Component có gọi API trực tiếp không đúng chỗ không?
- DTO backend đã được map sang frontend model chưa?
- Loading, empty, error, unauthorized states đã đủ chưa?
- Form có schema validation chưa?
- Query key/cache/revalidate có rõ ràng không?
- Shared code có thật sự shared không?
- Có test cho mapper/schema/flow quan trọng không?
- Có làm lộ token/secret/env server ra client không?

## Recommended Initial Implementation

Giai đoạn đầu nên làm theo thứ tự:

1. Tạo `apps/candidate-web` bằng Next.js App Router + TypeScript.
2. Tạo `packages/ui`, `packages/api-contracts`, `packages/typescript-config`, `packages/eslint-config`.
3. Thiết lập path aliases và ESLint boundaries.
4. Tạo `shared/api/http-client.ts` và clients cho `auth`, `user`, `job`.
5. Tạo các entity đầu tiên: `user`, `job`, `company`, `application`.
6. Tạo feature đầu tiên: `auth`, `job-search`, `job-detail`, `application-submit`.
7. Thêm test setup và một E2E smoke flow.

Ưu tiên boundary trước, tooling sau. Một cấu trúc tốt không phải là nhiều folder, mà là ít nơi phải đoán khi thêm một hành vi mới.
