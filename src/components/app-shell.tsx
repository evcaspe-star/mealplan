import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";

const links = [
  { href: "/week", label: "Week" },
  { href: "/recipes", label: "Recipes" },
  { href: "/groceries", label: "Groceries" },
];

export function AppShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-full pb-24 md:pb-8">
      <header className="border-b border-line bg-card/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/week" className="font-display text-2xl text-leaf">
            Plate Plan
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>
          <form action={signOut}>
            <button type="submit" className="text-sm font-semibold text-ink-soft">
              Log out
            </button>
          </form>
        </div>
        {email ? (
          <p className="mx-auto hidden w-full max-w-5xl px-4 pb-3 text-sm text-ink-soft md:block">
            Signed in as {email}
          </p>
        ) : null}
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-3 border-t border-line bg-card md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-2 py-3 text-center text-sm font-bold text-leaf"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
