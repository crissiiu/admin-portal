# Sales Builder - Flow Xây Dựng Dự Án

Tài liệu này mô tả thứ tự xây dựng dự án theo flow tuần tự. Mục tiêu mới của dự án không còn là job portal, mà là một website bán hàng/e-commerce có thể dùng để trưng bày sản phẩm, bán hàng online, quản lý đơn hàng và vận hành nội dung bán hàng.

Mỗi bước nên làm trên một branch riêng, hoàn thành, kiểm thử, merge vào `dev`, sau đó mới chuyển sang bước tiếp theo.

## Định Hướng Sản Phẩm

Sales Builder là nền tảng website bán hàng cho một cửa hàng hoặc doanh nghiệp nhỏ/trung bình.

MVP cần có:

- Trang storefront public để khách xem sản phẩm, bộ sưu tập và nội dung bán hàng.
- Module sản phẩm, danh mục, tồn kho cơ bản.
- Giỏ hàng và checkout.
- Quản lý đơn hàng.
- Tài khoản khách hàng.
- Admin dashboard để quản lý sản phẩm, đơn hàng, khách hàng, nội dung và cấu hình bán hàng.
- Nền tảng kỹ thuật đủ sạch để sau này mở rộng thanh toán, vận chuyển, khuyến mãi và multi-store.

## Nguyên Tắc Làm Việc

- Branch chính production: `main`
- Branch tổng hợp phát triển: `dev`
- Mỗi hạng mục làm trên branch riêng: `feature/...`, `setup/...`, `fix/...`
- Không code nhiều module lớn trong cùng một branch
- Không merge nếu build, lint, typecheck hoặc test quan trọng đang lỗi
- Ưu tiên storefront, quản trị sản phẩm, đơn hàng và bảo mật trước các tính năng nâng cao

## Flow Tuần Tự Xây Dựng

### 01. Chuẩn Hóa Repository

Branch: `setup/project-foundation`

Nội dung cần làm:

- Đổi tên dự án sang `Sales Builder` ở README, package metadata và tài liệu chính.
- Kiểm tra cấu trúc dự án hiện tại.
- Chuẩn hóa script chạy dự án: `dev`, `build`, `lint`, `test`, `typecheck`.
- Thêm hoặc cập nhật file `.env.example`.
- Chuẩn hóa format code bằng ESLint/Prettier nếu chưa có.
- Kiểm tra TypeScript config nếu dự án dùng TypeScript.
- Thêm README hướng dẫn setup local.

Kết quả cần có:

- Developer mới có thể clone project, cài dependencies và chạy local được.
- Mọi biến môi trường quan trọng đều có trong `.env.example`.
- Có lệnh kiểm tra chất lượng code có thể chạy lặp lại.
- Tên dự án và mục tiêu sản phẩm không còn lệch sang job portal.

### 02. Chuẩn Hóa Cấu Trúc Thư Mục

Branch: `setup/project-structure`

Nội dung cần làm:

- Chia thư mục theo domain bán hàng:
  - `catalog`
  - `cart`
  - `checkout`
  - `orders`
  - `customers`
  - `content`
  - `admin`
- Tạo các vùng code dùng chung:
  - `components`
  - `features`
  - `entities`
  - `shared`
  - `services`
  - `types`
  - `hooks`
  - `constants`
- Đưa helper dùng chung vào đúng vị trí.
- Đặt quy ước import và export.

Kết quả cần có:

- Code mới biết đặt vào đâu.
- UI, business logic và data access không bị trộn lẫn.
- Sau này thêm module mới không làm vỡ cấu trúc cũ.

### 03. Thiết Kế Role Và Permission

Branch: `feature/auth-permission-model`

Nội dung cần làm:

- Định nghĩa các role:
  - `guest`
  - `customer`
  - `staff`
  - `admin`
- Tạo danh sách permission theo từng role.
- Xác định route nào public.
- Xác định route nào cần đăng nhập.
- Xác định route nào chỉ dành cho customer/staff/admin.
- Viết helper check role/permission dùng chung.

Kết quả cần có:

- Có một nơi rõ ràng để check quyền.
- Không check role tùy tiện ở nhiều nơi khác nhau.
- Storefront, account page và admin dashboard chỉ cần dùng lại permission helper.

### 04. Thiết Kế Database Schema

Branch: `feature/database-schema`

Nội dung cần làm:

- Tạo schema cho các bảng cốt lõi:
  - `users`
  - `customers`
  - `products`
  - `product_variants`
  - `categories`
  - `collections`
  - `inventory_items`
  - `carts`
  - `cart_items`
  - `orders`
  - `order_items`
  - `payments`
  - `shipping_addresses`
  - `discount_codes`
  - `cms_pages`
  - `audit_logs`
