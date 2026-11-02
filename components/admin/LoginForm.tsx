"use client";

import { useActionState } from "react";
import { login, type AdminFormState } from "@/app/quan-tri/actions";

const initialState: AdminFormState = { status: "idle", message: "" };

const fieldClass =
  "mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <label className="block text-sm text-ink">
        Tài khoản
        <input
          required
          name="account"
          autoComplete="username"
          className={fieldClass}
          disabled={!configured}
        />
      </label>
      <label className="block text-sm text-ink">
        Mật khẩu
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          className={fieldClass}
          disabled={!configured}
        />
      </label>
      <button
        type="submit"
        disabled={!configured || pending}
        className="w-full rounded-full bg-ink px-6 py-3.5 text-sm text-paper transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      {!configured ? (
        <p className="rounded-2xl bg-rose/15 px-4 py-3 text-sm text-clay">
          Chưa có biến admin_acc và admin_pass.
        </p>
      ) : null}
      {state.status === "error" ? (
        <p role="status" className="rounded-2xl bg-rose/15 px-4 py-3 text-sm text-clay">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
