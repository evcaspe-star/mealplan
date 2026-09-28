"use client";

import { toISODate } from "@/lib/dates";

export function TodayBadge({ date }: { date: string }) {
  const today = toISODate(new Date());
  if (today !== date) {
    return null;
  }

  return (
    <span className="rounded-full bg-apricot/15 px-2 py-0.5 text-xs font-bold text-apricot">
      Today
    </span>
  );
}
