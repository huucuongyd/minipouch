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
import {
  readCategories,
  saveCategories,
} from "@/lib/categories";
import { readCatalog, saveProducts, uploadProductImage } from "@/lib/catalog";
import type { Category, Product } from "@/lib/products";
import { site } from "@/lib/site";
import {
  readSiteSettings,
  saveSiteSettings,
  socialPlatforms,
  type SocialLink,
} from "@/lib/site-settings";

export type AdminFormState = {
  status: "idle" | "error" | "ok";
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

function refreshSiteSettings() {
  updateTag("site-settings");
}

function refreshCategories() {
  updateTag("categories");
}

function uniqueCategoryId(label: string, categories: Category[]) {
  const base = slugify(label) || "danh-muc";
  if (!categories.some((category) => category.id === base)) return base;
  let index = 2;
  while (categories.some((category) => category.id === `${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function cleanHttpUrl(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    return null;
  }
  return null;
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
  const imagesValue = readString(formData, "images");
  const imageFiles = formData
    .getAll("imageFiles")
    .filter((item): item is File => item instanceof File && item.size > 0);

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
  const categories = await readCategories();
  if (!categories.some((item) => item.id === pattern)) {
    return { status: "error", message: "Hãy chọn một danh mục." };
  }

  const images: string[] = [];
  for (const line of imagesValue.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const cleaned = cleanImage(trimmed);
    if (!cleaned) {
      return {
        status: "error",
        message: "Mỗi link ảnh cần bắt đầu bằng https:// hoặc /.",
      };
    }
    if (!images.includes(cleaned)) images.push(cleaned);
  }

  for (const imageFile of imageFiles) {
    if (!imageFile.type.startsWith("image/")) {
      return { status: "error", message: "File tải lên cần là ảnh." };
    }
    if (imageFile.size > 4 * 1024 * 1024) {
      return { status: "error", message: "Mỗi ảnh cần nhỏ hơn 4MB." };
    }
    try {
      const uploaded = await uploadProductImage(imageFile);
      if (!images.includes(uploaded)) images.push(uploaded);
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Tải ảnh chưa được.",
      };
    }
  }

  if (images.length > 12) {
    return { status: "error", message: "Tối đa 12 ảnh mỗi sản phẩm." };
  }

  const products = await readCatalog();
  const nextProduct: Product = {
    id: existingId || uniqueId(name, products),
    name,
    tagline,
    price,
    size,
    pattern,
    description,
    ...(images[0] ? { image: images[0] } : {}),
    ...(images.length ? { images } : {}),
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

export async function saveSocialLinks(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const socials: SocialLink[] = [];
  for (const platform of socialPlatforms) {
    const urlValue = readString(formData, `${platform.id}_url`);
    const tag = readString(formData, `${platform.id}_tag`);
    const cleaned = cleanHttpUrl(urlValue);
    if (cleaned === null) {
      return {
        status: "error",
        message: `Link ${platform.label} cần bắt đầu bằng https:// hoặc http://.`,
      };
    }
    if (tag.length > 80) {
      return {
        status: "error",
        message: `Tag ${platform.label} tối đa 80 ký tự.`,
      };
    }
    if (cleaned && !tag) {
      return {
        status: "error",
        message: `Đã có link ${platform.label} thì cần nhập tag hiển thị.`,
      };
    }
    socials.push({ platform: platform.id, url: cleaned, tag });
  }

  try {
    const current = await readSiteSettings();
    await saveSiteSettings({ ...current, socials });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Lưu mạng xã hội chưa được.",
    };
  }

  refreshSiteSettings();
  return { status: "ok", message: "Đã lưu link và tag mạng xã hội." };
}

export async function saveCategory(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const existingId = readString(formData, "id");
  const label = readString(formData, "label");
  const slug = readString(formData, "slug");

  if (label.length < 2 || label.length > 60) {
    return { status: "error", message: "Tên danh mục cần từ 2 đến 60 ký tự." };
  }

  const categories = await readCategories();

  if (existingId) {
    if (!categories.some((category) => category.id === existingId)) {
      return { status: "error", message: "Không tìm thấy danh mục để sửa." };
    }
    try {
      await saveCategories(
        categories.map((category) =>
          category.id === existingId ? { ...category, label } : category,
        ),
      );
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Lưu danh mục chưa được.",
      };
    }
    refreshCategories();
    redirect("/quan-tri");
  }

  let id: string;
  if (slug) {
    id = slugify(slug);
    if (!id) {
      return { status: "error", message: "Mã danh mục không hợp lệ." };
    }
    if (categories.some((category) => category.id === id)) {
      return { status: "error", message: "Mã danh mục đã tồn tại." };
    }
  } else {
    id = uniqueCategoryId(label, categories);
  }

  try {
    await saveCategories([...categories, { id, label }]);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Thêm danh mục chưa được.",
    };
  }

  refreshCategories();
  redirect("/quan-tri");
}

export async function deleteCategory(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const id = readString(formData, "id");
  const categories = await readCategories();
  if (!categories.some((category) => category.id === id)) {
    return { status: "error", message: "Không tìm thấy danh mục." };
  }

  const products = await readCatalog();
  const inUse = products.filter((product) => product.pattern === id);
  if (inUse.length > 0) {
    return {
      status: "error",
      message: `Không xóa được: còn ${inUse.length} sản phẩm đang dùng danh mục này.`,
    };
  }

  if (categories.length <= 1) {
    return { status: "error", message: "Cần giữ ít nhất một danh mục." };
  }

  try {
    await saveCategories(categories.filter((category) => category.id !== id));
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Xóa danh mục chưa được.",
    };
  }

  refreshCategories();
  redirect("/quan-tri");
}
