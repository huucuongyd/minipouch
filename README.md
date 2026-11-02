# NuBeNa

Landing page túi vải hình hộp may tay, viết bằng Next.js (App Router). Form liên hệ gửi mail qua Server Action + Nodemailer.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Trang

- `/` — giới thiệu, sản phẩm nổi bật, công dụng
- `/san-pham` — danh sách toàn bộ túi
- `/san-pham/[id]` — trang chi tiết từng mẫu
- `/ve-chung-toi` — sứ mệnh / vì sao may túi này
- `/lien-he` — form gửi email

## Điền thông tin thật

- Thương hiệu, địa chỉ, SĐT, MXH: `lib/site.ts`
- Tên túi, giá, mô tả: thêm object mới vào mảng `products` trong `lib/products.ts` (trang `/san-pham` hiện hết)
- Ảnh sản phẩm: thả file vào `public/products/`, rồi thêm `image: "/products/ten-file.jpg"` cho từng mẫu. Không có ảnh thì trang dùng minh họa vải.
  `pattern` chọn một trong: `floral` | `gingham` | `linen` | `dots`

## Gửi mail từ form liên hệ

1. Copy `.env.example` thành `.env.local`
2. Điền SMTP (Gmail dùng App Password)
3. Khởi động lại `npm run dev`

Chưa cấu hình SMTP thì form vẫn chạy: nội dung in ra terminal để bạn kiểm tra.

## Scripts

```bash
npm run dev
npm run build
npm start
```
