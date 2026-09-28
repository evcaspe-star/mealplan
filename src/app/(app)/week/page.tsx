import Link from "next/link";
import { clearMeal, saveMeal } from "@/app/actions/meals";
import { WeekRedirect } from "@/components/week-redirect";
import { TodayBadge } from "@/components/today-badge";
import { requireUser } from "@/lib/auth";
import { addDays, formatDay, formatWeekRange, normalizeWeek, parseISODate, toISODate } from "@/lib/dates";
import { isMealSlot, MEAL_SLOTS, type Meal, type Recipe } from "@/lib/types";
import { redirect } from "next/navigation";

const slotLabels = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

const errors: Record<string, string> = {
  meal: "Pick a day and a meal to save.",
  title: "Give the meal a name, or choose a saved recipe.",
  save: "That meal did not save. Try once more.",
};

export default async function WeekPage({
  searchParams,
}: {
  searchParams: Promise<{
    week?: string;
    date?: string;
    slot?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;

  if (!params.week) {
    return <WeekRedirect />;
  }

  const week = normalizeWeek(params.week);
  if (!week) {
    return <WeekRedirect />;
  }

  if (week !== params.week) {
    redirect(`/week?week=${week}`);
  }

  const { supabase, userId } = await requireUser();
  const end = toISODate(addDays(parseISODate(week), 6));
  const [{ data: meals }, { data: recipes }] = await Promise.all([
    supabase
      .from("meals")
      .select("id, meal_date, slot, title, recipe_id")
      .eq("user_id", userId)
      .gte("meal_date", week)
      .lte("meal_date", end)
      .order("meal_date"),
    supabase
      .from("recipes")
      .select("id, name, ingredients, notes")
      .eq("user_id", userId)
      .order("name"),
  ]);

  const mealRows = (meals ?? []) as Meal[];
  const recipeRows = (recipes ?? []) as Recipe[];
  const days = Array.from({ length: 7 }, (_, index) =>
    toISODate(addDays(parseISODate(week), index)),
  );
  const previous = toISODate(addDays(parseISODate(week), -7));
  const next = toISODate(addDays(parseISODate(week), 7));
  const editing =
    params.date && params.slot && isMealSlot(params.slot)
      ? { date: params.date, slot: params.slot }
      : null;
  const existing = editing
    ? mealRows.find(
        (meal) => meal.meal_date === editing.date && meal.slot === editing.slot,
      )
    : undefined;
  const planned = mealRows.length;

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-apricot">
            Your week
          </p>
          <h1 className="font-display text-4xl">{formatWeekRange(week)}</h1>
          <p className="mt-1 text-ink-soft">
            {planned === 0
              ? "A blank week is a fine place to start. Add one meal."
              : `${planned} meal${planned === 1 ? "" : "s"} planned. Nice work.`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/week?week=${previous}`} className="button-secondary">
            Previous
          </Link>
          <Link href={`/week?week=${next}`} className="button-secondary">
            Next
          </Link>
        </div>
      </div>

      {params.error ? (
        <p className="notice notice-warn">{errors[params.error] ?? errors.save}</p>
      ) : null}

      {editing ? (
        <form action={saveMeal} className="grid gap-4 rounded-3xl border border-line bg-card p-5">
          <div>
            <h2 className="font-display text-2xl">
              {slotLabels[editing.slot]} · {formatDay(editing.date)}
            </h2>
            <p className="text-sm text-ink-soft">
              Type a quick name, or attach a recipe you already saved.
            </p>
          </div>
          <input type="hidden" name="week" value={week} />
          <input type="hidden" name="meal_date" value={editing.date} />
          <input type="hidden" name="slot" value={editing.slot} />
          <label className="field">
            Meal name
            <input
              name="title"
              defaultValue={existing?.title ?? ""}
              placeholder="Tacos, leftovers, pasta…"
            />
          </label>
          <label className="field">
            Saved recipe
            <select name="recipe_id" defaultValue={existing?.recipe_id ?? ""}>
              <option value="">No recipe — a name is enough</option>
              {recipeRows.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="submit" className="button-primary">
              Save meal
            </button>
            <Link href={`/week?week=${week}`} className="button-secondary">
              Cancel
            </Link>
          </div>
        </form>
      ) : null}

      <div className="grid gap-3">
        {days.map((day) => (
          <section key={day} className="rounded-3xl border border-line bg-card p-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl">{formatDay(day)}</h2>
              <TodayBadge date={day} />
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {MEAL_SLOTS.map((slot) => {
                const meal = mealRows.find(
                  (item) => item.meal_date === day && item.slot === slot,
                );
                return (
                  <div key={slot} className="rounded-2xl bg-background p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                      {slotLabels[slot]}
                    </p>
                    {meal ? (
                      <div className="mt-2">
                        <p className="font-bold">{meal.title}</p>
                        <div className="mt-2 flex gap-3">
                          <Link
                            href={`/week?week=${week}&date=${day}&slot=${slot}`}
                            className="text-sm font-bold text-leaf"
                          >
                            Change
                          </Link>
                          <form action={clearMeal}>
                            <input type="hidden" name="week" value={week} />
                            <input type="hidden" name="meal_id" value={meal.id} />
                            <button type="submit" className="text-sm font-bold text-ink-soft">
                              Clear
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={`/week?week=${week}&date=${day}&slot=${slot}`}
                        className="mt-2 inline-block text-sm font-bold text-leaf"
                      >
                        Add meal
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
