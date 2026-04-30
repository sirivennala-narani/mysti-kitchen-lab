import { supabase } from "@/integrations/supabase/client";
import { getAll, getById } from "./db";

export type Recipe = {
  id: string;
  title: string;
  theme: string;
  emoji: string;
  difficulty: string;
  time: string;
  topics: string[];
  ingredients: string[];
};

export type RecipeStep = {
  id: string;
  recipe_id: string;
  position: number;
  title: string;
  detail: string;
  learn: string;
};

export type RecipeWithSteps = Recipe & { steps: RecipeStep[] };

export async function listRecipes(search?: string): Promise<Recipe[]> {
  return getAll<Recipe>("recipes", {
    orderBy: { column: "created_at", ascending: true },
    search: search ? { column: "title", query: search } : undefined,
  });
}

export async function getRecipeWithSteps(
  recipeId: string,
): Promise<RecipeWithSteps | null> {
  const recipe = await getById<Recipe>("recipes", recipeId);
  if (!recipe) return null;
  const { data, error } = await supabase
    .from("recipe_steps")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("position", { ascending: true });
  if (error) {
    console.error("[recipes.getRecipeWithSteps]", error);
    throw error;
  }
  return { ...recipe, steps: (data ?? []) as RecipeStep[] };
}