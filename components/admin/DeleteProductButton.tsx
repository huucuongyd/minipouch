"use client";

import { useActionState } from "react";
import { deleteProduct, type AdminFormState } from "@/app/quan-tri/actions";

const initialState: AdminFormState = { status: "idle", message: "" };

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [state, formAction, pending] = useActionState(deleteProduct, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Xóa “${name}”?`)) event.preventDefault();
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
