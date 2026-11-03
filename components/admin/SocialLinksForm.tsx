"use client";

import { useActionState } from "react";
import { saveSocialLinks, type AdminFormState } from "@/app/quan-tri/actions";
import { SocialIcon } from "@/components/SocialIcon";
import {
  socialLabel,
  socialPlatforms,
  type SocialLink,
} from "@/lib/site-settings";

const initialState: AdminFormState = { status: "idle", message: "" };

const fieldClass =
  "mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20";

export function SocialLinksForm({ socials }: { socials: SocialLink[] }) {
  const [state, formAction, pending] = useActionState(saveSocialLinks, initialState);
  const byPlatform = new Map(socials.map((social) => [social.platform, social]));

  return (
    <form action={formAction} className="mt-6 space-y-5">
      {socialPlatforms.map((platform) => {
        const current = byPlatform.get(platform.id);
        return (
          <div
            key={platform.id}
            className="rounded-[24px] bg-cream/70 p-5 ring-1 ring-sand"
          >
            <div className="flex items-center gap-3 text-ink">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-sage ring-1 ring-sand">
                <SocialIcon platform={platform.id} />
              </span>
              <p className="font-serif text-2xl">{socialLabel(platform.id)}</p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-ink">
                Link
                <input
                  name={`${platform.id}_url`}
                  type="url"
                  defaultValue={current?.url ?? ""}
                  placeholder="https://..."
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm text-ink">
                Tag / tên hiển thị
                <input
                  name={`${platform.id}_tag`}
                  defaultValue={current?.tag ?? ""}
                  placeholder={platform.id === "instagram" ? "@minipouch.vn" : "NuBeNa"}
                  className={fieldClass}
                />
              </label>
            </div>
          </div>
        );
      })}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3.5 text-sm text-paper transition hover:bg-clay disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Đang lưu..." : "Lưu mạng xã hội"}
      </button>
      {state.status === "error" ? (
        <p role="status" className="rounded-2xl bg-rose/15 px-4 py-3 text-sm text-clay">
          {state.message}
        </p>
      ) : state.status === "ok" ? (
        <p role="status" className="rounded-2xl bg-sage/15 px-4 py-3 text-sm text-ink">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
