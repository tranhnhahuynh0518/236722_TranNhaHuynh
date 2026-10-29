# Food Cloud — Hệ thống quản lý món ăn

Bài thi thực hành tổng hợp Điện toán đám mây: React + Node.js + Express + MongoDB Atlas + GitHub + Docker Hub + Render.

## Thông tin cá nhân (thay theo đề)
- MSSV: `236722`
- Họ tên: `TranNhaHuynh`
- Repository GitHub: `https://github.com/tranhnhahuynh0518/236722_TranNhaHuynh`
- Database MongoDB Atlas: `236722_TraNhaHuynh` (collection `foods`)
- Docker Hub backend image: `https://hub.docker.com/r/trannhahuynh0518/backend`
- Docker Hub frontend image: `https://hub.docker.com/r/trannhahuynh0518/frontend`
- URL frontend Render: `https://web-236722.onrender.com`
- URL backend Render: `CHUA_TRIEN_KHAI`
## Cấu trúc
- `backend/`: API Node.js / Express / Mongoose
- `frontend/`: giao diện React / Vite, web server Express phục vụ SPA
- `samples/foods.json`: 3 bản ghi mẫu nhập MongoDB Atlas
- `docs/HUONG_DAN_9_CAU.md`: lệnh từng bước, ảnh cần chụp, 9 commit
- `docs/KIEM_TRA_NB.md`: bảng kiểm cuối bài

## Chạy trên Windows (PowerShell)

1. Cài Node.js >= 20.19 (khuyến nghị Node 22), Git, Docker Desktop; mở Docker Desktop trước khi dùng lệnh docker.
2. Tạo MongoDB Atlas, database và collection theo tên của mình; lấy MongoDB SRV URI.
3. Backend:
   ```powershell
   cd backend
   Copy-Item .env.example .env
   # Mở .env bằng VS Code để thay MONGODB_URI, DB_NAME
   npm install
   npm start
   ```
   Kiểm tra `http://localhost:5000/health`.
4. Mở PowerShell mới, frontend:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   Truy cập `http://localhost:5173`.

## API
| Method | URL | Ý nghĩa |
|---|---|---|
| GET | `/health` | kiểm tra API và DB |
| GET | `/api/foods` | danh sách |
| GET | `/api/foods/:id` | chi tiết theo MongoDB `_id` |
| POST | `/api/foods` | thêm |
| PUT | `/api/foods/:id` | cập nhật toàn bộ dữ liệu |
| DELETE | `/api/foods/:id` | xóa |
| GET | `/api/foods?search=pho` | tìm theo tên / loại / vùng miền |

## Docker
Backend:
```powershell
docker build -t TEN_DOCKERHUB/backend:latest ./backend
docker run --rm -p 5000:5000 --env-file ./backend/.env TEN_DOCKERHUB/backend:latest
```
Frontend:
```powershell
docker build -t TEN_DOCKERHUB/frontend:latest ./frontend
docker run --rm -p 8080:8080 -e API_BASE_URL=http://localhost:5000 TEN_DOCKERHUB/frontend:latest
```
Không nhúng MONGODB_URI hay mật khẩu vào Dockerfile hoặc image. Không đưa `.env` lên GitHub.

## Render
Tạo **2 Web Services** bằng **Existing Image** từ các image đã push lên Docker Hub. Backend cần biến `MONGODB_URI`, `DB_NAME`, `CORS_ORIGIN`. Frontend cần `API_BASE_URL` (URL backend, không có dấu `/` cuối). Sửa frontend `API_BASE_URL` sau khi có URL backend rồi redeploy (không phải build lại Docker image). Khi triển khai từ Existing Image, Render không tự cập nhật khi image thay đổi.

Đọc `docs/HUONG_DAN_9_CAU.md` để làm đúng trình tự 9 câu và 9 commit.
