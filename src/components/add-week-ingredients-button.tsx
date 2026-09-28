"use client";

import { addWeekIngredients } from "@/app/actions/groceries";
import { mondayOf, toISODate } from "@/lib/dates";
import { useTransition } from "react";

export function AddWeekIngredientsButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="button-secondary"
      disabled={pending}
      onClick={() => {
        const week = toISODate(mondayOf(new Date()));
        startTransition(() => addWeekIngredients(week));
      }}
    >
      {pending ? "Adding ingredients…" : "Add this week’s ingredients"}
    </button>
  );
}
