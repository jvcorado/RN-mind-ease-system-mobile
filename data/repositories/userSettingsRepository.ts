import { supabase } from "../../lib/supabase";
import {
  ComplexityLevel,
  UserSettingsRow,
  UserSettingsPayload,
} from "../types/userSettings";

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
