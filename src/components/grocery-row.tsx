"use client";

import { toggleGrocery } from "@/app/actions/groceries";
import { useTransition } from "react";

export function GroceryRow({
  id,
  name,
  checked,
}: {
  id: string;
  name: string;
  checked: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <label
      className={`flex min-h-12 items-center gap-3 rounded-xl border border-line bg-card px-3 ${
        pending ? "opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        className="size-5 accent-leaf"
        checked={checked}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.checked;
          startTransition(() => toggleGrocery(id, next));
        }}
      />
      <span className={checked ? "text-ink-soft line-through" : "text-foreground"}>
        {name}
      </span>
    </label>
  );
}
