import { supabase } from "../../lib/supabase";

type SubtaskUpdate = {
  title?: string;
  completed?: boolean;
};

export const subtaskRepository = {
  async getSubtasks(taskId: string) {
    const { data, error } = await supabase
      .from("subtasks")
      .select("*")
      .eq("task_id", taskId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createSubtask(taskId: string, title: string) {
    const { data, error } = await supabase
      .from("subtasks")
      .insert([{ task_id: taskId, title }])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateSubtask(subtaskId: string, updates: SubtaskUpdate) {
    const { data, error } = await supabase
      .from("subtasks")
      .update(updates)
      .eq("id", subtaskId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteSubtask(subtaskId: string) {
    const { error } = await supabase
      .from("subtasks")
      .delete()
      .eq("id", subtaskId);

    if (error) {
      throw new Error(error.message);
    }
  },
};
