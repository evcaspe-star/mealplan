import { deleteRecipe, saveRecipe } from "@/app/actions/recipes";
import { requireUser } from "@/lib/auth";
import type { Recipe } from "@/lib/types";
import Link from "next/link";

const errors: Record<string, string> = {
  name: "Give the recipe a name so you can find it later.",
  save: "That recipe did not save. Try once more.",
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const { supabase, userId } = await requireUser();
  const { data } = await supabase
    .from("recipes")
    .select("id, name, ingredients, notes")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  const recipes = (data ?? []) as Recipe[];

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-apricot">
          Recipe box
        </p>
        <h1 className="font-display text-4xl">Meals you can repeat</h1>
        <p className="mt-1 text-ink-soft">
          Start with food you already make. Ingredients can be a short list,
          one item per line.
        </p>
      </div>

      {params.error ? (
        <p className="notice notice-warn">{errors[params.error] ?? errors.save}</p>
      ) : null}

      <form action={saveRecipe} className="grid gap-4 rounded-3xl border border-line bg-card p-5">
        <h2 className="font-display text-2xl">Add a recipe</h2>
        <label className="field">
          Name
          <input name="name" placeholder="Weeknight pasta" required />
        </label>
        <label className="field">
          Ingredients
          <textarea
            name="ingredients"
            rows={4}
            placeholder={"pasta\ntomato sauce\nspinach"}
          />
        </label>
        <label className="field">
          Notes
          <textarea name="notes" rows={2} placeholder="About 20 minutes. Add cheese if you have it." />
        </label>
        <button type="submit" className="button-primary">
          Save recipe
        </button>
      </form>

      {recipes.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line bg-card p-6 text-ink-soft">
          No recipes yet. Saving one makes planning the week much faster.
        </p>
      ) : (
        <div className="grid gap-3">
          {recipes.map((recipe) => (
            <article key={recipe.id} className="rounded-3xl border border-line bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-2xl">{recipe.name}</h2>
                <form action={deleteRecipe}>
                  <input type="hidden" name="recipe_id" value={recipe.id} />
                  <button type="submit" className="text-sm font-bold text-ink-soft">
                    Remove
                  </button>
                </form>
              </div>
              {recipe.ingredients ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                  {recipe.ingredients
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line, index) => (
                      <li key={`${recipe.id}-${index}`}>{line}</li>
                    ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-soft">No ingredients listed.</p>
              )}
              {recipe.notes ? <p className="mt-3 text-sm text-ink-soft">{recipe.notes}</p> : null}
            </article>
          ))}
        </div>
      )}

      <p className="text-sm text-ink-soft">
        Ready to use one?{" "}
        <Link href="/week" className="font-bold text-leaf">
          Open your week
        </Link>
      </p>
    </div>
  );
}
