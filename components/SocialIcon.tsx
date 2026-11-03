import type { SocialPlatform } from "@/lib/site-settings";

export function SocialIcon({
  platform,
  className = "h-5 w-5",
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <path
          d="M14 9h2.5V6.2C16.1 5.9 15 5.7 13.8 5.7c-2.4 0-4 1.5-4 4.2V12H7.5v3.2H9.8V21h3.3v-5.8H15.7L16.3 12h-3.2V10.2c0-.9.3-1.2 1-1.2Z"
          fill="currentColor"
        />
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M14.2 4.5c.4 2.2 1.7 3.8 3.8 4.7v2.5c-1.3-.1-2.5-.5-3.6-1.2v5.5c0 3.2-2.5 5.5-5.7 5.5S3 19.2 3 16c0-3 2.3-5.3 5.4-5.5v2.6c-1.4.2-2.4 1.3-2.4 2.8 0 1.6 1.3 2.8 2.9 2.8s2.8-1.2 2.8-2.8V4.5h2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
