import { supabase } from "@/integrations/supabase/client";

export type ProgressRow = {
  id: string;
  user_id: string;
  recipe_id: string;
  completed: boolean;
  current_step: number;
  completed_at: string | null;
};

export async function listProgress(userId: string): Promise<ProgressRow[]> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("[progress.list]", error);
    throw error;
  }
  return (data ?? []) as ProgressRow[];
}

export async function setCompleted(
  userId: string,
  recipeId: string,
  completed: boolean,
): Promise<ProgressRow> {
  const payload = {
    user_id: userId,
    recipe_id: recipeId,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  };
  const { data, error } = await supabase
    .from("user_progress")
    .upsert(payload, { onConflict: "user_id,recipe_id" })
    .select()
    .single();
  if (error) {
    console.error("[progress.setCompleted]", error);
    throw error;
  }
  return data as ProgressRow;
}

export async function setCurrentStep(
  userId: string,
  recipeId: string,
  step: number,
): Promise<void> {
  const { error } = await supabase
    .from("user_progress")
    .upsert(
      { user_id: userId, recipe_id: recipeId, current_step: step },
      { onConflict: "user_id,recipe_id" },
    );
  if (error) {
    console.error("[progress.setCurrentStep]", error);
    throw error;
  }
}