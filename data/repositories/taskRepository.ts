import { supabase } from "../../lib/supabase";
import { TaskUpdate } from "../types/task";

export const taskRepository = {
  async getTasks() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase.from("tasks").select("*");
    if (user?.id) {
      query = query.eq("user_id", user.id);
    }
    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createTask(title: string, description?: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ user_id: user.id, title, description }])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateTask(taskId: string, updates: TaskUpdate) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      throw new Error(error.message);
    }
  },
};
