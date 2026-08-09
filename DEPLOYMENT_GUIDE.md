# Hướng dẫn Triển khai (Deployment) Dự án FruitHub

Dự án FruitHub được cấu trúc để chạy linh hoạt cả ở môi trường phát triển cục bộ (Local) và trên hệ thống máy chủ đám mây không máy chủ (Serverless) của Vercel, kết hợp với cơ sở dữ liệu TiDB Serverless.

Tài liệu này sẽ hướng dẫn bạn quy trình 3 bước để triển khai toàn bộ ứng dụng từ số 0 lên Internet.

---

## Bước 1: Cấu hình Cơ sở Dữ liệu (TiDB Serverless)

Dự án này sử dụng **TiDB** (một cơ sở dữ liệu phân tán tương thích với MySQL).

1. Đăng nhập vào [TiDB Cloud](https://tidbcloud.com/).
2. Tạo một Cluster mới (chọn gói Serverless / Free Tier).
3. Trong bảng điều khiển Cluster, bấm nút **Connect** và lấy các thông tin kết nối quan trọng:
   - **Host** (VD: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`)
   - **Port** (Thường là `4000`)
   - **User** (VD: `xxxxxx.root`)
   - **Password**
4. Mở tab **SQL Editor** trong bảng điều khiển TiDB, dán toàn bộ lệnh khởi tạo bảng (File SQL của bạn) và chạy (Run) để tạo cấu trúc cơ sở dữ liệu và dữ liệu mẫu.

---

## Bước 2: Cấu hình dự án trên GitHub và Vercel

Vercel sẽ tự động lấy mã nguồn từ GitHub để xây dựng (Build) và chạy (Hosting).

1. **Đẩy mã nguồn lên GitHub:**
   - Tạo một kho lưu trữ (Repository) mới trên GitHub (VD: `FruitHub`).
   - Mở Terminal ở thư mục dự án và chạy các lệnh:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/Tên_Của_Bạn/FruitHub.git
     git push -u origin main
     ```

2. **Kết nối GitHub với Vercel:**
   - Đăng nhập vào [Vercel](https://vercel.com/) bằng tài khoản GitHub của bạn.
   - Bấm **"Add New..."** > **"Project"**.
   - Tìm kho lưu trữ `FruitHub` vừa tạo và bấm **"Import"**.

---

## Bước 3: Thiết lập Môi trường (Environment Variables)

Đây là bước cực kỳ quan trọng để mã nguồn trên Vercel có thể kết nối đến cơ sở dữ liệu TiDB của bạn (vì file `.env` đã bị ẩn đi bằng `.gitignore` để bảo mật).

Trong màn hình cấu hình Import của Vercel (hoặc nếu đã deploy thì vào thẻ **Settings > Environment Variables**), hãy thêm lần lượt các biến sau (lấy thông tin từ Bước 1):

| Key | Value (Ví dụ) | Ý nghĩa |
| :--- | :--- | :--- |
| `DB_HOST` | `gateway01...tidbcloud.com` | Địa chỉ máy chủ CSDL |
| `DB_PORT` | `4000` | Cổng kết nối |
| `DB_USER` | `xxxxxxxx.root` | Tên đăng nhập |
| `DB_PASSWORD` | `mật_khẩu_của_bạn` | Mật khẩu truy cập |
| `DB_NAME` | `test` | Tên database (thường là `test`) |
| `DB_MULTIPLE_STATEMENTS` | `true` | Cho phép chạy nhiều lệnh SQL |

Sau khi thêm đầy đủ các biến, bấm nút **Deploy**.

---

## 🛠 Cách Cập nhật Code (CI/CD Tự động)

Hệ thống CI/CD của Vercel đã được tích hợp tự động với GitHub. Từ bây giờ, mỗi khi bạn muốn sửa tính năng hoặc giao diện:

1. Bạn sửa mã nguồn trên máy tính (Local).
2. Chạy lệnh:
   ```bash
   git add .
   git commit -m "Mô tả thay đổi của bạn"
   git push origin main
   ```
3. Vercel sẽ nhận được thông báo từ GitHub, tự động tải mã nguồn mới về, tự động Build và cập nhật lên trang web (https://fruit-hub-sepia.vercel.app/) chỉ trong khoảng 30 giây!

---
> **Lưu ý về Serverless Connection:**
> Mã nguồn của hệ thống này đã được tinh chỉnh để dùng `mysql.createPool` thay vì `createConnection` nhằm chống lại tình trạng mất kết nối (Drop Connection) đặc thù của môi trường Serverless. Không được sửa cấu hình này nếu muốn web chạy ổn định.
