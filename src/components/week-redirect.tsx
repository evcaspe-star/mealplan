"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { mondayOf, toISODate } from "@/lib/dates";

export function WeekRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/week?week=${toISODate(mondayOf(new Date()))}`);
  }, [router]);

  return <p className="text-ink-soft">Opening your week…</p>;
}