- Thêm relationship giữa product, variant, cart, order và customer.
- Thêm index cho các cột hay tìm kiếm:
  - product title
  - slug
  - sku
  - category id
  - order number
  - customer id
- Tạo migration đầu tiên.

Kết quả cần có:

- Database có đủ nền tảng cho MVP bán hàng.
- Relationship rõ ràng, tránh sửa schema lớn quá sớm.
- Có migration để mọi máy local tạo database giống nhau.

### 05. Xây Dựng Auth Cơ Bản

Branch: `feature/auth-basic`

Nội dung cần làm:

- Đăng ký tài khoản khách hàng.
- Đăng nhập.
- Đăng xuất.
- Lưu session/token an toàn.
- Bảo vệ route cần đăng nhập.
- Gán role mặc định là `customer` khi đăng ký public.
- Chặn đăng ký `admin` từ public form.
- Validate input đăng ký/đăng nhập.

Kết quả cần có:

- Khách hàng có thể tạo tài khoản và đăng nhập.
- Route riêng tư không mở cho guest.
- Hệ thống biết user hiện tại là ai và có role gì.

### 06. Xây Dựng Storefront Layout Và Navigation

Branch: `feature/storefront-layout`

Nội dung cần làm:

- Tạo layout public cho storefront.
- Tạo header, footer, navigation, search entry.
- Tạo layout account cho customer.
- Tạo layout admin dashboard cho staff/admin.
- Hiển thị menu theo role.
- Thêm loading, empty và unauthorized state.

Kết quả cần có:

- Khách truy cập thấy giao diện bán hàng rõ ràng.
- Customer có khu vực tài khoản riêng.
- Staff/admin có khu vực quản trị riêng.

### 07. Xây Dựng Catalog Và Product Module

Branch: `feature/product-catalog`

Nội dung cần làm:

- Admin tạo sản phẩm.
- Admin cập nhật sản phẩm.
- Admin ẩn/hiện sản phẩm.
- Thêm ảnh sản phẩm hoặc trường image url nếu chưa làm upload.
- Thêm biến thể sản phẩm: SKU, giá, tồn kho, thuộc tính.
- Public xem danh sách sản phẩm.
- Public xem chi tiết sản phẩm.
- Validate thông tin sản phẩm.

Kết quả cần có:

- Có sản phẩm thật sự trong hệ thống.
- Storefront có dữ liệu để bán.
- Admin có thể quản lý vòng đời sản phẩm.

### 08. Xây Dựng Category Và Collection

Branch: `feature/category-collection`

Nội dung cần làm:

- Admin tạo/sửa/xóa danh mục.
- Admin tạo/sửa/xóa collection.
- Gắn sản phẩm vào category/collection.
- Public xem trang category.
- Public xem trang collection.
- Hỗ trợ slug SEO-friendly.

Kết quả cần có:

- Sản phẩm được tổ chức rõ ràng.
- Storefront có trang danh mục và bộ sưu tập.
- Khách hàng duyệt sản phẩm dễ hơn.

### 09. Xây Dựng Tìm Kiếm Và Lọc Sản Phẩm

Branch: `feature/product-search-filter`

Nội dung cần làm:

- Tìm kiếm theo keyword.
- Lọc theo danh mục.
- Lọc theo giá.
- Lọc theo trạng thái còn hàng.
- Lọc theo thuộc tính biến thể nếu có.
- Sắp xếp theo mới nhất, giá tăng/giảm, bán chạy nếu có dữ liệu.
- Thêm pagination.

Kết quả cần có:

- Khách hàng tìm sản phẩm nhanh hơn.
- Danh sách sản phẩm không tải quá nhiều dữ liệu một lúc.
- Query có cấu trúc để sau này nâng cấp search.

### 10. Xây Dựng Cart Module

Branch: `feature/cart`

Nội dung cần làm:

- Guest thêm sản phẩm vào giỏ hàng.
- Customer đăng nhập vẫn giữ được giỏ hàng.
- Cập nhật số lượng item.
- Xóa item khỏi giỏ hàng.
- Tính subtotal.
- Validate tồn kho khi thêm/cập nhật cart.

Kết quả cần có:

- Khách hàng có thể chuẩn bị đơn hàng.
- Cart hoạt động cho cả guest và customer.
- Không cho mua quá số lượng tồn kho.

### 11. Xây Dựng Checkout Flow

Branch: `feature/checkout-flow`

Nội dung cần làm:

- Nhập thông tin người nhận.
- Chọn địa chỉ giao hàng.
- Chọn phương thức vận chuyển tạm thời.
- Chọn phương thức thanh toán tạm thời.
- Áp dụng discount code nếu có.
- Review đơn hàng trước khi đặt.
- Tạo order từ cart.

