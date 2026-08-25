# Kế Hoạch Xây Dựng Component Frontend

Tài liệu này định nghĩa thứ tự xây dựng component dùng chung cho frontend. Nguyên tắc chính: mỗi lần chỉ xây một component, hoàn thiện API, style, export và kiểm tra xong mới chuyển sang component tiếp theo.

## Mục Tiêu

- Mở rộng `packages/ui` thành bộ component dùng chung cho các Next.js app.
- Giữ component generic trong `packages/ui`; component gắn nghiệp vụ nằm trong app.
- Đi từ primitive nhỏ nhất lên layout, feedback, navigation, rồi mới refactor màn hình.
- Mỗi component phải có TypeScript props rõ ràng, accessible state, `className` override và export tập trung từ `packages/ui/src/index.ts`.

## Tiến Độ Hiện Tại

- [x] Đã có package `packages/ui`.
- [x] Đã có helper `cn` trong `packages/ui/src/lib/cn.ts`.
- [x] Đã có package `packages/design-tokens`.
- [x] Đã chuyển màu mặc định sang hex: `#1068B4`, `#FCB900`, `#FF6900`.
- [x] Đã chuyển màu primary/action chính sang orange gradient, text đen.
- [x] Đã thêm Ant Design vào `packages/ui`.
- [x] Đã có Ant Design Theme Config dùng chung.
- [x] Đã có CSS Variables cho theme động light/dark.
- [x] Đã có `UiThemeProvider` bọc AntD `ConfigProvider`.
- [x] Đã có component `Button` base trong `packages/ui/src/components/button`.
- [x] Đã export `Button` từ `packages/ui/src/index.ts`.
- [x] Đã chuyển `Button` sang AntD wrapper và giữ tương thích API cũ.
- [x] Đã gắn `UiThemeProvider` và `Button` vào `apps/candidate-web`.
- [x] Đã thu gọn `candidate-web` về một trang chủ ban đầu.
- [x] Đã có Storybook cho `packages/ui`.
- [x] Đã có Storybook story cho Button.
- [x] Đã có MDX docs cho Button.
- [x] Đã có component `IconButton` trong `packages/ui/src/components/icon-button`.
- [x] Đã export `IconButton` từ `packages/ui/src/index.ts`.
- [x] Đã có Storybook story cho IconButton.
- [x] Đã có MDX docs cho IconButton.
- [x] Đã có component `Input`, `PasswordInput`, `Textarea` trong `packages/ui/src/components/input`.
- [x] Đã export `Input`, `PasswordInput`, `Textarea` từ `packages/ui/src/index.ts`.
- [x] Đã có Storybook story cho Input.
- [x] Đã có MDX docs cho Input.
- [x] Đã có component `FormField` trong `packages/ui/src/components/form-field`.
- [x] Đã export `FormField` từ `packages/ui/src/index.ts`.
- [x] Đã có Storybook story cho FormField.
- [x] Đã có MDX docs cho FormField.
- [x] Đã có component `Card`, `CardHeader`, `CardContent`, `CardFooter`, `FeatureCard` trong `packages/ui/src/components/card`.
- [x] Đã export Card components từ `packages/ui/src/index.ts`.
- [x] Đã có Storybook story cho Card.
- [x] Đã có MDX docs cho Card.
- [ ] Chưa hoàn thiện wrapper Ant Design cho tất cả component.
- [ ] Chưa có MDX docs cho toàn bộ component.
- [ ] Chưa có Chromatic hoặc visual regression workflow.
- [ ] Chưa có checklist test/accessibility theo từng component.

## Công Nghệ Sử Dụng

- React 19 và TypeScript cho component API.
- Ant Design làm nền component chính.
- Design tokens cho màu sắc, spacing, radius, typography, shadow, z-index.
- Ant Design Theme Config custom `token`, `components`, `algorithm`.
- CSS Variables hỗ trợ theme động light/dark mode.
- Tailwind CSS cho styling app và component utility.
- Less / CSS-in-JS / CSS Modules có thể dùng theo nhu cầu dự án; với AntD ưu tiên theme config và CSS variables.
- Storybook để document component, state, variant.
- MDX docs để viết hướng dẫn dùng component kèm ví dụ.
- Chromatic hoặc visual regression tools để kiểm tra UI sau khi sửa.
- Zod / Valibot / Yup cho validate form schema hoặc API data.
- React Hook Form hoặc AntD Form cho form state.
- TanStack Query / SWR cho server state.
- Redux Toolkit cho client state khi state đủ phức tạp.

## Token Màu Mặc Định

