# NuBeNa

Landing page túi vải hình hộp may tay, viết bằng Next.js (App Router). Form liên hệ gửi mail qua Server Action + Nodemailer.

## Chạy local

```bash
npm install
# One-time on host Postgres (if DB chưa có):
#   psql -h 127.0.0.1 -U postgres -c 'CREATE DATABASE minipouch;'
npm run db:ping
npm run db:migrate          # SQL migrations only (DB_SYNC=false)
npm run db:migrate:status
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Postgres

Local dùng Postgres **đã chạy trên máy** (cùng instance pgAdmin `local` / project `graph`): `postgres` / `postgres` @ `127.0.0.1:5432`, database `minipouch`. Không tạo container DB mới cho project này.  
Production (Vercel): `SERVICE_URL` = Aiven URI (`postgres://…?sslmode=require`), plus optional `DB_CA_CERT` / `DB_*`.

**No sync mode:** keep `DB_SYNC=false`. Schema changes live in `db/migrations/*.sql` and run with `npm run db:migrate` (never auto-create tables at runtime).

Client: `lib/db.ts` (`getPool`, `query`, `getDatabaseUrl`, `pingDatabase`). Health: `GET /api/health/db`.

## Trang

- `/` — giới thiệu, sản phẩm nổi bật, công dụng
- `/san-pham` — danh sách toàn bộ túi
- `/san-pham/[id]` — trang chi tiết từng mẫu
- `/ve-chung-minh` — sứ mệnh / vì sao may túi này
- `/lien-he` — form gửi email

## Điền thông tin thật

- Thương hiệu, địa chỉ, SĐT, MXH: `lib/site.ts`
- Tên túi, giá, mô tả: thêm object mới vào mảng `products` trong `lib/products.ts` (trang `/san-pham` hiện hết)
- Ảnh sản phẩm: thả file vào `public/products/`, rồi thêm `image: "/products/ten-file.jpg"` cho từng mẫu. Không có ảnh thì trang dùng minh họa vải.
  `pattern` chọn một trong: `floral` | `gingham` | `linen` | `dots`

## Gửi mail từ form liên hệ

1. Copy `.env.example` thành `.env`
2. Điền SMTP (Gmail dùng App Password)
3. Khởi động lại `npm run dev`

Chưa cấu hình SMTP thì form vẫn chạy: nội dung in ra terminal để bạn kiểm tra.

## Scripts

```bash
npm run dev
npm run build
npm start
```
