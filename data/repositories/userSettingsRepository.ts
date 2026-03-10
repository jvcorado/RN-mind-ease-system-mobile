import { supabase } from "../../lib/supabase";

export type ComplexityLevel = "simple" | "medium" | "detailed";

export type UserSettingsRow = {
  id?: string;
  user_id?: string;
  focus_mode_default?: boolean;
  summary_mode_default?: boolean;
  guided_rhythm?: boolean;
  font_size?: number;
  spacing?: number;
  contrast?: number;
  reduce_visual_stimuli?: boolean;
  disable_animations?: boolean;
  interface_rhythm?: number;
  complexity_level?: ComplexityLevel | string;
  focus_mode?: boolean;
  summary_mode?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type UserSettingsPayload = {
  complexity_level?: ComplexityLevel | string;
  focus_mode?: boolean;
  summary_mode?: boolean;
  guided_rhythm?: boolean;
  font_size?: number;
  spacing?: number;
  contrast?: number;
  focus_mode_default?: boolean;
  summary_mode_default?: boolean;
  reduce_visual_stimuli?: boolean;
  disable_animations?: boolean;
  interface_rhythm?: number;
  updated_at?: string;
};

export const userSettingsRepository = {
  async getUserSettings(): Promise<UserSettingsRow | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateUserSettings(updates: UserSettingsPayload) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from("user_settings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async upsertUserSettings(payload: UserSettingsPayload) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const row = {
      user_id: user.id,
      ...payload,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("user_settings")
      .upsert(row, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};
