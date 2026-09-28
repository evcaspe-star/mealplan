import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { email } = await requireUser();

  return <AppShell email={email}>{children}</AppShell>;
}
