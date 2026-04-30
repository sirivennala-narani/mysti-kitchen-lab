import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export type AppUser = {
  id: string;
  name: string;
  email: string;
};

function userFromSupabase(
  u: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null,
): AppUser | null {
  if (!u) return null;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    (typeof meta.name === "string" && meta.name) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    (u.email ? u.email.split("@")[0] : "Friend");
  return { id: u.id, email: u.email ?? "", name: String(name) };
}

export async function signup(name: string, email: string, password: string) {
  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: redirectTo },
  });
  if (error) throw error;
  return userFromSupabase(data.user);
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return userFromSupabase(data.user);
}

export async function loginWithGoogle() {
  const redirect_uri =
    typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;
  return lovable.auth.signInWithOAuth("google", { redirect_uri });
}

export async function logout() {
  await supabase.auth.signOut();
}

export function useSession() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Set up listener BEFORE getting session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(userFromSupabase(session?.user ?? null));
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(userFromSupabase(data.session?.user ?? null));
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, ready };
}