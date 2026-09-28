"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { isMealSlot } from "@/lib/types";

function weekPath(week: string) {
  return `/week?week=${encodeURIComponent(week)}`;
}

export async function saveMeal(formData: FormData) {
  const week = String(formData.get("week") ?? "");
  const mealDate = String(formData.get("meal_date") ?? "");
  const slot = String(formData.get("slot") ?? "");
  const recipeId = String(formData.get("recipe_id") ?? "");
  let title = String(formData.get("title") ?? "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(mealDate) || !isMealSlot(slot)) {
    redirect(`${weekPath(week)}&error=meal`);
  }

  const { supabase, userId } = await requireUser();

  if (!title && recipeId) {
    const { data: recipe } = await supabase
      .from("recipes")
      .select("name")
      .eq("id", recipeId)
      .eq("user_id", userId)
      .maybeSingle();
    title = recipe?.name ?? "";
  }

  if (!title) {
    redirect(
      `${weekPath(week)}&date=${mealDate}&slot=${slot}&error=title`,
    );
  }

  const payload = {
    title,
    recipe_id: recipeId || null,
  };

  const { data: existing } = await supabase
    .from("meals")
    .select("id")
    .eq("user_id", userId)
    .eq("meal_date", mealDate)
    .eq("slot", slot)
    .maybeSingle();

  const result = existing
    ? await supabase
        .from("meals")
        .update(payload)
        .eq("id", existing.id)
        .eq("user_id", userId)
    : await supabase.from("meals").insert({
        user_id: userId,
        meal_date: mealDate,
        slot,
        ...payload,
      });

  if (result.error) {
    redirect(`${weekPath(week)}&error=save`);
  }

  revalidatePath("/week");
  redirect(weekPath(week));
}

export async function clearMeal(formData: FormData) {
  const week = String(formData.get("week") ?? "");
  const mealId = String(formData.get("meal_id") ?? "");
  const { supabase, userId } = await requireUser();

  await supabase.from("meals").delete().eq("id", mealId).eq("user_id", userId);
  revalidatePath("/week");
  redirect(weekPath(week));
}