Kết quả cần có:

- Khách hàng có thể đặt đơn từ giỏ hàng.
- Order được tạo với snapshot sản phẩm, giá, địa chỉ và tổng tiền.
- Cart được clear hoặc đánh dấu completed sau khi đặt hàng.

### 12. Xây Dựng Order Management

Branch: `feature/order-management`

Nội dung cần làm:

- Customer xem lịch sử đơn hàng.
- Customer xem chi tiết đơn hàng.
- Admin xem danh sách đơn hàng.
- Admin cập nhật trạng thái đơn:
  - pending
  - paid
  - processing
  - shipped
  - completed
  - cancelled
  - refunded
- Ghi audit log khi trạng thái đơn thay đổi.

Kết quả cần có:

- Flow bán hàng cốt lõi hoạt động trọn vẹn.
- Customer và admin đều theo dõi được tiến trình đơn hàng.
- Có rule bảo vệ dữ liệu giữa các user.

### 13. Xây Dựng Inventory Cơ Bản

Branch: `feature/inventory-basic`

Nội dung cần làm:

- Lưu số lượng tồn kho theo product variant.
- Giảm tồn kho khi order được xác nhận.
- Hoàn tồn kho khi order bị hủy nếu cần.
- Cảnh báo sản phẩm sắp hết hàng.
- Admin cập nhật số lượng tồn kho thủ công.

Kết quả cần có:

- Không bán vượt quá tồn kho.
- Admin có điểm kiểm soát inventory.
- Checkout có dữ liệu tồn kho đáng tin cậy hơn.

### 14. Xây Dựng Admin Dashboard Tối Thiểu

Branch: `feature/admin-dashboard`

Nội dung cần làm:

- Admin xem tổng quan số sản phẩm, đơn hàng, khách hàng, doanh thu.
- Admin quản lý sản phẩm.
- Admin quản lý đơn hàng.
- Admin quản lý khách hàng.
- Admin xem audit log cơ bản.

Kết quả cần có:

- Hệ thống có điểm vận hành nội bộ.
- Có thể vận hành MVP an toàn hơn.
- Các hành động quan trọng của admin được ghi lại.

### 15. Xây Dựng CMS Nội Dung Bán Hàng

Branch: `feature/storefront-cms`

Nội dung cần làm:

- Admin tạo/sửa trang nội dung.
- Quản lý homepage sections.
- Quản lý banner/hero content.
- Quản lý trang giới thiệu, chính sách giao hàng, chính sách đổi trả.
- Public xem page theo slug.
- Thêm metadata SEO cơ bản.

Kết quả cần có:

- Storefront không chỉ là danh sách sản phẩm.
- Chủ shop có thể cập nhật nội dung bán hàng.
- Các trang chính sách phục vụ checkout và vận hành.

### 16. Thêm Discount Và Promotion Cơ Bản

Branch: `feature/discounts-basic`

Nội dung cần làm:

- Admin tạo discount code.
- Hỗ trợ giảm theo số tiền cố định.
- Hỗ trợ giảm theo phần trăm.
- Thiết lập ngày bắt đầu/kết thúc.
- Thiết lập giới hạn số lần dùng nếu cần.
- Áp dụng discount trong cart/checkout.

Kết quả cần có:

- Store có công cụ bán hàng cơ bản.
- Checkout tính tổng tiền rõ ràng.
- Rule discount tập trung, không hard-code rải rác.

### 17. Thêm Notification Và Email Cơ Bản

Branch: `feature/notifications-basic`

Nội dung cần làm:

- Tạo notification khi order được tạo.
- Tạo notification khi trạng thái order thay đổi.
- Customer xem thông báo của mình.
- Admin xem thông báo đơn hàng mới.
- Chuẩn bị email template cho order confirmation.

Kết quả cần có:

- Customer nhận phản hồi rõ ràng sau khi đặt hàng.
- Admin không cần tự vào từng trang để kiểm tra đơn mới.
- Có nền tảng cho email transactional sau này.

### 18. Tăng Cường Validation Và Security

Branch: `hardening/security-validation`

Nội dung cần làm:

- Kiểm tra toàn bộ API/server action.
- Đảm bảo mọi action quan trọng đều check auth và role.
- Đảm bảo customer không xem/sửa đơn hàng của người khác.
- Đảm bảo staff/admin không thao tác vượt quyền.
- Sanitize nội dung rich text nếu có.
- Giới hạn kích thước và định dạng file upload.
- Xử lý lỗi theo format thống nhất.

Kết quả cần có:

