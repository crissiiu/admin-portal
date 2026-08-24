# Database Documentation

Thư mục này chứa tài liệu thiết kế database cho Sales Builder.

## Tài Liệu Hiện Có

- [Flow 4 - Database schema tổng quan](./flow-4-database-schema.md): plan tổng quan cho schema MySQL theo service.
- [Flow 4 - Chi tiết từng bảng](./flow-4-table-details.md): mô tả mục đích từng bảng, từng field, index chính và ghi chú relationship cho database MySQL theo service.

## Nguyên Tắc Chung

- Database dùng MySQL 8.x.
- Migration chính thức dùng SQL thuần.
- Schema được tách theo service ownership.
- Mọi bảng thuộc dữ liệu tenant phải có `tenant_id`.
- Relationship xuyên service dùng logical reference, không tạo foreign key vật lý xuyên database/service.
- Dữ liệu lịch sử quan trọng như order item phải lưu snapshot, không phụ thuộc vào dữ liệu sản phẩm hiện tại.
- Không xoá cứng dữ liệu ngay khi người dùng/admin bấm xoá. Mặc định dùng soft delete hoặc trạng thái lưu trữ để tránh mất dữ liệu tức thì.
- Việc xoá vật lý dữ liệu rác sẽ do cleanup/retention job xử lý trong tương lai theo từng tính năng; thời gian giữ dữ liệu mặc định là 30 ngày nếu tính năng không cấu hình khác.

## Checklist Theo Dõi Implement

- [x] Chuyển local database từ PostgreSQL sang MySQL.
- [x] Tạo migration SQL đầu tiên theo từng service.
- [x] Tạo đầy đủ các bảng core cho MVP bán hàng.
- [x] Thêm index/unique constraint theo tài liệu.
- [x] Thêm soft delete và retention metadata cho bảng phù hợp.
- [x] Đảm bảo không có logic xoá cứng dữ liệu business trong flow 4.
- [x] Chạy migration trên database sạch.
- [x] Kiểm tra insert dữ liệu mẫu tối thiểu.
- [x] Kiểm tra query mặc định không trả về dữ liệu đã xoá mềm.
- [x] Cập nhật tài liệu nếu schema thực tế có điều chỉnh trong lúc implement.
