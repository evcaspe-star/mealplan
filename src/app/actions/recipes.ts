"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function saveRecipe(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) {
    redirect("/recipes?error=name");
  }

  const { supabase, userId } = await requireUser();
  const { error } = await supabase.from("recipes").insert({
    user_id: userId,
    name,
    ingredients,
    notes,
  });

  if (error) {
    redirect("/recipes?error=save");
  }

  revalidatePath("/recipes");
  redirect("/recipes");
}

export async function deleteRecipe(formData: FormData) {
  const recipeId = String(formData.get("recipe_id") ?? "");
  const { supabase, userId } = await requireUser();

  await supabase.from("recipes").delete().eq("id", recipeId).eq("user_id", userId);
  revalidatePath("/recipes");
  revalidatePath("/week");
  redirect("/recipes");
}
