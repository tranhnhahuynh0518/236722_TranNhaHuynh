# Food Cloud — Hệ thống quản lý món ăn

Bài thi thực hành tổng hợp Điện toán đám mây: React + Node.js + Express + MongoDB Atlas + GitHub + Docker Hub + Render.

## Thông tin cá nhân (thay theo đề)
- MSSV: `236722`
- Họ tên: `TranNhaHuynh`
- Repository GitHub: `https://github.com/tranhnhahuynh0518/236722_TranNhaHuynh`
- Database MongoDB Atlas: `236722_TranNhaHuynh` (collection `foods`)
- Docker Hub backend image: `https://hub.docker.com/r/trannhahuynh0518/backend`
- Docker Hub frontend image: `https://hub.docker.com/r/trannhahuynh0518/frontend`
- URL frontend Render: `https://web-236722.onrender.com`
- URL backend Render: `https://api-236722.onrender.com`
## Cấu trúc
- `backend/`: API Node.js / Express / Mongoose
- `frontend/`: giao diện React / Vite, web server Express phục vụ SPA
- `samples/foods.json`: 3 bản ghi mẫu nhập MongoDB Atlas

- `docs/KIEM_TRA_NB.md`: bảng kiểm cuối bài


## Kiểm tra tổng thể và hoàn thiện bài nộp

### 1. Các đường dẫn triển khai

- GitHub: https://github.com/tranhnhahuynh0518/236722_TranNhaHuynh
- Docker Backend: https://hub.docker.com/r/trannhahuynh0518/backend
- Docker Frontend: https://hub.docker.com/r/trannhahuynh0518/frontend
- Render Frontend: https://web-236722.onrender.com
- Render Backend: https://api-236722.onrender.com
- MongoDB Atlas: 236722_TranNhaHuynh
- Collection: foods

### 2. Kiểm thử Backend API

Đã kiểm thử các chức năng:
- GET danh sách món ăn.
- GET chi tiết món ăn.
- POST thêm món ăn.
- PUT cập nhật món ăn.
- DELETE xóa món ăn.
- Tìm kiếm món ăn không dấu.
- Kiểm tra mã món ăn trùng: HTTP 409.
- Kiểm tra dữ liệu không hợp lệ: HTTP 400.
- Kiểm tra món ăn không tồn tại: HTTP 404.

### 3. Kiểm tra hệ thống triển khai

- Backend Render sử dụng MongoDB Atlas.
- Frontend Render được cấu hình gọi Backend Render.
- GET /health: kiểm tra trạng thái backend.
- GET /api/foods: kiểm tra dữ liệu từ MongoDB.
- Kiểm tra các chức năng quản lý món ăn trên giao diện web.

### 4. Bảo mật

- Không đưa file .env lên GitHub.
- Sử dụng biến môi trường cho MongoDB Atlas.
- Không công khai mật khẩu hoặc access token.
