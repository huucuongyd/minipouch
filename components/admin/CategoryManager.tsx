"use client";

import { useActionState, useState } from "react";
import {
  deleteCategory,
  saveCategory,
  type AdminFormState,
} from "@/app/quan-tri/actions";
import type { Category } from "@/lib/products";

const initialState: AdminFormState = { status: "idle", message: "" };

const fieldClass =
  "mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20";

function CategoryForm({
  category,
  onCancel,
}: {
  category?: Category;
  onCancel?: () => void;
}) {
  const [state, formAction, pending] = useActionState(saveCategory, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <label className="block text-sm text-ink">
        Tên danh mục
        <input
          required
          name="label"
          defaultValue={category?.label}
          placeholder="Ví dụ: Hoa nhí"
          className={fieldClass}
        />
      </label>
      {!category ? (
        <label className="block text-sm text-ink">
          Mã (tuỳ chọn)
          <input
            name="slug"
            placeholder="Để trống sẽ tạo từ tên"
            className={fieldClass}
          />
        </label>
      ) : (
        <p className="text-xs text-muted">Mã: {category.id}</p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition hover:bg-clay disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Đang lưu..." : category ? "Lưu" : "Thêm danh mục"}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-muted hover:text-ink"
          >
            Huỷ
          </button>
        ) : null}
      </div>
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

function DeleteCategoryButton({ id, label }: { id: string; label: string }) {
  const [state, formAction, pending] = useActionState(deleteCategory, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Xóa danh mục “${label}”?`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} className="text-sm text-clay hover:underline">
        {pending ? "Đang xóa..." : "Xóa"}
      </button>
      {state.status === "error" ? (
        <p className="mt-1 text-xs text-clay">{state.message}</p>
      ) : null}
    </form>
  );
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-sand overflow-hidden rounded-[24px] bg-cream/50 ring-1 ring-sand">
        {categories.length === 0 ? (
          <li className="px-5 py-6 text-sm text-muted">Chưa có danh mục nào.</li>
        ) : (
          categories.map((category) => (
            <li key={category.id} className="px-5 py-4">
              {editingId === category.id ? (
                <CategoryForm category={category} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-serif text-2xl text-ink">{category.label}</p>
                    <p className="text-xs text-muted">{category.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setEditingId(category.id)}
                      className="text-sm text-ink underline decoration-blush underline-offset-4"
                    >
                      Sửa
                    </button>
                    <DeleteCategoryButton id={category.id} label={category.label} />
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>

      <div className="rounded-[24px] bg-cream/70 p-5 ring-1 ring-sand">
        <p className="font-serif text-2xl text-ink">Thêm danh mục</p>
        <div className="mt-4">
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}
