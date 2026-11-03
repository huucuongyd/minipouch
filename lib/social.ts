/** Client-safe social platform metadata (no server-only imports). */

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

export function socialLabel(platform: SocialPlatform) {
  return socialPlatforms.find((item) => item.id === platform)?.label ?? platform;
}

export function isSocialPlatform(value: string): value is SocialPlatform {
  return socialPlatforms.some((platform) => platform.id === value);
}
