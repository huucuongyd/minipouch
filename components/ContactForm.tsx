"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitContact, type ContactState } from "@/app/actions";
import { products } from "@/lib/products";

const initialState: ContactState = { status: "idle", message: "" };

const fieldClass =
  "mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-ink outline-none transition placeholder:text-muted/70 focus:border-rose focus:ring-2 focus:ring-rose/20";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const searchParams = useSearchParams();
  const defaultProduct =
    products.find((product) => product.id === searchParams.get("sp"))?.name ?? "";

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-ink">
          Họ tên
          <input
            required
            name="name"
            autoComplete="name"
            placeholder="Nguyễn An"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm text-ink">
          Email
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="ban@email.com"
            className={fieldClass}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-ink">
          Số điện thoại
          <input
            name="phone"
            autoComplete="tel"
            placeholder="0901 234 567"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm text-ink">
          Sản phẩm quan tâm
          <select name="product" defaultValue={defaultProduct} className={fieldClass}>
            <option value="">Chưa chọn — tư vấn giúp mình</option>
            {products.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
            <option value="Đặt may theo yêu cầu">Đặt may theo yêu cầu</option>
          </select>
        </label>
      </div>

      <label className="block text-sm text-ink">
        Lời nhắn
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Mình muốn đặt túi làm quà / đựng mỹ phẩm / hỏi về vải..."
          className={`${fieldClass} resize-y`}
        />
      </label>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink px-6 py-3.5 text-sm text-paper transition hover:bg-clay disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {pending ? "Đang gửi..." : "Gửi lời nhắn"}
      </button>

      {state.status !== "idle" ? (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-2xl px-4 py-3 text-sm ${
            state.status === "success"
              ? "bg-sage/15 text-moss"
              : "bg-rose/15 text-clay"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
