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
- [x] Đã có component `Loading` dùng chung trong `packages/ui/src/components/loading`.
- [x] Đã export `Loading` từ `packages/ui/src/index.ts`.
- [x] Đã có Storybook story cho Loading.
- [x] Đã có MDX docs cho Loading.
- [x] Đã chuyển `Button`, `IconButton`, `DataTable`, `DataList` sang dùng loading indicator chung.
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
- [x] Đã có component `Alert` trong `packages/ui/src/components/alert`.
- [x] Đã export `Alert` từ `packages/ui/src/index.ts`.
- [x] Đã có Storybook story cho Alert.
- [x] Đã có MDX docs cho Alert.
- [x] Đã có component `Modal` và alias `Dialog` trong `packages/ui/src/components/modal`.
- [x] Đã export `Modal`, `Dialog` từ `packages/ui/src/index.ts`.
- [x] Đã có Storybook story cho Modal/Dialog.
- [x] Đã có MDX docs cho Modal/Dialog.
- [x] Đã có component `Tabs` trong `packages/ui/src/components/tabs`.
- [x] Đã export `Tabs` từ `packages/ui/src/index.ts`.
- [x] Đã có Storybook story cho Tabs.
- [x] Đã có MDX docs cho Tabs.
- [x] Đã có component `DataTable` và `DataList` trong `packages/ui/src/components/data-table`.
- [x] Đã export `DataTable`, `DataList` từ `packages/ui/src/index.ts`.
- [x] Đã có Storybook story cho Table / Data List.
- [x] Đã có MDX docs cho Table / Data List.
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

### 1.1. [x] Loading

- [x] Đã implement component `Loading` dùng chung.
- [x] Mặc định `Loading` chỉ hiển thị icon xoay, không hiển thị chữ.
- [x] Đã hỗ trợ variant `inline` và `block`.
- [x] Đã hỗ trợ size `sm`, `md`, `lg`.
- [x] Đã hỗ trợ tone `primary`, `neutral`, `inverse`, `danger`.
- [x] Đã dùng `Loading` trong `Button` thay cho spinner mặc định của AntD.
- [x] Đã dùng `Loading` trong `IconButton` khi nút icon đang xử lý.
- [x] Đã dùng `Loading` làm indicator cho AntD Table/List trong `DataTable` và `DataList`.
- [x] Đã có Storybook stories: playground, sizes, tones, block.
- [x] Đã có MDX docs cho Loading.
- [x] Đã pass typecheck `packages/ui`.
- [x] Đã pass lint `packages/ui`.
- [ ] Chưa có visual regression cho Loading.
- Công nghệ: React, TypeScript, CSS animation, AntD loading indicator slot.
- API: `variant`, `size`, `tone`, `label`, `className`.
- Check: loading có accessible status; spinner không làm nút nhảy layout; tone primary dùng được trên nền orange với text đen; block loading chỉ hiện icon xoay và đủ rõ trong panel/table.

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

- [x] Đã implement wrapper dùng AntD Alert.
- [x] Đã hỗ trợ type `info`, `success`, `warning`, `error`.
- [x] Đã hỗ trợ variant `soft`, `outline`, `filled`.
- [x] Đã hỗ trợ `title`, `description`, `children`, `showIcon`, `closable`, `action`.
- [x] Đã tự set role: `warning`/`error` dùng `alert`, `info`/`success` dùng `status`.
- [x] Đã thêm AntD theme token cho Alert radius.
- [x] Đã có Storybook stories: playground, types, variants, closable, with action, form error, filled set.
- [x] Đã có MDX docs cho type, variant và accessibility role.
- [x] Đã pass typecheck `packages/ui`.
- [x] Đã pass lint `packages/ui`.
- [ ] Chưa có visual regression cho Alert.
- Công nghệ: AntD Alert, React, TypeScript.
- API: `type`, `variant`, `title`, `description`, `children`, `showIcon`, `closable`, `action`.
- Check: type truyền đúng màu; warning/error đủ nổi bật; role accessibility đúng; action không làm vỡ layout.

### 7. [ ] Modal / Dialog

