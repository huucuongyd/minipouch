-- Seed defaults matching lib/products.ts / lib/site-settings.ts (idempotent).

INSERT INTO categories (id, label, sort_order) VALUES
  ('floral', 'Hoa nhí', 1),
  ('gingham', 'Caro sage', 2),
  ('linen', 'Linen trơn', 3),
  ('dots', 'Chấm bi', 4)
ON CONFLICT (id) DO UPDATE
SET
  label = EXCLUDED.label,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, tagline, price, size, category_id, description, cover_image, sort_order
) VALUES
  (
    'hoa-nhi',
    'Hoa Nhí',
    'Họa tiết hoa nhỏ trên nền kem — ngọt mà không sến.',
    '159.000đ',
    '15 × 25 cm',
    'floral',
    'Vải cotton họa tiết hoa nhí, đứng form, kéo khóa trên miệng. Phù hợp đựng mỹ phẩm, làm quà, hoặc mang theo đồ lặt vặt trong ngày.',
    '/products/hoa-nhi-1.jpg',
    1
  ),
  (
    'caro-sage',
    'Caro Sage',
    'Kẻ caro xanh sage, dịu như một buổi sáng chậm.',
    '159.000đ',
    '15 × 25 cm',
    'gingham',
    'Caro xanh sage may tay, nhẹ và đứng dáng. Vừa khay cơm văn phòng, cũng xinh khi để trên bàn làm việc.',
    '/products/caro-sage-1.jpg',
    2
  ),
  (
    'linen-be',
    'Linen Be',
    'Vải linen trơn, tối giản — hợp mọi outfit.',
    '149.000đ',
    '15 × 25 cm',
    'linen',
    'Linen be trơn, ít họa tiết. Dành cho bạn thích đồ tối giản: đựng sách mỏng, hộp cơm, hoặc gói quà không cần giấy gói.',
    '/products/linen-be-1.jpg',
    3
  ),
  (
    'cham-bi',
    'Chấm Bi Đào',
    'Chấm bi trên nền đào, mang đi là thấy vui.',
    '159.000đ',
    '15 × 25 cm',
    'dots',
    'Nền đào chấm bi, tươi mà không rối. Hay được chọn làm túi đựng skincare mini hoặc quà sinh nhật bạn thân.',
    '/products/cham-bi-1.jpg',
    4
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  size = EXCLUDED.size,
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  cover_image = EXCLUDED.cover_image,
  sort_order = EXCLUDED.sort_order;

INSERT INTO product_images (product_id, url, sort_order) VALUES
  ('hoa-nhi', '/products/hoa-nhi-1.jpg', 1),
  ('hoa-nhi', '/products/hoa-nhi-2.jpg', 2),
  ('hoa-nhi', '/products/hoa-nhi-3.jpg', 3),
  ('caro-sage', '/products/caro-sage-1.jpg', 1),
  ('caro-sage', '/products/caro-sage-2.jpg', 2),
  ('linen-be', '/products/linen-be-1.jpg', 1),
  ('linen-be', '/products/linen-be-2.jpg', 2),
  ('cham-bi', '/products/cham-bi-1.jpg', 1),
  ('cham-bi', '/products/cham-bi-2.jpg', 2),
  ('cham-bi', '/products/cham-bi-3.jpg', 3)
ON CONFLICT (product_id, url) DO UPDATE
SET sort_order = EXCLUDED.sort_order;

INSERT INTO site_socials (platform, url, tag) VALUES
  ('instagram', 'https://instagram.com/minipouch.vn', '@minipouch.vn'),
  ('facebook', 'https://facebook.com/minipouch.vn', 'NuBeNa'),
  ('tiktok', '', '')
ON CONFLICT (platform) DO UPDATE
SET
  url = EXCLUDED.url,
  tag = EXCLUDED.tag;
