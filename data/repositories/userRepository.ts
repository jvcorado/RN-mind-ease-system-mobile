import { supabase } from "../../lib/supabase";

export type ProfileRow = {
  name: string | null;
  email: string | null;
  created_at: string | null;
  pomodoro_count: number | null;
};

export const userRepository = {
  async getProfile(): Promise<ProfileRow | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("name, email, created_at, pomodoro_count")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getPomodoroCount() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("pomodoro_count")
      .eq("id", user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data.pomodoro_count;
  },

  async incrementPomodoro() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase.rpc("increment_pomodoro");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};
