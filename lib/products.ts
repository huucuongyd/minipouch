export type BagPattern = "floral" | "gingham" | "linen" | "dots";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  size: string;
  pattern: BagPattern;
  /** Đặt đường dẫn ảnh tại đây sau, ví dụ "/products/hoa-nhi.jpg" */
  image?: string;
  /** Mô tả dài hiện trên trang chi tiết sản phẩm */
  description: string;
};

export const patterns: { id: BagPattern; label: string }[] = [
  { id: "floral", label: "Hoa nhí" },
  { id: "gingham", label: "Caro sage" },
  { id: "linen", label: "Linen trơn" },
  { id: "dots", label: "Chấm bi" },
];

export const seedProducts: Product[] = [
  {
    id: "hoa-nhi",
    name: "Hoa Nhí",
    tagline: "Họa tiết hoa nhỏ trên nền kem — ngọt mà không sến.",
    price: "159.000đ",
    size: "15 × 25 cm",
    pattern: "floral",
    description:
      "Túi hình hộp vải cotton họa tiết hoa nhí. Đứng form, kéo khóa trên miệng. Phù hợp đựng mỹ phẩm, làm quà, hoặc mang theo đồ lặt vặt trong ngày.",
  },
  {
    id: "caro-sage",
    name: "Caro Sage",
    tagline: "Kẻ caro xanh sage, dịu như một buổi sáng chậm.",
    price: "159.000đ",
    size: "15 × 25 cm",
    pattern: "gingham",
    description:
      "Caro xanh sage may tay, nhẹ và đứng dáng. Vừa khay cơm văn phòng, cũng xinh khi để trên bàn làm việc.",
  },
  {
    id: "linen-be",
    name: "Linen Be",
    tagline: "Vải linen trơn, tối giản — hợp mọi outfit.",
    price: "149.000đ",
    size: "15 × 25 cm",
    pattern: "linen",
    description:
      "Linen be trơn, ít họa tiết. Dành cho bạn thích đồ tối giản: đựng sách mỏng, hộp cơm, hoặc gói quà không cần giấy gói.",
  },
  {
    id: "cham-bi",
    name: "Chấm Bi Đào",
    tagline: "Chấm bi trên nền đào, mang đi là thấy vui.",
    price: "159.000đ",
    size: "15 × 25 cm",
    pattern: "dots",
    description:
      "Nền đào chấm bi, tươi mà không rối. Hay được chọn làm túi đựng skincare mini hoặc quà sinh nhật bạn thân.",
  },
];

export const uses = [
  {
    title: "Làm quà",
    body: "Gói sẵn, viết một dòng nhớ thương. Món quà nhỏ cho bạn thân, đồng nghiệp, hay chính bạn.",
    icon: "gift",
  },
  {
    title: "Đựng mỹ phẩm",
    body: "Son, cushion, tẩy trang — xếp gọn một góc, không còn lộn xộn dưới đáy túi.",
    icon: "makeup",
  },
  {
    title: "Đựng hộp cơm",
    body: "Vừa khay cơm văn phòng. Mang đi làm vẫn chỉn chu, không nhăn áo, không lo đổ.",
    icon: "lunch",
  },
  {
    title: "Đồ nhỏ gọn",
    body: "Sạc, tai nghe, thuốc, chìa khóa — những thứ hay thất lạc, giờ có chỗ riêng.",
    icon: "bits",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Mình mua làm túi đựng skincare mini mang đi học. Xinh thật, đứng form luôn.",
    name: "Minh Anh",
    meta: "Sinh viên, Hà Nội",
  },
  {
    quote:
      "Tặng bạn thân sinh nhật, bạn khen suốt. Chiếc túi nhỏ mà gói được cả thành ý.",
    name: "Thu Hà",
    meta: "Nhân viên văn phòng, TP.HCM",
  },
  {
    quote:
      "Đựng hộp cơm vừa khít. Trưa mang ra bàn là đồng nghiệp hỏi mua ở đâu.",
    name: "Ngọc",
    meta: "Designer, Đà Nẵng",
  },
];