- [x] Primary/action background: `linear-gradient(180deg, #FCB900 0%, #FF6900 100%)`.
- [x] Primary/action text: `#111827`.
- [x] Blue phụ: `#1068B4`.
- [x] Orange gradient start: `#FCB900`.
- [x] Orange gradient end: `#FF6900`.
- [x] Orange gradient CSS: `linear-gradient(180deg, #FCB900 0%, #FF6900 100%)`.
- [x] Orange gradient đi từ nhạt ở trên xuống đậm ở dưới.
- [x] Orange gradient dùng cho nền hoặc phần tử có độ phủ màu cao.

## Thứ Tự Implement Component

### 0. [x] Theme Foundation

- [x] Đã có `packages/design-tokens`.
- [x] Đã có AntD theme config.
- [x] Đã có CSS variables light/dark.
- [x] Đã có `UiThemeProvider`.
- [x] Đã pass typecheck/lint liên quan.
- Công nghệ: `packages/design-tokens`, AntD `ConfigProvider`, AntD `token`, `components`, `algorithm`, CSS Variables.

### 1. [ ] Button

- [x] Đã có base implementation.
- [x] Đã chuyển sang AntD Button wrapper.
- [x] Đã giữ tương thích `type="button"` bằng cách map sang AntD `htmlType`.
- [x] Đã hỗ trợ `loading`, `leftIcon`, `rightIcon`, `asChild`.
- [x] Đã thêm `"use client"` cho Next App Router.
- [x] Đã đổi primary button sang nền orange gradient và text đen.
- [x] Đã thêm variant `outline`, `danger`, `success`, `link`.
- [x] Đã chuyển `danger` sang nền đỏ cảnh báo, text trắng.
- [x] Đã thêm nhiều mẫu Storybook: all variants, sizes, icons, states, full width, asChild, on orange surface.
- [x] Đã dùng `Button` trong trang chủ `candidate-web`.
- [x] Đã dùng `Button` trong global error `candidate-web`.
- [x] Đã pass typecheck `candidate-web`.
- [x] Đã pass lint `candidate-web`.
- [x] Đã pass build `candidate-web`.
- [x] Đã có Storybook story cho Button.
- [x] Đã có MDX docs cho Button.
- [x] Đã pass build Storybook cho `packages/ui`.
- [ ] Chưa có visual regression cho Button.
- Mục đích: action component mặc định cho form, CTA và command.
- Công nghệ: AntD Button wrapper, React, TypeScript, Tailwind/CSS-in-JS, Radix Slot nếu cần `asChild`.
- API: `variant`, `size`, `asChild`, `loading`, `leftIcon`, `rightIcon`, `block`.
- Check: disabled và loading không trigger thao tác; icon và text căn giữa; focus visible rõ.

### 2. [ ] IconButton

- [x] Đã implement wrapper dùng `Button` và AntD Tooltip.
- [x] Đã yêu cầu `label` để tạo `aria-label`.
- [x] Đã hỗ trợ `tooltip`, `icon`, `size`, `variant`, `loading`, `disabled`.
- [x] Đã giữ kích thước vuông ổn định theo size `sm`, `md`, `lg`.
- [x] Đã có Storybook stories: playground, variants, sizes, states, toolbar, without tooltip.
- [x] Đã có MDX docs cho accessibility và ví dụ dùng.
- [x] Đã pass typecheck `packages/ui`.
- [x] Đã pass lint `packages/ui`.
- [ ] Chưa có visual regression cho IconButton.
- Công nghệ: AntD Button wrapper, React, TypeScript, Tailwind/CSS-in-JS, lucide-react.
- API: `icon`, `label`, `tooltip`, `variant`, `size`, `loading`, `disabled`.
- Check: luôn có accessible label; icon căn giữa; vùng click vuông; tooltip hiển thị đúng label; disabled/loading không trigger thao tác.

### 3. [ ] Input

- [x] Đã implement wrapper dùng AntD Input.
- [x] Đã hỗ trợ `label`, `helperText`, `error`, `required`.
- [x] Đã hỗ trợ prefix/suffix icon, disabled, status và size `small`, `middle`, `large`.
- [x] Đã có `PasswordInput` dùng AntD `Input.Password`.
- [x] Đã có `Textarea` dùng AntD `Input.TextArea`.
- [x] Đã tự set `status="error"` và `aria-invalid` khi có `error`.
- [x] Đã có Storybook stories: playground, label/helper, required, error, prefix/suffix, sizes, password, textarea, form group.
- [x] Đã có MDX docs cho cách dùng Input.
- [x] Đã pass typecheck `packages/ui`.
- [x] Đã pass lint `packages/ui`.
- [ ] Chưa có visual regression cho Input.
- Công nghệ: AntD Input, React, TypeScript, design tokens.
- API: `label`, `helperText`, `error`, `required`, `prefix`, `suffix`, `size`, `status`, `disabled`.
- Check: label liên kết đúng với input; error hiển thị rõ; `aria-invalid` đúng khi lỗi; prefix/suffix không làm lệch chiều cao.