- Giảm rủi ro lộ dữ liệu.
- Giảm rủi ro user thao tác vượt quyền.
- Lỗi được trả về rõ ràng, không lộ thông tin nhạy cảm.

### 19. Thêm Seed Data Và Dữ Liệu Mẫu

Branch: `setup/seed-data`

Nội dung cần làm:

- Tạo customer mẫu.
- Tạo staff/admin mẫu.
- Tạo danh mục mẫu.
- Tạo collection mẫu.
- Tạo danh sách sản phẩm mẫu.
- Tạo cart/order mẫu.
- Tạo CMS page mẫu.

Kết quả cần có:

- Developer có dữ liệu để test UI nhanh.
- Demo sản phẩm không bị trống.
- QA có thể lặp lại kịch bản test.

### 20. Thêm Test Cho Luồng Chính

Branch: `test/core-flows`

Nội dung cần làm:

- Test validation auth.
- Test permission helper.
- Test tạo sản phẩm.
- Test thêm vào cart.
- Test checkout tạo order.
- Test customer không xem order của người khác.
- Test admin cập nhật trạng thái order.
- Test tính discount.

Kết quả cần có:

- Các luồng có rủi ro cao được bảo vệ.
- Sau này refactor ít sợ vô tình làm hỏng logic cốt lõi.

### 21. Chuẩn Hóa CI/CD

Branch: `setup/ci-pipeline`

Nội dung cần làm:

- Thêm pipeline chạy khi push/PR.
- Chạy install dependencies.
- Chạy lint.
- Chạy typecheck.
- Chạy test.
- Chạy build.
- Chặn merge nếu pipeline fail.

Kết quả cần có:

- Lỗi cơ bản bị bắt trước khi merge.
- Branch `dev` ổn định hơn.
- Team phát triển nhanh mà ít phá nhau hơn.

### 22. Tối Ưu UX Và Performance

Branch: `feature/ux-performance-pass`

Nội dung cần làm:

- Thêm skeleton/loading state.
- Thêm empty state cho danh sách rỗng.
- Tối ưu query danh sách sản phẩm.
- Tối ưu pagination.
- Kiểm tra responsive mobile.
- Kiểm tra cart/checkout trên mobile.
- Giảm re-render không cần thiết nếu dùng React/Next.js.

Kết quả cần có:

- Sản phẩm dùng mượt hơn.
- Giao diện không bị vỡ trên mobile.
- Danh sách lớn vẫn tải tốt.
- Checkout không gây khó chịu trên màn hình nhỏ.

### 23. Chuẩn Bị Staging Và Production

Branch: `setup/deployment-readiness`

Nội dung cần làm:

- Tách env cho local, staging, production.
- Kiểm tra migration production.
- Thiết lập backup database.
- Cấu hình logging lỗi.
- Cấu hình monitoring cơ bản.
- Kiểm tra secret không nằm trong source code.
- Viết checklist deploy.

Kết quả cần có:

- Có thể deploy an toàn.
- Có cách rollback hoặc xử lý khi deploy lỗi.
- Production không phụ thuộc thao tác thủ công tùy tiện.

## Thứ Tự Merge Đề Xuất

1. `setup/project-foundation`
2. `setup/project-structure`
3. `feature/auth-permission-model`
4. `feature/database-schema`
5. `feature/auth-basic`
6. `feature/storefront-layout`
7. `feature/product-catalog`
8. `feature/category-collection`
9. `feature/product-search-filter`
10. `feature/cart`
11. `feature/checkout-flow`
12. `feature/order-management`
13. `feature/inventory-basic`
14. `feature/admin-dashboard`
15. `feature/storefront-cms`
16. `feature/discounts-basic`
17. `feature/notifications-basic`
18. `hardening/security-validation`
19. `setup/seed-data`
20. `test/core-flows`
21. `setup/ci-pipeline`
22. `feature/ux-performance-pass`
23. `setup/deployment-readiness`

## Checklist Trước Khi Merge Mỗi Branch

- Code đã chạy local.
- Không có lỗi lint.
- Không có lỗi typecheck.
- Build thành công.
- Đã test flow liên quan.
- Không sửa file/module không liên quan.
- Không commit `.env` hoặc secret.
- Tên branch và commit message rõ nghĩa.

## Hướng Phát Triển Sau MVP

Sau khi hoàn thành flow trên, có thể tiếp tục theo các branch riêng:

- `feature/online-payments`
- `feature/shipping-integrations`
- `feature/product-reviews`
- `feature/wishlist`
- `feature/advanced-search`
- `feature/email-marketing`
- `feature/customer-segments`
- `feature/abandoned-cart`
- `feature/multi-store`
- `feature/sales-analytics`
- `feature/staff-permission-management`
