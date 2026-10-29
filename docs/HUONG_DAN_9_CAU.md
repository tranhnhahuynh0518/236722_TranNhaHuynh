# HƯỚNG DẪN THỰC HÀNH ĐIỆN TOÁN ĐÁM MÂY — 9 CÂU

> Bám theo file **ĐỀ THI THỰC HÀNH ĐIỆN TOÁN ĐÁM MÂY.docx** mà sinh viên gửi. Chạy lệnh bằng **Windows PowerShell** trong VS Code. Dấu `THAY_...` là chỗ phải thay theo tài khoản thật. Bộ source này hoàn chỉnh ở dạng template, không chứa tài khoản, mật khẩu hay dịch vụ đã tạo thay cho sinh viên.

## Chuẩn bị chung (trước Câu 1)

1. Cài [Node.js](https://nodejs.org/) **22 LTS** (Node >= 20.19), [Git](https://git-scm.com/downloads), [VS Code](https://code.visualstudio.com/), [Docker Desktop](https://www.docker.com/products/docker-desktop/); mở Docker Desktop và chờ Docker Engine hoạt động.
2. Tạo/đăng nhập tài khoản [GitHub](https://github.com), [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database), [Docker Hub](https://hub.docker.com), [Render](https://dashboard.render.com). Dùng đúng MSSV + họ tên **không dấu, không khoảng trắng** theo quy ước giảng viên.
3. Giải nén ZIP đến ví dụ `D:\CloudExam\2212345_NguyenVanAn`, mở thư mục này bằng **VS Code > File > Open Folder**, chọn **Terminal > New Terminal** (PowerShell).
4. Kiểm tra:

```powershell
node -v
npm -v
git --version
docker --version
docker info
```

**Ví dụ xuyên suốt:** MSSV `2212345`, tên `NguyenVanAn`, GitHub username `TEN_GITHUB`, Docker Hub username `TEN_DOCKERHUB`. Thay bằng tên tài khoản thật. Tên repo và DB là `2212345_NguyenVanAn`; image Docker theo quy ước thực tế `TEN_DOCKERHUB/backend` và `TEN_DOCKERHUB/frontend`. Nếu được, tạo Docker Hub username trùng chuỗi `2212345nguyenvanan` để giống hệt ví dụ đề.

---

## Câu 1 — Tạo repository GitHub và cấu trúc (commit 1)

**Bước 1.** Vào GitHub > **New repository**. Repository name: `2212345_NguyenVanAn` (đổi thành MSSV_hoten của bạn), visibility **Public**, **KHÔNG chọn** tạo README, .gitignore hoặc License (đã có sẵn ở template). Click **Create repository**.

**Bước 2.** Trong VS Code, bạn sẽ thấy `backend/`, `frontend/`, `samples/`, `docs/`, `.gitignore`, `README.md`. Mở README và thay `THAY_MSSV`, `THAY_HO_TEN`; sau đó nhấn Ctrl+S. Nếu muốn, tạm điền đường dẫn GitHub thật vào ô `Repository GitHub`.

**Bước 3.** Tại terminal gốc dự án:

```powershell
git init
git branch -M main
git config user.name "Ho Ten Cua Ban"
git config user.email "email-cua-ban@example.com"
git remote add origin https://github.com/TEN_GITHUB/2212345_NguyenVanAn.git
git add .gitignore README.md backend/.gitkeep frontend/.gitkeep
git commit -m "Cau 1 - Khoi tao repository va cau truc frontend backend"
git push -u origin main
```

**Lưu ý:** Thay URL thật từ nút **Code** trên repo GitHub. Nếu bạn đã cấu hình Git name/email toàn cục thì có thể bỏ 2 lệnh `git config`. Khi push, đăng nhập GitHub qua trình duyệt / credential manager (không nhập mật khẩu tài khoản vào shell hoặc README).

**Ảnh minh chứng:** Repo **Public** trên GitHub, README, thư mục `backend`, `frontend`, dòng commit 1.

**Xác nhận:** `git status` không nhất thiết sạch vì **file Câu 2–9 trong template vẫn đang chưa track**; đây là chủ ý để commit tuần tự. Không dùng `git add .` lúc này.

---

## Câu 2 — MongoDB Atlas, collection foods và 3 món mẫu (commit 2)

**Bước 1.** Atlas > Create project (nếu cần) > Create Database/Deployments > chọn **Free cluster** khi khả dụng; chờ cluster sẵn sàng.

**Bước 2.** Atlas > **Database Access** > Add New Database User. Tạo username + password mạnh. Gán quyền đọc/ghi trên database của bạn. Ghi nhớ bí mật ở nơi riêng, **không gửi vào chat, không chụp lộ mật khẩu**.

**Bước 3.** Atlas > **Network Access** > Add IP Address > **Add Current IP Address** để chạy local. Đến lúc triển khai Render, thêm các **outbound IP ranges** của Render từ trang dịch vụ Render > Connect > Outbound (khuyến nghị). Chỉ dùng `0.0.0.0/0` **tạm thời nếu bắt buộc**, vì cho phép truy cập từ mọi IP; bảo vệ bằng mật khẩu mạnh và thu hẹp sau đó.

**Bước 4.** Atlas > **Data Explorer** > **Create Database**:

- Database name: `2212345_NguyenVanAn` (thay của bạn, đúng chữ hoa/chữ thường).
- Collection name: `foods`.

**Bước 5.** Mở collection `foods` > **Insert Document** > chế độ **JSON** > mở `samples/foods.json` và **copy toàn bộ mảng JSON**, dán vào editor > **Insert**. Sẽ có ít nhất 3 tài liệu mang `foodId` F001, F002, F003.

**Bước 6.** Atlas > **Connect** > **Drivers / Node.js** > Copy URI bắt đầu bằng `mongodb+srv://`. Chỉ đưa URI vào file local `.env` (tạo tại Câu 3), không đăng lên GitHub. Nếu mật khẩu có `@`, `/`, `#`... phải URL-encode các ký tự đặc biệt (hoặc tạo mật khẩu phù hợp).

**Bước 7.** Git commit các tệp mô tả schema và 3 bản ghi (không commit nội dung xác thực):

```powershell
git add samples/foods.json backend/.env.example
git commit -m "Cau 2 - Thiet ke du lieu MongoDB Atlas va 3 mon mau"
git push
```

**Ảnh:** tên database `MSSV_hoten`, collection `foods`, màn hình chứa 3 bản ghi, Network Access (che thông tin nhạy cảm).

---

## Câu 3 — Backend Node.js Express + MongoDB Atlas (commit 3)

**Bước 1.** Trong terminal gốc:

```powershell
cd backend
Copy-Item .env.example .env
code .env
```

**Bước 2.** Điền file `backend/.env` (chỉ là **ví dụ**, phải thay toàn bộ):

```dotenv
PORT=5000
DB_NAME=2212345_NguyenVanAn
MONGODB_URI=mongodb+srv://DB_USER:DB_PASSWORD@YOUR-CLUSTER.mongodb.net/?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173,http://localhost:8080
```

**Bước 3.** Cài, khởi động:

```powershell
npm install
npm start
```

Khi thành công sẽ thấy `MongoDB Atlas: connected`, sau đó `API: http://localhost:5000`. Giữ terminal backend chạy. Kiểm tra tại trình duyệt `http://localhost:5000/health`, kết quả `{"status":"ok","database":"connected"}`.

**Bước 4.** Mở **PowerShell khác** để test các API (làm từ thư mục nào cũng được):

```powershell
# GET danh sách 3 món
Invoke-RestMethod http://localhost:5000/api/foods
# Tìm theo tên, loại hoặc vùng miền
Invoke-RestMethod 'http://localhost:5000/api/foods?search=pho'
# Tạo món F004
$body = @{
  foodId='F004'; name='Goi cuon'; category='Mon cuon'; cuisine='Mien Nam'
  ingredients=@('Banh trang','Tom','Rau'); price=35000; quantity=10
  description='Goi cuon tuoi ngon'; imageUrl=''
} | ConvertTo-Json
$created = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/foods' -ContentType 'application/json' -Body $body
$created
# Chi tiết theo _id được MongoDB trả về
Invoke-RestMethod "http://localhost:5000/api/foods/$($created._id)"
# PUT: thay toàn bộ thông tin món F004
$changed = @{
  foodId='F004'; name='Goi cuon dac biet'; category='Mon cuon'; cuisine='Mien Nam'
  ingredients=@('Banh trang','Tom','Thit','Rau'); price=40000; quantity=12
  description='Goi cuon sau khi cap nhat'; imageUrl=''
} | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "http://localhost:5000/api/foods/$($created._id)" -ContentType 'application/json' -Body $changed
# DELETE F004 (không xóa 3 dữ liệu mẫu)
Invoke-RestMethod -Method Delete -Uri "http://localhost:5000/api/foods/$($created._id)"
```

**Bước 5.** Test lỗi: POST món với `foodId='F001'` (đã tồn tại) phải nhận `409`, dữ liệu thiếu phải nhận `400`, ID không tồn tại phải `404` (ID phải đúng 24 ký tự hex). Trong PowerShell, `Invoke-RestMethod` sẽ báo lỗi cho HTTP 4xx — **đó là điều mong đợi** khi kiểm thử tình huống sai.

**Bước 6.** Quay lại terminal gốc thư mục dự án (trong terminal backend mới, `cd ..`). Thực hiện:

```powershell
git add backend/package.json backend/package-lock.json backend/src/
git commit -m "Cau 3 - Xay dung API CRUD tim kiem validate va health"
git push
```

Nếu `package-lock.json` chưa có, chạy `npm install` trong `backend` trước.

**Ảnh:** `/health`, GET `/api/foods`, test POST/PUT/DELETE, giao diện Atlas khi dữ liệu thay đổi, commit 3. **Không chụp hoặc push `.env`.**

---

## Câu 4 — Frontend React: danh sách + chi tiết + thêm/sửa/xóa + tìm kiếm (commit 4)

**Bước 1.** Tạo terminal mới tại **thư mục gốc** dự án, chạy:

```powershell
cd frontend
npm install
npm run dev
```

**Bước 2.** Mở `http://localhost:5173`. File `frontend/public/config.js` trỏ frontend local tới backend `http://localhost:5000`. Backend phải đang chạy trong terminal riêng.

**Bước 3.** Tự kiểm tra trên giao diện:

1. Trang chủ liệt kê 3 món mẫu, tên / loại / giá / số lượng.
2. Bấm **Chi tiết** để thấy đầy đủ thông tin.
3. Nhập thông tin **F004** vào form, bấm **Thêm món ăn**.
4. Bấm **Sửa**, thay thông tin, bấm **Lưu cập nhật**.
5. Tìm bằng `phở` hoặc `Miền Trung`.
6. Bấm **Xóa**, xác nhận, kiểm tra món biến mất.
7. Tắt backend tạm thời để xem lỗi kết nối; bật lại backend rồi thử lại.

**Bước 4.** Mở terminal gốc và commit:

```powershell
cd ..
git add frontend/package.json frontend/package-lock.json frontend/index.html frontend/vite.config.js frontend/public/ frontend/src/ frontend/server.cjs
git commit -m "Cau 4 - Xay dung frontend React day du CRUD tim kiem"
git push
```

**Ảnh:** danh sách, form thêm, chi tiết, form sửa, tìm kiếm, thông báo kết quả và commit 4.

---

## Câu 5 — Docker backend và push Docker Hub (commit 5)

**Bước 1.** Mở Docker Desktop, chờ Docker Engine. Vào Docker Hub > **Repositories** > Create repository tên **backend**, Public, trong tài khoản của bạn (hoặc namespace theo giảng viên).

**Bước 2.** Tại thư mục gốc dự án:

```powershell
docker login
docker build -t TEN_DOCKERHUB/backend:latest ./backend
docker images
```

**Bước 3.** Test container chạy riêng (nếu backend `npm start` local đang dùng port 5000, **Ctrl+C** dừng nó trước):

```powershell
docker run --rm --name food-backend -p 5000:5000 --env-file ./backend/.env TEN_DOCKERHUB/backend:latest
```

Vào `http://localhost:5000/health` để kiểm tra. Dừng container bằng `Ctrl+C`. Việc dùng `--env-file` truyền secret **lúc chạy**; Dockerfile và image không chứa password. `.dockerignore` cũng loại file `.env`.

**Bước 4.** Đẩy lên Docker Hub:

```powershell
docker push TEN_DOCKERHUB/backend:latest
```

Kiểm tra repository Public và tag `latest` trên Docker Hub. Link thường là `https://hub.docker.com/r/TEN_DOCKERHUB/backend`.

**Bước 5.** Thêm đường dẫn image vào README mục thông tin cá nhân, rồi:

```powershell
git add backend/Dockerfile backend/.dockerignore README.md
git commit -m "Cau 5 - Docker backend va cap nhat huong dan Docker Hub"
git push
```

**Ảnh:** Docker build thành công, `docker ps` khi đang chạy, `/health` khi chạy Docker, image trên Docker Hub, commit 5.

---

## Câu 6 — Docker frontend và push Docker Hub (commit 6)

**Bước 1.** Docker Hub > tạo thêm repository Public tên **frontend**.

**Bước 2.** Ở thư mục gốc dự án:

```powershell
docker build -t TEN_DOCKERHUB/frontend:latest ./frontend
docker run --rm --name food-frontend -p 8080:8080 -e API_BASE_URL=http://localhost:5000 TEN_DOCKERHUB/frontend:latest
```

Mở `http://localhost:8080`. Chạy backend (local hoặc container) ở cổng 5000 trong terminal khác để thao tác được. Nếu chạy backend Docker, mở một terminal mới (không được dùng trùng cổng 5000 với Node đang chạy):

```powershell
docker run --rm --name food-backend -p 5000:5000 --env-file ./backend/.env TEN_DOCKERHUB/backend:latest
```

**Bước 3.** Kiểm tra danh sách, thêm, sửa, xóa, tìm kiếm tại `http://localhost:8080`. Mở `http://localhost:8080/config.js` để xem runtime config API (không có password).

**Bước 4.** Dừng frontend bằng Ctrl+C rồi push:

```powershell
docker push TEN_DOCKERHUB/frontend:latest
```

**Bước 5.** Thêm link Docker Hub frontend vào README, commit:

```powershell
git add frontend/Dockerfile frontend/.dockerignore README.md
git commit -m "Cau 6 - Docker frontend va cap nhat Docker Hub"
git push
```

**Ảnh:** Docker build, container đang chạy, UI tại 8080, image frontend Docker Hub, commit 6.

---

## Câu 7 — Triển khai frontend Render (commit 7)

**Bước 1.** Render Dashboard > **+ New > Web Service > Existing Image**. Nhập `docker.io/TEN_DOCKERHUB/frontend:latest`, bấm **Connect**.

**Bước 2.** Chọn Name `web-2212345` (đổi MSSV), region thích hợp, plan **Free** nếu hiển thị/đủ điều kiện, và môi trường:

| Key | Value |
|---|---|
| `API_BASE_URL` | `http://localhost:5000` **tạm thời**; thay bằng `https://api-2212345.onrender.com` sau Câu 8 |

Bấm **Deploy Web Service**; chờ trạng thái **Live**, kiểm tra URL `https://web-2212345.onrender.com` (Render hiển thị URL thật, **không tự đoán**).

**Quan trọng:** Vì Câu 8 chưa triển khai backend, ở Câu 7 **có thể chỉ xác minh được web mở**; frontend public *không thể dùng localhost:5000 ở máy người xem*. Sau Câu 8, quay lại frontend Render, đặt `API_BASE_URL` thành URL backend thật, lưu biến môi trường/redeploy rồi kiểm thử CRUD. **Không nhúng localhost hoặc URL API cứng vào Docker image.**

**Bước 3.** Ghi URL frontend Render thật trong README. Commit:

```powershell
git add README.md
git commit -m "Cau 7 - Trien khai frontend tren Render va luu URL"
git push
```

**Ảnh:** dịch vụ frontend trạng thái Live, URL mở được, biến `API_BASE_URL` (không chứa secret), commit 7. Ảnh CRUD trên frontend Render chụp **sau khi xong Câu 8**.

---

## Câu 8 — Triển khai backend Render, kết nối frontend (commit 8)

**Bước 1.** Render > **+ New > Web Service > Existing Image** > `docker.io/TEN_DOCKERHUB/backend:latest` > Connect. Name `api-2212345` (đổi MSSV); chọn region/plan phù hợp.

**Bước 2.** Environment của backend (giá trị MONGODB_URI nhập trong Render Dashboard, **không chia sẻ**):

| Key | Value |
|---|---|
| `MONGODB_URI` | Chuỗi kết nối MongoDB Atlas đầy đủ, đúng tài khoản/mật khẩu |
| `DB_NAME` | `2212345_NguyenVanAn` (thay theo database thật) |
| `CORS_ORIGIN` | `https://web-2212345.onrender.com,http://localhost:5173,http://localhost:8080` (thay URL web thực tế; không có dấu `/` ở cuối) |
| `PORT` | **Không bắt buộc**; Render tự chuyển lưu lượng đến cổng phát hiện hoặc dùng `5000` nếu cần |

**Bước 3.** Kết nối Atlas > Render: từ Render backend service **Connect > Outbound**, lấy các dải IP outbound và cho phép trong Atlas **Network Access**. Có thể tạm cấp rộng để xác định lỗi trong thời gian thi nhưng phải thu hẹp. Sau đó deploy backend và kiểm tra URL thực tế `https://api-2212345.onrender.com/health`; cần trả `status: ok`, `database: connected`.

**Bước 4.** Render frontend service > **Environment** > sửa:

```text
API_BASE_URL=https://URL-BACKEND-THAT.onrender.com
```

Thực hiện **Save / Deploy** cho service frontend để biến môi trường mới có hiệu lực. Mở URL frontend, nhấn Ctrl+Shift+R, vào `https://URL-FRONTEND-THAT.onrender.com/config.js` để thấy đúng backend URL. Test CRUD toàn bộ.

**Bước 5.** Cập nhật README với URL backend, bổ sung hướng dẫn CORS. Commit:

```powershell
git add README.md
git commit -m "Cau 8 - Trien khai backend Render ket noi Atlas va CORS"
git push
```

**Ảnh:** backend Live, `/health`, `GET /api/foods` trên URL Render, frontend CRUD hoạt động với Atlas, commit 8.

---

## Câu 9 — Kiểm thử tổng thể + chuẩn bị nộp (commit 9)

**Bước 1.** Làm lần lượt các kiểm tra có trong `docs/KIEM_TRA_NB.md`: đọc, thêm, sửa, xóa, tìm kiếm, tình huống sai, MongoDB phản ánh thay đổi; repo public, README, image Docker Hub, URL public, ít nhất 9 commit.

**Bước 2.** Mở trình duyệt ẩn danh thử link GitHub, Docker Hub backend/frontend, Render frontend/backend. Chụp ảnh minh chứng tránh lộ dữ liệu riêng. Cập nhật README đủ 5 link theo đề.

**Bước 3.** Commit hồ sơ hướng dẫn/checklist (thêm nội dung bạn đã hoàn thành vào file kiểm tra):

```powershell
git add README.md docs/
git commit -m "Cau 9 - Kiem thu tong the va hoan thien thong tin nop bai"
git push
git log --oneline -9
git status
```

Bạn cần thấy **>= 9 commit**. Vì source template được tách add theo từng câu nên danh sách commit thật phản ánh tiến độ của bạn, không phải commit rỗng.

**Bước 4.** Điền biểu mẫu theo **file đề được tải sau cùng**:

https://docs.google.com/forms/d/e/1FAIpQLSc6p2I6a-D8EhovwGKEsi4jxoUC7RtcSRQps8_VysECi5jziw/viewform

Các trường nộp: `Link_GitHub`, `Link_Docker_Backend`, `Link_Docker_Frontend`, `Link_Render_App`, `Link_Render_API`, `Link_Data_MongoDB` (tên/đường dẫn xác định DB theo yêu cầu giảng viên, **không gửi MongoDB connection URI có mật khẩu**).

**Ảnh:** kiểm tra tổng thể, GitHub > Commits đủ 9, Docker Hub 2 image, Render 2 dịch vụ, Data Explorer chứa dữ liệu hiện tại, README đủ link, xác nhận nộp bài.

---

## Bảng xử lý lỗi nhanh

| Lỗi | Kiểm tra |
|---|---|
| `npm` không nhận lệnh | Cài Node.js 22; đóng và mở lại PowerShell |
| `docker daemon not running` | Mở Docker Desktop; `docker info` phải chạy được |
| `MongoServerSelectionError`, connection timeout | Atlas Network Access (IP), đúng cluster, Internet/DNS; outbound IP từ Render |
| `bad auth : Authentication failed` | DB user Atlas, password, URL-encode ký tự đặc biệt trong URI |
| `/health` không chạy | MongoDB chưa kết nối/biến `MONGODB_URI`, `DB_NAME` thiếu; xem log backend |
| `409 Mã foodId đã tồn tại` | Đổi `foodId` thành mã mới (ví dụ F004) |
| Frontend hiển thị `Không kết nối được backend` | `/config.js` đúng API chưa; backend Live chưa; CORS đúng URL frontend chưa |
| CORS blocked | Sửa `CORS_ORIGIN` trên Render backend thành **đúng origin** frontend, không có `/` cuối; redeploy |
| Render frontend có giao diện nhưng chưa có dữ liệu | Đừng dùng localhost ở Render; đặt `API_BASE_URL=https://BACKEND-URL` |
| Browser hiển thị `Cannot GET /` | Kiểm tra image frontend chứa `dist/`, `server.cjs`; build thành công |
| Docker Hub `denied: requested access` | `docker login`, image tag dùng đúng **Docker Hub username** và repo đã tạo |
| Git push `repository not found` | `git remote -v`, GitHub URL, đăng nhập/auth và repo public tồn tại |

## Ghi nhớ an toàn

- **Không commit** `.env`, API key, access token, GitHub/Docker Hub passwords.
- Frontend `API_BASE_URL` là URL công khai, không phải secret. Mật khẩu MongoDB chỉ tồn tại trong `backend/.env` local và Render backend Environment.
- Frontend là React SPA do server Express phục vụ qua port 8080; backend Express phục vụ API qua port 5000. Render có thể cấp cổng khác qua biến `PORT`; code đều lắng nghe `process.env.PORT`.
- Dùng đúng **database MSSV_hoten**, **collection foods** và tối thiểu **3** món đầu vào mẫu.