### 4. [ ] FormField

- [x] Đã implement wrapper generic cho label, helper text, error message và aria wiring.
- [x] Đã hỗ trợ render-prop để truyền `fieldProps` vào control con.
- [x] Đã tự tạo `id`, `aria-describedby`, `aria-invalid`, `aria-required`.
- [x] Đã hỗ trợ `label`, `helperText`, `error`, `required`, `optionalText`.
- [x] Đã compose được với `Input`, `PasswordInput`, `Textarea` và custom control.
- [x] Đã có Storybook stories: playground, required, error, optional, password, textarea, search, form example.
- [x] Đã có MDX docs cho cách dùng render-prop và accessibility.
- [x] Đã pass typecheck `packages/ui`.
- [x] Đã pass lint `packages/ui`.
- [ ] Chưa tích hợp React Hook Form hoặc AntD Form ở mức adapter.
- [ ] Chưa có visual regression cho FormField.
- Công nghệ: AntD Form hoặc React Hook Form, Zod / Valibot / Yup.
- API: `label`, `helperText`, `error`, `required`, `optionalText`, `children`.
- Check: label trỏ đúng control; message id được gắn vào `aria-describedby`; error set `aria-invalid`; control custom nhận được `fieldProps`.

### 5. [ ] Card

- [x] Đã implement wrapper dùng AntD Card.
- [x] Đã hỗ trợ compound sections `CardHeader`, `CardContent`, `CardFooter`.
- [x] Đã thêm `FeatureCard` kiểu media trái, content phải, icon badge, title, description và CTA.
- [x] Đã hỗ trợ variant `default`, `outlined`, `elevated`, `accent`, `interactive`.
- [x] Đã giữ radius 8px theo design system.
- [x] Đã có Storybook stories: playground, feature media card, variants, metric card, job card, accent card, with actions.
- [x] Đã có MDX docs cho cách dùng Card và variants.
- [x] Đã pass typecheck `packages/ui`.
- [x] Đã pass lint `packages/ui`.
- [ ] Chưa có visual regression cho Card.
- Công nghệ: AntD Card wrapper, React, TypeScript.
- API: `variant`, AntD Card props, `CardHeader`, `CardContent`, `CardFooter`, `FeatureCard`.
- Check: spacing ổn định; không lồng card trong card; hover state chỉ dùng cho interactive item; action footer căn phải và không làm lệch layout.

### 6. [ ] Alert

- [ ] Chưa implement.
- Công nghệ: AntD Alert, React, TypeScript.

### 7. [ ] Modal / Dialog

- [ ] Chưa implement.
- Công nghệ: AntD Modal hoặc Radix Dialog khi cần control accessibility chi tiết.

### 8. [ ] Tabs

- [ ] Chưa implement.
- Công nghệ: AntD Tabs, React, TypeScript.

### 9. [ ] Table / Data List

- [ ] Chưa implement.
- Công nghệ: AntD Table, TanStack Query / SWR cho server state.

## Checklist Khi Hoàn Tất Một Component

- [ ] Props TypeScript đủ rõ.
- [ ] Export từ `packages/ui/src/index.ts`.
- [ ] Storybook stories cho state và variant.
- [ ] MDX docs có ví dụ dùng.
- [ ] Typecheck package UI.
- [ ] Lint package UI.
- [ ] Nếu component được dùng trong app, typecheck/lint/build app liên quan.
- [ ] Visual regression khi workflow Chromatic được thêm.

## Lịch Refactor App

- [x] `candidate-web` đã được thu gọn về trang chủ ban đầu.
- [x] Trang chủ `candidate-web` đã consume `Button` và `UiThemeProvider` từ `packages/ui`.
- [ ] Khi xây thêm `Input`, `FormField`, `Card`, sẽ refactor trang hoặc flow mới theo component chung.

## Lệnh Kiểm Tra

- `pnpm --filter @job-portal/ui run typecheck`.
- `pnpm --filter @job-portal/ui run lint`.
- `pnpm --filter @job-portal/ui run build-storybook`.
- `pnpm --filter @job-portal/candidate-web run typecheck`.
- `pnpm --filter @job-portal/candidate-web run lint`.
- `pnpm --filter @job-portal/candidate-web run build`.
