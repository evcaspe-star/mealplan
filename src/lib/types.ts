export type Recipe = {
  id: string;
  name: string;
  ingredients: string;
  notes: string;
};

export type Meal = {
  id: string;
  meal_date: string;
  slot: "breakfast" | "lunch" | "dinner";
  title: string;
  recipe_id: string | null;
};

export type GroceryItem = {
  id: string;
  name: string;
  is_checked: boolean;
};

export const MEAL_SLOTS = ["breakfast", "lunch", "dinner"] as const;

export function isMealSlot(value: string): value is Meal["slot"] {
  return MEAL_SLOTS.includes(value as Meal["slot"]);
}