- [x] Đã implement wrapper dùng AntD Modal.
- [x] Đã export alias `Dialog` cho flow xác nhận hoặc nội dung dạng dialog.
- [x] Đã hỗ trợ `open`, `onOpenChange`, `title`, `description`, `children`.
- [x] Đã hỗ trợ footer mặc định qua `showFooter`, `confirmText`, `cancelText`, `confirmLoading`.
- [x] Đã hỗ trợ `variant="danger"` để confirm action dùng button đỏ cảnh báo.
- [x] Đã hỗ trợ custom `footer`.
- [x] Đã thêm AntD theme token cho Modal radius/background/title.
- [x] Đã có Storybook stories: basic, confirmation, danger dialog, with form, custom footer, with alert.
- [x] Đã có MDX docs cho API chính và các tình huống dùng.
- [x] Đã pass typecheck `packages/ui`.
- [x] Đã pass lint `packages/ui`.
- [ ] Chưa có visual regression cho Modal/Dialog.
- Công nghệ: AntD Modal hoặc Radix Dialog khi cần control accessibility chi tiết.
- API: `open`, `onOpenChange`, `title`, `description`, `children`, `showFooter`, `confirmText`, `cancelText`, `confirmLoading`, `variant`, `footer`.
- Check: focus trap/escape/mask close theo AntD; danger dialog không cho đóng nhầm khi cần `maskClosable={false}`; footer không vỡ layout; title/description hiển thị rõ.

### 8. [ ] Tabs

- [x] Đã implement wrapper dùng AntD Tabs.
- [x] Đã hỗ trợ controlled mode qua `value` và `onValueChange`.
- [x] Đã hỗ trợ uncontrolled mode qua `defaultValue`.
- [x] Đã hỗ trợ `items` gồm `key`, `label`, `children`, `icon`, `disabled`.
- [x] Đã hỗ trợ variant `line`, `pills`, `boxed`.
- [x] Đã hỗ trợ size `small`, `middle`, `large` và placement như `top`, `left`.
- [x] Đã thêm CSS component layer cho `sb-tabs--line`, `sb-tabs--pills`, `sb-tabs--boxed`.
- [x] Đã có Storybook stories: playground, variants, sizes, with icons, controlled, disabled tab, vertical.
- [x] Đã có MDX docs cho variants và API chính.
- [x] Đã pass typecheck `packages/ui`.
- [x] Đã pass lint `packages/ui`.
- [ ] Chưa có visual regression cho Tabs.
- Công nghệ: AntD Tabs, React, TypeScript.
- API: `items`, `value`, `defaultValue`, `onValueChange`, `variant`, `size`, `placement`.
- Check: keyboard navigation theo AntD; active state rõ; disabled tab không đổi tab; layout line/pills/boxed không làm nhảy nội dung.

### 9. [ ] Table / Data List

- [x] Đã implement wrapper `DataTable` dùng AntD Table.
- [x] Đã implement wrapper `DataList` dùng AntD List.
- [x] Đã hỗ trợ `data`, `columns`, `rowKey`, `pagination`, `loading`, `emptyText`.
- [x] Đã hỗ trợ density `compact`, `comfortable`, `spacious` cho Table.
- [x] Đã set scroll ngang mặc định để table không vỡ layout trên màn nhỏ.
- [x] Đã thêm empty state dùng AntD `Empty`.
- [x] Đã thêm AntD theme token cho Table.
- [x] Đã thêm CSS component layer cho `sb-data-table` và `sb-data-list`.
- [x] Đã có Storybook stories: playground, density, pagination, empty state, loading state, data list cards.
- [x] Đã có MDX docs cho Table / Data List.
- [x] Đã pass typecheck `packages/ui`.
- [x] Đã pass lint `packages/ui`.
- [x] Đã pass typecheck `candidate-web`.
- [x] Đã pass build Storybook cho `packages/ui`.
- [x] Đã dùng `Loading` chung làm indicator cho Table/List.
- [ ] Chưa tích hợp TanStack Query hoặc SWR vì chưa có API/màn dữ liệu cụ thể.
- [ ] Chưa có visual regression cho Table / Data List.
- Công nghệ: AntD Table, TanStack Query / SWR cho server state.
- API: `data`, `columns`, `rowKey`, `density`, `pagination`, `loading`, `emptyText`, `items`, `getKey`, `renderItem`.
- Check: row key ổn định; empty/loading hiển thị rõ; table có scroll ngang khi nhiều cột; list item không làm vỡ layout mobile; pagination nhận state từ app khi dùng dữ liệu server.

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
