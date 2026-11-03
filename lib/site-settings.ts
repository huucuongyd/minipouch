import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { BlobNotFoundError, get, put } from "@vercel/blob";
import { cacheLife, cacheTag } from "next/cache";
import { catalogMode } from "@/lib/catalog";
import { site } from "@/lib/site";

const SETTINGS_PATH = "catalog/site.json";
const localSettingsPath = join(process.cwd(), "data", "site.json");

export const socialPlatforms = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number]["id"];

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  tag: string;
};

export type SiteSettings = {
  socials: SocialLink[];
};

export const seedSocials: SocialLink[] = [
  {
    platform: "instagram",
    url: site.instagram,
    tag: site.instagramHandle,
  },
  {
    platform: "facebook",
    url: site.facebook,
    tag: site.name,
  },
  {
    platform: "tiktok",
    url: "",
    tag: "",
  },
];

function isPlatform(value: string): value is SocialPlatform {
  return socialPlatforms.some((platform) => platform.id === value);
}

function parseSettings(raw: unknown): SiteSettings | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (!Array.isArray(record.socials)) return null;

  const byPlatform = new Map<SocialPlatform, SocialLink>();
  for (const item of record.socials) {
    if (!item || typeof item !== "object") continue;
    const social = item as Record<string, unknown>;
    if (typeof social.platform !== "string" || !isPlatform(social.platform)) continue;
    const url = typeof social.url === "string" ? social.url.trim() : "";
    const tag = typeof social.tag === "string" ? social.tag.trim() : "";
    byPlatform.set(social.platform, { platform: social.platform, url, tag });
  }

  return {
    socials: socialPlatforms.map(
      (platform) =>
        byPlatform.get(platform.id) ?? {
          platform: platform.id,
          url: "",
          tag: "",
        },
    ),
  };
}

async function readLocalFile(): Promise<SiteSettings | null> {
  try {
    const text = await readFile(localSettingsPath, "utf8");
    return parseSettings(JSON.parse(text));
  } catch {
    return null;
  }
}

async function readBlob(): Promise<SiteSettings | null> {
  if (catalogMode() !== "blob") return null;
  try {
    const result = await get(SETTINGS_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    const text = await new Response(result.stream).text();
    const parsed = parseSettings(JSON.parse(text));
    if (!parsed) throw new Error("Dữ liệu mạng xã hội trên Blob không đúng định dạng.");
    return parsed;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

async function loadSettings(): Promise<SiteSettings> {
  if (catalogMode() === "blob") {
    const stored = await readBlob();
    if (stored !== null) return stored;
  } else {
    const stored = await readLocalFile();
    if (stored !== null) return stored;
  }
  return { socials: seedSocials };
}

export async function readSiteSettings() {
  return loadSettings();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag("site-settings");
  cacheLife("hours");
  try {
    return await loadSettings();
  } catch (error) {
    console.error("[NuBeNa] Không đọc được cài đặt trang:", error);
    return { socials: seedSocials };
  }
}

export async function getActiveSocials() {
  const settings = await getSiteSettings();
  return settings.socials.filter((social) => social.url);
}

export async function saveSiteSettings(settings: SiteSettings) {
  const body = JSON.stringify(settings);
  if (catalogMode() === "blob") {
    await put(SETTINGS_PATH, body, {
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
  await writeFile(localSettingsPath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}

export function socialLabel(platform: SocialPlatform) {
  return socialPlatforms.find((item) => item.id === platform)?.label ?? platform;
}
