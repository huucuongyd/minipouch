import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { BlobNotFoundError, get, put } from "@vercel/blob";
import { cacheLife, cacheTag } from "next/cache";
import { catalogMode, hasBlobCredentials } from "@/lib/catalog";
import { patterns as seedPatterns, type Category } from "@/lib/products";

const CATEGORIES_PATH = "catalog/categories.json";
const localCategoriesPath = join(process.cwd(), "data", "categories.json");

export type { Category };

export const seedCategories: Category[] = seedPatterns.map((pattern) => ({
  id: pattern.id,
  label: pattern.label,
}));

function parseCategories(raw: unknown): Category[] | null {
  if (!Array.isArray(raw)) return null;
  const categories: Category[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const record = item as Record<string, unknown>;
    if (typeof record.id !== "string" || typeof record.label !== "string") return null;
    const id = record.id.trim();
    const label = record.label.trim();
    if (!id || !label || seen.has(id)) return null;
    seen.add(id);
    categories.push({ id, label });
  }
  return categories;
}

async function readLocalFile(): Promise<Category[] | null> {
  try {
    const text = await readFile(localCategoriesPath, "utf8");
    return parseCategories(JSON.parse(text));
  } catch {
    return null;
  }
}

async function readBlob(): Promise<Category[] | null> {
  if (!hasBlobCredentials()) return null;
  try {
    const result = await get(CATEGORIES_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    const text = await new Response(result.stream).text();
    const parsed = parseCategories(JSON.parse(text));
    if (!parsed) throw new Error("Dữ liệu danh mục trên Blob không đúng định dạng.");
    return parsed;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

async function loadCategories(): Promise<Category[]> {
  if (catalogMode() === "blob") {
    const stored = await readBlob();
    if (stored !== null) return stored;
  } else {
    const stored = await readLocalFile();
    if (stored !== null) return stored;
  }
  return seedCategories;
}

export async function readCategories() {
  return loadCategories();
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("categories");
  cacheLife("hours");
  try {
    return await loadCategories();
  } catch (error) {
    console.error("[NuBeNa] Không đọc được danh mục:", error);
    return seedCategories;
  }
}

export async function saveCategories(categories: Category[]) {
  const body = JSON.stringify(categories);
  if (catalogMode() === "blob") {
    await put(CATEGORIES_PATH, body, {
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
  await writeFile(localCategoriesPath, `${JSON.stringify(categories, null, 2)}\n`, "utf8");
}
