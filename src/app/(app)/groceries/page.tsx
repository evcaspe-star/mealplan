import { addGroceryItem, clearCheckedGroceries, deleteGrocery } from "@/app/actions/groceries";
import { AddWeekIngredientsButton } from "@/components/add-week-ingredients-button";
import { GroceryRow } from "@/components/grocery-row";
import { requireUser } from "@/lib/auth";
import type { GroceryItem } from "@/lib/types";

const errors: Record<string, string> = {
  name: "Type an item before adding it.",
  save: "That item did not save. Try once more.",
};

export default async function GroceriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; count?: string }>;
}) {
  const params = await searchParams;
  const { supabase, userId } = await requireUser();
  const { data } = await supabase
    .from("grocery_items")
    .select("id, name, is_checked")
    .eq("user_id", userId)
    .order("is_checked")
    .order("created_at");
  const items = (data ?? []) as GroceryItem[];
  const remaining = items.filter((item) => !item.is_checked).length;
  const checked = items.length - remaining;

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-apricot">
          Grocery list
        </p>
        <h1 className="font-display text-4xl">What to pick up</h1>
        <p className="mt-1 text-ink-soft">
          {items.length === 0
            ? "Nothing here yet. Add milk, or pull ingredients from this week’s recipes."
            : `${remaining} still to buy. ${checked} already in the cart.`}
        </p>
      </div>

      {params.error ? (
        <p className="notice notice-warn">{errors[params.error] ?? errors.save}</p>
      ) : null}
      {params.notice === "added" ? (
        <p className="notice">
          Added {params.count ?? "some"} ingredient{params.count === "1" ? "" : "s"} from this week.
        </p>
      ) : null}
      {params.notice === "none" ? (
        <p className="notice">
          No new ingredients to add. Plan a meal with a recipe, or type an item below.
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <AddWeekIngredientsButton />
        {checked > 0 ? (
          <form action={clearCheckedGroceries}>
            <button type="submit" className="button-secondary">
              Clear finished items
            </button>
          </form>
        ) : null}
      </div>

      <form action={addGroceryItem} className="flex flex-col gap-2 sm:flex-row">
        <label className="field flex-1">
          Add an item
          <input name="name" placeholder="Oat milk" />
        </label>
        <button type="submit" className="button-primary sm:self-end">
          Add
        </button>
      </form>

      {items.length === 0 ? null : (
        <ul className="grid gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <div className="flex-1">
                <GroceryRow id={item.id} name={item.name} checked={item.is_checked} />
              </div>
              <form action={deleteGrocery}>
                <input type="hidden" name="item_id" value={item.id} />
                <button type="submit" className="px-2 text-sm font-bold text-ink-soft">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
