"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { addDays, parseISODate, toISODate } from "@/lib/dates";

export async function addGroceryItem(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/groceries?error=name");
  }

  const { supabase, userId } = await requireUser();
  const { error } = await supabase.from("grocery_items").insert({
    user_id: userId,
    name,
  });

  if (error) {
    redirect("/groceries?error=save");
  }

  revalidatePath("/groceries");
  redirect("/groceries");
}

export async function toggleGrocery(id: string, isChecked: boolean) {
  const { supabase, userId } = await requireUser();
  await supabase
    .from("grocery_items")
    .update({ is_checked: isChecked })
    .eq("id", id)
    .eq("user_id", userId);
  revalidatePath("/groceries");
}

export async function deleteGrocery(formData: FormData) {
  const itemId = String(formData.get("item_id") ?? "");
  const { supabase, userId } = await requireUser();
  await supabase
    .from("grocery_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);
  revalidatePath("/groceries");
  redirect("/groceries");
}

export async function clearCheckedGroceries() {
  const { supabase, userId } = await requireUser();
  await supabase
    .from("grocery_items")
    .delete()
    .eq("user_id", userId)
    .eq("is_checked", true);
  revalidatePath("/groceries");
  redirect("/groceries");
}

export async function addWeekIngredients(week: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(week)) {
    redirect("/groceries?notice=none");
  }

  const { supabase, userId } = await requireUser();
  const end = toISODate(addDays(parseISODate(week), 6));

  const [{ data: meals }, { data: existing }] = await Promise.all([
    supabase
      .from("meals")
      .select("recipe_id, recipes(ingredients)")
      .eq("user_id", userId)
      .gte("meal_date", week)
      .lte("meal_date", end)
      .not("recipe_id", "is", null),
    supabase.from("grocery_items").select("name").eq("user_id", userId),
  ]);

  const seen = new Set(
    (existing ?? []).map((item) => item.name.trim().toLowerCase()),
  );
  const toInsert: { user_id: string; name: string }[] = [];

  for (const meal of meals ?? []) {
    const recipe = Array.isArray(meal.recipes) ? meal.recipes[0] : meal.recipes;
    const ingredients = recipe?.ingredients ?? "";
    for (const line of ingredients.split("\n")) {
      const name = line.trim();
      const key = name.toLowerCase();
      if (!name || seen.has(key)) {
        continue;
      }
      seen.add(key);
      toInsert.push({ user_id: userId, name });
    }
  }

  if (toInsert.length === 0) {
    redirect("/groceries?notice=none");
  }

  const { error } = await supabase.from("grocery_items").insert(toInsert);
  if (error) {
    redirect("/groceries?error=save");
  }

  revalidatePath("/groceries");
  redirect(`/groceries?notice=added&count=${toInsert.length}`);
}
