"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  credentialsMatch,
  isAdmin,
  adminConfigured,
} from "@/lib/admin-session";
import { readCatalog, saveProducts, uploadProductImage } from "@/lib/catalog";
import { patterns, type BagPattern, type Product } from "@/lib/products";
import { site } from "@/lib/site";

export type AdminFormState = {
  status: "idle" | "error";
  message: string;
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "tui";
}

function uniqueId(name: string, products: Product[]) {
  const base = slugify(name);
  if (!products.some((product) => product.id === base)) return base;
  let index = 2;
  while (products.some((product) => product.id === `${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function cleanImage(value: string) {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    return null;
  }
  return null;
}

function refreshCatalog() {
  updateTag("products");
}

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/quan-tri/dang-nhap");
}

export async function login(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!adminConfigured()) {
    return {
      status: "error",
      message: "Chưa cấu hình admin_acc và admin_pass.",
    };
  }
  const account = readString(formData, "account");
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  if (!credentialsMatch(account, password)) {
    return { status: "error", message: "Tài khoản hoặc mật khẩu chưa đúng." };
  }
  await createAdminSession();
  redirect("/quan-tri");
}

export async function logout() {
  await clearAdminSession();
  redirect("/quan-tri/dang-nhap");
}

export async function saveProduct(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const existingId = readString(formData, "id");
  const name = readString(formData, "name");
  const tagline = readString(formData, "tagline");
  const price = readString(formData, "price");
  const size = readString(formData, "size") || site.size;
  const pattern = readString(formData, "pattern");
  const description = readString(formData, "description");
  const imageValue = readString(formData, "image");
  const imageFile = formData.get("imageFile");

  if (name.length < 2 || name.length > 80) {
    return { status: "error", message: "Tên túi cần từ 2 đến 80 ký tự." };
  }
  if (tagline.length < 4 || tagline.length > 180) {
    return { status: "error", message: "Câu mô tả ngắn cần từ 4 đến 180 ký tự." };
  }
  if (!price || price.length > 40) {
    return { status: "error", message: "Bạn nhập giá hiển thị, ví dụ 159.000đ." };
  }
  if (size.length > 40) {
    return { status: "error", message: "Kích thước quá dài." };
  }
  if (description.length < 10 || description.length > 2000) {
    return { status: "error", message: "Mô tả cần từ 10 đến 2000 ký tự." };
  }
  if (!patterns.some((item) => item.id === pattern)) {
    return { status: "error", message: "Hãy chọn một họa tiết." };
  }

  let image = cleanImage(imageValue);
  if (imageValue && !image) {
    return { status: "error", message: "Link ảnh cần bắt đầu bằng https:// hoặc /." };
  }

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) {
      return { status: "error", message: "File tải lên cần là ảnh." };
    }
    if (imageFile.size > 4 * 1024 * 1024) {
      return { status: "error", message: "Ảnh cần nhỏ hơn 4MB." };
    }
    try {
      image = await uploadProductImage(imageFile);
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Tải ảnh chưa được.",
      };
    }
  }

  const products = await readCatalog();
  const nextProduct: Product = {
    id: existingId || uniqueId(name, products),
    name,
    tagline,
    price,
    size,
    pattern: pattern as BagPattern,
    description,
    ...(image ? { image } : {}),
  };

  const nextProducts = existingId
    ? products.map((product) => (product.id === existingId ? nextProduct : product))
    : [nextProduct, ...products];

  if (existingId && !products.some((product) => product.id === existingId)) {
    return { status: "error", message: "Không tìm thấy sản phẩm để sửa." };
  }

  try {
    await saveProducts(nextProducts);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Lưu sản phẩm chưa được.",
    };
  }

  refreshCatalog();
  redirect("/quan-tri");
}

export async function deleteProduct(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const id = readString(formData, "id");
  const products = await readCatalog();
  if (!products.some((product) => product.id === id)) {
    return { status: "error", message: "Không tìm thấy sản phẩm." };
  }
  try {
    await saveProducts(products.filter((product) => product.id !== id));
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Xóa sản phẩm chưa được.",
    };
  }
  refreshCatalog();
  redirect("/quan-tri");
}
