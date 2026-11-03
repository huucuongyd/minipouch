"use client";

import { useActionState } from "react";
import { saveProduct, type AdminFormState } from "@/app/quan-tri/actions";
import { patterns, type Product } from "@/lib/products";

const initialState: AdminFormState = { status: "idle", message: "" };

const fieldClass =
  "mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20";

export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, pending] = useActionState(saveProduct, initialState);

  return (
    <form action={formAction} encType="multipart/form-data" className="mt-8 space-y-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <label className="block text-sm text-ink">
        Tên túi
        <input
          required
          name="name"
          defaultValue={product?.name}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm text-ink">
        Câu ngắn
        <input
          required
          name="tagline"
          defaultValue={product?.tagline}
          className={fieldClass}
        />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-ink">
          Giá
          <input
            required
            name="price"
            defaultValue={product?.price}
            placeholder="159.000đ"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm text-ink">
          Kích thước
          <input
            name="size"
            defaultValue={product?.size ?? "15 × 25 cm"}
            className={fieldClass}
          />
        </label>
      </div>
      <label className="block text-sm text-ink">
        Họa tiết
        <select
          name="pattern"
          defaultValue={product?.pattern ?? "floral"}
          className={fieldClass}
        >
          {patterns.map((pattern) => (
            <option key={pattern.id} value={pattern.id}>
              {pattern.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-ink">
        Mô tả
        <textarea
          required
          name="description"
          rows={5}
          defaultValue={product?.description}
          className={`${fieldClass} resize-y`}
        />
      </label>
      <label className="block text-sm text-ink">
        Link ảnh (mỗi dòng một link — ảnh đầu là ảnh bìa)
        <textarea
          name="images"
          rows={4}
          defaultValue={(product?.images ?? (product?.image ? [product.image] : [])).join(
            "\n",
          )}
          placeholder={"https://...\nhttps://..."}
          className={`${fieldClass} resize-y font-mono text-sm`}
        />
      </label>
      <label className="block text-sm text-ink">
        Hoặc tải thêm ảnh lên (có thể chọn nhiều)
        <input
          name="imageFiles"
          type="file"
          accept="image/*"
          multiple
          className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:text-paper"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3.5 text-sm text-paper transition hover:bg-clay disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Đang lưu..." : product ? "Lưu thay đổi" : "Đăng sản phẩm"}
      </button>
      {state.status === "error" ? (
        <p role="status" className="rounded-2xl bg-rose/15 px-4 py-3 text-sm text-clay">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
