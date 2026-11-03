import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { BlobNotFoundError, get, put } from "@vercel/blob";
import { cacheLife, cacheTag } from "next/cache";
import { seedProducts, type Product } from "@/lib/products";

const CATALOG_PATH = "catalog/products.json";
const localCatalogPath = join(process.cwd(), "data", "products.json");

export type CatalogMode = "blob" | "file" | "readonly";

/**
 * Blob SDK auth order: BLOB_READ_WRITE_TOKEN, or OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN).
 * On Vercel, OIDC is injected at runtime — having BLOB_STORE_ID is enough to enable blob mode.
 * Locally, `vercel env pull .env` provides VERCEL_OIDC_TOKEN (or a static RW token).
 */
export function hasBlobCredentials(): boolean {
  const env = process.env;
  if (env.BLOB_READ_WRITE_TOKEN?.trim()) return true;
  if (!env.BLOB_STORE_ID?.trim()) return false;
  // Deployed on Vercel: platform supplies OIDC; do not require reading VERCEL_OIDC_TOKEN here
  // (it may be absent from process.env even though the SDK can use it).
  if (env.VERCEL) return true;
  return Boolean(env.VERCEL_OIDC_TOKEN?.trim());
}

export function catalogMode(): CatalogMode {
  if (hasBlobCredentials()) return "blob";
  if (process.env.VERCEL) return "readonly";
  return "file";
}

function parseProducts(raw: unknown): Product[] | null {
  if (!Array.isArray(raw)) return null;
  const products: Product[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const record = item as Record<string, unknown>;
    if (typeof record.id !== "string" || typeof record.pattern !== "string") return null;
    const pattern = record.pattern.trim();
    if (!pattern) return null;
    if (
      typeof record.name !== "string" ||
      typeof record.tagline !== "string" ||
      typeof record.price !== "string" ||
      typeof record.size !== "string" ||
      typeof record.description !== "string"
    ) {
      return null;
    }
    const images: string[] = [];
    if (Array.isArray(record.images)) {
      for (const item of record.images) {
        if (typeof item !== "string") continue;
        const url = item.trim();
        if (url && !images.includes(url)) images.push(url);
      }
    }
    const cover = typeof record.image === "string" ? record.image.trim() : "";
    if (cover && !images.includes(cover)) images.unshift(cover);

    products.push({
      id: record.id,
      name: record.name,
      tagline: record.tagline,
      price: record.price,
      size: record.size,
      pattern,
      description: record.description,
      ...(images[0] ? { image: images[0] } : {}),
      ...(images.length ? { images } : {}),
    });
  }
  return products;
}

async function readLocalFile(): Promise<Product[] | null> {
  try {
    const text = await readFile(localCatalogPath, "utf8");
    return parseProducts(JSON.parse(text));
  } catch {
    return null;
  }
}

async function readBlob(): Promise<Product[] | null> {
  if (!hasBlobCredentials()) return null;
  try {
    const result = await get(CATALOG_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    const text = await new Response(result.stream).text();
    const parsed = parseProducts(JSON.parse(text));
    if (!parsed) throw new Error("Dữ liệu sản phẩm trên Blob không đúng định dạng.");
    return parsed;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

async function loadProducts(): Promise<Product[]> {
  if (catalogMode() === "blob") {
    const stored = await readBlob();
    if (stored !== null) return stored;
  } else {
    const stored = await readLocalFile();
    if (stored !== null) return stored;
  }
  return seedProducts;
}

export async function readCatalog() {
  return loadProducts();
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  try {
    return await loadProducts();
  } catch (error) {
    console.error("[NuBeNa] Không đọc được sản phẩm:", error);
    return seedProducts;
  }
}

export async function getProduct(id: string) {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

export async function saveProducts(products: Product[]) {
  const body = JSON.stringify(products);
  if (catalogMode() === "blob") {
    await put(CATALOG_PATH, body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  if (catalogMode() === "readonly") {
    throw new Error(
      "Chưa lưu được trên Vercel. Hãy tạo Blob store và kết nối project (OIDC hoặc BLOB_READ_WRITE_TOKEN).",
    );
  }
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(localCatalogPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

export async function uploadProductImage(file: File) {
  if (!hasBlobCredentials()) {
    throw new Error(
      "Chưa có Blob store nên chưa tải ảnh lên được. Chạy vercel env pull .env hoặc dán link ảnh https.",
    );
  }
  // Public product photos use IMAGES_STORE_ID (public store). Catalog stays on private BLOB_STORE_ID.
  const imageStoreId = process.env.IMAGES_STORE_ID?.trim();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-48);
  try {
    const blob = await put(`products/${Date.now()}-${safeName || "anh.jpg"}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || "application/octet-stream",
      ...(imageStoreId ? { storeId: imageStoreId } : {}),
    });
    return blob.url;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/private store/i.test(message)) {
      throw new Error(
        "Store ảnh cần là public. Tạo Blob store public, đặt IMAGES_STORE_ID, rồi vercel env pull .env.",
      );
    }
    throw error;
  }
}
