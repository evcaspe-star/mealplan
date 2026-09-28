import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const steps = [
  {
    title: "Save a few meals you already like",
    text: "A sandwich, pasta, or leftovers all count. You do not need a chef’s recipe.",
  },
  {
    title: "Drop them onto the week",
    text: "Breakfast, lunch, and dinner. Leave a day blank if you are eating out.",
  },
  {
    title: "Turn the plan into a grocery list",
    text: "Check items off while you shop, then clear them when you are done.",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/week");
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:py-14">
      <header className="flex items-center justify-between">
        <p className="font-display text-2xl text-leaf">Plate Plan</p>
        <Link href="/login" className="text-sm font-bold text-leaf">
          Log in
        </Link>
      </header>

      <section className="mt-12 grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-apricot">
            A calmer week of eating
          </p>
          <h1 className="font-display mt-3 text-5xl leading-tight text-foreground sm:text-6xl">
            Decide dinner before you are hungry.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            Plate Plan is a simple weekly meal planner. Save recipes, fill in
            the days, and take a grocery list with you. One small plan is
            enough to start.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="button-primary">
              Create a free account
            </Link>
            <Link href="/login" className="button-secondary">
              I already have an account
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-line bg-card p-6 shadow-sm">
          <div className="mx-auto mb-5 flex size-28 items-center justify-center rounded-full bg-[#f6e2c4]">
            <div className="size-16 rounded-full bg-leaf" />
          </div>
          <p className="text-center font-display text-2xl">This week</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="rounded-xl bg-background px-3 py-2">Mon dinner · Veggie tacos</li>
            <li className="rounded-xl bg-background px-3 py-2">Tue lunch · Leftover soup</li>
            <li className="rounded-xl bg-background px-3 py-2">Wed dinner · Pasta night</li>
          </ul>
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-3xl border border-line bg-card p-5">
            <p className="text-sm font-bold text-apricot">Step {index + 1}</p>
            <h2 className="font-display mt-2 text-2xl">{step.title}</h2>
            <p className="mt-2 text-ink-soft">{step.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
